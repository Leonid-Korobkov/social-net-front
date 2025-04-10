import { BASE_URL } from '@/app/constants'
import { useUserState } from '@/store/user.store'
import axios from 'axios'
import Cookies from 'js-cookie'

export const apiClient = axios.create({
  baseURL: `${BASE_URL}/api`,
  // headers: {
  //   'Content-Type': 'application/json',
  // },
})

// Интерцептор для добавления токена
apiClient.interceptors.request.use(config => {
  const token =
    typeof window !== 'undefined'
      ? Cookies.get('token') || useUserState.getState().token
      : ''

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Интерцептор для обработки ошибок
apiClient.interceptors.response.use(
  response => response.data,
  error => {
    if (error.response?.status === 401) {
      useUserState.getState().logout()
    }
    return Promise.reject(error)
  }
)
