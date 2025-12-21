/**
 * MemberList component - displays a grid of member cards
 */

import { useState, useMemo } from 'react'
import type { Member } from '../../types/api'
import { MemberCard } from './MemberCard'
import { Loading } from '../common/Loading'

interface MemberListProps {
  members: Member[]
  isLoading?: boolean
  generations?: string[]
  favoriteIds?: string[]
  showFavoritesOnly?: boolean
  onFavoriteToggle?: (memberId: string) => void
  onFavoritesFilterToggle?: () => void
}

export function MemberList({
  members,
  isLoading = false,
  generations = [],
  favoriteIds = [],
  showFavoritesOnly = false,
  onFavoriteToggle,
  onFavoritesFilterToggle,
}: MemberListProps) {
  const [selectedGeneration, setSelectedGeneration] = useState<string>('')

  // Filter members by generation and favorites
  const filteredMembers = useMemo(() => {
    let filtered = members

    if (selectedGeneration) {
      filtered = filtered.filter((m) => m.generation === selectedGeneration)
    }

    if (showFavoritesOnly) {
      filtered = filtered.filter((m) => favoriteIds.includes(m.code))
    }

    return filtered
  }, [members, selectedGeneration, showFavoritesOnly, favoriteIds])

  if (isLoading && members.length === 0) {
    return <Loading text="メンバーを読み込み中..." />
  }

  return (
    <div className="space-y-4">
      {/* Filter Controls */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Generation Filter */}
        {generations.length > 0 && (
          <select
            value={selectedGeneration}
            onChange={(e) => setSelectedGeneration(e.target.value)}
            className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm focus:border-nogi-500 focus:outline-none focus:ring-1 focus:ring-nogi-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          >
            <option value="">全期生</option>
            {generations.map((gen) => (
              <option key={gen} value={gen}>
                {gen}
              </option>
            ))}
          </select>
        )}

        {/* Favorites Filter Toggle */}
        {onFavoritesFilterToggle && favoriteIds.length > 0 && (
          <button
            onClick={onFavoritesFilterToggle}
            className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm transition-colors ${
              showFavoritesOnly
                ? 'bg-pink-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            <svg
              className="h-4 w-4"
              fill={showFavoritesOnly ? 'currentColor' : 'none'}
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
            お気に入り ({favoriteIds.length})
          </button>
        )}

        {/* Member Count */}
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {filteredMembers.length}人のメンバー
        </span>
      </div>

      {/* Member Grid */}
      {filteredMembers.length > 0 ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {filteredMembers.map((member) => (
            <MemberCard
              key={member.code}
              member={member}
              isFavorite={favoriteIds.includes(member.code)}
              onFavoriteToggle={onFavoriteToggle}
            />
          ))}
        </div>
      ) : (
        <div className="py-12 text-center">
          <p className="text-gray-500 dark:text-gray-400">
            {showFavoritesOnly
              ? 'お気に入りのメンバーがいません'
              : '該当するメンバーがいません'}
          </p>
        </div>
      )}

      {/* Loading indicator for refresh */}
      {isLoading && members.length > 0 && (
        <div className="flex justify-center py-4">
          <Loading size="sm" />
        </div>
      )}
    </div>
  )
}
