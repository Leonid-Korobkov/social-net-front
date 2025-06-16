import { create } from 'zustand'
import { User } from './types'
import { createSelectors } from './createSelectors'

// Интерфейс только для данных состояния
interface UserDataState {
  user: User | null
  isLoadingUser: boolean
  error?: string
}

// Начальные данные состояния
const initialData: UserDataState = {
  user: null,
  isLoadingUser: true,
  error: undefined,
}

// Интерфейс для действий
interface UserActionsState {
  setUser: (user: User | null) => void
  setIsLoadingUser: (isLoading: boolean) => void
  setError: (error: string) => void
  logout: () => void
}

// Полный тип состояния (данные + действия)
export type UserState = UserDataState & UserActionsState

export const UserStore = create<UserState>(set => ({
  ...initialData,
  setUser: user => {
    set({ user })
  },
  logout: () => {
    set(initialData)
  },
  setIsLoadingUser: isLoading => {
    set({ isLoadingUser: isLoading })
  },
  setError: error => {
    set({ error })
  },
}))

export const useUserStore = createSelectors(UserStore)
