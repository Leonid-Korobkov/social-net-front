import { createListenerMiddleware } from '@reduxjs/toolkit'
import { userApi } from '@/store/services/user.api'

export const listenerMiddleware = createListenerMiddleware()

listenerMiddleware.startListening({
  matcher: userApi.endpoints.login.matchFulfilled,
  effect: async (action, listenerApi) => {
    listenerApi.cancelActiveListeners()

    if (action.payload.token && typeof window !== 'undefined') {
      localStorage.setItem('token', action.payload.token)
    }
  },
})
