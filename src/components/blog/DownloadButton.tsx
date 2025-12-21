/**
 * DownloadButton component - button to download all images
 */

import { useState } from 'react'
import { downloadAllImages, generateZipFilename, type DownloadProgress } from '../../utils/download'

interface DownloadButtonProps {
  imageUrls: string[]
  memberName: string
  postTitle: string
  disabled?: boolean
  className?: string
}

export function DownloadButton({
  imageUrls,
  memberName,
  postTitle,
  disabled = false,
  className = '',
}: DownloadButtonProps) {
  const [isDownloading, setIsDownloading] = useState(false)
  const [progress, setProgress] = useState<DownloadProgress | null>(null)
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null)

  if (imageUrls.length === 0) {
    return null
  }

  const handleDownload = async () => {
    setIsDownloading(true)
    setProgress(null)
    setResult(null)

    const filename = generateZipFilename(memberName, postTitle)

    try {
      const { success, downloaded, failed } = await downloadAllImages(
        imageUrls,
        filename,
        setProgress
      )

      if (success) {
        setResult({
          success: true,
          message: `${downloaded}枚の画像をダウンロードしました${failed > 0 ? ` (${failed}枚失敗)` : ''}`,
        })
      } else {
        setResult({
          success: false,
          message: failed > 0
            ? `画像のダウンロードに失敗しました。公式サイトから直接ダウンロードしてください。`
            : 'ダウンロードに失敗しました',
        })
      }
    } catch (error) {
      setResult({
        success: false,
        message: 'エラーが発生しました',
      })
      console.error('Download error:', error)
    } finally {
      setIsDownloading(false)
      // Clear result after 5 seconds
      setTimeout(() => setResult(null), 5000)
    }
  }

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={handleDownload}
        disabled={disabled || isDownloading}
        className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
          disabled || isDownloading
            ? 'cursor-not-allowed bg-gray-100 text-gray-400 dark:bg-gray-700 dark:text-gray-500'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
        }`}
      >
        {isDownloading ? (
          <>
            <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24">
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            {progress ? `${progress.percentage}%` : 'ダウンロード中...'}
          </>
        ) : (
          <>
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
              />
            </svg>
            画像を一括ダウンロード ({imageUrls.length}枚)
          </>
        )}
      </button>

      {/* Result Toast */}
      {result && (
        <div
          className={`absolute left-0 top-full z-10 mt-2 w-64 rounded-lg p-3 text-sm shadow-lg ${
            result.success
              ? 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300'
              : 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300'
          }`}
        >
          {result.message}
        </div>
      )}
    </div>
  )
}
