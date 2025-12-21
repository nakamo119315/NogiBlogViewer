/**
 * Hook for managing comment history
 */

import { useState, useEffect, useCallback, useMemo } from 'react'
import type { CommentRecord } from '../types/api'
import {
  getCommentHistory,
  addCommentRecord,
  removeCommentRecord,
  getCommentedPostIds,
  clearCommentHistory,
} from '../services/commentService'

interface UseCommentHistoryResult {
  /** List of comment records */
  comments: CommentRecord[]
  /** List of commented post IDs */
  commentedPostIds: string[]
  /** Check if a post has been commented on */
  isCommented: (postId: string) => boolean
  /** Mark a post as commented */
  markAsCommented: (postId: string, postTitle: string, memberName: string, note?: string) => void
  /** Remove a comment record */
  removeComment: (postId: string) => void
  /** Clear all comment history */
  clearAll: () => void
  /** Refresh comment history from localStorage */
  refresh: () => void
}

export function useCommentHistory(): UseCommentHistoryResult {
  const [comments, setComments] = useState<CommentRecord[]>([])
  const [commentedPostIds, setCommentedPostIds] = useState<string[]>([])

  // Load comments from localStorage
  const loadComments = useCallback(() => {
    const history = getCommentHistory()
    setComments(history)
    setCommentedPostIds(getCommentedPostIds())
  }, [])

  // Initial load
  useEffect(() => {
    loadComments()
  }, [loadComments])

  // Check if a post is commented
  const isCommented = useCallback(
    (postId: string) => commentedPostIds.includes(postId),
    [commentedPostIds]
  )

  // Mark a post as commented
  const markAsCommented = useCallback(
    (postId: string, postTitle: string, memberName: string, note?: string) => {
      addCommentRecord(postId, postTitle, memberName, note)
      loadComments()
    },
    [loadComments]
  )

  // Remove a comment record
  const removeComment = useCallback(
    (postId: string) => {
      removeCommentRecord(postId)
      loadComments()
    },
    [loadComments]
  )

  // Clear all comments
  const clearAll = useCallback(() => {
    clearCommentHistory()
    loadComments()
  }, [loadComments])

  return useMemo(
    () => ({
      comments,
      commentedPostIds,
      isCommented,
      markAsCommented,
      removeComment,
      clearAll,
      refresh: loadComments,
    }),
    [
      comments,
      commentedPostIds,
      isCommented,
      markAsCommented,
      removeComment,
      clearAll,
      loadComments,
    ]
  )
}
