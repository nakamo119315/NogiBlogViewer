/**
 * MemberPage - 特定メンバーのブログ一覧を表示するページ
 */

import { useParams, Link } from 'react-router-dom'
import { BlogList } from '../components/blog/BlogList'
import { useBlogData } from '../hooks/useBlogData'
import { useMember } from '../hooks/useMemberData'
import { Loading } from '../components/common/Loading'
import { useAppContext } from '../store/AppContext'

export function MemberPage() {
  const { memberId } = useParams<{ memberId: string }>()
  const { member, isLoading: isMemberLoading } = useMember(memberId)
  const {
    blogs,
    isLoading: isBlogsLoading,
    hasMore,
    loadMore,
  } = useBlogData({ memberCode: memberId })
  const { preferences, toggleFavorite } = useAppContext()

  const isFavorite = member
    ? preferences.favoriteMembers.includes(member.code)
    : false

  if (isMemberLoading) {
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
                  {member.bloodType}型
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

      {/* Blog List */}
      <div>
        <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
          ブログ投稿
        </h2>
        <BlogList
          blogs={blogs}
          isLoading={isBlogsLoading}
          hasMore={hasMore}
          showMemberInfo={false}
          onLoadMore={loadMore}
        />
      </div>
    </div>
  )
}
