import { BASE_URL } from '@/app/constants'
import { useUserStore } from '@/store/user.store'
import axios, { AxiosError, AxiosHeaders } from 'axios'
import Cookies from 'js-cookie'

// Типизация для ошибок
export interface ApiErrorResponse {
  errorMessage: string
  status?: number
  code?: string
  headers?: AxiosHeaders | Record<string, any> | undefined
}

export interface ErrorOptions {
  onError?: (error: ApiErrorResponse) => void
}

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
      ? Cookies.get('token') || useUserStore.getState().token
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
      useUserStore.getState().logout()
    }
    return Promise.reject(error)
  }
)

export interface ErrorResponseData {
  error: string
}

// Функция обработки ошибок от axios
export const handleAxiosError = (
  error: AxiosError<ErrorResponseData>
): ApiErrorResponse => {
  if (error.response) {
    // Ошибка от сервера с ответом
    return {
      errorMessage: error.response.data?.error || 'Ошибка сервера',
      status: error.response.status,
      code: error.code,
      headers: error.response.headers,
    }
  } else if (error.request) {
    // Запрос был сделан, но ответ не получен
    return {
      errorMessage:
        (error.request.message as string) ||
        'Сервер не отвечает. Попробуйте позже',
      code: 'SERVER_UNAVAILABLE',
    }
  } else {
    return {
      errorMessage:
        (error.message as string) ||
        'Произошла неизвестная ошибка. Мы скоро починим...',
      code: 'REQUEST_SETUP_ERROR',
    }
  }
}
