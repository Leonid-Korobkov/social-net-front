import Cookies from 'js-cookie'
import { create } from 'zustand'
import { createSelectors } from './createSelectors'
import { User } from './types'

interface initialUserStore {
  isAuthenticated: boolean
  current: User | null
  token?: string
  error?: string

  setUser: (user: User) => void
  logout: () => void
  setIsAuthenticated: () => void
  setError: (error: string) => void
}

const initialState: initialUserStore = {
  isAuthenticated: false,
  current: null,
  token: undefined,
  error: undefined,

  setUser: () => {},
  logout: () => {},
  setIsAuthenticated: () => {},
  setError: () => {},
}

export const UserStore = create<initialUserStore>(set => ({
  ...initialState,
  logout: () => {
    Cookies.remove('token')
    set(initialState)
  },
  setUser: user => {
    set({ current: user, isAuthenticated: true })
  },
  setIsAuthenticated: () => {
    set({ isAuthenticated: true })
  },
  setError: error => {
    set({ error })
  },
}))

export const useUserStore = createSelectors(UserStore)
