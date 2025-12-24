/**
 * Global data cache context for API data
 * Reduces API calls by caching data across page navigations
 */

import {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from 'react'
import type { BlogPost, Member } from '../types/api'
import { fetchBlogs, getStaticBlogs } from '../services/blogService'
import {
  fetchActiveMembers,
  fetchGenerations,
  getStaticMembers,
} from '../services/memberService'

interface DataCache {
  blogs: BlogPost[]
  members: Member[]
  generations: string[]
  lastFetchedAt: number | null
}

interface DataContextType {
  // Cached data
  blogs: BlogPost[]
  members: Member[]
  generations: string[]
  // Loading states
  isLoading: boolean
  // Has data been fetched this session?
  hasFetched: boolean
  // Fetch data (uses cache if available)
  fetchData: () => Promise<void>
  // Force refresh from API
  refreshData: () => Promise<void>
  // Get cache age in minutes
  cacheAgeMinutes: number | null
}

const DataContext = createContext<DataContextType | undefined>(undefined)

interface DataProviderProps {
  children: ReactNode
}

export function DataProvider({ children }: DataProviderProps) {
  const [cache, setCache] = useState<DataCache>(() => ({
    blogs: getStaticBlogs(),
    members: getStaticMembers(),
    generations: [],
    lastFetchedAt: null,
  }))
  const [isLoading, setIsLoading] = useState(false)
  const [hasFetched, setHasFetched] = useState(false)

  const fetchData = useCallback(async () => {
    // If already fetched this session, use cache
    if (hasFetched) {
      return
    }

    setIsLoading(true)
    try {
      const [blogs, members, generations] = await Promise.all([
        fetchBlogs({ count: 200 }),
        fetchActiveMembers(),
        fetchGenerations(),
      ])

      setCache({
        blogs,
        members,
        generations,
        lastFetchedAt: Date.now(),
      })
      setHasFetched(true)
    } catch (error) {
      console.error('Failed to fetch data:', error)
      // Keep static data on error
    } finally {
      setIsLoading(false)
    }
  }, [hasFetched])

  const refreshData = useCallback(async () => {
    setIsLoading(true)
    try {
      const [blogs, members, generations] = await Promise.all([
        fetchBlogs({ count: 200 }),
        fetchActiveMembers(),
        fetchGenerations(),
      ])

      setCache({
        blogs,
        members,
        generations,
        lastFetchedAt: Date.now(),
      })
      setHasFetched(true)
    } catch (error) {
      console.error('Failed to refresh data:', error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const cacheAgeMinutes = cache.lastFetchedAt
    ? Math.floor((Date.now() - cache.lastFetchedAt) / 60000)
    : null

  return (
    <DataContext.Provider
      value={{
        blogs: cache.blogs,
        members: cache.members,
        generations: cache.generations,
        isLoading,
        hasFetched,
        fetchData,
        refreshData,
        cacheAgeMinutes,
      }}
    >
      {children}
    </DataContext.Provider>
  )
}

export function useDataCache() {
  const context = useContext(DataContext)
  if (context === undefined) {
    throw new Error('useDataCache must be used within a DataProvider')
  }
  return context
}
