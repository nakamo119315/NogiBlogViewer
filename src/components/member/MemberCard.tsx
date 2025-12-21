/**
 * MemberCard component - displays a single member card
 */

import { Link } from 'react-router-dom'
import type { Member } from '../../types/api'

interface MemberCardProps {
  member: Member
  isFavorite?: boolean
  onFavoriteToggle?: (memberId: string) => void
}

export function MemberCard({
  member,
  isFavorite = false,
  onFavoriteToggle,
}: MemberCardProps) {
  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    onFavoriteToggle?.(member.code)
  }

  return (
    <Link
      to={`/member/${member.code}`}
      className="group relative block overflow-hidden rounded-lg bg-white shadow-md transition-all hover:shadow-lg dark:bg-gray-800"
    >
      {/* Profile Image */}
      <div className="aspect-[3/4] overflow-hidden bg-gray-100 dark:bg-gray-700">
        {member.profileImage ? (
          <img
            src={member.profileImage}
            alt={member.name}
            className="h-full w-full object-cover transition-transform group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-gray-400">
            <svg
              className="h-16 w-16"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
          </div>
        )}
      </div>

      {/* Member Info */}
      <div className="p-3">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
          {member.name}
        </h3>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          {member.generation}
        </p>
      </div>

      {/* Favorite Button */}
      {onFavoriteToggle && (
        <button
          onClick={handleFavoriteClick}
          className={`absolute right-2 top-2 rounded-full p-1.5 transition-colors ${
            isFavorite
              ? 'bg-pink-500 text-white'
              : 'bg-white/80 text-gray-400 hover:text-pink-500 dark:bg-gray-800/80'
          }`}
          aria-label={isFavorite ? 'お気に入りから削除' : 'お気に入りに追加'}
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
        </button>
      )}

      {/* Graduated Badge */}
      {member.isGraduated && (
        <div className="absolute left-2 top-2 rounded bg-gray-600 px-2 py-0.5 text-xs text-white">
          卒業
        </div>
      )}
    </Link>
  )
}
