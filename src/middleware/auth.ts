import { createListenerMiddleware } from '@reduxjs/toolkit'
import { userApi } from '@/store/services/user.api'
import Cookies from 'js-cookie' // Добавляем пакет js-cookie для работы с куками

export const listenerMiddleware = createListenerMiddleware()

listenerMiddleware.startListening({
  matcher: userApi.endpoints.login.matchFulfilled,
  effect: async (action, listenerApi) => {
    listenerApi.cancelActiveListeners()

    if (action.payload.token && typeof window !== 'undefined') {
      //localStorage.setItem('token', action.payload.token)
      Cookies.set('token', action.payload.token, {
        expires: 7,
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
      })
    }
  },
})
