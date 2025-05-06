import { createStore } from 'zustand'
import { persist } from 'zustand/middleware'
import { User } from './types'

interface initialUserSettingsStore {
  reduceAnimation: boolean
  setReduceAnimation: (bool: boolean) => void
  searchText: string
  setSearchText: (str: string) => void
  searchActiveTab: string
  setSearchActiveTab: (tab: string) => void
  postText: string
  setPostText: (str: string) => void
  logout: () => void
  viewedPosts: string[]
  pendingViewPosts: string[]
  addViewedPost: (id: string) => void
  wasPostViewed: (id: string) => boolean
  addPendingViewPost: (id: string) => void
  getAndClearPendingViewPosts: () => string[]
  clearViewedPosts: () => void

  current: User | null
  setUser: (user: User) => void
}

const initialState: initialUserSettingsStore = {
  reduceAnimation: false,
  setReduceAnimation: (bool: boolean) => {},
  searchText: '',
  setSearchText: (str: string) => {},
  searchActiveTab: 'posts',
  setSearchActiveTab: (tab: string) => {},
  postText: '',
  setPostText: (str: string) => {},
  logout: () => {},
  viewedPosts: [],
  pendingViewPosts: [],
  addViewedPost: (id: string) => {},
  wasPostViewed: (id: string) => false,
  addPendingViewPost: (id: string) => {},
  getAndClearPendingViewPosts: () => [],
  clearViewedPosts: () => {},

  current: null,
  setUser: () => {},
}

// Вынесу тип отдельно, чтобы избежать циклической ссылки
export type UserSettingsStoreType = typeof initialState

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
      setSearchActiveTab: (tab: string) => {
        set(state => ({ searchActiveTab: tab }))
      },
      setPostText: (str: string) => {
        set(state => ({ postText: str }))
      },
      logout: () => {
        set(initialState)
      },
      addViewedPost: (id: string) => {
        set(state => {
          if (state.viewedPosts.includes(id)) return state
          return { viewedPosts: [...state.viewedPosts, id] }
        })
      },
      wasPostViewed: (id: string): boolean => {
        return UserSettingsStore.getState().viewedPosts.includes(id)
      },
      addPendingViewPost: (id: string) => {
        set(state => {
          if (state.pendingViewPosts.includes(id)) return state
          return { pendingViewPosts: [...state.pendingViewPosts, id] }
        })
      },
      getAndClearPendingViewPosts: (): string[] => {
        const posts: string[] = UserSettingsStore.getState().pendingViewPosts
        set(state => ({ pendingViewPosts: [] }))
        return posts
      },
      clearViewedPosts: () => {
        set(state => ({ viewedPosts: [], pendingViewPosts: [] }))
      },

      setUser: user => {
        set({ current: user })
      },
    }),
    {
      name: 'user-settings',
    }
  )
)

// export const useUserSettingsStore = createSelectors(UserSettingsStore)
