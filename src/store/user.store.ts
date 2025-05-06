import Cookies from 'js-cookie'
import { create } from 'zustand'
import { createSelectors } from './createSelectors'

interface initialUserStore {
  token?: string
  error?: string

  logout: () => void
  setError: (error: string) => void
}

const initialState: initialUserStore = {
  token: undefined,
  error: undefined,

  logout: () => {},
  setError: () => {},
}

export const UserStore = create<initialUserStore>(set => ({
  ...initialState,
  logout: () => {
    Cookies.remove('token')
    set(initialState)
  },
  setError: error => {
    set({ error })
  },
}))

export const useUserStore = createSelectors(UserStore)
