/**
 * StatsPage - 全メンバーの統計情報を表示するページ
 */

import { useMemo } from 'react'
import { useBlogData } from '../hooks/useBlogData'
import { useMemberData } from '../hooks/useMemberData'
import {
  useAllMembersStatistics,
  sortMemberStats,
} from '../hooks/useAllMembersStatistics'
import { MemberRankingList } from '../components/stats/MemberRankingList'
import { OverallChart } from '../components/stats/OverallChart'
import { Loading } from '../components/common/Loading'

export function StatsPage() {
  const { members, isLoading: isMembersLoading } = useMemberData()
  const { blogs, isLoading: isBlogsLoading } = useBlogData({ initialCount: 200 })

  const stats = useAllMembersStatistics(blogs, members)

  const isLoading = isMembersLoading || isBlogsLoading

  // Pre-sorted rankings
  const byTotalPosts = useMemo(
    () => sortMemberStats(stats.members, 'totalPosts'),
    [stats.members]
  )
  const byPostsPerMonth = useMemo(
    () => sortMemberStats(stats.members, 'postsPerMonth'),
    [stats.members]
  )
  const byLastPostDate = useMemo(
    () => sortMemberStats(stats.members, 'lastPostDate'),
    [stats.members]
  )

  if (isLoading && blogs.length === 0) {
    return <Loading text="統計情報を読み込み中..." />
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          統計情報
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          全メンバーのブログ投稿統計
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-lg bg-white p-4 shadow-md dark:bg-gray-800">
          <div className="text-2xl font-bold text-nogi-600 dark:text-nogi-400">
            {stats.totalPosts}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            総投稿数
          </div>
        </div>
        <div className="rounded-lg bg-white p-4 shadow-md dark:bg-gray-800">
          <div className="text-2xl font-bold text-nogi-600 dark:text-nogi-400">
            {stats.activeMembersCount}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            投稿メンバー数
          </div>
        </div>
      </div>

      {/* Overall Chart */}
      <OverallChart data={stats.monthlyDistribution} />

      {/* Rankings */}
      <div className="space-y-4">
        <MemberRankingList
          members={byTotalPosts}
          title="投稿数ランキング"
          sortBy="totalPosts"
        />

        <MemberRankingList
          members={byPostsPerMonth}
          title="更新頻度ランキング"
          sortBy="postsPerMonth"
        />

        <MemberRankingList
          members={byLastPostDate}
          title="最近の更新"
          sortBy="lastPostDate"
        />
      </div>
    </div>
  )
}
