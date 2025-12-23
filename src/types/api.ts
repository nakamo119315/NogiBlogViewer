/**
 * NogiBlogViewer API Type Definitions
 *
 * This file defines TypeScript types for:
 * 1. External API responses (Nogizaka46 official API)
 * 2. Internal application models
 * 3. LocalStorage schemas
 */

// ============================================================================
// External API Types (Nogizaka46 Official API)
// ============================================================================

/**
 * Blog API Response
 * Endpoint: https://www.nogizaka46.com/s/n46/api/list/blog
 */
export interface ApiBlogResponse {
  /** Total number of blog posts */
  count: string;
  /** Array of blog entries */
  data: ApiBlogEntry[];
}

/**
 * Single blog entry from the API
 */
export interface ApiBlogEntry {
  /** Unique post identifier */
  code: string;
  /** Post title */
  title: string;
  /** Post content (HTML formatted) */
  text: string;
  /** Thumbnail image URL */
  img: string;
  /** Publication date (format: "YYYY/MM/DD HH:MM:SS") */
  date: string;
  /** Relative URL to post detail page */
  link: string;
  /** Author member code */
  arti_code: string;
  /** Author name (Japanese) */
  name: string;
  /** Author profile image URL */
  artist_img: string;
}

/**
 * Member API Response
 * Endpoint: https://www.nogizaka46.com/s/n46/api/list/member
 */
export interface ApiMemberResponse {
  /** Total number of members */
  count: string;
  /** Array of member entries */
  data: ApiMemberEntry[];
}

/**
 * Single member entry from the API
 */
export interface ApiMemberEntry {
  /** Unique member identifier */
  code: string;
  /** Member name (Japanese) */
  name: string;
  /** Member name (English/Romanized) */
  english_name: string;
  /** Member name (Hiragana) */
  kana: string;
  /** Generation category (e.g., "6期生") */
  cate: string;
  /** Profile image URL */
  img: string;
  /** Relative URL to member profile page */
  link: string;
  /** Special designation (e.g., "選抜メンバー") */
  pick: string;
  /** Role/status indicator */
  god: string;
  /** Membership tier */
  under: string;
  /** Birthday (format: "YYYY/MM/DD") */
  birthday: string;
  /** Blood type */
  blood: string;
  /** Zodiac sign */
  constellation: string;
  /** Graduation status ("YES" or "NO") */
  graduation: string;
  /** Generation affiliation code */
  groupcode: string;
}

// ============================================================================
// Application Models
// ============================================================================

/**
 * Internal Member model
 */
export interface Member {
  /** Unique member identifier */
  code: string;
  /** Member name (Japanese) */
  name: string;
  /** Member name (English/Romanized) */
  englishName: string;
  /** Member name (Hiragana) */
  kana: string;
  /** Generation (e.g., "6期生") */
  generation: string;
  /** Profile image URL */
  profileImage: string;
  /** Profile page URL */
  profileLink: string;
  /** Birthday (format: "YYYY/MM/DD") */
  birthday: string;
  /** Blood type */
  bloodType: string;
  /** Whether member has graduated */
  isGraduated: boolean;
}

/**
 * Internal BlogPost model
 */
export interface BlogPost {
  /** Unique post identifier */
  id: string;
  /** Post title */
  title: string;
  /** Post content (HTML formatted) */
  content: string;
  /** Thumbnail image URL */
  thumbnail: string;
  /** Publication date */
  publishedAt: Date;
  /** Full URL to official post */
  link: string;
  /** Author member code */
  memberId: string;
  /** Author name */
  memberName: string;
  /** Author profile image URL */
  memberImage: string;
  /** All image URLs extracted from content */
  images: string[];
}

/**
 * User preferences stored in localStorage
 */
export interface UserPreferences {
  /** Username for comments */
  username: string;
  /** List of favorite member IDs */
  favoriteMembers: string[];
  /** UI theme */
  theme: 'light' | 'dark';
  /** Whether to show only favorite members */
  showOnlyFavorites: boolean;
}

/**
 * Record of a comment made by the user
 */
export interface CommentRecord {
  /** ID of the post commented on */
  postId: string;
  /** Title of the post (for display) */
  postTitle: string;
  /** Member name (for display) */
  memberName: string;
  /** When the comment was marked */
  commentedAt: Date;
  /** Optional note */
  note?: string;
}

/**
 * Cached data in localStorage
 */
export interface CachedData {
  /** Cached member list */
  members: Member[];
  /** Cached blog posts (latest N) */
  blogs: BlogPost[];
  /** Last cache update time */
  lastUpdated: Date;
}

/**
 * Member visit history for tracking new articles
 */
export interface MemberVisitHistory {
  /** Map of member ID to last visit timestamp (ISO string) */
  [memberId: string]: string;
}

// ============================================================================
// LocalStorage Schema
// ============================================================================

/**
 * Complete localStorage schema
 */
export interface LocalStorageSchema {
  nogiblog_preferences: UserPreferences;
  nogiblog_comments: CommentRecord[];
  nogiblog_cache: CachedData;
  nogiblog_member_visits: MemberVisitHistory;
}

/**
 * LocalStorage keys
 */
export const STORAGE_KEYS = {
  PREFERENCES: 'nogiblog_preferences',
  COMMENTS: 'nogiblog_comments',
  CACHE: 'nogiblog_cache',
  MEMBER_VISITS: 'nogiblog_member_visits',
  BOOKMARKS: 'nogiblog_bookmarks',
} as const;

/**
 * Bookmarked post for offline reading
 */
export interface BookmarkedPost {
  /** Blog post ID */
  id: string;
  /** Post title */
  title: string;
  /** Author member name */
  memberName: string;
  /** Author member code */
  memberCode: string;
  /** Publication date (ISO string) */
  publishedAt: string;
  /** When the post was bookmarked (ISO string) */
  bookmarkedAt: string;
  /** Thumbnail image URL */
  thumbnail: string;
}

// ============================================================================
// Default Values
// ============================================================================

/**
 * Default user preferences
 */
export const DEFAULT_PREFERENCES: UserPreferences = {
  username: '',
  favoriteMembers: [],
  theme: 'light',
  showOnlyFavorites: false,
};

// ============================================================================
// API Configuration
// ============================================================================

/**
 * API endpoints
 */
export const API_ENDPOINTS = {
  /** Blog list API */
  BLOG_LIST: 'https://www.nogizaka46.com/s/n46/api/list/blog',
  /** Member list API */
  MEMBER_LIST: 'https://www.nogizaka46.com/s/n46/api/list/member',
  /** Comment list API */
  COMMENT_LIST: 'https://www.nogizaka46.com/s/n46/api/list/comment',
  /** Base URL for official site */
  BASE_URL: 'https://www.nogizaka46.com',
} as const;

/**
 * Comment API Response
 * Endpoint: https://www.nogizaka46.com/s/n46/api/list/comment
 */
export interface ApiCommentResponse {
  /** Total number of comments */
  count: string;
  /** Array of comment entries */
  data: ApiCommentEntry[];
}

/**
 * Single comment entry from the API
 */
export interface ApiCommentEntry {
  /** Blog post ID this comment belongs to */
  kijicode: string;
  /** Unique comment ID */
  code: string;
  /** Comment content (HTML formatted) */
  body: string;
  /** Commenter's name */
  comment1: string;
  /** Comment date (format: "YYYY/MM/DD HH:MM:SS") */
  date: string;
}

/**
 * API request parameters
 */
export interface BlogApiParams {
  /** Number of entries to retrieve (default: 100) */
  rw?: number;
  /** Callback function name for JSONP */
  callback?: string;
}

// ============================================================================
// Mapper Functions (Type-only signatures)
// ============================================================================

/**
 * Map API blog entry to internal BlogPost model
 */
export type MapApiBlogEntry = (entry: ApiBlogEntry) => BlogPost;

/**
 * Map API member entry to internal Member model
 */
export type MapApiMemberEntry = (entry: ApiMemberEntry) => Member;

// ============================================================================
// Utility Types
// ============================================================================

/**
 * Blog post with hasCommented flag for UI
 */
export interface BlogPostWithStatus extends BlogPost {
  /** Whether user has commented on this post */
  hasCommented: boolean;
}

/**
 * Member with favorite status for UI
 */
export interface MemberWithStatus extends Member {
  /** Whether member is in user's favorites */
  isFavorite: boolean;
  /** Latest blog post (if available) */
  latestPost?: BlogPost;
}

/**
 * Paginated response wrapper
 */
export interface PaginatedResponse<T> {
  /** Data items */
  items: T[];
  /** Total count */
  total: number;
  /** Current page (0-indexed) */
  page: number;
  /** Items per page */
  pageSize: number;
  /** Whether there are more pages */
  hasMore: boolean;
}
