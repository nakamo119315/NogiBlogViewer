/**
 * Hook for managing favorite members
 */

import { useCallback, useMemo } from 'react'
import { useAppContext } from '../store/AppContext'
import type { Member } from '../types/api'

interface UseFavoritesResult {
  /** List of favorite member IDs */
  favoriteIds: string[]
  /** Whether a member is a favorite */
  isFavorite: (memberId: string) => boolean
  /** Add member to favorites */
  addFavorite: (memberId: string) => void
  /** Remove member from favorites */
  removeFavorite: (memberId: string) => void
  /** Toggle favorite status */
  toggleFavorite: (memberId: string) => void
  /** Filter members to only favorites */
  filterFavorites: (members: Member[]) => Member[]
  /** Whether to show only favorites */
  showOnlyFavorites: boolean
  /** Toggle show only favorites filter */
  toggleShowOnlyFavorites: () => void
}

export function useFavorites(): UseFavoritesResult {
  const { preferences, updatePreferences, toggleFavorite, toggleShowOnlyFavorites } =
    useAppContext()

  const favoriteIds = preferences.favoriteMembers

  const isFavorite = useCallback(
    (memberId: string) => favoriteIds.includes(memberId),
    [favoriteIds]
  )

  const addFavorite = useCallback(
    (memberId: string) => {
      if (!favoriteIds.includes(memberId)) {
        updatePreferences({
          favoriteMembers: [...favoriteIds, memberId],
        })
      }
    },
    [favoriteIds, updatePreferences]
  )

  const removeFavorite = useCallback(
    (memberId: string) => {
      updatePreferences({
        favoriteMembers: favoriteIds.filter((id) => id !== memberId),
      })
    },
    [favoriteIds, updatePreferences]
  )

  const filterFavorites = useCallback(
    (members: Member[]) => {
      if (!preferences.showOnlyFavorites) {
        return members
      }
      return members.filter((m) => favoriteIds.includes(m.code))
    },
    [preferences.showOnlyFavorites, favoriteIds]
  )

  return useMemo(
    () => ({
      favoriteIds,
      isFavorite,
      addFavorite,
      removeFavorite,
      toggleFavorite,
      filterFavorites,
      showOnlyFavorites: preferences.showOnlyFavorites,
      toggleShowOnlyFavorites,
    }),
    [
      favoriteIds,
      isFavorite,
      addFavorite,
      removeFavorite,
      toggleFavorite,
      filterFavorites,
      preferences.showOnlyFavorites,
      toggleShowOnlyFavorites,
    ]
  )
}
