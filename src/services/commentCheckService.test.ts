import { describe, it, expect, vi, beforeEach } from 'vitest'
import { getCachedCommentResults, clearCommentCache } from './commentCheckService'

describe('commentCheckService', () => {
  beforeEach(() => {
    clearCommentCache()
    vi.clearAllMocks()
  })

  describe('getCachedCommentResults', () => {
    it('should return empty result when no cache exists', () => {
      const result = getCachedCommentResults('testuser')
      expect(result.postIds).toEqual([])
      expect(result.comments).toEqual([])
    })

    it('should return empty result for different username', () => {
      // Set cache for one user
      localStorage.setItem('nogiblog_comment_cache', JSON.stringify({
        username: 'user1',
        postIds: ['p1'],
        commentedPostIds: ['p1'],
        userComments: [{ postId: 'p1', commentId: 'c1', body: 'test', date: '2024/01/15' }],
        lastFetched: Date.now(),
      }))

      // Query for different user
      const result = getCachedCommentResults('user2')
      expect(result.postIds).toEqual([])
      expect(result.comments).toEqual([])
    })
  })

  describe('clearCommentCache', () => {
    it('should remove cache from localStorage', () => {
      localStorage.setItem('nogiblog_comment_cache', JSON.stringify({ test: 'data' }))
      clearCommentCache()
      expect(localStorage.removeItem).toHaveBeenCalledWith('nogiblog_comment_cache')
    })
  })
})
