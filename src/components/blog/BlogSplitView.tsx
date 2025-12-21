/**
 * BlogSplitView component - split view layout for blog content and comments
 */

import { useState } from 'react'
import type { BlogPost } from '../../types/api'
import { BlogContent } from './BlogContent'
import { CommentPanel } from '../comment/CommentPanel'

interface BlogSplitViewProps {
  blog: BlogPost
  hasCommented?: boolean
  onMarkAsCommented?: (postId: string) => void
  onDownloadClick?: () => void
}

export function BlogSplitView({
  blog,
  hasCommented = false,
  onMarkAsCommented,
  onDownloadClick,
}: BlogSplitViewProps) {
  const [isCommentPanelOpen, setIsCommentPanelOpen] = useState(false)

  const handleCommentClick = () => {
    setIsCommentPanelOpen(true)
  }

  const handleCommentSubmit = (postId: string) => {
    onMarkAsCommented?.(postId)
    setIsCommentPanelOpen(false)
  }

  return (
    <>
      <BlogContent
        blog={blog}
        hasCommented={hasCommented}
        onCommentClick={handleCommentClick}
        onDownloadClick={onDownloadClick}
      />

      <CommentPanel
        blog={blog}
        isOpen={isCommentPanelOpen}
        onClose={() => setIsCommentPanelOpen(false)}
        onCommentSubmit={handleCommentSubmit}
      />
    </>
  )
}
