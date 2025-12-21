/**
 * Service for checking user comments from the official API
 */

import type { ApiCommentResponse } from '../types/api'
import { fetchJSONP, buildApiUrl } from './api'
import { API_ENDPOINTS } from '../types/api'

const CACHE_KEY = 'nogiblog_comment_cache'
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

interface CommentCache {
  username: string
  commentedPostIds: string[]
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
 * Fetch comments from API and find posts commented by the user
 */
async function fetchUserComments(username: string): Promise<string[]> {
  if (!username.trim()) {
    return []
  }

  const commentedPostIds: string[] = []

  try {
    // Fetch recent comments (up to 1000 to increase chances of finding user's comments)
    const url = buildApiUrl(API_ENDPOINTS.COMMENT_LIST, { rw: 1000 })
    const response = await fetchJSONP<ApiCommentResponse>(url)

    // Find comments by the user
    for (const comment of response.data) {
      if (comment.comment1 === username) {
        if (!commentedPostIds.includes(comment.kijicode)) {
          commentedPostIds.push(comment.kijicode)
        }
      }
    }
  } catch (error) {
    console.error('Failed to fetch comments from API:', error)
  }

  return commentedPostIds
}

/**
 * Get post IDs that the user has commented on
 * Uses cache if available and username hasn't changed
 */
export async function getCommentedPostIdsByUsername(username: string): Promise<string[]> {
  if (!username.trim()) {
    return []
  }

  // Check cache
  const cache = getCache()
  if (cache &&
      cache.username === username &&
      Date.now() - cache.lastFetched < CACHE_DURATION) {
    return cache.commentedPostIds
  }

  // Fetch fresh data
  const commentedPostIds = await fetchUserComments(username)

  // Save to cache
  saveCache({
    username,
    commentedPostIds,
    lastFetched: Date.now(),
  })

  return commentedPostIds
}

/**
 * Force refresh comment data for a username
 */
export async function refreshCommentedPosts(username: string): Promise<string[]> {
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
