/**
 * BlogContent component - displays full blog post content
 */

import { Link } from 'react-router-dom'
import type { BlogPost } from '../../types/api'
import { formatDateTime } from '../../utils/date'
import { BlogImage } from './BlogImage'
import { DownloadButton } from './DownloadButton'
import { API_ENDPOINTS } from '../../types/api'

interface BlogContentProps {
  blog: BlogPost
  hasCommented?: boolean
  onCommentClick?: () => void
  onDownloadClick?: () => void
}

export function BlogContent({
  blog,
  hasCommented = false,
  onCommentClick,
}: BlogContentProps) {
  // Build official blog URL
  const officialUrl = blog.link.startsWith('http')
    ? blog.link
    : `${API_ENDPOINTS.BASE_URL}${blog.link}`

  return (
    <article className="overflow-hidden rounded-lg bg-white shadow-md dark:bg-gray-800">
      {/* Header */}
      <div className="border-b border-gray-200 p-4 dark:border-gray-700">
        {/* Member Info */}
        <Link
          to={`/member/${blog.memberId}`}
          className="mb-3 flex items-center gap-3 transition-opacity hover:opacity-80"
        >
          {blog.memberImage ? (
            <img
              src={blog.memberImage}
              alt={blog.memberName}
              className="h-10 w-10 rounded-full object-cover"
            />
          ) : (
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200 text-gray-500 dark:bg-gray-600">
              {blog.memberName.charAt(0)}
            </div>
          )}
          <span className="font-medium text-gray-900 dark:text-white">
            {blog.memberName}
          </span>
        </Link>

        {/* Title */}
        <h1 className="text-xl font-bold text-gray-900 dark:text-white">
          {blog.title}
        </h1>

        {/* Meta */}
        <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
          <time>{formatDateTime(blog.publishedAt)}</time>
          {blog.images.length > 0 && (
            <span className="flex items-center gap-1">
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
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              {blog.images.length}枚
            </span>
          )}
          {hasCommented && (
            <span className="flex items-center gap-1 text-green-600 dark:text-green-400">
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              コメント済み
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div
        className="prose prose-sm max-w-none p-4 dark:prose-invert prose-img:rounded-lg prose-img:mx-auto"
        dangerouslySetInnerHTML={{ __html: blog.content }}
      />

      {/* Images Gallery */}
      {blog.images.length > 0 && (
        <div className="border-t border-gray-200 p-4 dark:border-gray-700">
          <h2 className="mb-3 text-sm font-semibold text-gray-900 dark:text-white">
            画像一覧 ({blog.images.length}枚)
          </h2>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
            {blog.images.map((imageUrl, index) => (
              <BlogImage
                key={`${blog.id}-image-${index}`}
                src={imageUrl}
                alt={`${blog.title} - 画像${index + 1}`}
              />
            ))}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-2 border-t border-gray-200 p-4 dark:border-gray-700">
        {/* Comment Button */}
        {onCommentClick && (
          <button
            onClick={onCommentClick}
            className="flex items-center gap-2 rounded-lg bg-nogi-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-nogi-600"
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
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
            コメントする
          </button>
        )}

        {/* Download Button */}
        {blog.images.length > 0 && (
          <DownloadButton
            imageUrls={blog.images}
            memberName={blog.memberName}
            postTitle={blog.title}
          />
        )}

        {/* Official Site Link */}
        <a
          href={officialUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
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
              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
            />
          </svg>
          公式サイトで見る
        </a>
      </div>
    </article>
  )
}
