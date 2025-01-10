import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { RootState } from '../store'
import { BASE_URL } from '../../constants'

const baseQuery = fetchBaseQuery({
  baseUrl: `${BASE_URL}/api`,
  prepareHeaders: (headers, { getState }) => {
    const token =
      (getState() as RootState).auth.token || localStorage.getItem('token')

    if (token) {
      headers.set('authorization', `Bearer ${token}`)
    }
    return headers
  },
})

// Создаем обертку для обработки ошибок
const baseQueryWithErrorHandling = async (
  args: any,
  api: any,
  extraOptions: any,
) => {
  try {
    const result = await baseQuery(args, api, extraOptions)

    if (result.error) {
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
