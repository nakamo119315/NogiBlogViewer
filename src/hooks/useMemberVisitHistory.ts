import { useCallback, useRef } from 'react'
import { useLocalStorage } from './useLocalStorage'
import { STORAGE_KEYS, MemberVisitHistory } from '../types/api'

/**
 * Hook for tracking member page visit history
 * Used to highlight new blog posts since last visit
 */
export function useMemberVisitHistory() {
  const [visitHistory, setVisitHistory] = useLocalStorage<MemberVisitHistory>(
    STORAGE_KEYS.MEMBER_VISITS,
    {}
  )

  // Store the initial visit time for comparison during the session
  const sessionVisitRef = useRef<Record<string, Date>>({})

  /**
   * Get the last visit date for a member
   * Returns the stored visit date, not the current session's visit
   */
  const getLastVisit = useCallback(
    (memberId: string): Date | null => {
      // First check session cache (for consistent behavior during page navigation)
      if (sessionVisitRef.current[memberId]) {
        return sessionVisitRef.current[memberId]
      }

      const timestamp = visitHistory[memberId]
      if (!timestamp) {
        return null
      }

      try {
        const date = new Date(timestamp)
        // Cache in session ref
        sessionVisitRef.current[memberId] = date
        return date
      } catch {
        return null
      }
    },
    [visitHistory]
  )

  /**
   * Record a visit to a member's page
   * Should be called after the page is displayed to user
   */
  const recordVisit = useCallback(
    (memberId: string): void => {
      // Store current time before recording for comparison
      const currentStoredTime = visitHistory[memberId]
      if (currentStoredTime && !sessionVisitRef.current[memberId]) {
        sessionVisitRef.current[memberId] = new Date(currentStoredTime)
      }

      const now = new Date().toISOString()
      setVisitHistory((prev) => ({
        ...prev,
        [memberId]: now,
      }))
    },
    [visitHistory, setVisitHistory]
  )

  /**
   * Check if a blog post is new (published after last visit)
   */
  const isNewPost = useCallback(
    (memberId: string, publishedAt: Date): boolean => {
      const lastVisit = getLastVisit(memberId)
      if (!lastVisit) {
        // First visit - nothing is "new"
        return false
      }
      return publishedAt > lastVisit
    },
    [getLastVisit]
  )

  /**
   * Clear all visit history
   */
  const clearHistory = useCallback((): void => {
    setVisitHistory({})
    sessionVisitRef.current = {}
  }, [setVisitHistory])

  return {
    getLastVisit,
    recordVisit,
    isNewPost,
    clearHistory,
  }
}
