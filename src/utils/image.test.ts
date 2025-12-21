import { describe, it, expect } from 'vitest'
import {
  extractImagesFromHtml,
  normalizeImageUrl,
  getImageFilename,
  getImageExtension,
  isImageUrl,
  normalizeHtmlImageUrls,
  getPlaceholderImage,
} from './image'

describe('image utils', () => {
  describe('normalizeImageUrl', () => {
    it('should return absolute URLs unchanged', () => {
      expect(normalizeImageUrl('https://example.com/image.jpg')).toBe('https://example.com/image.jpg')
      expect(normalizeImageUrl('http://example.com/image.jpg')).toBe('http://example.com/image.jpg')
    })

    it('should add https to protocol-relative URLs', () => {
      expect(normalizeImageUrl('//example.com/image.jpg')).toBe('https://example.com/image.jpg')
    })

    it('should add base URL to root-relative URLs', () => {
      const result = normalizeImageUrl('/images/photo.jpg')
      expect(result).toContain('nogizaka46.com')
      expect(result).toContain('/images/photo.jpg')
    })

    it('should add base URL to relative URLs', () => {
      const result = normalizeImageUrl('images/photo.jpg')
      expect(result).toContain('nogizaka46.com')
      expect(result).toContain('/images/photo.jpg')
    })
  })

  describe('extractImagesFromHtml', () => {
    it('should extract image URLs from HTML', () => {
      const html = '<p><img src="https://example.com/1.jpg"></p><img src="https://example.com/2.png">'
      const result = extractImagesFromHtml(html)
      expect(result).toHaveLength(2)
      expect(result[0]).toBe('https://example.com/1.jpg')
      expect(result[1]).toBe('https://example.com/2.png')
    })

    it('should handle single and double quotes', () => {
      const html = `<img src='https://example.com/1.jpg'><img src="https://example.com/2.jpg">`
      const result = extractImagesFromHtml(html)
      expect(result).toHaveLength(2)
    })

    it('should return empty array for no images', () => {
      const html = '<p>No images here</p>'
      expect(extractImagesFromHtml(html)).toHaveLength(0)
    })
  })

  describe('getImageFilename', () => {
    it('should extract filename from URL', () => {
      expect(getImageFilename('https://example.com/path/to/image.jpg')).toBe('image.jpg')
    })

    it('should return "image" for empty path', () => {
      expect(getImageFilename('https://example.com/')).toBe('image')
    })
  })

  describe('getImageExtension', () => {
    it('should extract extension from URL', () => {
      expect(getImageExtension('https://example.com/image.jpg')).toBe('jpg')
      expect(getImageExtension('https://example.com/image.PNG')).toBe('png')
    })

    it('should handle URLs with query params', () => {
      expect(getImageExtension('https://example.com/image.jpg?v=123')).toBe('jpg')
    })

    it('should default to jpg for unknown extensions', () => {
      expect(getImageExtension('https://example.com/image')).toBe('jpg')
    })
  })

  describe('isImageUrl', () => {
    it('should return true for valid image extensions', () => {
      expect(isImageUrl('https://example.com/image.jpg')).toBe(true)
      expect(isImageUrl('https://example.com/image.png')).toBe(true)
      expect(isImageUrl('https://example.com/image.gif')).toBe(true)
      expect(isImageUrl('https://example.com/image.webp')).toBe(true)
    })

    it('should return false for non-image URLs', () => {
      expect(isImageUrl('https://example.com/document.pdf')).toBe(false)
      expect(isImageUrl('https://example.com/script.js')).toBe(false)
    })
  })

  describe('normalizeHtmlImageUrls', () => {
    it('should normalize relative URLs in HTML', () => {
      const html = '<img src="/images/photo.jpg">'
      const result = normalizeHtmlImageUrls(html)
      expect(result).toContain('nogizaka46.com')
      expect(result).toContain('/images/photo.jpg')
    })

    it('should preserve absolute URLs', () => {
      const html = '<img src="https://cdn.example.com/photo.jpg">'
      const result = normalizeHtmlImageUrls(html)
      expect(result).toBe('<img src="https://cdn.example.com/photo.jpg">')
    })
  })

  describe('getPlaceholderImage', () => {
    it('should return placeholder URL with dimensions', () => {
      const result = getPlaceholderImage(400, 300)
      expect(result).toContain('400x300')
    })

    it('should use default dimensions', () => {
      const result = getPlaceholderImage()
      expect(result).toContain('300x300')
    })
  })
})
