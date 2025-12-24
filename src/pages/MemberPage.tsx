/**
 * MemberPage - 特定メンバーのブログ一覧を表示するページ
 */

import { useEffect, useMemo } from 'react'
import { useParams, Link } from 'react-router-dom'
import { BlogList } from '../components/blog/BlogList'
import { BlogStatistics } from '../components/blog/BlogStatistics'
import { DateRangeFilter } from '../components/blog/DateRangeFilter'
import { useDataCache } from '../store/DataContext'
import { useBlogData } from '../hooks/useBlogData'
import { useCommentHistory } from '../hooks/useCommentHistory'
import { useMemberVisitHistory } from '../hooks/useMemberVisitHistory'
import { useDateFilter } from '../hooks/useDateFilter'
import { useBlogStatistics } from '../hooks/useBlogStatistics'
import { Loading } from '../components/common/Loading'
import { useAppContext } from '../store/AppContext'

export function MemberPage() {
  const { memberId } = useParams<{ memberId: string }>()

  // Use cached member data
  const { members, hasFetched: hasCachedData, fetchData: fetchCacheData } = useDataCache()
  const member = useMemo(
    () => members.find((m) => m.code === memberId) ?? null,
    [members, memberId]
  )

  // Fetch cache if not already fetched
  useEffect(() => {
    if (!hasCachedData) {
      fetchCacheData()
    }
  }, [hasCachedData, fetchCacheData])

  const {
    blogs,
    isLoading: isBlogsLoading,
    hasMore,
    loadMore,
  } = useBlogData({ memberCode: memberId })
  const { preferences, toggleFavorite } = useAppContext()
  const { commentedPostIds } = useCommentHistory()

  // New feature hooks
  const { getLastVisit, recordVisit } = useMemberVisitHistory()
  const {
    fromDate,
    toDate,
    setFromDate,
    setToDate,
    clearFilter,
    filterBlogs,
    isFiltered,
  } = useDateFilter()

  // Get last visit date before recording new visit
  const lastVisitDate = memberId ? getLastVisit(memberId) : null

  // Record visit when page loads
  useEffect(() => {
    if (memberId) {
      // Small delay to ensure last visit is captured first
      const timer = setTimeout(() => {
        recordVisit(memberId)
      }, 100)
      return () => clearTimeout(timer)
    }
  }, [memberId, recordVisit])

  // Filter blogs by date range
  const filteredBlogs = useMemo(() => filterBlogs(blogs), [blogs, filterBlogs])

  // Calculate statistics from all blogs (not filtered)
  const stats = useBlogStatistics(blogs)

  const isFavorite = member
    ? preferences.favoriteMembers.includes(member.code)
    : false

  if (!hasCachedData && !member) {
    return <Loading text="メンバー情報を読み込み中..." />
  }

  if (!member) {
    return (
      <div className="py-12 text-center">
        <p className="text-gray-500 dark:text-gray-400">
          メンバーが見つかりません
        </p>
        <Link
          to="/"
          className="mt-4 inline-block text-nogi-600 hover:underline dark:text-nogi-400"
        >
          ホームに戻る
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Member Header */}
      <div className="overflow-hidden rounded-lg bg-white shadow-md dark:bg-gray-800">
        <div className="flex flex-col items-center gap-4 p-6 sm:flex-row">
          {/* Profile Image */}
          <div className="h-24 w-24 shrink-0 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-700">
            {member.profileImage ? (
              <img
                src={member.profileImage}
                alt={member.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-2xl text-gray-400">
                {member.name.charAt(0)}
              </div>
            )}
          </div>

          {/* Member Info */}
          <div className="flex-1 text-center sm:text-left">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {member.name}
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {member.englishName}
            </p>
            <div className="mt-2 flex flex-wrap justify-center gap-2 sm:justify-start">
              <span className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-600 dark:bg-gray-700 dark:text-gray-300">
                {member.generation}
              </span>
              {member.birthday && (
                <span className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-600 dark:bg-gray-700 dark:text-gray-300">
                  {member.birthday}
                </span>
              )}
              {member.bloodType && (
                <span className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-600 dark:bg-gray-700 dark:text-gray-300">
                  {member.bloodType.endsWith('型') ? member.bloodType : `${member.bloodType}型`}
                </span>
              )}
              {member.isGraduated && (
                <span className="rounded-full bg-gray-600 px-3 py-1 text-xs text-white">
                  卒業
                </span>
              )}
            </div>
          </div>

          {/* Favorite Button */}
          <button
            onClick={() => toggleFavorite(member.code)}
            className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              isFavorite
                ? 'bg-pink-500 text-white hover:bg-pink-600'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            <svg
              className="h-5 w-5"
              fill={isFavorite ? 'currentColor' : 'none'}
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
            {isFavorite ? 'お気に入り' : 'お気に入りに追加'}
          </button>
        </div>
      </div>

      {/* Statistics Section */}
      <BlogStatistics stats={stats} isLoading={isBlogsLoading} />

      {/* Blog List */}
      <div className="space-y-4">
        {/* Date Filter */}
        <DateRangeFilter
          fromDate={fromDate}
          toDate={toDate}
          onFromDateChange={setFromDate}
          onToDateChange={setToDate}
          onClear={clearFilter}
          isFiltered={isFiltered}
        />

        {/* Blog List Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            ブログ投稿
          </h2>
          {isFiltered && (
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {filteredBlogs.length}件 / {blogs.length}件
            </span>
          )}
        </div>

        <BlogList
          blogs={filteredBlogs}
          isLoading={isBlogsLoading}
          hasMore={hasMore && !isFiltered}
          commentedPostIds={commentedPostIds}
          showMemberInfo={false}
          onLoadMore={loadMore}
          lastVisitDate={lastVisitDate}
        />
      </div>
    </div>
  )
}
