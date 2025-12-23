/**
 * BlogCard component - displays a blog post preview card
 */

import { Link } from 'react-router-dom'
import type { BlogPost } from '../../types/api'
import { formatRelativeTime } from '../../utils/date'

interface BlogCardProps {
  blog: BlogPost
  hasCommented?: boolean
  showMemberInfo?: boolean
  isNew?: boolean
}

export function BlogCard({
  blog,
  hasCommented = false,
  showMemberInfo = true,
  isNew = false,
}: BlogCardProps) {
  return (
    <Link
      to={`/blog/${blog.id}`}
      className="group block overflow-hidden rounded-lg bg-white shadow-md transition-all hover:shadow-lg dark:bg-gray-800"
    >
      <div className="flex flex-col sm:flex-row">
        {/* Thumbnail */}
        <div className="relative aspect-video w-full shrink-0 overflow-hidden bg-gray-100 sm:aspect-square sm:w-32 md:w-40 dark:bg-gray-700">
          {blog.thumbnail ? (
            <img
              src={blog.thumbnail}
              alt={blog.title}
              className="h-full w-full object-cover transition-transform group-hover:scale-105"
              loading="lazy"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-gray-400">
              <svg
                className="h-8 w-8"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
          )}

          {/* Commented Badge */}
          {hasCommented && (
            <div className="absolute left-2 top-2 flex items-center gap-1 rounded bg-green-500 px-1.5 py-0.5 text-xs text-white">
              <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              コメント済
            </div>
          )}

          {/* NEW Badge */}
          {isNew && (
            <div className="absolute right-2 top-2 rounded bg-nogi-500 px-2 py-0.5 text-xs font-bold text-white">
              NEW
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex min-w-0 flex-1 flex-col p-3">
          {/* Member Info */}
          {showMemberInfo && (
            <div className="mb-2 flex items-center gap-2">
              {blog.memberImage ? (
                <img
                  src={blog.memberImage}
                  alt={blog.memberName}
                  className="h-6 w-6 rounded-full object-cover"
                />
              ) : (
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-200 text-xs text-gray-500 dark:bg-gray-600">
                  {blog.memberName.charAt(0)}
                </div>
              )}
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {blog.memberName}
              </span>
            </div>
          )}

          {/* Title */}
          <h3 className="mb-1 line-clamp-2 text-sm font-semibold text-gray-900 group-hover:text-nogi-600 dark:text-white dark:group-hover:text-nogi-400">
            {blog.title}
          </h3>

          {/* Date and Image Count */}
          <div className="mt-auto flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
            <time>{formatRelativeTime(blog.publishedAt)}</time>
            {blog.images.length > 0 && (
              <span className="flex items-center gap-1">
                <svg
                  className="h-3.5 w-3.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                {blog.images.length}枚
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  )
}
