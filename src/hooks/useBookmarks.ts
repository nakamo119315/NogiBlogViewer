/**
 * Hook for managing bookmarked blog posts
 */

import { useCallback, useMemo } from 'react'
import { useLocalStorage } from './useLocalStorage'
import type { BlogPost, BookmarkedPost } from '../types/api'
import { STORAGE_KEYS } from '../types/api'

interface UseBookmarksResult {
  /** List of bookmarked posts */
  bookmarks: BookmarkedPost[]
  /** Check if a post is bookmarked */
  isBookmarked: (postId: string) => boolean
  /** Add a post to bookmarks */
  addBookmark: (post: BlogPost) => void
  /** Remove a post from bookmarks */
  removeBookmark: (postId: string) => void
  /** Toggle bookmark status */
  toggleBookmark: (post: BlogPost) => void
  /** Number of bookmarked posts */
  bookmarkCount: number
}

export function useBookmarks(): UseBookmarksResult {
  const [bookmarks, setBookmarks] = useLocalStorage<BookmarkedPost[]>(
    STORAGE_KEYS.BOOKMARKS,
    []
  )

  const isBookmarked = useCallback(
    (postId: string) => bookmarks.some((b) => b.id === postId),
    [bookmarks]
  )

  const addBookmark = useCallback(
    (post: BlogPost) => {
      if (!isBookmarked(post.id)) {
        const bookmark: BookmarkedPost = {
          id: post.id,
          title: post.title,
          memberName: post.memberName,
          memberCode: post.memberId,
          publishedAt: post.publishedAt.toISOString(),
          bookmarkedAt: new Date().toISOString(),
          thumbnail: post.thumbnail,
        }
        setBookmarks((prev) => [bookmark, ...prev])
      }
    },
    [isBookmarked, setBookmarks]
  )

  const removeBookmark = useCallback(
    (postId: string) => {
      setBookmarks((prev) => prev.filter((b) => b.id !== postId))
    },
    [setBookmarks]
  )

  const toggleBookmark = useCallback(
    (post: BlogPost) => {
      if (isBookmarked(post.id)) {
        removeBookmark(post.id)
      } else {
        addBookmark(post)
      }
    },
    [isBookmarked, addBookmark, removeBookmark]
  )

  return useMemo(
    () => ({
      bookmarks,
      isBookmarked,
      addBookmark,
      removeBookmark,
      toggleBookmark,
      bookmarkCount: bookmarks.length,
    }),
    [bookmarks, isBookmarked, addBookmark, removeBookmark, toggleBookmark]
  )
}
