/**
 * BlogSplitView component - split view layout for blog content and comments
 */

import { useState, useCallback } from 'react'
import type { BlogPost } from '../../types/api'
import { BlogContent } from './BlogContent'
import { CommentPanel } from '../comment/CommentPanel'
import { useBookmarks } from '../../hooks/useBookmarks'

interface BlogSplitViewProps {
  blog: BlogPost
  hasCommented?: boolean
  onDownloadClick?: () => void
}

export function BlogSplitView({
  blog,
  hasCommented = false,
  onDownloadClick,
}: BlogSplitViewProps) {
  const [isCommentPanelOpen, setIsCommentPanelOpen] = useState(false)
  const { isBookmarked, toggleBookmark } = useBookmarks()

  const handleCommentClick = () => {
    setIsCommentPanelOpen(true)
  }

  const handleBookmarkToggle = useCallback(() => {
    toggleBookmark(blog)
  }, [toggleBookmark, blog])

  return (
    <>
      <BlogContent
        blog={blog}
        hasCommented={hasCommented}
        isBookmarked={isBookmarked(blog.id)}
        onCommentClick={handleCommentClick}
        onDownloadClick={onDownloadClick}
        onBookmarkToggle={handleBookmarkToggle}
      />

      <CommentPanel
        blog={blog}
        isOpen={isCommentPanelOpen}
        onClose={() => setIsCommentPanelOpen(false)}
      />
    </>
  )
}
