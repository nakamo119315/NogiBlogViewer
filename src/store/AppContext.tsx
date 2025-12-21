import { createContext, useContext, ReactNode, useCallback } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { UserPreferences, DEFAULT_PREFERENCES, STORAGE_KEYS } from '../types/api'

interface AppContextType {
  preferences: UserPreferences
  updatePreferences: (updates: Partial<UserPreferences>) => void
  resetPreferences: () => void
  toggleFavorite: (memberId: string) => void
  toggleShowOnlyFavorites: () => void
}

const AppContext = createContext<AppContextType | undefined>(undefined)

interface AppProviderProps {
  children: ReactNode
}

export function AppProvider({ children }: AppProviderProps) {
  const [preferences, setPreferences] = useLocalStorage<UserPreferences>(
    STORAGE_KEYS.PREFERENCES,
    DEFAULT_PREFERENCES
  )

  const updatePreferences = useCallback((updates: Partial<UserPreferences>) => {
    setPreferences((prev) => ({ ...prev, ...updates }))
  }, [setPreferences])

  const resetPreferences = useCallback(() => {
    setPreferences(DEFAULT_PREFERENCES)
  }, [setPreferences])

  const toggleFavorite = useCallback((memberId: string) => {
    setPreferences((prev) => {
      const isFavorite = prev.favoriteMembers.includes(memberId)
      return {
        ...prev,
        favoriteMembers: isFavorite
          ? prev.favoriteMembers.filter((id) => id !== memberId)
          : [...prev.favoriteMembers, memberId],
      }
    })
  }, [setPreferences])

  const toggleShowOnlyFavorites = useCallback(() => {
    setPreferences((prev) => ({
      ...prev,
      showOnlyFavorites: !prev.showOnlyFavorites,
    }))
  }, [setPreferences])

  return (
    <AppContext.Provider
      value={{
        preferences,
        updatePreferences,
        resetPreferences,
        toggleFavorite,
        toggleShowOnlyFavorites,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const context = useContext(AppContext)
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider')
  }
  return context
}

// Alias for backward compatibility
export const useAppContext = useApp
