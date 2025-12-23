import { useState } from 'react'
import { Link } from 'react-router-dom'
import type { MemberStatistics } from '../../hooks/useAllMembersStatistics'
import { formatRelativeTime } from '../../utils/date'

type SortBy = 'totalPosts' | 'postsPerMonth' | 'lastPostDate'

interface MemberRankingListProps {
  members: MemberStatistics[]
  title: string
  sortBy: SortBy
  showTopN?: number
}

export function MemberRankingList({
  members,
  title,
  sortBy,
  showTopN = 10,
}: MemberRankingListProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const displayMembers = isExpanded ? members : members.slice(0, showTopN)
  const hasMore = members.length > showTopN

  const getStatValue = (member: MemberStatistics): string => {
    switch (sortBy) {
      case 'totalPosts':
        return `${member.totalPosts}件`
      case 'postsPerMonth':
        return `${member.postsPerMonth}件/月`
      case 'lastPostDate':
        return member.lastPostDate
          ? formatRelativeTime(member.lastPostDate)
          : '-'
    }
  }

  const getStatLabel = (): string => {
    switch (sortBy) {
      case 'totalPosts':
        return '総投稿数'
      case 'postsPerMonth':
        return '月平均'
      case 'lastPostDate':
        return '最終投稿'
    }
  }

  return (
    <div className="overflow-hidden rounded-lg bg-white shadow-md dark:bg-gray-800">
      {/* Header */}
      <div className="border-b border-gray-100 px-4 py-3 dark:border-gray-700">
        <h3 className="font-semibold text-gray-900 dark:text-white">{title}</h3>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          {getStatLabel()}順
        </p>
      </div>

      {/* List */}
      <div className="divide-y divide-gray-100 dark:divide-gray-700">
        {displayMembers.map((member, index) => (
          <Link
            key={member.memberId}
            to={`/member/${member.memberId}`}
            className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            {/* Rank */}
            <div
              className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                index < 3
                  ? 'bg-nogi-500 text-white'
                  : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
              }`}
            >
              {index + 1}
            </div>

            {/* Profile Image */}
            <div className="h-10 w-10 shrink-0 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-700">
              {member.memberImage ? (
                <img
                  src={member.memberImage}
                  alt={member.memberName}
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-sm text-gray-400">
                  {member.memberName.charAt(0)}
                </div>
              )}
            </div>

            {/* Name */}
            <div className="min-w-0 flex-1">
              <p className="truncate font-medium text-gray-900 dark:text-white">
                {member.memberName}
              </p>
            </div>

            {/* Stat Value */}
            <div className="shrink-0 text-right">
              <span className="font-semibold text-nogi-600 dark:text-nogi-400">
                {getStatValue(member)}
              </span>
            </div>
          </Link>
        ))}
      </div>

      {/* Expand Button */}
      {hasMore && (
        <div className="border-t border-gray-100 px-4 py-2 dark:border-gray-700">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-full text-center text-sm text-nogi-600 hover:text-nogi-700 dark:text-nogi-400 dark:hover:text-nogi-300"
          >
            {isExpanded
              ? '閉じる'
              : `すべて表示 (${members.length}人)`}
          </button>
        </div>
      )}
    </div>
  )
}
