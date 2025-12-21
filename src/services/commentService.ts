/**
 * Comment service for managing comment history
 */

import type { CommentRecord } from '../types/api'
import { STORAGE_KEYS } from '../types/api'

const COMMENTS_STORAGE_KEY = STORAGE_KEYS.COMMENTS

/**
 * Get all comment records from localStorage
 */
export function getCommentHistory(): CommentRecord[] {
  try {
    const data = localStorage.getItem(COMMENTS_STORAGE_KEY)
    if (!data) return []

    const parsed = JSON.parse(data) as CommentRecord[]
    return parsed.map((record) => ({
      ...record,
      commentedAt: new Date(record.commentedAt),
    }))
  } catch {
    return []
  }
}

/**
 * Add a comment record
 */
export function addCommentRecord(
  postId: string,
  postTitle: string,
  memberName: string,
  note?: string
): CommentRecord {
  const history = getCommentHistory()

  const newRecord: CommentRecord = {
    postId,
    postTitle,
    memberName,
    commentedAt: new Date(),
    note,
  }

  // Check if already exists
  const existingIndex = history.findIndex((r) => r.postId === postId)
  if (existingIndex !== -1) {
    // Update existing record
    history[existingIndex] = newRecord
  } else {
    // Add new record
    history.unshift(newRecord)
  }

  // Keep only last 100 records
  const trimmedHistory = history.slice(0, 100)

  localStorage.setItem(COMMENTS_STORAGE_KEY, JSON.stringify(trimmedHistory))

  return newRecord
}

/**
 * Remove a comment record
 */
export function removeCommentRecord(postId: string): void {
  const history = getCommentHistory()
  const filtered = history.filter((r) => r.postId !== postId)
  localStorage.setItem(COMMENTS_STORAGE_KEY, JSON.stringify(filtered))
}

/**
 * Check if a post has been commented on
 */
export function hasCommented(postId: string): boolean {
  const history = getCommentHistory()
  return history.some((r) => r.postId === postId)
}

/**
 * Get all commented post IDs
 */
export function getCommentedPostIds(): string[] {
  const history = getCommentHistory()
  return history.map((r) => r.postId)
}

/**
 * Clear all comment history
 */
export function clearCommentHistory(): void {
  localStorage.removeItem(COMMENTS_STORAGE_KEY)
}

/**
 * Build comment URL for official site
 */
export function buildCommentUrl(blogLink: string): string {
  const baseUrl = 'https://www.nogizaka46.com'
  return blogLink.startsWith('http') ? blogLink : `${baseUrl}${blogLink}`
}
