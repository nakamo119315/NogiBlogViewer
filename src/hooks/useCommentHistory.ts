/**
 * Hook for managing comment history (API-based only)
 */

import { useState, useEffect, useCallback, useMemo } from 'react'
import {
  checkCommentsOnPosts,
  refreshCommentCheck,
  getCachedCommentResults,
  type UserComment,
} from '../services/commentCheckService'
import { fetchBlogsByMember } from '../services/blogService'
import { useAppContext } from '../store/AppContext'

interface UseCommentHistoryOptions {
  /** Whether to fetch API comments (default: false, only Settings page should set true) */
  fetchApiComments?: boolean
}

interface UseCommentHistoryResult {
  /** List of commented post IDs */
  commentedPostIds: string[]
  /** List of API-detected user comments with details */
  apiUserComments: UserComment[]
  /** Number of posts being checked */
  checkedPostCount: number
  /** Check if a post has been commented on */
  isCommented: (postId: string) => boolean
  /** Refresh comment history */
  refresh: () => void
  /** Whether API comments are being loaded */
  isLoadingApiComments: boolean
}

export function useCommentHistory(options: UseCommentHistoryOptions = {}): UseCommentHistoryResult {
  const { fetchApiComments = false } = options
  const [commentedPostIds, setCommentedPostIds] = useState<string[]>([])
  const [apiUserComments, setApiUserComments] = useState<UserComment[]>([])
  const [checkedPostCount, setCheckedPostCount] = useState(0)
  const [isLoadingApiComments, setIsLoadingApiComments] = useState(false)

  const { preferences } = useAppContext()
  const username = preferences.username
  const favoriteMembers = preferences.favoriteMembers

  // Load API comments for favorite members' latest posts
  const loadApiComments = useCallback(async () => {
    if (!username || favoriteMembers.length === 0) {
      setCommentedPostIds([])
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
        setCommentedPostIds([])
        setApiUserComments([])
        return
      }

      // Check comments on those posts
      const result = await checkCommentsOnPosts(postIds, username)
      setCommentedPostIds(result.postIds)
      setApiUserComments(result.comments)
    } catch (error) {
      console.error('Failed to load API comments:', error)
    } finally {
      setIsLoadingApiComments(false)
    }
  }, [username, favoriteMembers])

  // Initial load - cached API comments only
  useEffect(() => {
    if (username) {
      const cached = getCachedCommentResults(username)
      setCommentedPostIds(cached.postIds)
      setApiUserComments(cached.comments)
    }
  }, [username])

  // Load fresh API comments only when explicitly requested (Settings page)
  useEffect(() => {
    if (fetchApiComments) {
      loadApiComments()
    }
  }, [fetchApiComments, loadApiComments])

  // Check if a post is commented
  const isCommented = useCallback(
    (postId: string) => commentedPostIds.includes(postId),
    [commentedPostIds]
  )

  // Refresh API comments
  const refresh = useCallback(async () => {
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
          setCommentedPostIds(result.postIds)
          setApiUserComments(result.comments)
        }
      } finally {
        setIsLoadingApiComments(false)
      }
    }
  }, [username, favoriteMembers])

  return useMemo(
    () => ({
      commentedPostIds,
      apiUserComments,
      checkedPostCount,
      isCommented,
      refresh,
      isLoadingApiComments,
    }),
    [
      commentedPostIds,
      apiUserComments,
      checkedPostCount,
      isCommented,
      refresh,
      isLoadingApiComments,
    ]
  )
}
