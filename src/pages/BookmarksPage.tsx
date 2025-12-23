/**
 * BookmarksPage - displays bookmarked blog posts
 */

import { Link } from 'react-router-dom'
import { useBookmarks } from '../hooks/useBookmarks'
import { formatDate } from '../utils/date'

export function BookmarksPage() {
  const { bookmarks, removeBookmark } = useBookmarks()

  const hasNoBookmarks = bookmarks.length === 0

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          保存済み
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          {bookmarks.length}件のブログを保存中
        </p>
      </div>

      {/* Content */}
      {hasNoBookmarks ? (
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
              d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
            />
          </svg>
          <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">
            保存済みのブログがありません
          </h3>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            ブログ記事の「保存」ボタンから追加できます
          </p>
          <Link
            to="/"
            className="mt-4 inline-flex items-center gap-1 text-sm text-nogi-600 hover:underline dark:text-nogi-400"
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
                d="M15 19l-7-7 7-7"
              />
            </svg>
            ホームへ
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {bookmarks.map((bookmark) => (
            <div
              key={bookmark.id}
              className="flex items-start gap-3 rounded-lg bg-white p-3 shadow-md transition-shadow hover:shadow-lg dark:bg-gray-800"
            >
              {/* Thumbnail */}
              {bookmark.thumbnail && (
                <Link
                  to={`/blog/${bookmark.id}`}
                  className="flex-shrink-0"
                >
                  <img
                    src={bookmark.thumbnail}
                    alt=""
                    className="h-16 w-16 rounded-md object-cover"
                  />
                </Link>
              )}

              {/* Content */}
              <div className="min-w-0 flex-1">
                <Link
                  to={`/blog/${bookmark.id}`}
                  className="block hover:opacity-80"
                >
                  <h3 className="line-clamp-2 font-medium text-gray-900 dark:text-white">
                    {bookmark.title}
                  </h3>
                </Link>
                <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                  <Link
                    to={`/member/${bookmark.memberCode}`}
                    className="hover:text-nogi-600 dark:hover:text-nogi-400"
                  >
                    {bookmark.memberName}
                  </Link>
                  <span>・</span>
                  <time>{formatDate(new Date(bookmark.publishedAt))}</time>
                </div>
              </div>

              {/* Remove Button */}
              <button
                onClick={() => removeBookmark(bookmark.id)}
                className="flex-shrink-0 rounded-full p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-700 dark:hover:text-gray-300"
                aria-label="保存を解除"
              >
                <svg
                  className="h-5 w-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                  />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
