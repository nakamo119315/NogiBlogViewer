import { Link } from 'react-router-dom'

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/80 backdrop-blur-md dark:border-gray-700 dark:bg-gray-900/80">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-14 items-center justify-between sm:h-16">
          <Link to="/" className="flex items-center gap-1.5 sm:gap-2">
            <span className="text-xl sm:text-2xl">🎀</span>
            <span className="text-base font-bold text-gray-900 sm:text-xl dark:text-white">
              NogiBlog
              <span className="hidden sm:inline">Viewer</span>
            </span>
          </Link>
        </div>
      </div>
    </header>
  )
}
