import { describe, it, expect } from 'vitest'
import { buildCommentUrl } from './commentService'

describe('commentService', () => {
  describe('buildCommentUrl', () => {
    it('should return absolute URLs unchanged', () => {
      const url = 'https://www.nogizaka46.com/s/n46/diary/123'
      expect(buildCommentUrl(url)).toBe(url)
    })

    it('should add base URL to relative paths', () => {
      const result = buildCommentUrl('/s/n46/diary/123')
      expect(result).toBe('https://www.nogizaka46.com/s/n46/diary/123')
    })
  })
})
