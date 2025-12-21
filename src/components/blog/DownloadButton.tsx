/**
 * DownloadButton component - button to download all images
 */

import { useState } from 'react'
import { downloadAllImages, generateZipFilename, shareImages, isMobileDevice, type DownloadProgress } from '../../utils/download'

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
  const [showOptions, setShowOptions] = useState(false)

  const isMobile = isMobileDevice()

  if (imageUrls.length === 0) {
    return null
  }

  const handleZipDownload = async () => {
    setShowOptions(false)
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
      setTimeout(() => setResult(null), 5000)
    }
  }

  const handleShare = async () => {
    setShowOptions(false)
    setIsDownloading(true)
    setProgress(null)
    setResult(null)

    try {
      const { success, shared, failed } = await shareImages(
        imageUrls,
        `${memberName} - ${postTitle}`,
        setProgress
      )

      if (success) {
        setResult({
          success: true,
          message: `${shared}枚の画像を共有しました${failed > 0 ? ` (${failed}枚失敗)` : ''}`,
        })
      } else {
        setResult({
          success: false,
          message: '共有に失敗しました。ZIPダウンロードをお試しください。',
        })
      }
    } catch (error) {
      setResult({
        success: false,
        message: 'エラーが発生しました',
      })
      console.error('Share error:', error)
    } finally {
      setIsDownloading(false)
      setTimeout(() => setResult(null), 5000)
    }
  }

  const handleButtonClick = () => {
    if (isMobile) {
      setShowOptions(!showOptions)
    } else {
      handleZipDownload()
    }
  }

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={handleButtonClick}
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
            {progress ? `${progress.percentage}%` : '処理中...'}
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
            画像を保存 ({imageUrls.length}枚)
          </>
        )}
      </button>

      {/* Mobile Options Menu */}
      {showOptions && isMobile && (
        <div className="absolute left-0 top-full z-20 mt-2 w-56 rounded-lg bg-white p-2 shadow-lg dark:bg-gray-800">
          <button
            onClick={handleShare}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <svg className="h-5 w-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
            <div>
              <div className="font-medium">写真に保存</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">共有シートから保存できます</div>
            </div>
          </button>
          <button
            onClick={handleZipDownload}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <svg className="h-5 w-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
            </svg>
            <div>
              <div className="font-medium">ZIPダウンロード</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">ファイルアプリに保存</div>
            </div>
          </button>
        </div>
      )}

      {/* Backdrop for options menu */}
      {showOptions && isMobile && (
        <div
          className="fixed inset-0 z-10"
          onClick={() => setShowOptions(false)}
        />
      )}

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
