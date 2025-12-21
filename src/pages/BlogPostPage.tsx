/**
 * BlogPostPage - 特定のブログ投稿を表示するページ
 */

import { useParams, Link } from 'react-router-dom'
import { BlogSplitView } from '../components/blog/BlogSplitView'
import { useBlogPost } from '../hooks/useBlogData'
import { Loading } from '../components/common/Loading'
import { addCommentRecord, hasCommented } from '../services/commentService'
import { useState, useEffect } from 'react'

export function BlogPostPage() {
  const { blogId } = useParams<{ blogId: string }>()
  const { blog, isLoading, error } = useBlogPost(blogId)
  const [isCommented, setIsCommented] = useState(false)

  // Check if post has been commented on
  useEffect(() => {
    if (blogId) {
      setIsCommented(hasCommented(blogId))
    }
  }, [blogId])

  // Handle marking as commented
  const handleMarkAsCommented = (postId: string) => {
    if (blog) {
      addCommentRecord(postId, blog.title, blog.memberName)
      setIsCommented(true)
    }
  }

  if (isLoading) {
    return <Loading text="ブログを読み込み中..." />
  }

  if (error || !blog) {
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
            d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M12 12h.01M12 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <p className="mt-4 text-gray-500 dark:text-gray-400">
          {error?.message || 'ブログ投稿が見つかりません'}
        </p>
        <Link
          to="/"
          className="mt-4 inline-block text-nogi-600 hover:underline dark:text-nogi-400"
        >
          ホームに戻る
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Back Navigation */}
      <Link
        to={`/member/${blog.memberId}`}
        className="inline-flex items-center gap-1 text-sm text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
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
        {blog.memberName}のブログ一覧に戻る
      </Link>

      {/* Blog Split View with Comment Panel */}
      <BlogSplitView
        blog={blog}
        hasCommented={isCommented}
        onMarkAsCommented={handleMarkAsCommented}
      />
    </div>
  )
}
