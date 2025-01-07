import { configureStore } from '@reduxjs/toolkit'
import { api } from './services/api'
import auth from '../features/user/user.slice'
import postsReducer from '../features/posts/posts.slice'

export const store = configureStore({
  reducer: {
    [api.reducerPath]: api.reducer,
    auth,
    posts: postsReducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware().concat(api.middleware),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
