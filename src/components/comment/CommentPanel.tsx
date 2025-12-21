/**
 * CommentPanel component - panel for composing comments
 */

import { useState } from 'react'
import type { BlogPost } from '../../types/api'
import { API_ENDPOINTS } from '../../types/api'
import { Button } from '../common/Button'

interface CommentPanelProps {
  blog: BlogPost
  isOpen: boolean
  onClose: () => void
  onCommentSubmit?: (postId: string) => void
}

export function CommentPanel({
  blog,
  isOpen,
  onClose,
  onCommentSubmit,
}: CommentPanelProps) {
  const [isRedirecting, setIsRedirecting] = useState(false)

  if (!isOpen) return null

  // Build official blog URL for commenting
  const officialUrl = blog.link.startsWith('http')
    ? blog.link
    : `${API_ENDPOINTS.BASE_URL}${blog.link}`

  const handleOpenOfficialSite = () => {
    setIsRedirecting(true)
    window.open(officialUrl, '_blank', 'noopener,noreferrer')

    // Mark as commented after redirect
    setTimeout(() => {
      setIsRedirecting(false)
      onCommentSubmit?.(blog.id)
    }, 500)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center sm:justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="relative w-full max-w-lg animate-slide-up rounded-t-2xl bg-white p-6 shadow-xl sm:rounded-2xl dark:bg-gray-800">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-700"
          aria-label="閉じる"
        >
          <svg
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        {/* Header */}
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            コメントする
          </h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {blog.memberName}さんの「{blog.title}」にコメント
          </p>
        </div>

        {/* Instructions */}
        <div className="mb-6 rounded-lg bg-gray-50 p-4 dark:bg-gray-700">
          <p className="text-sm text-gray-600 dark:text-gray-300">
            公式サイトでコメントを投稿できます。以下のボタンをタップすると、公式ブログページが新しいタブで開きます。
          </p>
        </div>

        {/* Blog Preview */}
        <div className="mb-6 flex items-center gap-3 rounded-lg border border-gray-200 p-3 dark:border-gray-600">
          {blog.thumbnail && (
            <img
              src={blog.thumbnail}
              alt=""
              className="h-12 w-12 rounded object-cover"
            />
          )}
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-gray-900 dark:text-white">
              {blog.title}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {blog.memberName}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <Button variant="outline" onClick={onClose} className="flex-1">
            キャンセル
          </Button>
          <Button
            variant="primary"
            onClick={handleOpenOfficialSite}
            disabled={isRedirecting}
            className="flex-1"
          >
            {isRedirecting ? (
              <span className="flex items-center gap-2">
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
                移動中...
              </span>
            ) : (
              <span className="flex items-center gap-2">
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
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  />
                </svg>
                公式サイトで開く
              </span>
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}
