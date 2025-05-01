import Cookies from 'js-cookie'
import { create, createStore } from 'zustand'
import { persist } from 'zustand/middleware'
import { createSelectors } from './createSelectors'
import { User } from './types'

interface initialUserSettingsStore {
  reduceAnimation: boolean
  setReduceAnimation: (bool: boolean) => void
}

const initialState: initialUserSettingsStore = {
  reduceAnimation: false,
  setReduceAnimation: (bool: boolean) => {},
}

export const UserSettingsStore = createStore<initialUserSettingsStore>()(
  persist(
    set => ({
      ...initialState,
      setReduceAnimation: (bool: boolean) => {
        set(state => ({ reduceAnimation: bool }))
      },
    }),
    {
      name: 'user-settings',
    }
  )
)

// export const useUserSettingsStore = createSelectors(UserSettingsStore)
