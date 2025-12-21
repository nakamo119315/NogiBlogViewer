/**
 * HomePage - メンバー一覧を表示するホームページ
 */

import { MemberList } from '../components/member/MemberList'
import { useMemberData } from '../hooks/useMemberData'
import { useAppContext } from '../store/AppContext'

export function HomePage() {
  const { members, isLoading, generations } = useMemberData()
  const { preferences, toggleFavorite, toggleShowOnlyFavorites } = useAppContext()

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          メンバー一覧
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          メンバーを選んでブログを読む
        </p>
      </div>

      {/* Member List */}
      <MemberList
        members={members}
        isLoading={isLoading}
        generations={generations}
        favoriteIds={preferences.favoriteMembers}
        showFavoritesOnly={preferences.showOnlyFavorites}
        onFavoriteToggle={toggleFavorite}
        onFavoritesFilterToggle={toggleShowOnlyFavorites}
      />
    </div>
  )
}
