import Cookies from 'js-cookie'
import { create, createStore } from 'zustand'
import { persist } from 'zustand/middleware'
import { createSelectors } from './createSelectors'
import { User } from './types'

interface initialUserSettingsStore {
  reduceAnimation: boolean
  setReduceAnimation: () => void
}

const initialState: initialUserSettingsStore = {
  reduceAnimation: false,
  setReduceAnimation: () => {},
}

export const UserSettingsStore = createStore<initialUserSettingsStore>()(
  persist(
    set => ({
      ...initialState,
      setReduceAnimation: () => {
        set(state => ({ reduceAnimation: !state.reduceAnimation }))
      },
    }),
    {
      name: 'user-settings',
    }
  )
)

// export const useUserSettingsStore = createSelectors(UserSettingsStore)
