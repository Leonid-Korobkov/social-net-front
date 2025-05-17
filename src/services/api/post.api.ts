import { Post } from '@/store/types'
import { UserSettingsStore } from '@/store/userSettings.store'
import {
  InfiniteData,
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'
import { AxiosError } from 'axios'
import {
  apiClient,
  ApiErrorResponse,
  ErrorResponseData,
  handleAxiosError,
} from '../ApiConfig'
import { userKeys } from './user.api'
import { useStore } from 'zustand'

// Ключи для кэширования
export const postKeys = {
  all: ['posts'] as const,
  postId: (postId: string) => [...postKeys.all, postId] as const,
  feed: (feedType: FeedType) => [...postKeys.all, 'feed', feedType] as const,
}

export interface PostsRequest {
  limit: number
  page?: number
}

export interface FeedRequest extends PostsRequest {
  feedType: FeedType
}

export type FeedType = 'for-you' | 'new' | 'following' | 'viewed'

export interface PostsDTO {
  data: Post[]
  total: number
  allViewed?: boolean
}

// --- React Хуки ---
// Хук для создания поста
export const useCreatePost = () => {
  const queryClient = useQueryClient()
  const currentUser = useStore(UserSettingsStore, state => state.current)!

  return useMutation({
    mutationFn: async (content: { content: string; media?: string[] }) => {
      try {
        return await apiClient.post<any, Post>(`/posts`, content)
      } catch (error) {
        throw handleAxiosError(error as AxiosError<ErrorResponseData>)
      }
    },
    onSuccess: newPost => {
      // 1) Вставляем новый пост на первую страницу
      queryClient.setQueryData<InfiniteData<PostsDTO>>(postKeys.all, old => {
        if (!old) return old
        const newPages = [...old.pages]
        newPages[0] = {
          ...newPages[0],
          data: [newPost, ...newPages[0].data],
        }
        return { ...old, pages: newPages }
      })

      // 2) Обновляем кэш отдельного поста
      queryClient.setQueryData(postKeys.postId(newPost.id.toString()), newPost)

      // 3) Обновляем кэш постов пользователя
      if (currentUser?.id) {
        const key = userKeys.posts(currentUser.id.toString())
        queryClient.setQueryData<InfiniteData<PostsDTO>>(key, old => {
          if (!old) return old
          const newPages = [...old.pages]
          newPages[0] = {
            ...newPages[0],
            data: [newPost, ...newPages[0].data],
          }
          return { ...old, pages: newPages }
        })
      }
    },
  })
}

// Хук для получения всех постов
export const useGetAllPosts = ({ limit }: PostsRequest) => {
  const queryClient = useQueryClient()

  return useInfiniteQuery({
    queryKey: postKeys.all,
    queryFn: async ({ pageParam: page = 1 }) => {
      try {
        return await apiClient.get<PostsRequest, PostsDTO>(`/posts`, {
          params: {
            page,
            limit,
          },
        })
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
    retry: 0,
    select: result => result.pages.map(page => page.data).flat(),
    // refetchOnMount: false,
    // refetchOnWindowFocus: false,
    // refetchOnReconnect: false,
  })
}

// Хук для получения поста по id
export const useGetPostById = (id: string) => {
  const queryClient = useQueryClient()

  return useQuery({
    queryKey: postKeys.postId(id),
    queryFn: async () => {
      try {
        return await apiClient.get<string, Post>(`/posts/${id}`)
      } catch (error) {
        throw handleAxiosError(error as AxiosError<ErrorResponseData>)
      }
    },
    retry: 0,
  })
}

// 4) Удаление поста с ручным вырезанием из кэша
export const useDeletePost = () => {
  const queryClient = useQueryClient()
  const currentUser = useStore(UserSettingsStore, state => state.current)!

  return useMutation<Post, ApiErrorResponse, { id: string }>({
    mutationFn: ({ id }) => apiClient.delete<string, Post>(`/posts/${id}`),
    onSuccess: (_, { id }) => {
      // a) Убираем из кэша infinite-query все вхождения поста
      queryClient.setQueryData<InfiniteData<PostsDTO>>(postKeys.all, old => {
        if (!old) return old
        const filteredPages = old.pages.map(page => ({
          ...page,
          data: page.data.filter(post => post.id !== id),
        }))
        return { ...old, pages: filteredPages }
      })

      // b) Удаляем кэш отдельного запроса
      queryClient.removeQueries({ queryKey: postKeys.postId(id) })

      // c) Инвалидируем пользовательские посты
      // 3) Обновляем кэш постов пользователя
      if (currentUser?.id) {
        const key = userKeys.posts(currentUser.id.toString())
        queryClient.setQueryData<InfiniteData<PostsDTO>>(key, old => {
          if (!old) return old
          const filteredPages = old.pages.map(page => ({
            ...page,
            data: page.data.filter(post => post.id !== id),
          }))
          return { ...old, pages: filteredPages }
        })
      }
      // queryClient.invalidateQueries({
      //   queryKey: userKeys.posts(currentUser.id.toString()),
      // })
    },
  })
}

// Хук для увеличения счетчика просмотров поста
export const useIncrementViewCount = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (postId: string) => {
      try {
        return await apiClient.post(`/posts/${postId}/view`)
      } catch (error) {
        throw handleAxiosError(error as AxiosError<ErrorResponseData>)
      }
    },
    onSuccess: (_, postId) => {
      // Актуализируем кэш поста
      // queryClient.invalidateQueries({ queryKey: postKeys.postId(postId) })
    },
    onError: error => {
      // Можно добавить toast или логирование
      // toast.error('Ошибка при увеличении просмотров')
      console.error('Ошибка при увеличении просмотров', error)
    },
  })
}

// Хук для увеличения счетчика "поделиться"
export const useIncrementShareCount = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (postId: string) => {
      try {
        return await apiClient.post(`/posts/${postId}/share`)
      } catch (error) {
        throw handleAxiosError(error as AxiosError<ErrorResponseData>)
      }
    },
    onSuccess: (_, postId) => {
      // Актуализируем кэш поста
      // queryClient.invalidateQueries({ queryKey: postKeys.postId(postId) })
    },
    onError: error => {
      // Можно добавить toast или логирование
      // toast.error('Ошибка при увеличении "поделиться"')
      console.error('Ошибка при увеличении "поделиться"', error)
    },
  })
}

// Хук для batch-отправки просмотров
export const useIncrementViewsBatch = () => {
  return useMutation({
    mutationFn: async (ids: string[]) => {
      try {
        return await apiClient.post(`/posts/views/batch`, { ids })
      } catch (error) {
        throw handleAxiosError(error as AxiosError<ErrorResponseData>)
      }
    },
    onError: error => {
      // Можно добавить toast или логирование
      // toast.error('Ошибка при batch просмотрах')
      console.error('Ошибка при batch просмотрах', error)
    },
  })
}

// Хук для получения ленты с разными типами
export const useGetFeed = ({ limit, feedType }: FeedRequest) => {
  const queryClient = useQueryClient()

  return useInfiniteQuery({
    queryKey: postKeys.feed(feedType),
    queryFn: async ({ pageParam: page = 1 }) => {
      try {
        return await apiClient.get<PostsRequest, PostsDTO>(`/posts`, {
          params: {
            page,
            limit,
            feed: feedType,
          },
        })
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
    retry: 0,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    select: result => {
      // Собираем все посты в один массив
      const allData = result.pages.map(page => page.data).flat()
      // Берём allViewed с первой страницы (актуально только если постов нет)
      const allViewed = result.pages[0]?.allViewed
      return { data: allData, allViewed }
    },
  })
}
