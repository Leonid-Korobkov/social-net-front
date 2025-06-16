import {
  apiClient,
  ErrorResponseData,
  handleAxiosError,
} from '@/services/ApiConfig'
import { Session } from '@/store/types'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { AxiosError } from 'axios'

// Ключи для кэширования
export const sessionKeys = {
  all: ['sessions'] as const,
}

// --- React Хуки ---

// Получение всех сессий пользователя
export const useGetSessions = () => {
  return useQuery({
    queryKey: sessionKeys.all,
    queryFn: async () => {
      try {
        return await apiClient.get<null, Session[]>('/sessions')
      } catch (error) {
        throw handleAxiosError(error as AxiosError<ErrorResponseData>)
      }
    },
  })
}

// Завершение конкретной сессии
export const useTerminateSession = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (sessionId: string) => {
      const { data } = await apiClient.delete(`/sessions/${sessionId}`)
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sessions'] })
    },
  })
}

// Завершение текущей сессии
export const useTerminateCurrentSession = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async () => {
      const { data } = await apiClient.delete('/sessions/current')
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sessions'] })
    },
  })
}

// Завершение всех других сессий
export const useTerminateOtherSessions = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async () => {
      const { data } = await apiClient.delete('/sessions/all')
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sessions'] })
    },
  })
}
