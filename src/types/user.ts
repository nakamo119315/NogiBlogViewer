/**
 * User-related type definitions
 */

export interface UserPreferences {
  /** Username for comments */
  username: string
  /** List of favorite member IDs */
  favoriteMembers: string[]
  /** UI theme */
  theme: 'light' | 'dark'
  /** Whether to show only favorite members */
  showOnlyFavorites: boolean
}

export interface CommentRecord {
  /** ID of the post commented on */
  postId: string
  /** Title of the post (for display) */
  postTitle: string
  /** Member name (for display) */
  memberName: string
  /** When the comment was marked */
  commentedAt: Date
  /** Optional note */
  note?: string
}

export const DEFAULT_PREFERENCES: UserPreferences = {
  username: '',
  favoriteMembers: [],
  theme: 'light',
  showOnlyFavorites: false,
}
