/**
 * BlogList component - displays a list of blog posts
 */

import type { BlogPost } from '../../types/api'
import { BlogCard } from './BlogCard'
import { Loading } from '../common/Loading'
import { Button } from '../common/Button'

interface BlogListProps {
  blogs: BlogPost[]
  isLoading?: boolean
  hasMore?: boolean
  commentedPostIds?: string[]
  showMemberInfo?: boolean
  onLoadMore?: () => void
}

export function BlogList({
  blogs,
  isLoading = false,
  hasMore = false,
  commentedPostIds = [],
  showMemberInfo = true,
  onLoadMore,
}: BlogListProps) {
  if (isLoading && blogs.length === 0) {
    return <Loading text="ブログを読み込み中..." />
  }

  if (blogs.length === 0) {
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
            d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
          />
        </svg>
        <p className="mt-4 text-gray-500 dark:text-gray-400">
          ブログ投稿がありません
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Blog List */}
      <div className="space-y-3">
        {blogs.map((blog) => (
          <BlogCard
            key={blog.id}
            blog={blog}
            hasCommented={commentedPostIds.includes(blog.id)}
            showMemberInfo={showMemberInfo}
          />
        ))}
      </div>

      {/* Load More */}
      {hasMore && onLoadMore && (
        <div className="flex justify-center py-4">
          {isLoading ? (
            <Loading size="sm" />
          ) : (
            <Button variant="outline" onClick={onLoadMore}>
              もっと見る
            </Button>
          )}
        </div>
      )}
    </div>
  )
}
