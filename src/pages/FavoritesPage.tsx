/**
 * FavoritesPage - displays only favorited members
 */

import { Link } from 'react-router-dom'
import { MemberCard } from '../components/member/MemberCard'
import { useMemberData } from '../hooks/useMemberData'
import { useFavorites } from '../hooks/useFavorites'
import { Loading } from '../components/common/Loading'

export function FavoritesPage() {
  const { members, isLoading } = useMemberData()
  const { favoriteIds, toggleFavorite } = useFavorites()

  // Filter to only show favorites
  const favoriteMembers = members.filter((m) => favoriteIds.includes(m.code))

  if (isLoading) {
    return <Loading text="メンバーを読み込み中..." />
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          お気に入りメンバー
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          {favoriteMembers.length}人のメンバーをお気に入り登録中
        </p>
      </div>

      {/* Favorites Grid */}
      {favoriteMembers.length > 0 ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {favoriteMembers.map((member) => (
            <MemberCard
              key={member.code}
              member={member}
              isFavorite={true}
              onFavoriteToggle={toggleFavorite}
            />
          ))}
        </div>
      ) : (
        <div className="py-12 text-center">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
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
          <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">
            お気に入りがありません
          </h3>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            メンバー一覧からお気に入りを追加してください
          </p>
          <Link
            to="/"
            className="mt-4 inline-flex items-center gap-1 text-sm text-nogi-600 hover:underline dark:text-nogi-400"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            メンバー一覧へ
          </Link>
        </div>
      )}
    </div>
  )
}
