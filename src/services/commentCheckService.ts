/**
 * Service for checking user comments from the official API
 */

import type { ApiCommentResponse } from '../types/api'
import { fetchJSONP, buildApiUrl } from './api'
import { API_ENDPOINTS } from '../types/api'

const CACHE_KEY = 'nogiblog_comment_cache'
const CACHE_DURATION = 10 * 60 * 1000 // 10 minutes (longer due to more data)

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

interface FetchResult {
  postIds: string[]
  comments: UserComment[]
}

/**
 * Fetch comments from API and find posts commented by the user
 */
async function fetchUserComments(username: string): Promise<FetchResult> {
  if (!username.trim()) {
    return { postIds: [], comments: [] }
  }

  const commentedPostIds: string[] = []
  const userComments: UserComment[] = []

  // Fetch comments in batches to avoid timeout
  // API is slow with large batches, so use smaller batches (50 each)
  // Fetch up to 5000 comments (100 batches of 50)
  const batchSize = 50
  const maxBatches = 100

  for (let batch = 0; batch < maxBatches; batch++) {
    try {
      const url = buildApiUrl(API_ENDPOINTS.COMMENT_LIST, {
        rw: batchSize,
        st: batch * batchSize,
      })

      // Use longer timeout for comment API (30 seconds)
      const response = await fetchJSONP<ApiCommentResponse>(url, 30000)

      // Find comments by the user
      for (const comment of response.data) {
        if (comment.comment1 === username) {
          // Add to post IDs (deduplicated)
          if (!commentedPostIds.includes(comment.kijicode)) {
            commentedPostIds.push(comment.kijicode)
          }
          // Store comment details
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
    } catch (error) {
      console.error(`Failed to fetch comments batch ${batch}:`, error)
      // Continue with next batch or return what we have so far
      if (batch === 0) {
        // First batch failed, return empty
        return { postIds: [], comments: [] }
      }
      // We have some results, stop fetching and return what we found
      break
    }
  }

  return { postIds: commentedPostIds, comments: userComments }
}

interface CommentResult {
  postIds: string[]
  comments: UserComment[]
}

/**
 * Get post IDs and comments by username
 * Uses cache if available and username hasn't changed
 */
export async function getCommentedPostIdsByUsername(username: string): Promise<CommentResult> {
  if (!username.trim()) {
    return { postIds: [], comments: [] }
  }

  // Check cache
  const cache = getCache()
  if (cache &&
      cache.username === username &&
      Date.now() - cache.lastFetched < CACHE_DURATION) {
    return {
      postIds: cache.commentedPostIds,
      comments: cache.userComments || []
    }
  }

  // Fetch fresh data
  const result = await fetchUserComments(username)

  // Save to cache
  saveCache({
    username,
    commentedPostIds: result.postIds,
    userComments: result.comments,
    lastFetched: Date.now(),
  })

  return result
}

/**
 * Force refresh comment data for a username
 */
export async function refreshCommentedPosts(username: string): Promise<CommentResult> {
  clearCommentCache()
  return getCommentedPostIdsByUsername(username)
}

/**
 * Check if cache is valid for the given username
 */
export function isCacheValid(username: string): boolean {
  const cache = getCache()
  return !!(cache &&
    cache.username === username &&
    Date.now() - cache.lastFetched < CACHE_DURATION)
}

/**
 * Get cached user comments
 */
export function getCachedUserComments(): UserComment[] {
  const cache = getCache()
  return cache?.userComments || []
}
