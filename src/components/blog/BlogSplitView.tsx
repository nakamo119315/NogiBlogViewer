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
  onDownloadClick?: () => void
}

export function BlogSplitView({
  blog,
  hasCommented = false,
  onDownloadClick,
}: BlogSplitViewProps) {
  const [isCommentPanelOpen, setIsCommentPanelOpen] = useState(false)

  const handleCommentClick = () => {
    setIsCommentPanelOpen(true)
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
      />
    </>
  )
}
