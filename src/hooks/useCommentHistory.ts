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
import {
  checkCommentsOnPosts,
  refreshCommentCheck,
  type UserComment,
} from '../services/commentCheckService'
import { fetchBlogsByMember } from '../services/blogService'
import { useAppContext } from '../store/AppContext'

interface UseCommentHistoryResult {
  /** List of comment records (manual) */
  comments: CommentRecord[]
  /** List of commented post IDs (manual + API) */
  commentedPostIds: string[]
  /** List of API-detected commented post IDs */
  apiCommentedPostIds: string[]
  /** List of API-detected user comments with details */
  apiUserComments: UserComment[]
  /** Number of posts being checked */
  checkedPostCount: number
  /** Check if a post has been commented on */
  isCommented: (postId: string) => boolean
  /** Mark a post as commented */
  markAsCommented: (postId: string, postTitle: string, memberName: string, note?: string) => void
  /** Remove a comment record */
  removeComment: (postId: string) => void
  /** Clear all comment history */
  clearAll: () => void
  /** Refresh comment history */
  refresh: () => void
  /** Whether API comments are being loaded */
  isLoadingApiComments: boolean
}

export function useCommentHistory(): UseCommentHistoryResult {
  const [comments, setComments] = useState<CommentRecord[]>([])
  const [manualCommentedPostIds, setManualCommentedPostIds] = useState<string[]>([])
  const [apiCommentedPostIds, setApiCommentedPostIds] = useState<string[]>([])
  const [apiUserComments, setApiUserComments] = useState<UserComment[]>([])
  const [checkedPostCount, setCheckedPostCount] = useState(0)
  const [isLoadingApiComments, setIsLoadingApiComments] = useState(false)

  const { preferences } = useAppContext()
  const username = preferences.username
  const favoriteMembers = preferences.favoriteMembers

  // Load manual comments from localStorage
  const loadManualComments = useCallback(() => {
    const history = getCommentHistory()
    setComments(history)
    setManualCommentedPostIds(getCommentedPostIds())
  }, [])

  // Load API comments for favorite members' latest posts
  const loadApiComments = useCallback(async () => {
    if (!username || favoriteMembers.length === 0) {
      setApiCommentedPostIds([])
      setApiUserComments([])
      setCheckedPostCount(0)
      return
    }

    setIsLoadingApiComments(true)
    try {
      // Get latest 2 posts from each favorite member
      const postIds: string[] = []
      for (const memberId of favoriteMembers) {
        try {
          const blogs = await fetchBlogsByMember(memberId, 2)
          postIds.push(...blogs.map((b) => b.id))
        } catch (error) {
          console.error(`Failed to fetch blogs for member ${memberId}:`, error)
        }
      }

      setCheckedPostCount(postIds.length)

      if (postIds.length === 0) {
        setApiCommentedPostIds([])
        setApiUserComments([])
        return
      }

      // Check comments on those posts
      const result = await checkCommentsOnPosts(postIds, username)
      setApiCommentedPostIds(result.postIds)
      setApiUserComments(result.comments)
    } catch (error) {
      console.error('Failed to load API comments:', error)
    } finally {
      setIsLoadingApiComments(false)
    }
  }, [username, favoriteMembers])

  // Initial load - manual comments
  useEffect(() => {
    loadManualComments()
  }, [loadManualComments])

  // Load API comments when username changes
  useEffect(() => {
    loadApiComments()
  }, [loadApiComments])

  // Combine manual and API commented post IDs
  const commentedPostIds = useMemo(() => {
    const combined = new Set([...manualCommentedPostIds, ...apiCommentedPostIds])
    return Array.from(combined)
  }, [manualCommentedPostIds, apiCommentedPostIds])

  // Check if a post is commented
  const isCommented = useCallback(
    (postId: string) => commentedPostIds.includes(postId),
    [commentedPostIds]
  )

  // Mark a post as commented
  const markAsCommented = useCallback(
    (postId: string, postTitle: string, memberName: string, note?: string) => {
      addCommentRecord(postId, postTitle, memberName, note)
      loadManualComments()
    },
    [loadManualComments]
  )

  // Remove a comment record
  const removeComment = useCallback(
    (postId: string) => {
      removeCommentRecord(postId)
      loadManualComments()
    },
    [loadManualComments]
  )

  // Clear all manual comments
  const clearAll = useCallback(() => {
    clearCommentHistory()
    loadManualComments()
  }, [loadManualComments])

  // Refresh both manual and API comments
  const refresh = useCallback(async () => {
    loadManualComments()
    if (username && favoriteMembers.length > 0) {
      setIsLoadingApiComments(true)
      try {
        // Get latest 2 posts from each favorite member
        const postIds: string[] = []
        for (const memberId of favoriteMembers) {
          try {
            const blogs = await fetchBlogsByMember(memberId, 2)
            postIds.push(...blogs.map((b) => b.id))
          } catch (error) {
            console.error(`Failed to fetch blogs for member ${memberId}:`, error)
          }
        }

        setCheckedPostCount(postIds.length)

        if (postIds.length > 0) {
          const result = await refreshCommentCheck(postIds, username)
          setApiCommentedPostIds(result.postIds)
          setApiUserComments(result.comments)
        }
      } finally {
        setIsLoadingApiComments(false)
      }
    }
  }, [loadManualComments, username, favoriteMembers])

  return useMemo(
    () => ({
      comments,
      commentedPostIds,
      apiCommentedPostIds,
      apiUserComments,
      checkedPostCount,
      isCommented,
      markAsCommented,
      removeComment,
      clearAll,
      refresh,
      isLoadingApiComments,
    }),
    [
      comments,
      commentedPostIds,
      apiCommentedPostIds,
      apiUserComments,
      checkedPostCount,
      isCommented,
      markAsCommented,
      removeComment,
      clearAll,
      refresh,
      isLoadingApiComments,
    ]
  )
}
