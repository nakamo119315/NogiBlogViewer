/**
 * SettingsPage - user settings and preferences
 */

import { useState } from 'react'
import { useAppContext } from '../store/AppContext'
import { useCommentHistory } from '../hooks/useCommentHistory'
import { Button } from '../components/common/Button'
import { clearCommentCache } from '../services/commentCheckService'

export function SettingsPage() {
  const { preferences, updatePreferences, resetPreferences } = useAppContext()
  const {
    comments,
    apiCommentedPostIds,
    apiUserComments,
    checkedPostCount,
    clearAll: clearCommentHistory,
    refresh: refreshComments,
    isLoadingApiComments,
  } = useCommentHistory()
  const [username, setUsername] = useState(preferences.username)
  const [showClearConfirm, setShowClearConfirm] = useState(false)
  const [showApiComments, setShowApiComments] = useState(false)

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value)
  }

  const handleUsernameSave = () => {
    updatePreferences({ username })
    clearCommentCache() // Clear cache when username changes
  }

  const handleClearHistory = () => {
    clearCommentHistory()
    setShowClearConfirm(false)
  }

  const handleResetPreferences = () => {
    resetPreferences()
    setUsername('')
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          設定
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          アプリの設定を変更できます
        </p>
      </div>

      {/* Username Setting */}
      <section className="rounded-lg bg-white p-6 shadow-md dark:bg-gray-800">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          ユーザー名
        </h2>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          コメント時に使用する名前を設定できます
        </p>
        <div className="mt-4 flex gap-3">
          <input
            type="text"
            value={username}
            onChange={handleUsernameChange}
            placeholder="ニックネームを入力"
            className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-nogi-500 focus:outline-none focus:ring-1 focus:ring-nogi-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          />
          <Button
            variant="primary"
            onClick={handleUsernameSave}
            disabled={username === preferences.username}
          >
            保存
          </Button>
        </div>
      </section>

      {/* Comment History Stats */}
      <section className="rounded-lg bg-white p-6 shadow-md dark:bg-gray-800">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              コメント履歴
            </h2>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              これまでにコメントした投稿の記録
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={refreshComments}
            disabled={isLoadingApiComments}
          >
            {isLoadingApiComments ? (
              <span className="flex items-center gap-2">
                <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                更新中
              </span>
            ) : (
              '更新'
            )}
          </Button>
        </div>

        {/* API-detected comments */}
        {preferences.username && preferences.favoriteMembers.length > 0 && (
          <div className="mt-4 rounded-lg bg-green-50 p-4 dark:bg-green-900/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <svg className="h-5 w-5 text-green-600 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="font-medium text-green-700 dark:text-green-300">
                  お気に入りメンバーの記事から検出
                </span>
              </div>
              {apiUserComments.length > 0 && (
                <button
                  onClick={() => setShowApiComments(!showApiComments)}
                  className="text-sm text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300"
                >
                  {showApiComments ? '閉じる' : 'コメント一覧を見る'}
                </button>
              )}
            </div>
            <p className="mt-2 text-sm text-green-600 dark:text-green-400">
              お気に入り{preferences.favoriteMembers.length}人の最新{checkedPostCount}記事をチェック
            </p>
            <p className="text-sm text-green-600 dark:text-green-400">
              「{preferences.username}」として
              <span className="mx-1 text-lg font-bold">{apiCommentedPostIds.length}</span>
              件の投稿に
              <span className="mx-1 text-lg font-bold">{apiUserComments.length}</span>
              件のコメント
            </p>
            {isLoadingApiComments && (
              <p className="mt-1 text-xs text-green-500 dark:text-green-500">
                コメントを確認中...
              </p>
            )}

            {/* API Comment List */}
            {showApiComments && apiUserComments.length > 0 && (
              <div className="mt-4 max-h-96 overflow-y-auto rounded-lg border border-green-200 bg-white dark:border-green-800 dark:bg-gray-800">
                {apiUserComments.map((comment, index) => (
                  <div
                    key={`${comment.commentId}-${index}`}
                    className="border-b border-green-100 p-3 last:border-b-0 dark:border-green-900"
                  >
                    <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                      <span>投稿ID: {comment.postId}</span>
                      <span>{comment.date}</span>
                    </div>
                    <div
                      className="mt-1 text-sm text-gray-700 dark:text-gray-300"
                      dangerouslySetInnerHTML={{ __html: comment.body }}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* No favorites message */}
        {preferences.username && preferences.favoriteMembers.length === 0 && (
          <div className="mt-4 rounded-lg bg-yellow-50 p-4 dark:bg-yellow-900/20">
            <p className="text-sm text-yellow-700 dark:text-yellow-300">
              お気に入りメンバーを登録すると、そのメンバーの最新記事へのコメントが自動検出されます
            </p>
          </div>
        )}

        {!preferences.username && (
          <div className="mt-4 rounded-lg bg-gray-50 p-4 dark:bg-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-300">
              上のユーザー名を設定すると、公式サイトでのコメントが自動検出されます
            </p>
          </div>
        )}

        {/* Manual comment count */}
        <div className="mt-4 flex items-center justify-between">
          <div className="text-sm text-gray-600 dark:text-gray-300">
            手動で記録:
            <span className="ml-1 text-lg font-bold text-nogi-600 dark:text-nogi-400">
              {comments.length}
            </span>
            件
          </div>
          {comments.length > 0 && (
            <div className="relative">
              {showClearConfirm ? (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500">本当に削除しますか？</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowClearConfirm(false)}
                  >
                    キャンセル
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={handleClearHistory}
                  >
                    削除
                  </Button>
                </div>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowClearConfirm(true)}
                >
                  手動履歴をクリア
                </Button>
              )}
            </div>
          )}
        </div>

        {/* Manual Comment History List */}
        {comments.length > 0 && (
          <div className="mt-4 max-h-48 overflow-y-auto rounded-lg border border-gray-200 dark:border-gray-700">
            {comments.map((comment) => (
              <div
                key={comment.postId}
                className="flex items-center justify-between border-b border-gray-100 p-3 last:border-b-0 dark:border-gray-700"
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-gray-900 dark:text-white">
                    {comment.postTitle}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {comment.memberName} • {new Date(comment.commentedAt).toLocaleDateString('ja-JP')}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Favorites Stats */}
      <section className="rounded-lg bg-white p-6 shadow-md dark:bg-gray-800">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          お気に入り
        </h2>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          お気に入り登録しているメンバー
        </p>
        <div className="mt-4 text-sm text-gray-600 dark:text-gray-300">
          <span className="text-2xl font-bold text-pink-500">
            {preferences.favoriteMembers.length}
          </span>{' '}
          人のメンバーをお気に入り登録中
        </div>
      </section>

      {/* Reset All */}
      <section className="rounded-lg bg-white p-6 shadow-md dark:bg-gray-800">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          データのリセット
        </h2>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          すべての設定を初期状態に戻します
        </p>
        <div className="mt-4">
          <Button variant="outline" onClick={handleResetPreferences}>
            設定をリセット
          </Button>
        </div>
      </section>

      {/* App Info */}
      <section className="rounded-lg bg-gray-50 p-6 dark:bg-gray-800/50">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          このアプリについて
        </h2>
        <div className="mt-4 space-y-2 text-sm text-gray-600 dark:text-gray-300">
          <p>NogiBlogViewer - 乃木坂46ブログビューワー</p>
          <p>
            このアプリは非公式のファンアプリです。乃木坂46公式とは一切関係ありません。
          </p>
          <p className="text-xs text-gray-400">
            データは乃木坂46公式サイトのAPIから取得しています。
          </p>
        </div>
      </section>
    </div>
  )
}
