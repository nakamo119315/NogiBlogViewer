/**
 * Image URL extraction and processing utilities
 */

import { API_ENDPOINTS } from '../types/api'

/**
 * Extract all image URLs from HTML content
 * @param htmlContent - HTML string containing img tags
 * @returns Array of image URLs
 */
export function extractImagesFromHtml(htmlContent: string): string[] {
  const imgRegex = /<img[^>]+src=["']([^"']+)["'][^>]*>/gi
  const images: string[] = []
  let match

  while ((match = imgRegex.exec(htmlContent)) !== null) {
    const src = match[1]
    if (src) {
      images.push(normalizeImageUrl(src))
    }
  }

  return images
}

/**
 * Normalize image URL to absolute URL
 * @param url - Image URL (may be relative)
 * @returns Absolute URL
 */
export function normalizeImageUrl(url: string): string {
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url
  }

  if (url.startsWith('//')) {
    return `https:${url}`
  }

  if (url.startsWith('/')) {
    return `${API_ENDPOINTS.BASE_URL}${url}`
  }

  return `${API_ENDPOINTS.BASE_URL}/${url}`
}

/**
 * Get image filename from URL
 * @param url - Image URL
 * @returns Filename
 */
export function getImageFilename(url: string): string {
  const parts = url.split('/')
  return parts[parts.length - 1] || 'image'
}

/**
 * Get image extension from URL or default to jpg
 * @param url - Image URL
 * @returns File extension
 */
export function getImageExtension(url: string): string {
  const filename = getImageFilename(url)
  const match = filename.match(/\.([a-zA-Z0-9]+)(\?.*)?$/)
  return match ? match[1].toLowerCase() : 'jpg'
}

/**
 * Check if URL is a valid image URL
 * @param url - URL to check
 * @returns Boolean indicating if URL is an image
 */
export function isImageUrl(url: string): boolean {
  const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp']
  const ext = getImageExtension(url)
  return imageExtensions.includes(ext)
}

/**
 * Create placeholder image URL
 * @param width - Image width
 * @param height - Image height
 * @returns Placeholder URL
 */
export function getPlaceholderImage(width = 300, height = 300): string {
  return `https://via.placeholder.com/${width}x${height}?text=No+Image`
}
