/**
 * Service for checking user comments from the official API
 * Fetches comments for specific blog posts (by article ID)
 */

import type { ApiCommentResponse } from '../types/api'
import { fetchJSONP, buildApiUrl } from './api'
import { API_ENDPOINTS } from '../types/api'

const CACHE_KEY = 'nogiblog_comment_cache'
const CACHE_DURATION = 60 * 60 * 1000 // 1 hour (longer since we preserve history)

/** User comment found from API */
export interface UserComment {
  /** Post ID */
  postId: string
  /** Comment ID */
  commentId: string
  /** Comment content */
  body: string
  /** Comment date */
  date: string
}

interface CommentCache {
  username: string
  postIds: string[] // Post IDs that were checked
  commentedPostIds: string[]
  userComments: UserComment[]
  lastFetched: number
}

/**
 * Get cached comment data
 */
function getCache(): CommentCache | null {
  try {
    const data = localStorage.getItem(CACHE_KEY)
    if (!data) return null
    return JSON.parse(data) as CommentCache
  } catch {
    return null
  }
}

/**
 * Save comment cache
 */
function saveCache(cache: CommentCache): void {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(cache))
  } catch {
    // Ignore storage errors
  }
}

/**
 * Clear comment cache
 */
export function clearCommentCache(): void {
  localStorage.removeItem(CACHE_KEY)
}

/**
 * Fetch all comments for a specific blog post
 * @param postId - The blog post ID (kijicode)
 * @param username - Username to search for
 * @returns Comments made by the user on this post
 */
async function fetchCommentsForPost(postId: string, username: string): Promise<UserComment[]> {
  const userComments: UserComment[] = []
  const batchSize = 10
  let offset = 0
  const maxIterations = 100 // Safety limit (1000 comments per post max)

  for (let i = 0; i < maxIterations; i++) {
    try {
      const url = buildApiUrl(API_ENDPOINTS.COMMENT_LIST, {
        kiji: postId,
        rw: batchSize,
        st: offset,
        callback: 'res',
      })

      const response = await fetchJSONP<ApiCommentResponse>(url, 15000)

      // Find comments by the user
      for (const comment of response.data) {
        if (comment.comment1 === username) {
          userComments.push({
            postId: comment.kijicode,
            commentId: comment.code,
            body: comment.body,
            date: comment.date,
          })
        }
      }

      // If we got less than batch size, we've reached the end
      if (response.data.length < batchSize) {
        break
      }

      offset += batchSize
    } catch (error) {
      console.error(`Failed to fetch comments for post ${postId} at offset ${offset}:`, error)
      break
    }
  }

  return userComments
}

export interface CommentResult {
  postIds: string[]
  comments: UserComment[]
}

/**
 * Check comments on specific blog posts for a username
 * Skips posts that are already known to be commented
 * @param postIds - Array of post IDs to check
 * @param username - Username to search for
 * @returns Result with commented post IDs and comment details
 */
export async function checkCommentsOnPosts(
  postIds: string[],
  username: string
): Promise<CommentResult> {
  if (!username.trim() || postIds.length === 0) {
    // Return existing cache even if no new posts to check
    const cache = getCache()
    if (cache && cache.username === username) {
      return {
        postIds: cache.commentedPostIds,
        comments: cache.userComments || []
      }
    }
    return { postIds: [], comments: [] }
  }

  // Get existing cache to preserve previous results
  const cache = getCache()
  const existingCommentedPostIds: string[] = cache?.username === username ? [...(cache.commentedPostIds || [])] : []
  const existingComments: UserComment[] = cache?.username === username ? [...(cache.userComments || [])] : []
  const alreadyCheckedPostIds: string[] = cache?.username === username ? [...(cache.postIds || [])] : []

  // Filter out posts that are already marked as commented (no need to re-check)
  const postsToCheck = postIds.filter(id => !existingCommentedPostIds.includes(id))

  // Also check if cache is still valid for posts we've already checked
  const needsFreshCheck = postsToCheck.some(id => !alreadyCheckedPostIds.includes(id)) ||
    (cache && Date.now() - cache.lastFetched > CACHE_DURATION)

  if (!needsFreshCheck && cache) {
    // All posts either commented or recently checked
    return {
      postIds: existingCommentedPostIds,
      comments: existingComments
    }
  }

  const newComments: UserComment[] = []
  const newCommentedPostIds: string[] = []

  // Only fetch comments for posts that need checking
  for (const postId of postsToCheck) {
    // Skip if we already checked this post recently and it wasn't commented
    if (alreadyCheckedPostIds.includes(postId) && cache && Date.now() - cache.lastFetched < CACHE_DURATION) {
      continue
    }

    const comments = await fetchCommentsForPost(postId, username)
    if (comments.length > 0) {
      newComments.push(...comments)
      if (!newCommentedPostIds.includes(postId)) {
        newCommentedPostIds.push(postId)
      }
    }
  }

  // Merge with existing results
  const mergedCommentedPostIds = [...new Set([...existingCommentedPostIds, ...newCommentedPostIds])]
  const mergedComments = [...existingComments, ...newComments]
  const mergedCheckedPostIds = [...new Set([...alreadyCheckedPostIds, ...postIds])]

  // Save to cache
  saveCache({
    username,
    postIds: mergedCheckedPostIds,
    commentedPostIds: mergedCommentedPostIds,
    userComments: mergedComments,
    lastFetched: Date.now(),
  })

  return { postIds: mergedCommentedPostIds, comments: mergedComments }
}

/**
 * Force refresh comment data for specific posts
 * Preserves existing commented posts but re-checks the given posts
 */
export async function refreshCommentCheck(
  postIds: string[],
  username: string
): Promise<CommentResult> {
  if (!username.trim() || postIds.length === 0) {
    return { postIds: [], comments: [] }
  }

  // Get existing cache to preserve commented posts
  const cache = getCache()
  const existingCommentedPostIds: string[] = cache?.username === username ? [...(cache.commentedPostIds || [])] : []
  const existingComments: UserComment[] = cache?.username === username ? [...(cache.userComments || [])] : []

  // Remove the posts we're re-checking from existing data
  const preservedCommentedPostIds = existingCommentedPostIds.filter(id => !postIds.includes(id))
  const preservedComments = existingComments.filter(c => !postIds.includes(c.postId))

  const newComments: UserComment[] = []
  const newCommentedPostIds: string[] = []

  // Force re-check all specified posts
  for (const postId of postIds) {
    const comments = await fetchCommentsForPost(postId, username)
    if (comments.length > 0) {
      newComments.push(...comments)
      if (!newCommentedPostIds.includes(postId)) {
        newCommentedPostIds.push(postId)
      }
    }
  }

  // Merge with preserved results
  const mergedCommentedPostIds = [...new Set([...preservedCommentedPostIds, ...newCommentedPostIds])]
  const mergedComments = [...preservedComments, ...newComments]

  // Save to cache
  saveCache({
    username,
    postIds: postIds, // Reset checked posts to current set
    commentedPostIds: mergedCommentedPostIds,
    userComments: mergedComments,
    lastFetched: Date.now(),
  })

  return { postIds: mergedCommentedPostIds, comments: mergedComments }
}

/**
 * Check if cache is valid for the given posts and username
 */
export function isCacheValid(postIds: string[], username: string): boolean {
  const cache = getCache()
  if (!cache) return false
  const cacheKey = postIds.sort().join(',')
  return (
    cache.username === username &&
    cache.postIds.sort().join(',') === cacheKey &&
    Date.now() - cache.lastFetched < CACHE_DURATION
  )
}
