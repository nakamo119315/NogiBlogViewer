import { Link, useLocation, useNavigate } from 'react-router-dom'

export function Header() {
  const location = useLocation()
  const navigate = useNavigate()

  // Show back button on detail pages (not on main tabs)
  const isDetailPage = location.pathname.startsWith('/blog/') ||
                       location.pathname.startsWith('/member/')

  const handleBack = () => {
    // Check if there's history to go back to
    if (window.history.length > 1) {
      navigate(-1)
    } else {
      navigate('/')
    }
  }

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/80 backdrop-blur-md dark:border-gray-700 dark:bg-gray-900/80">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-14 items-center justify-between sm:h-16">
          <div className="flex items-center gap-2">
            {/* Back Button */}
            {isDetailPage && (
              <button
                onClick={handleBack}
                className="flex h-9 w-9 items-center justify-center rounded-full text-gray-600 transition-colors hover:bg-gray-100 active:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-800 dark:active:bg-gray-700"
                aria-label="戻る"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
            )}

            {/* Logo */}
            <Link to="/" className="flex items-center gap-1.5 sm:gap-2">
              <span className="text-xl sm:text-2xl">🎀</span>
              <span className="text-base font-bold text-gray-900 sm:text-xl dark:text-white">
                NogiBlog
                <span className="hidden sm:inline">Viewer</span>
              </span>
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}
