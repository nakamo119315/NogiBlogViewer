import { useState, useCallback, useMemo } from 'react'
import type { BlogPost } from '../types/api'
import { isDateInRange } from '../utils/date'

/**
 * Hook for filtering blog posts by date range
 */
export function useDateFilter() {
  const [fromDate, setFromDate] = useState<Date | null>(null)
  const [toDate, setToDate] = useState<Date | null>(null)

  /**
   * Clear the date filter
   */
  const clearFilter = useCallback(() => {
    setFromDate(null)
    setToDate(null)
  }, [])

  /**
   * Check if filter is active
   */
  const isFiltered = useMemo(() => {
    return fromDate !== null || toDate !== null
  }, [fromDate, toDate])

  /**
   * Filter blogs by date range
   */
  const filterBlogs = useCallback(
    (blogs: BlogPost[]): BlogPost[] => {
      if (!isFiltered) {
        return blogs
      }

      return blogs.filter((blog) =>
        isDateInRange(blog.publishedAt, fromDate, toDate)
      )
    },
    [fromDate, toDate, isFiltered]
  )

  return {
    fromDate,
    toDate,
    setFromDate,
    setToDate,
    clearFilter,
    filterBlogs,
    isFiltered,
  }
}
