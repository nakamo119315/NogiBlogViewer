import { useMemo } from 'react'
import type { BlogPost } from '../types/api'
import { getMonthKey, daysBetween } from '../utils/date'

export interface MonthlyCount {
  month: string
  count: number
}

export interface BlogStatistics {
  totalPosts: number
  postsPerMonth: number
  monthlyDistribution: MonthlyCount[]
  daysSinceLastPost: number | null
  mostActiveMonth: MonthlyCount | null
  firstPostDate: Date | null
  lastPostDate: Date | null
}

/**
 * Hook to compute statistics from blog posts
 */
export function useBlogStatistics(blogs: BlogPost[]): BlogStatistics {
  return useMemo(() => {
    if (blogs.length === 0) {
      return {
        totalPosts: 0,
        postsPerMonth: 0,
        monthlyDistribution: [],
        daysSinceLastPost: null,
        mostActiveMonth: null,
        firstPostDate: null,
        lastPostDate: null,
      }
    }

    // Sort blogs by date (newest first)
    const sortedBlogs = [...blogs].sort(
      (a, b) => b.publishedAt.getTime() - a.publishedAt.getTime()
    )

    const lastPostDate = sortedBlogs[0].publishedAt
    const firstPostDate = sortedBlogs[sortedBlogs.length - 1].publishedAt

    // Calculate monthly distribution
    const monthCounts = new Map<string, number>()
    for (const blog of blogs) {
      const monthKey = getMonthKey(blog.publishedAt)
      monthCounts.set(monthKey, (monthCounts.get(monthKey) || 0) + 1)
    }

    // Sort months chronologically
    const monthlyDistribution: MonthlyCount[] = Array.from(monthCounts.entries())
      .map(([month, count]) => ({ month, count }))
      .sort((a, b) => a.month.localeCompare(b.month))

    // Find most active month
    const mostActiveMonth = monthlyDistribution.reduce<MonthlyCount | null>(
      (max, current) => (!max || current.count > max.count ? current : max),
      null
    )

    // Calculate posts per month
    const totalMonths = monthlyDistribution.length
    const postsPerMonth = totalMonths > 0 ? blogs.length / totalMonths : 0

    // Calculate days since last post
    const daysSinceLastPost = daysBetween(lastPostDate, new Date())

    return {
      totalPosts: blogs.length,
      postsPerMonth: Math.round(postsPerMonth * 10) / 10,
      monthlyDistribution,
      daysSinceLastPost,
      mostActiveMonth,
      firstPostDate,
      lastPostDate,
    }
  }, [blogs])
}
