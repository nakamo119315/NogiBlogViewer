import { useMemo } from 'react'
import type { BlogPost, Member } from '../types/api'
import { getMonthKey, daysBetween } from '../utils/date'
import type { MonthlyCount } from './useBlogStatistics'

export interface MemberStatistics {
  memberId: string
  memberName: string
  memberImage: string
  totalPosts: number
  postsPerMonth: number
  lastPostDate: Date | null
  daysSinceLastPost: number | null
}

export interface AllMembersStatistics {
  members: MemberStatistics[]
  totalPosts: number
  activeMembersCount: number
  monthlyDistribution: MonthlyCount[]
}

/**
 * Calculate statistics for all members from blog posts
 */
export function useAllMembersStatistics(
  blogs: BlogPost[],
  members: Member[]
): AllMembersStatistics {
  return useMemo(() => {
    if (blogs.length === 0) {
      return {
        members: [],
        totalPosts: 0,
        activeMembersCount: 0,
        monthlyDistribution: [],
      }
    }

    // Group blogs by member
    const blogsByMember = new Map<string, BlogPost[]>()
    for (const blog of blogs) {
      const existing = blogsByMember.get(blog.memberId) || []
      existing.push(blog)
      blogsByMember.set(blog.memberId, existing)
    }

    // Calculate overall monthly distribution
    const monthCounts = new Map<string, number>()
    for (const blog of blogs) {
      const monthKey = getMonthKey(blog.publishedAt)
      monthCounts.set(monthKey, (monthCounts.get(monthKey) || 0) + 1)
    }

    const monthlyDistribution: MonthlyCount[] = Array.from(monthCounts.entries())
      .map(([month, count]) => ({ month, count }))
      .sort((a, b) => a.month.localeCompare(b.month))

    // Calculate statistics for each member
    const memberStats: MemberStatistics[] = []

    for (const member of members) {
      const memberBlogs = blogsByMember.get(member.code) || []

      if (memberBlogs.length === 0) {
        continue // Skip members with no posts
      }

      // Sort by date (newest first)
      const sortedBlogs = [...memberBlogs].sort(
        (a, b) => b.publishedAt.getTime() - a.publishedAt.getTime()
      )

      const lastPostDate = sortedBlogs[0].publishedAt

      // Calculate months active
      const memberMonths = new Set<string>()
      for (const blog of memberBlogs) {
        memberMonths.add(getMonthKey(blog.publishedAt))
      }

      const totalMonths = memberMonths.size
      const postsPerMonth = totalMonths > 0 ? memberBlogs.length / totalMonths : 0

      memberStats.push({
        memberId: member.code,
        memberName: member.name,
        memberImage: member.profileImage,
        totalPosts: memberBlogs.length,
        postsPerMonth: Math.round(postsPerMonth * 10) / 10,
        lastPostDate,
        daysSinceLastPost: daysBetween(lastPostDate, new Date()),
      })
    }

    return {
      members: memberStats,
      totalPosts: blogs.length,
      activeMembersCount: memberStats.length,
      monthlyDistribution,
    }
  }, [blogs, members])
}

/**
 * Sort member statistics by different criteria
 */
export function sortMemberStats(
  members: MemberStatistics[],
  sortBy: 'totalPosts' | 'postsPerMonth' | 'lastPostDate'
): MemberStatistics[] {
  const sorted = [...members]

  switch (sortBy) {
    case 'totalPosts':
      return sorted.sort((a, b) => b.totalPosts - a.totalPosts)
    case 'postsPerMonth':
      return sorted.sort((a, b) => b.postsPerMonth - a.postsPerMonth)
    case 'lastPostDate':
      return sorted.sort((a, b) => {
        if (!a.lastPostDate) return 1
        if (!b.lastPostDate) return -1
        return b.lastPostDate.getTime() - a.lastPostDate.getTime()
      })
    default:
      return sorted
  }
}
