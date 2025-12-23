import { Routes, Route } from 'react-router-dom'
import { Layout } from './components/layout/Layout'
import { HomePage } from './pages/HomePage'
import { MemberPage } from './pages/MemberPage'
import { BlogPostPage } from './pages/BlogPostPage'
import { FavoritesPage } from './pages/FavoritesPage'
import { BookmarksPage } from './pages/BookmarksPage'
import { SettingsPage } from './pages/SettingsPage'
import { StatsPage } from './pages/StatsPage'

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/member/:memberId" element={<MemberPage />} />
        <Route path="/blog/:blogId" element={<BlogPostPage />} />
        <Route path="/favorites" element={<FavoritesPage />} />
        <Route path="/bookmarks" element={<BookmarksPage />} />
        <Route path="/stats" element={<StatsPage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Routes>
    </Layout>
  )
}

export default App
