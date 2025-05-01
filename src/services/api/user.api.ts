import {
  apiClient,
  ApiErrorResponse,
  ErrorResponseData,
  handleAxiosError,
} from '../ApiConfig'
import {
  useQuery,
  useMutation,
  useQueryClient,
  useInfiniteQuery,
} from '@tanstack/react-query'
import { User } from '@/store/types'
import Cookies from 'js-cookie'
import { AxiosError } from 'axios'
import { useUserStore } from '@/store/user.store'
import { PostsDTO, PostsRequest } from './post.api'
import { IUserSettings } from '@/types/user.interface'
import axios from 'axios'

// Типы для запросов и для ответов API, которые приходят с backend
type LoginRequest = {
  email: string
  password: string
}
type LoginDTO = {
  token: string
  user?: User
}

type RegisterRequest = {
  name: string
  email: string
  password: string
}
type RegisterDTO = {
  token: string
  user?: User
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
        const response = await apiClient.post<LoginRequest, LoginDTO>(
          '/login',
          body
        )
        if (response.token) {
          Cookies.set('token', response.token, {
            expires: 7,
            path: '/',
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
          })
        }
        return response
      } catch (error) {
        console.log(error)
        throw handleAxiosError(error as AxiosError<ErrorResponseData>)
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.current() })
    },
    onError: (error: ApiErrorResponse) => {
      console.error('Ошибка авторизации :', error.errorMessage)
    },
  })
}

// Хук для регистрации
export const useRegister = () => {
  return useMutation({
    mutationFn: async (body: LoginRequest) => {
      try {
        const response = await apiClient.post<RegisterRequest, RegisterDTO>(
          '/register',
          body
        )
        return response
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

// Хук для получения текущего пользователя
export const useGetCurrentUser = () => {
  return useQuery<User, ApiErrorResponse>({
    queryKey: userKeys.current(),
    retry: 0,
    // refetchOnMount: false,
    // refetchOnWindowFocus: false,
    // refetchOnReconnect: false,
    queryFn: async () => {
      try {
        const user = await apiClient.get<void, User>('/current')
        useUserStore.setState({ current: user, isAuthenticated: true }) // Прямой вызов setState
        return user
      } catch (error) {
        throw handleAxiosError(error as AxiosError<ErrorResponseData>)
      }
    },
  })
}

// Хук для получения пользователя по ID
export const useGetUserById = (id: string) => {
  return useQuery({
    queryKey: userKeys.profile(id),
    retry: 0,
    queryFn: async () => {
      try {
        return await apiClient.get<number, User>(`/users/${id}`)
      } catch (error) {
        throw handleAxiosError(error as AxiosError<ErrorResponseData>)
      }
    },
    // refetchOnMount: false,
    // refetchOnWindowFocus: false,
    // refetchOnReconnect: false,
  })
}

// Хук для обновления пользователя
export const useUpdateUser = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, body }: { id: string; body: FormData }) => {
      try {
        return await apiClient.put(`/users/${id}`, body)
      } catch (error) {
        throw handleAxiosError(error as AxiosError<ErrorResponseData>)
      }
    },
    // onMutate: async ({ id, body }) => {
    //   await queryClient.cancelQueries({ queryKey: userKeys.profile(id) })
    //   await queryClient.cancelQueries({ queryKey: userKeys.current() })

    //   const previousUserData = queryClient.getQueryData(userKeys.profile(id))
    //   const previousCurrentUser = queryClient.getQueryData(userKeys.current())

    //   // Создаем объект изменений из FormData
    //   const previewChanges: Partial<User> = {}
    //   for (const [key, value] of body.entries()) {
    //     if (key !== 'avatar') {
    //       // Пропускаем файл аватара
    //       previewChanges[key as keyof User] = value as any
    //     }
    //   }

    //   queryClient.setQueryData(
    //     userKeys.profile(id),
    //     (old: User | undefined) => {
    //       return old ? { ...old, ...previewChanges } : old
    //     }
    //   )

    //   queryClient.setQueryData(userKeys.current(), (old: User | undefined) => {
    //     return old && old.id === id ? { ...old, ...previewChanges } : old
    //   })

    //   return { previousUserData, previousCurrentUser }
    // },
    // onError: (error: ApiErrorResponse, { id }, context) => {
    //   if (context?.previousUserData) {
    //     queryClient.setQueryData(userKeys.profile(id), context.previousUserData)
    //   }
    //   if (context?.previousCurrentUser) {
    //     queryClient.setQueryData(
    //       userKeys.current(),
    //       context.previousCurrentUser
    //     )
    //   }
    //   console.error('Ошибка обновления пользователя:', error.errorMessage)
    // },
    onSuccess: (data, { id }) => {
      queryClient.invalidateQueries({ queryKey: userKeys.profile(id) })
      queryClient.invalidateQueries({ queryKey: userKeys.current() })
      queryClient.invalidateQueries({ queryKey: userKeys.posts(id) })
    },
  })
}

// Хук для получения всех постов пользователя
export const useGetPostsByUserId = ({
  limit,
  userId,
}: PostsRequest & { userId: string }) => {
  const queryClient = useQueryClient()

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
    // refetchOnWindowFocus: false,
    // refetchOnReconnect: false,
  })
}

export const useUpdateUserSettings = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      userId,
      data,
    }: {
      userId: string
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
    onSuccess: (data, { userId }) => {
      queryClient.invalidateQueries({ queryKey: userKeys.profile(userId) })
      queryClient.invalidateQueries({ queryKey: userKeys.current() })
      queryClient.invalidateQueries({ queryKey: userKeys.posts(userId) })
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
    // refetchOnMount: false,
    // refetchOnWindowFocus: false,
    // refetchOnReconnect: false,
  })
}
