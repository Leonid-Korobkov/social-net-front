import { configureStore } from '@reduxjs/toolkit'
import { api } from './services/api'
import auth from '../features/user/user.slice'

export const store = configureStore({
  reducer: {
    [api.reducerPath]: api.reducer,
    auth,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware().concat(api.middleware),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
