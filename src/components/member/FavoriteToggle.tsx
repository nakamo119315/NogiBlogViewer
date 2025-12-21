/**
 * FavoriteToggle component - button to toggle favorite status
 */

interface FavoriteToggleProps {
  isFavorite: boolean
  onToggle: () => void
  size?: 'sm' | 'md' | 'lg'
  showLabel?: boolean
  className?: string
}

export function FavoriteToggle({
  isFavorite,
  onToggle,
  size = 'md',
  showLabel = false,
  className = '',
}: FavoriteToggleProps) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6',
  }

  const buttonSizeClasses = {
    sm: 'p-1',
    md: 'p-1.5',
    lg: 'p-2',
  }

  return (
    <button
      onClick={(e) => {
        e.preventDefault()
        e.stopPropagation()
        onToggle()
      }}
      className={`inline-flex items-center gap-1.5 rounded-full transition-colors ${
        isFavorite
          ? 'bg-pink-500 text-white hover:bg-pink-600'
          : 'bg-gray-100 text-gray-400 hover:bg-gray-200 hover:text-pink-500 dark:bg-gray-700 dark:hover:bg-gray-600'
      } ${showLabel ? 'px-3 py-1.5' : buttonSizeClasses[size]} ${className}`}
      aria-label={isFavorite ? 'お気に入りから削除' : 'お気に入りに追加'}
      title={isFavorite ? 'お気に入りから削除' : 'お気に入りに追加'}
    >
      <svg
        className={sizeClasses[size]}
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
      {showLabel && (
        <span className="text-sm font-medium">
          {isFavorite ? 'お気に入り' : 'お気に入りに追加'}
        </span>
      )}
    </button>
  )
}
