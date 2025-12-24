/**
 * StatsPage - 全メンバーの統計情報を表示するページ
 */

import { useMemo, useEffect } from 'react'
import { useDataCache } from '../store/DataContext'
import {
  useAllMembersStatistics,
  sortMemberStats,
} from '../hooks/useAllMembersStatistics'
import { MemberRankingList } from '../components/stats/MemberRankingList'
import { MemberPostsChart } from '../components/stats/MemberPostsChart'
import { OverallChart } from '../components/stats/OverallChart'
import { Loading } from '../components/common/Loading'

export function StatsPage() {
  const {
    blogs,
    members,
    isLoading,
    hasFetched,
    fetchData,
    refreshData,
    cacheAgeMinutes,
  } = useDataCache()

  // Fetch data on first mount (only if not already fetched)
  useEffect(() => {
    if (!hasFetched) {
      fetchData()
    }
  }, [hasFetched, fetchData])

  const stats = useAllMembersStatistics(blogs, members)

  // Pre-sorted rankings
  const byTotalPosts = useMemo(
    () => sortMemberStats(stats.members, 'totalPosts'),
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
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 flex-1">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            統計情報
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            全メンバーのブログ投稿統計
          </p>
          {cacheAgeMinutes !== null && (
            <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">
              最終更新: {cacheAgeMinutes === 0 ? 'たった今' : `${cacheAgeMinutes}分前`}
            </p>
          )}
        </div>
        <button
          onClick={refreshData}
          disabled={isLoading}
          className="flex w-full items-center justify-center gap-1.5 rounded-lg bg-nogi-500 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-nogi-600 disabled:opacity-50 sm:w-auto"
        >
          <svg
            className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
          更新
        </button>
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

      {/* Member Posts Chart */}
      <MemberPostsChart members={stats.members} />

      {/* Rankings */}
      <div className="space-y-4">
        <MemberRankingList
          members={byTotalPosts}
          title="投稿数ランキング"
          sortBy="totalPosts"
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
