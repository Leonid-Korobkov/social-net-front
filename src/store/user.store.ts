import { create } from 'zustand'
import { createSelectors } from './createSelectors'
import Cookies from 'js-cookie'

interface initialUserStore {
  accessToken?: string
  error?: string

  setAccessToken: (accessToken: string) => void
  logout: () => void
  setError: (error: string) => void
  updateAccessToken: (accessToken: string) => void
}

const initialState: initialUserStore = {
  accessToken: undefined,
  error: undefined,

  setAccessToken: () => {},
  logout: () => {},
  setError: () => {},
  updateAccessToken: () => {},
}

export const UserStore = create<initialUserStore>(set => ({
  ...initialState,
  setAccessToken: accessToken => {  
    Cookies.set('accessToken', accessToken, {
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    })

    set({ accessToken: accessToken })
  },
  logout: () => {
    Cookies.remove('accessToken')
    Cookies.remove('refreshToken')
    set(initialState)
  },
  setError: error => {
    set({ error })
  },
  updateAccessToken: accessToken => {
    Cookies.set('accessToken', accessToken, {
      secure: true,
      sameSite: 'strict',
    })
    set({ accessToken })
  },
}))

export const useUserStore = createSelectors(UserStore)
