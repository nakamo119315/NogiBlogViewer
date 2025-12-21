/**
 * DownloadProgress component - displays download progress bar
 */

import type { DownloadProgress as DownloadProgressType } from '../../utils/download'

interface DownloadProgressProps {
  progress: DownloadProgressType
  isVisible: boolean
}

export function DownloadProgress({ progress, isVisible }: DownloadProgressProps) {
  if (!isVisible) return null

  return (
    <div className="fixed inset-x-4 bottom-24 z-50 mx-auto max-w-md rounded-lg bg-white p-4 shadow-lg dark:bg-gray-800">
      <div className="mb-2 flex items-center justify-between text-sm">
        <span className="font-medium text-gray-900 dark:text-white">
          画像をダウンロード中...
        </span>
        <span className="text-gray-500 dark:text-gray-400">
          {progress.completed + progress.failed}/{progress.total}
        </span>
      </div>

      {/* Progress Bar */}
      <div className="h-2 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
        <div
          className="h-full rounded-full bg-nogi-500 transition-all duration-300"
          style={{ width: `${progress.percentage}%` }}
        />
      </div>

      {/* Status */}
      <div className="mt-2 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
        <span>{progress.completed}枚成功</span>
        {progress.failed > 0 && (
          <span className="text-red-500">{progress.failed}枚失敗</span>
        )}
      </div>
    </div>
  )
}
