/**
 * Blog post type definitions
 */

export interface BlogPost {
  id: string
  title: string
  content: string
  thumbnail: string
  publishedAt: Date
  link: string
  memberId: string
  memberName: string
  memberImage: string
  images: string[]
}

export interface BlogPostWithStatus extends BlogPost {
  hasCommented: boolean
}
