import { BASE_URL } from '@/app/constants'
import { useUserStore } from '@/store/user.store'
import { UserSettingsStore } from '@/store/userSettings.store'
import axios, { AxiosError, AxiosHeaders, AxiosResponse } from 'axios'
import Cookies from 'js-cookie'
import toast from 'react-hot-toast'
import { useStore } from 'zustand'

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
  withCredentials: true,
})

// Интерцептор запросов: здесь можно добавить логику, не связанную с токенами (например, таймауты)
apiClient.interceptors.request.use(config => {
  // Устанавливаем таймаут только для запросов, не связанных с загрузкой медиа
  if (
    !config.url?.includes('/media/upload') &&
    !(
      config.headers['Content-Type'] &&
      String(config.headers['Content-Type']).includes('multipart/form-data')
    )
  ) {
    config.timeout = 5000 // Таймаут 5 секунд для обычных запросов
  }
  return config
})

// Интерцептор ответов: обработка ошибок и форматирование ответов
apiClient.interceptors.response.use(
  response => {
    // Для мультипарт запросов возвращаем полный ответ, для остальных только data
    const contentType = response.headers['content-type'] || ''
    const reqContentType = String(response.config.headers['Content-Type'] || '')

    if (
      contentType.includes('multipart/form-data') ||
      response.config.url?.includes('/media/upload') ||
      reqContentType.includes('multipart/form-data')
    ) {
      return response
    }
    return response.data
  },
  async error => {
    const originalRequest = error.config
    // Обработка ошибок, например, редирект на страницу входа при 401
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      // Если сессия недействительна, выходим
      if (typeof window !== 'undefined') {
        useUserStore.getState().logout()
        UserSettingsStore.getState().logout()
      }
    }
    console.error('API response error:', error)
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
    toast.error(
      'Сервер не отвечает. Пожалуйста, попробуйте зайти через 1-2 минуты.'
    )
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
