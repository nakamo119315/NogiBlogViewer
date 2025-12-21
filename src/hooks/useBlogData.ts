/**
 * Hook for fetching and managing blog data
 */

import { useState, useEffect, useCallback } from 'react'
import type { BlogPost } from '../types/api'
import {
  fetchBlogs,
  fetchBlogsByMember,
  fetchBlogById,
  getStaticBlogs,
} from '../services/blogService'

interface UseBlogDataOptions {
  /** Member code to filter by */
  memberCode?: string
  /** Number of posts to load initially */
  initialCount?: number
  /** Whether to use static data only (no API calls) */
  staticOnly?: boolean
}

interface UseBlogDataResult {
  /** Blog posts */
  blogs: BlogPost[]
  /** Whether data is being loaded */
  isLoading: boolean
  /** Error if any */
  error: Error | null
  /** Whether there are more posts to load */
  hasMore: boolean
  /** Load more posts */
  loadMore: () => Promise<void>
  /** Refresh blog data */
  refresh: () => Promise<void>
}

/**
 * Hook for fetching blog posts with hybrid loading
 * Uses static data initially, then fetches latest from API
 */
export function useBlogData(options: UseBlogDataOptions = {}): UseBlogDataResult {
  const { memberCode, initialCount = 20, staticOnly = false } = options

  const [blogs, setBlogs] = useState<BlogPost[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const [hasMore, setHasMore] = useState(true)
  const [page, setPage] = useState(0)

  // Initial load with hybrid approach
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true)
      setError(null)

      try {
        // Start with static data for instant display
        const staticData = getStaticBlogs()
        if (memberCode) {
          setBlogs(staticData.filter((b) => b.memberId === memberCode))
        } else {
          setBlogs(staticData)
        }

        // Then fetch fresh data from API
        if (!staticOnly) {
          const freshData = memberCode
            ? await fetchBlogsByMember(memberCode, initialCount)
            : await fetchBlogs({ count: initialCount })

          if (freshData.length > 0) {
            setBlogs(freshData)
            setHasMore(freshData.length >= initialCount)
          }
        }
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to load blogs'))
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
    setPage(0)
  }, [memberCode, initialCount, staticOnly])

  // Load more posts
  const loadMore = useCallback(async () => {
    if (isLoading || !hasMore) return

    setIsLoading(true)
    try {
      const nextPage = page + 1
      const moreBlogs = await fetchBlogs({
        count: initialCount,
        memberCode,
        page: nextPage,
      })

      if (moreBlogs.length > 0) {
        setBlogs((prev) => [...prev, ...moreBlogs])
        setPage(nextPage)
        setHasMore(moreBlogs.length >= initialCount)
      } else {
        setHasMore(false)
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to load more blogs'))
    } finally {
      setIsLoading(false)
    }
  }, [isLoading, hasMore, page, initialCount, memberCode])

  // Refresh data
  const refresh = useCallback(async () => {
    setPage(0)
    setHasMore(true)
    setIsLoading(true)
    setError(null)

    try {
      const freshData = memberCode
        ? await fetchBlogsByMember(memberCode, initialCount)
        : await fetchBlogs({ count: initialCount })

      setBlogs(freshData)
      setHasMore(freshData.length >= initialCount)
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to refresh blogs'))
    } finally {
      setIsLoading(false)
    }
  }, [memberCode, initialCount])

  return {
    blogs,
    isLoading,
    error,
    hasMore,
    loadMore,
    refresh,
  }
}

/**
 * Hook for fetching a single blog post
 */
export function useBlogPost(id: string | undefined) {
  const [blog, setBlog] = useState<BlogPost | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    if (!id) {
      setBlog(null)
      setIsLoading(false)
      return
    }

    const loadBlog = async () => {
      setIsLoading(true)
      setError(null)

      try {
        const blogPost = await fetchBlogById(id)
        setBlog(blogPost ?? null)
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to load blog post'))
      } finally {
        setIsLoading(false)
      }
    }

    loadBlog()
  }, [id])

  return { blog, isLoading, error }
}
