/**
 * HomePage - メンバー一覧を表示するホームページ
 */

import { useEffect } from 'react'
import { MemberList } from '../components/member/MemberList'
import { useDataCache } from '../store/DataContext'
import { useAppContext } from '../store/AppContext'

export function HomePage() {
  const { members, generations, isLoading, hasFetched, fetchData } = useDataCache()
  const { preferences, toggleFavorite, toggleShowOnlyFavorites } = useAppContext()

  // Fetch data on first mount (only if not already fetched)
  useEffect(() => {
    if (!hasFetched) {
      fetchData()
    }
  }, [hasFetched, fetchData])

  // Filter out graduated members for display
  const activeMembers = members.filter((m) => !m.isGraduated)

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
        members={activeMembers}
        isLoading={isLoading && !hasFetched}
        generations={generations}
        favoriteIds={preferences.favoriteMembers}
        showFavoritesOnly={preferences.showOnlyFavorites}
        onFavoriteToggle={toggleFavorite}
        onFavoritesFilterToggle={toggleShowOnlyFavorites}
      />
    </div>
  )
}
