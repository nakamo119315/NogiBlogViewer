/**
 * CommentHistory component - displays list of commented posts
 */

import { Link } from 'react-router-dom'
import type { CommentRecord } from '../../types/api'
import { formatRelativeTime } from '../../utils/date'

interface CommentHistoryProps {
  comments: CommentRecord[]
  onRemove?: (postId: string) => void
}

export function CommentHistory({ comments, onRemove }: CommentHistoryProps) {
  if (comments.length === 0) {
    return (
      <div className="py-12 text-center">
        <svg
          className="mx-auto h-12 w-12 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
          />
        </svg>
        <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">
          コメント履歴がありません
        </h3>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          ブログにコメントするとここに表示されます
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {comments.map((comment) => (
        <div
          key={comment.postId}
          className="flex items-start gap-3 rounded-lg bg-white p-4 shadow-sm dark:bg-gray-800"
        >
          {/* Comment Icon */}
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400">
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </div>

          {/* Content */}
          <div className="min-w-0 flex-1">
            <Link
              to={`/blog/${comment.postId}`}
              className="block text-sm font-medium text-gray-900 hover:text-nogi-600 dark:text-white dark:hover:text-nogi-400"
            >
              {comment.postTitle}
            </Link>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {comment.memberName} • {formatRelativeTime(comment.commentedAt)}
            </p>
            {comment.note && (
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                {comment.note}
              </p>
            )}
          </div>

          {/* Remove Button */}
          {onRemove && (
            <button
              onClick={() => onRemove(comment.postId)}
              className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-700"
              title="削除"
              aria-label="削除"
            >
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
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          )}
        </div>
      ))}
    </div>
  )
}
