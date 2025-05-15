import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type ThemeName = 'default' | 'purple' | 'monochrome' | 'brown' | 'green'

interface UserThemeStoreState {
  theme: ThemeName
  setTheme: (theme: ThemeName) => void
}

export const UserThemeStore = create<UserThemeStoreState>()(
  persist(
    set => ({
      theme: 'default',
      setTheme: theme => set({ theme }),
    }),
    {
      name: 'user-theme',
    }
  )
)
