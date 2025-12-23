import { useState } from 'react'
import type { BlogStatistics as BlogStatsType } from '../../hooks/useBlogStatistics'
import { MonthlyPostsChart } from './MonthlyPostsChart'
import { formatMonthDisplay } from '../../utils/date'

interface BlogStatisticsProps {
  stats: BlogStatsType
  isLoading?: boolean
}

export function BlogStatistics({ stats, isLoading = false }: BlogStatisticsProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  if (isLoading) {
    return (
      <div className="animate-pulse rounded-lg bg-white p-4 shadow-md dark:bg-gray-800">
        <div className="h-6 w-24 rounded bg-gray-200 dark:bg-gray-700" />
      </div>
    )
  }

  if (stats.totalPosts === 0) {
    return null
  }

  return (
    <div className="overflow-hidden rounded-lg bg-white shadow-md dark:bg-gray-800">
      {/* Header - Always visible */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex w-full items-center justify-between p-4 text-left transition-colors hover:bg-gray-50 dark:hover:bg-gray-700"
      >
        <div className="flex items-center gap-2">
          <svg
            className="h-5 w-5 text-nogi-600 dark:text-nogi-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
            />
          </svg>
          <span className="font-medium text-gray-900 dark:text-white">
            統計情報
          </span>
          <span className="rounded-full bg-nogi-100 px-2 py-0.5 text-xs text-nogi-700 dark:bg-nogi-900 dark:text-nogi-300">
            {stats.totalPosts}件
          </span>
        </div>

        <svg
          className={`h-5 w-5 text-gray-500 transition-transform dark:text-gray-400 ${
            isExpanded ? 'rotate-180' : ''
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="border-t border-gray-100 p-4 dark:border-gray-700">
          {/* Stats Grid */}
          <div className="mb-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-nogi-600 dark:text-nogi-400">
                {stats.totalPosts}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                総投稿数
              </div>
            </div>

            <div className="text-center">
              <div className="text-2xl font-bold text-nogi-600 dark:text-nogi-400">
                {stats.postsPerMonth}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                月平均
              </div>
            </div>

            <div className="text-center">
              <div className="text-2xl font-bold text-nogi-600 dark:text-nogi-400">
                {stats.daysSinceLastPost !== null
                  ? stats.daysSinceLastPost === 0
                    ? '今日'
                    : `${stats.daysSinceLastPost}日前`
                  : '-'}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                最終投稿
              </div>
            </div>

            <div className="text-center">
              <div className="text-lg font-bold text-nogi-600 dark:text-nogi-400">
                {stats.mostActiveMonth
                  ? formatMonthDisplay(stats.mostActiveMonth.month)
                  : '-'}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                最も活発な月
                {stats.mostActiveMonth && (
                  <span className="ml-1">({stats.mostActiveMonth.count}件)</span>
                )}
              </div>
            </div>
          </div>

          {/* Chart */}
          <div className="mt-4">
            <h4 className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              月別投稿数
            </h4>
            <MonthlyPostsChart data={stats.monthlyDistribution} />
          </div>
        </div>
      )}
    </div>
  )
}
