import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import {
  parseApiDate,
  formatDate,
  formatDateTime,
  formatRelativeTime,
  formatShortDate,
} from './date'

describe('date utils', () => {
  describe('parseApiDate', () => {
    it('should parse API date format correctly', () => {
      const result = parseApiDate('2024/01/15 12:30:00')
      expect(result).toBeInstanceOf(Date)
      expect(result.getFullYear()).toBe(2024)
      expect(result.getMonth()).toBe(0) // January
      expect(result.getDate()).toBe(15)
    })
  })

  describe('formatDate', () => {
    it('should format Date object in Japanese style', () => {
      const date = new Date('2024-01-15T12:00:00')
      const result = formatDate(date)
      expect(result).toContain('2024')
      expect(result).toContain('1')
      expect(result).toContain('15')
    })

    it('should accept ISO string input', () => {
      const result = formatDate('2024-01-15T12:00:00')
      expect(result).toContain('2024')
    })
  })

  describe('formatDateTime', () => {
    it('should format date with time', () => {
      const date = new Date('2024-01-15T14:30:00')
      const result = formatDateTime(date)
      expect(result).toContain('2024')
      expect(result).toContain('14')
      expect(result).toContain('30')
    })
  })

  describe('formatRelativeTime', () => {
    beforeEach(() => {
      vi.useFakeTimers()
      vi.setSystemTime(new Date('2024-01-15T12:00:00'))
    })

    afterEach(() => {
      vi.useRealTimers()
    })

    it('should return "たった今" for recent times', () => {
      const date = new Date('2024-01-15T11:59:30')
      expect(formatRelativeTime(date)).toBe('たった今')
    })

    it('should return minutes ago', () => {
      const date = new Date('2024-01-15T11:45:00')
      expect(formatRelativeTime(date)).toBe('15分前')
    })

    it('should return hours ago', () => {
      const date = new Date('2024-01-15T09:00:00')
      expect(formatRelativeTime(date)).toBe('3時間前')
    })

    it('should return days ago', () => {
      const date = new Date('2024-01-13T12:00:00')
      expect(formatRelativeTime(date)).toBe('2日前')
    })

    it('should return formatted date for older dates', () => {
      const date = new Date('2024-01-01T12:00:00')
      const result = formatRelativeTime(date)
      expect(result).toContain('2024')
    })
  })

  describe('formatShortDate', () => {
    it('should format as MM/DD', () => {
      const date = new Date('2024-01-05T12:00:00')
      expect(formatShortDate(date)).toBe('01/05')
    })

    it('should pad single digits', () => {
      const date = new Date('2024-03-09T12:00:00')
      expect(formatShortDate(date)).toBe('03/09')
    })
  })
})
