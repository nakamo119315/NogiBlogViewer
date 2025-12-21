/**
 * SettingsPage - user settings and preferences
 */

import { useState } from 'react'
import { useAppContext } from '../store/AppContext'
import { useCommentHistory } from '../hooks/useCommentHistory'
import { Button } from '../components/common/Button'

export function SettingsPage() {
  const { preferences, updatePreferences, resetPreferences } = useAppContext()
  const { comments, clearAll: clearCommentHistory } = useCommentHistory()
  const [username, setUsername] = useState(preferences.username)
  const [showClearConfirm, setShowClearConfirm] = useState(false)

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value)
  }

  const handleUsernameSave = () => {
    updatePreferences({ username })
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
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          コメント履歴
        </h2>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          これまでにコメントした投稿の記録
        </p>
        <div className="mt-4 flex items-center justify-between">
          <div className="text-sm text-gray-600 dark:text-gray-300">
            <span className="text-2xl font-bold text-nogi-600 dark:text-nogi-400">
              {comments.length}
            </span>{' '}
            件のコメント済み投稿
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
                  履歴をクリア
                </Button>
              )}
            </div>
          )}
        </div>
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
