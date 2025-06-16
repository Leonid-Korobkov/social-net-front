import { useSessionStore } from '@/store/sessionStore'
import { Session, User } from '@/store/types'
import { useUserStore } from '@/store/user.store'
import { UserSettingsStore } from '@/store/userSettings.store'
import { IUserSettings } from '@/types/user.interface'
import toast from 'react-hot-toast'
import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'
import axios, { AxiosError } from 'axios'
import { useStore } from 'zustand'
import {
  apiClient,
  ApiErrorResponse,
  ErrorResponseData,
  handleAxiosError,
} from '../ApiConfig'
import { PostsDTO, PostsRequest } from './post.api'

// Типы для запросов и для ответов API, которые приходят с backend
type LoginRequest = {
  email: string
  password: string
}

type LoginDTO = {
  user: User
  // Если email не подтвержден, то c бака приходит эти поля
  error?: string
  requiresVerification?: boolean
  userId?: number
  message?: string
}

type RegisterRequest = {
  name: string
  email: string
  password: string
  userName: string
}

type RegisterDTO = {
  id: number
  message: string
}

type VerifyEmailRequest = {
  token: string
  code: string
}

type ResendVerificationRequest = {
  token: string
}

type ForgotPasswordRequest = {
  email: string
}

type ResetPasswordDTO = {
  message: string
}

type VerifyResetCodeRequest = {
  email: string
  code: string
}

type ResetPasswordRequest = {
  email: string
  code: string
  newPassword: string
}

// Ключи для кэширования
export const userKeys = {
  all: ['users'] as const,
  randomImage: ['random-image'] as const,
  current: () => [...userKeys.all, 'current'] as const,
  profile: (id: string) => [...userKeys.all, 'profile', id] as const,
  friends: (id: string) => [...userKeys.all, 'friends', id] as const,
  posts: (userId: string) => [...userKeys.all, 'posts', userId] as const,
}

// --- React Хуки ---
// Хук для авторизации
export const useLogin = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (body: LoginRequest) => {
      try {
        return await apiClient.post<LoginRequest, LoginDTO>('/auth/login', body)
      } catch (error) {
        console.log('error', error)
        const apiError = handleAxiosError(
          error as AxiosError<ErrorResponseData>
        )
        // Если это ошибка неподтвержденного email, возвращаем специальный ответ
        if (
          apiError.status === 403 &&
          apiError.errorMessage === 'Email не подтвержден'
        ) {
          return {
            error: apiError.errorMessage,
            requiresVerification: true,
            userId: (error as AxiosError<any>).response?.data?.userId,
            message: (error as AxiosError<any>).response?.data?.message,
          } as LoginDTO
        }
        throw apiError
      }
    },
    onSuccess: data => {
      // Инвалидируем кэш только если это успешный вход (не требующий верификации)
      if (!data.requiresVerification) {
        queryClient.invalidateQueries({ queryKey: userKeys.current() })
        return
      }
    },
    onError: (error: ApiErrorResponse) => {
      console.error('Ошибка авторизации: ', error.errorMessage)
    },
  })
}

// Хук для регистрации
export const useRegister = () => {
  return useMutation({
    mutationFn: async (body: RegisterRequest) => {
      try {
        return await apiClient.post<RegisterRequest, RegisterDTO>(
          '/auth/register',
          body
        )
      } catch (error) {
        throw handleAxiosError(error as AxiosError<ErrorResponseData>)
      }
    },
    onSuccess: () => {},
    onError: (error: ApiErrorResponse) => {
      console.error('Ошибка регистрации :', error.errorMessage)
    },
  })
}

// Хук для подтверждения email
export const useVerifyEmail = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: VerifyEmailRequest) => {
      try {
        return await apiClient.post<VerifyEmailRequest, LoginDTO>(
          '/auth/verify-email',
          data
        )
      } catch (error) {
        throw handleAxiosError(error as AxiosError<ErrorResponseData>)
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.current() })
    },
    onError: (error: ApiErrorResponse) => {
      console.error('Ошибка подтверждения аккаунта :', error.errorMessage)
    },
  })
}

// Хук для повторной отправки кода подтверждения
export const useResendVerification = () => {
  return useMutation({
    mutationFn: async (data: ResendVerificationRequest) => {
      try {
        return await apiClient.post('/auth/resend-verification', data)
      } catch (error) {
        throw handleAxiosError(error as AxiosError<ErrorResponseData>)
      }
    },
    onError: (error: ApiErrorResponse) => {
      console.error('Ошибка подтверждения аккаунта :', error.errorMessage)
    },
  })
}

// Хук для запроса сброса пароля (шаг 1)
export const useForgotPassword = () => {
  return useMutation({
    mutationFn: async (data: ForgotPasswordRequest) => {
      try {
        return await apiClient.post<ForgotPasswordRequest, ResetPasswordDTO>(
          '/auth/forgot-password',
          data
        )
      } catch (error) {
        throw handleAxiosError(error as AxiosError<ErrorResponseData>)
      }
    },
    onError: (error: ApiErrorResponse) => {
      toast.error(error.errorMessage)
    },
    onSuccess: data => {
      toast.success(data.message)
    },
  })
}

// Хук для подтверждения кода сброса пароля (шаг 2)
export const useVerifyResetCode = () => {
  return useMutation({
    mutationFn: async (data: VerifyResetCodeRequest) => {
      try {
        return await apiClient.post<VerifyResetCodeRequest, ResetPasswordDTO>(
          '/auth/verify-reset-code',
          data
        )
      } catch (error) {
        throw handleAxiosError(error as AxiosError<ErrorResponseData>)
      }
    },
    onError: (error: ApiErrorResponse) => {
      toast.error(error.errorMessage)
    },
    onSuccess: data => {
      toast.success(data.message)
    },
  })
}

// Хук для сброса пароля (шаг 3)
export const useResetPassword = () => {
  return useMutation({
    mutationFn: async (data: ResetPasswordRequest) => {
      try {
        return await apiClient.post<ResetPasswordRequest, ResetPasswordDTO>(
          '/auth/reset-password',
          data
        )
      } catch (error) {
        throw handleAxiosError(error as AxiosError<ErrorResponseData>)
      }
    },
    onError: (error: ApiErrorResponse) => {
      toast.error(error.errorMessage)
    },
    onSuccess: data => {
      toast.success(data.message)
    },
  })
}

// Хук для выхода из системы
export const useLogout = () => {
  return useMutation({
    mutationFn: async () => {
      try {
        return await apiClient.post('/auth/logout')
      } catch (error) {
        throw handleAxiosError(error as AxiosError<ErrorResponseData>)
      }
    },
  })
}

// Хук для получения текущего пользователя
export const useGetCurrentUser = () => {
  return useQuery<User, ApiErrorResponse>({
    queryKey: userKeys.current(),
    retry: 0,
    queryFn: async () => {
      try {
        return await apiClient.get<void, User>('/current')
      } catch (error) {
        throw handleAxiosError(error as AxiosError<ErrorResponseData>)
      }
    },
  })
}

// Хук для получения пользователя по ID
export const useGetUserById = (id: string) => {
  return useQuery({
    queryKey: userKeys.profile(id.toString()),
    retry: 0,
    queryFn: async () => {
      try {
        return await apiClient.get<number, User>(`/users/${id}`)
      } catch (error) {
        throw handleAxiosError(error as AxiosError<ErrorResponseData>)
      }
    },
  })
}

// Хук для обновления пользователя
export const useUpdateUser = () => {
  const queryClient = useQueryClient()
  const currentUser = useStore(useUserStore, state => state.user)!

  return useMutation({
    mutationFn: async ({
      username,
      body,
    }: {
      username: string
      body: FormData
    }) => {
      try {
        return await apiClient.put(`/users/${currentUser.id}`, body)
      } catch (error) {
        throw handleAxiosError(error as AxiosError<ErrorResponseData>)
      }
    },
    onSuccess: (data, { username }) => {
      queryClient.invalidateQueries({ queryKey: userKeys.profile(username) })
      queryClient.invalidateQueries({ queryKey: userKeys.current() })
      queryClient.invalidateQueries({ queryKey: userKeys.posts(username) })
    },
  })
}

// Хук для получения всех постов пользователя
export const useGetPostsByUserId = ({
  limit,
  userId,
}: PostsRequest & { userId: string }) => {
  return useInfiniteQuery({
    queryKey: userKeys.posts(userId),
    queryFn: async ({ pageParam: page = 1 }) => {
      try {
        return await apiClient.get<PostsRequest, PostsDTO>(
          `/users/${userId}/posts`,
          {
            params: {
              page,
              limit,
            },
          }
        )
      } catch (error) {
        throw handleAxiosError(error as AxiosError<ErrorResponseData>)
      }
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages, lastPageParam) => {
      if (limit * allPages.length >= lastPage.total) {
        return undefined
      }
      return lastPageParam + 1
    },
    select: result => result.pages.map(page => page.data).flat(),
    // refetchOnMount: false,
    refetchOnWindowFocus: false,
    // refetchOnReconnect: false,
  })
}

export const useUpdateUserSettings = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      username,
      data,
    }: {
      username: string
      data: IUserSettings
    }) => {
      try {
        return await apiClient.put<IUserSettings, IUserSettings>(
          `/users/settings`,
          data
        )
      } catch (error) {
        throw handleAxiosError(error as AxiosError<ErrorResponseData>)
      }
    },
    onSuccess: (data, { username }) => {
      queryClient.invalidateQueries({ queryKey: userKeys.profile(username) })
      queryClient.invalidateQueries({ queryKey: userKeys.current() })
      queryClient.invalidateQueries({ queryKey: userKeys.posts(username) })
    },
  })
}

export const useGetUserSettings = (userId: string) => {
  return useQuery({
    queryKey: ['userSettings', userId],
    queryFn: () =>
      axios
        .get<IUserSettings>(`/api/users/${userId}/settings`)
        .then(res => res.data),
  })
}

// Хук для получения случайного изображения
export const useGetNewRandomImage = () => {
  return useQuery({
    retry: 0,
    queryKey: userKeys.randomImage,
    queryFn: async () => {
      try {
        return await apiClient.get<string, string>(`/users/getRandomImage`)
      } catch (error) {
        throw handleAxiosError(error as AxiosError<ErrorResponseData>)
      }
    },
    enabled: false,
  })
}

// Delete user account
export const useDeleteUser = () => {
  return useMutation({
    mutationFn: ({
      userId,
      confirmationText,
    }: {
      userId: string
      confirmationText: string
    }) =>
      apiClient
        .delete(`/users/${userId}`, { data: { confirmationText } })
        .then(res => res.data),
  })
}
