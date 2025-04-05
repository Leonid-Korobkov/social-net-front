import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { RootState } from '../store'
import { BASE_URL } from '@/app/constants'
import { BaseQueryApi, FetchArgs } from '@reduxjs/toolkit/query'
import Cookies from 'js-cookie'

const baseQuery = fetchBaseQuery({
  baseUrl: `${BASE_URL}/api`,
  prepareHeaders: (headers, { getState }) => {
    const token =
      typeof window !== 'undefined'
        ? Cookies.get('token') || (getState() as RootState).auth.token
        : (getState() as RootState).auth.token

    if (token) {
      headers.set('authorization', `Bearer ${token}`)
    }
    return headers
  },
})

// Создаем обертку для обработки ошибок
const baseQueryWithErrorHandling = async (
  args: string | FetchArgs,
  api: BaseQueryApi,
  extraOptions: object
) => {
  try {
    const result = await baseQuery(args, api, extraOptions)

    if (result.error) {
      if (result.error.status === 401) {
        Cookies.remove('token', { path: '/' })
      }

      // Обрабатываем ошибки от сервера
      if (result.error.status === 500) {
        return {
          error: {
            status: 500,
            data: { error: 'Ошибка сервера. Пожалуйста, попробуйте позже.' },
          },
        }
      }
    }

    return result
  } catch (error) {
    return {
      error: {
        status: 'FETCH_ERROR',
        data: { error: 'Не удалось подключиться к серверу' },
      },
    }
  }
}

export const api = createApi({
  reducerPath: 'api',
  tagTypes: ['CurrentUser', 'User', 'Post', 'Posts'],
  baseQuery: baseQueryWithErrorHandling,
  refetchOnMountOrArgChange: true,
  refetchOnFocus: true,
  endpoints: () => ({}),
})
