/**
 * Date formatting utilities
 */

/**
 * Parse API date string to Date object
 * @param dateString - Date string in "YYYY/MM/DD HH:MM:SS" format
 * @returns Date object
 */
export function parseApiDate(dateString: string): Date {
  // Convert "YYYY/MM/DD HH:MM:SS" to ISO format
  const isoString = dateString.replace(/\//g, '-').replace(' ', 'T') + '+09:00' // JST
  return new Date(isoString)
}

/**
 * Format date for display (Japanese style)
 * @param date - Date object or ISO string
 * @returns Formatted date string
 */
export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

/**
 * Format date and time for display
 * @param date - Date object or ISO string
 * @returns Formatted datetime string
 */
export function formatDateTime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleString('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

/**
 * Format relative time (e.g., "3時間前", "2日前")
 * @param date - Date object or ISO string
 * @returns Relative time string
 */
export function formatRelativeTime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  const now = new Date()
  const diffMs = now.getTime() - d.getTime()
  const diffSec = Math.floor(diffMs / 1000)
  const diffMin = Math.floor(diffSec / 60)
  const diffHour = Math.floor(diffMin / 60)
  const diffDay = Math.floor(diffHour / 24)

  if (diffSec < 60) {
    return 'たった今'
  } else if (diffMin < 60) {
    return `${diffMin}分前`
  } else if (diffHour < 24) {
    return `${diffHour}時間前`
  } else if (diffDay < 7) {
    return `${diffDay}日前`
  } else {
    return formatDate(d)
  }
}

/**
 * Format short date (MM/DD)
 * @param date - Date object or ISO string
 * @returns Short date string
 */
export function formatShortDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${month}/${day}`
}
