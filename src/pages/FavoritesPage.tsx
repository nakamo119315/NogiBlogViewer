/**
 * FavoritesPage - displays favorited members and their blogs
 */

import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { MemberCard } from '../components/member/MemberCard'
import { BlogList } from '../components/blog/BlogList'
import { useMemberData } from '../hooks/useMemberData'
import { useFavorites } from '../hooks/useFavorites'
import { useCommentHistory } from '../hooks/useCommentHistory'
import { Loading } from '../components/common/Loading'
import { fetchBlogs } from '../services/blogService'
import type { BlogPost } from '../types/api'

type TabType = 'members' | 'blogs'

export function FavoritesPage() {
  const [activeTab, setActiveTab] = useState<TabType>('blogs')
  const [blogs, setBlogs] = useState<BlogPost[]>([])
  const [isLoadingBlogs, setIsLoadingBlogs] = useState(false)

  const { members, isLoading: isMembersLoading } = useMemberData()
  const { favoriteIds, toggleFavorite } = useFavorites()
  const { commentedPostIds } = useCommentHistory()

  // Filter to only show favorites
  const favoriteMembers = members.filter((m) => favoriteIds.includes(m.code))

  // Load blogs from favorite members
  useEffect(() => {
    if (favoriteIds.length === 0) {
      setBlogs([])
      return
    }

    const loadBlogs = async () => {
      setIsLoadingBlogs(true)
      try {
        // Fetch latest blogs and filter by favorite members
        const allBlogs = await fetchBlogs({ count: 100 })
        const filteredBlogs = allBlogs.filter((blog) =>
          favoriteIds.includes(blog.memberId)
        )
        setBlogs(filteredBlogs)
      } catch (error) {
        console.error('Failed to load blogs:', error)
      } finally {
        setIsLoadingBlogs(false)
      }
    }

    loadBlogs()
  }, [favoriteIds])

  if (isMembersLoading) {
    return <Loading text="読み込み中..." />
  }

  const hasNoFavorites = favoriteIds.length === 0

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          お気に入り
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          {favoriteMembers.length}人のメンバーをお気に入り登録中
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 rounded-lg bg-gray-100 p-1 dark:bg-gray-800">
        <button
          onClick={() => setActiveTab('blogs')}
          className={`flex-1 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === 'blogs'
              ? 'bg-white text-gray-900 shadow dark:bg-gray-700 dark:text-white'
              : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'
          }`}
        >
          ブログ一覧
        </button>
        <button
          onClick={() => setActiveTab('members')}
          className={`flex-1 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === 'members'
              ? 'bg-white text-gray-900 shadow dark:bg-gray-700 dark:text-white'
              : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'
          }`}
        >
          メンバー
        </button>
      </div>

      {/* Content */}
      {hasNoFavorites ? (
        <div className="py-12 text-center">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
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
          <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">
            お気に入りがありません
          </h3>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            メンバー一覧からお気に入りを追加してください
          </p>
          <Link
            to="/"
            className="mt-4 inline-flex items-center gap-1 text-sm text-nogi-600 hover:underline dark:text-nogi-400"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            メンバー一覧へ
          </Link>
        </div>
      ) : activeTab === 'blogs' ? (
        <div>
          <BlogList
            blogs={blogs}
            isLoading={isLoadingBlogs}
            commentedPostIds={commentedPostIds}
            showMemberInfo={true}
          />
          {!isLoadingBlogs && blogs.length === 0 && (
            <div className="py-12 text-center">
              <p className="text-gray-500 dark:text-gray-400">
                お気に入りメンバーのブログがありません
              </p>
            </div>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {favoriteMembers.map((member) => (
            <MemberCard
              key={member.code}
              member={member}
              isFavorite={true}
              onFavoriteToggle={toggleFavorite}
            />
          ))}
        </div>
      )}
    </div>
  )
}
