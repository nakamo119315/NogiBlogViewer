/**
 * Download utilities for bulk image downloads
 */

import JSZip from 'jszip'
import { saveAs } from 'file-saver'

export interface DownloadProgress {
  total: number
  completed: number
  failed: number
  percentage: number
}

export type ProgressCallback = (progress: DownloadProgress) => void

/**
 * Fetch an image as a blob with CORS handling
 */
async function fetchImageAsBlob(url: string): Promise<Blob | null> {
  try {
    // Try direct fetch first
    const response = await fetch(url, {
      mode: 'cors',
    })
    if (response.ok) {
      return await response.blob()
    }
  } catch {
    // CORS error expected, try with no-cors as fallback
    // Note: no-cors will return an opaque response
  }

  // For CORS-blocked images, we cannot download them directly
  // The user will need to download manually from the official site
  return null
}

/**
 * Generate a filename from URL
 */
function getFilenameFromUrl(url: string, index: number): string {
  try {
    const urlObj = new URL(url)
    const pathname = urlObj.pathname
    const segments = pathname.split('/')
    const filename = segments[segments.length - 1]

    // Get extension from filename
    const extMatch = filename.match(/\.(jpg|jpeg|png|gif|webp)$/i)
    const ext = extMatch ? extMatch[0] : '.jpg'

    // Create a clean filename
    const baseName = filename.replace(/\.[^.]+$/, '').replace(/[^a-zA-Z0-9_-]/g, '_')
    return `${index + 1}_${baseName || 'image'}${ext}`
  } catch {
    return `image_${index + 1}.jpg`
  }
}

/**
 * Download all images from a list of URLs as a ZIP file
 */
export async function downloadAllImages(
  imageUrls: string[],
  zipFilename: string,
  onProgress?: ProgressCallback
): Promise<{ success: boolean; downloaded: number; failed: number }> {
  if (imageUrls.length === 0) {
    return { success: false, downloaded: 0, failed: 0 }
  }

  const zip = new JSZip()
  let completed = 0
  let failed = 0

  // Update progress
  const updateProgress = () => {
    if (onProgress) {
      onProgress({
        total: imageUrls.length,
        completed,
        failed,
        percentage: Math.round(((completed + failed) / imageUrls.length) * 100),
      })
    }
  }

  // Initial progress
  updateProgress()

  // Download all images
  const downloadPromises = imageUrls.map(async (url, index) => {
    const blob = await fetchImageAsBlob(url)
    if (blob) {
      const filename = getFilenameFromUrl(url, index)
      zip.file(filename, blob)
      completed++
    } else {
      failed++
    }
    updateProgress()
  })

  await Promise.all(downloadPromises)

  // Generate and download ZIP if any images were downloaded
  if (completed > 0) {
    try {
      const content = await zip.generateAsync({ type: 'blob' })
      saveAs(content, zipFilename)
      return { success: true, downloaded: completed, failed }
    } catch (error) {
      console.error('Failed to generate ZIP:', error)
      return { success: false, downloaded: completed, failed }
    }
  }

  return { success: false, downloaded: 0, failed: imageUrls.length }
}

/**
 * Generate a ZIP filename for a blog post
 */
export function generateZipFilename(memberName: string, postTitle: string): string {
  const cleanMemberName = memberName.replace(/[^a-zA-Z0-9\u3040-\u309f\u30a0-\u30ff\u4e00-\u9faf_-]/g, '')
  const cleanTitle = postTitle
    .replace(/[^a-zA-Z0-9\u3040-\u309f\u30a0-\u30ff\u4e00-\u9faf_-]/g, '')
    .substring(0, 20)
  const timestamp = new Date().toISOString().slice(0, 10).replace(/-/g, '')
  return `${cleanMemberName}_${cleanTitle}_${timestamp}.zip`
}

/**
 * Check if the device is mobile
 */
export function isMobileDevice(): boolean {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  )
}

/**
 * Share images using Web Share API (for mobile - allows saving to Photos)
 */
export async function shareImages(
  imageUrls: string[],
  title: string,
  onProgress?: ProgressCallback
): Promise<{ success: boolean; shared: number; failed: number }> {
  if (!navigator.share) {
    return { success: false, shared: 0, failed: imageUrls.length }
  }

  let shared = 0
  let failed = 0

  const updateProgress = () => {
    if (onProgress) {
      onProgress({
        total: imageUrls.length,
        completed: shared,
        failed,
        percentage: Math.round(((shared + failed) / imageUrls.length) * 100),
      })
    }
  }

  updateProgress()

  // Fetch all images first
  const files: File[] = []
  for (let i = 0; i < imageUrls.length; i++) {
    try {
      const response = await fetch(imageUrls[i], { mode: 'cors' })
      if (response.ok) {
        const blob = await response.blob()
        const ext = imageUrls[i].match(/\.(jpg|jpeg|png|gif|webp)$/i)?.[1] || 'jpg'
        const file = new File([blob], `image_${i + 1}.${ext}`, { type: blob.type })
        files.push(file)
        shared++
      } else {
        failed++
      }
    } catch {
      failed++
    }
    updateProgress()
  }

  if (files.length === 0) {
    return { success: false, shared: 0, failed: imageUrls.length }
  }

  // Check if we can share files
  if (navigator.canShare && navigator.canShare({ files })) {
    try {
      await navigator.share({
        title,
        files,
      })
      return { success: true, shared: files.length, failed }
    } catch (error) {
      // User cancelled or share failed
      if ((error as Error).name === 'AbortError') {
        // User cancelled - still count as success since images were prepared
        return { success: true, shared: files.length, failed }
      }
      console.error('Share failed:', error)
      return { success: false, shared: 0, failed: imageUrls.length }
    }
  }

  return { success: false, shared: 0, failed: imageUrls.length }
}
