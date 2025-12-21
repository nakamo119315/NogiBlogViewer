/**
 * Blog service for fetching blog post data
 */

import type { ApiBlogResponse, BlogPost } from '../types/api'
import { fetchJSONP, buildApiUrl } from './api'
import { mapApiBlogEntries } from './mappers'
import { API_ENDPOINTS } from '../types/api'
import staticBlogsData from '../data/blogs.json'
import { parseApiDate } from '../utils/date'
import { extractImagesFromHtml, normalizeImageUrl } from '../utils/image'

interface FetchBlogsOptions {
  /** Number of posts to fetch (default: 50) */
  count?: number
  /** Member code to filter by */
  memberCode?: string
  /** Page number for pagination (0-indexed) */
  page?: number
}

/**
 * Fetch blog posts from the official API
 */
export async function fetchBlogs(
  options: FetchBlogsOptions = {}
): Promise<BlogPost[]> {
  const { count = 50, memberCode, page = 0 } = options

  try {
    const params: Record<string, string | number | undefined> = {
      rw: count,
      st: page * count,
    }

    if (memberCode) {
      params.ct = memberCode
    }

    const url = buildApiUrl(API_ENDPOINTS.BLOG_LIST, params)
    const response = await fetchJSONP<ApiBlogResponse>(url)
    return mapApiBlogEntries(response.data)
  } catch (error) {
    console.error('Failed to fetch blogs from API:', error)
    // Fallback to static data
    return getStaticBlogs()
  }
}

/**
 * Fetch blog posts by member code
 */
export async function fetchBlogsByMember(
  memberCode: string,
  count = 20
): Promise<BlogPost[]> {
  return fetchBlogs({ memberCode, count })
}

/**
 * Fetch latest blog posts across all members
 */
export async function fetchLatestBlogs(count = 20): Promise<BlogPost[]> {
  return fetchBlogs({ count })
}

/**
 * Fetch a specific blog post by ID
 * Note: The API doesn't support fetching by ID directly,
 * so we fetch recent posts and find the matching one
 */
export async function fetchBlogById(id: string): Promise<BlogPost | undefined> {
  // First check static data
  const staticBlog = getStaticBlogs().find((b) => b.id === id)
  if (staticBlog) {
    return staticBlog
  }

  // Try to find in recent posts
  const blogs = await fetchBlogs({ count: 100 })
  return blogs.find((blog) => blog.id === id)
}

/**
 * Get static blog data (fallback)
 */
export function getStaticBlogs(): BlogPost[] {
  return staticBlogsData.data.map((b) => ({
    id: b.id,
    title: b.title,
    content: b.content,
    thumbnail: normalizeImageUrl(b.thumbnail),
    publishedAt: parseApiDate(b.publishedAt),
    link: b.link,
    memberId: b.memberId,
    memberName: b.memberName,
    memberImage: normalizeImageUrl(b.memberImage),
    images: extractImagesFromHtml(b.content),
  }))
}

/**
 * Search blog posts by title or content
 */
export async function searchBlogs(query: string): Promise<BlogPost[]> {
  const blogs = await fetchBlogs({ count: 100 })
  const lowerQuery = query.toLowerCase()
  return blogs.filter(
    (blog) =>
      blog.title.toLowerCase().includes(lowerQuery) ||
      blog.content.toLowerCase().includes(lowerQuery)
  )
}
