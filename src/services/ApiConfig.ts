import { BASE_URL } from '@/app/constants'
import { useUserStore } from '@/store/user.store'
import axios, { AxiosError, AxiosHeaders, AxiosResponse } from 'axios'
import Cookies from 'js-cookie'
import toast from 'react-hot-toast'

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

// Интерцептор для добавления токена и CSRF
apiClient.interceptors.request.use(config => {
  const accessToken =
    typeof window !== 'undefined'
      ? Cookies.get('accessToken') || useUserStore.getState().accessToken
      : ''

  const csrfToken =
    typeof window !== 'undefined' ? Cookies.get('csrf-token') : ''

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`
  }

  if (csrfToken) {
    config.headers['X-CSRF-Token'] = csrfToken
  }

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

// Интерцептор для обработки ответов и обновления токена
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
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

    // Если ошибка 401 и это не запрос на обновление токена
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        // Запрашиваем новый access token
        const response = await axios.get(`${BASE_URL}/api/auth/refresh`, {
          withCredentials: true,
        })

        const { accessToken } = response.data

        // Обновляем токен в store и cookies
        useUserStore.getState().updateAccessToken(accessToken)
        Cookies.set('accessToken', accessToken, {
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
        })

        // Повторяем оригинальный запрос с новым токеном
        originalRequest.headers.Authorization = `Bearer ${accessToken}`
        return apiClient.request(originalRequest)
      } catch (refreshError) {
        // Если не удалось обновить токен, выходим из системы
        // useStore(UserStore, state => state.logout)
        // useStore(UserSettingsStore, state => state.logout)
        return Promise.reject(refreshError)
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
