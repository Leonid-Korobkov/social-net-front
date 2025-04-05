import { createSlice } from '@reduxjs/toolkit'
import { User } from '@/store/types'
import { userApi } from '@/store/services/user.api'
import { RootState } from '@/store/store'
import Cookies from 'js-cookie'

interface InitialState {
  user: User | null
  isAuthenticated: boolean
  users: User[] | null
  current: User | null
  token?: string
}

const initialState: InitialState = {
  user: null,
  isAuthenticated: false,
  users: null,
  current: null,
}

const slice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    logout: () => {
      Cookies.remove('token', { path: '/' })
      return initialState
    },
    resetUser: state => {
      state.user = null
    },
  },
  extraReducers: builder => {
    builder
      .addMatcher(userApi.endpoints.login.matchFulfilled, (state, action) => {
        state.token = action.payload.token
        state.isAuthenticated = true
        Cookies.set('token', action.payload.token, { path: '/' })
      })
      .addMatcher(
        userApi.endpoints.currentUser.matchFulfilled,
        (state, action) => {
          state.isAuthenticated = true
          state.current = action.payload
        }
      )
      .addMatcher(
        userApi.endpoints.getUserById.matchFulfilled,
        (state, action) => {
          state.user = action.payload
        }
      )
      .addMatcher(userApi.endpoints.logout.matchFulfilled, () => initialState)
  },
})

export const { logout, resetUser } = slice.actions
export default slice.reducer

// Селекторы для получения данных из стейта
export const selectIsAuthenticated = (state: RootState) =>
  state.auth.isAuthenticated

export const selectCurrent = (state: RootState) => state.auth.current

export const selectUsers = (state: RootState) => state.auth.users

export const selectUser = (state: RootState) => state.auth.user
