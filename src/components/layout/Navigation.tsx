import { NavLink } from 'react-router-dom'

interface NavItem {
  to: string
  label: string
  icon: string
}

const navItems: NavItem[] = [
  { to: '/', label: 'ホーム', icon: '🏠' },
  { to: '/stats', label: '統計', icon: '📊' },
  { to: '/favorites', label: 'お気に入り', icon: '⭐' },
  { to: '/settings', label: '設定', icon: '⚙️' },
]

export function Navigation() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900 md:static md:border-t-0 md:bg-transparent">
      <div className="mx-auto max-w-7xl px-4">
        <ul className="flex items-center justify-around py-2 md:justify-start md:gap-6">
          {navItems.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                className={({ isActive }) =>
                  `flex flex-col items-center gap-1 rounded-lg px-3 py-2 text-sm transition-colors md:flex-row md:gap-2 ${
                    isActive
                      ? 'text-primary-600 dark:text-primary-400'
                      : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200'
                  }`
                }
              >
                <span className="text-xl md:text-base">{item.icon}</span>
                <span>{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  )
}
