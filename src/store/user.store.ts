import { create } from 'zustand'
import Cookies from 'js-cookie'
import { User } from './types'
import { createSelectors } from './createSelectors'

interface InitialState {
  user: User | null
  isAuthenticated: boolean
  users: User[] | null
  current: User | null
  token?: string

  logout: () => void
  resetUser: () => void
}

const initialState: InitialState = {
  user: null,
  isAuthenticated: false,
  users: null,
  current: null,
  
  logout: () => {},
  resetUser: () => {},
}

export const UserState = create<InitialState>(set => ({
  ...initialState,
  logout: () => {
    Cookies.remove('token')
    set(initialState)
  },
  resetUser: () => set({ user: null }),
}))

export const useUserState = createSelectors(UserState)
