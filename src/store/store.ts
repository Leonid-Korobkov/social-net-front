import { configureStore } from '@reduxjs/toolkit'
import { api } from '@/store/services/api'
import auth from '../features/user/user.slice'
import { listenerMiddleware } from '../middleware/auth'

export const makeStore = () => {
  return configureStore({
    reducer: {
      [api.reducerPath]: api.reducer,
      auth,
    },
    middleware: getDefaultMiddleware =>
      getDefaultMiddleware().concat(
        api.middleware,
        listenerMiddleware.middleware
      ),
  })
}
export type AppStore = ReturnType<typeof makeStore>
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']
