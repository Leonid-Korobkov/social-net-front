import { createStore } from 'zustand'
import { persist } from 'zustand/middleware'

interface initialUserSettingsStore {
  reduceAnimation: boolean
  setReduceAnimation: (bool: boolean) => void
  searchText: string
  setSearchText: (str: string) => void
  postText: string
  setPostText: (str: string) => void
  logout: () => void
}

const initialState: initialUserSettingsStore = {
  reduceAnimation: false,
  setReduceAnimation: (bool: boolean) => {},
  searchText: '',
  setSearchText: (str: string) => {},
  postText: '',
  setPostText: (str: string) => {},
  logout: () => {},
}

export const UserSettingsStore = createStore<initialUserSettingsStore>()(
  persist(
    set => ({
      ...initialState,
      setReduceAnimation: (bool: boolean) => {
        set(state => ({ reduceAnimation: bool }))
      },
      setSearchText: (str: string) => {
        set(state => ({ searchText: str }))
      },
      setPostText: (str: string) => {
        set(state => ({ postText: str }))
      },
      logout: () => {
        set(initialState)
      },
    }),
    {
      name: 'user-settings',
    }
  )
)

// export const useUserSettingsStore = createSelectors(UserSettingsStore)
