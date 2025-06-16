import { Post } from '@/store/types'
import { useUserStore } from '@/store/user.store'
import {
  InfiniteData,
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { useStore } from 'zustand'
import {
  apiClient,
  ApiErrorResponse,
  ErrorResponseData,
  handleAxiosError,
} from '../ApiConfig'
import { userKeys } from './user.api'

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

export type FeedType = 'for-you' | 'new' | 'following' | 'viewed' | 'top'

export interface PostsDTO {
  data: Post[]
  total: number
  allViewed?: boolean
}

// --- React Хуки ---
// Хук для создания поста
export const useCreatePost = () => {
  const queryClient = useQueryClient()
  const currentUser = useStore(useUserStore, state => state.user)!

  return useMutation({
    mutationFn: async (content: { content: string; media?: string[] }) => {
      try {
        return await apiClient.post<any, Post>(`/posts`, content)
      } catch (error) {
        throw handleAxiosError(error as AxiosError<ErrorResponseData>)
      }
    },
    onSuccess: newPost => {
      // --- Обновляем все feed-кэши ---
      updateAllFeedCaches(queryClient, old => {
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
        updateUserPostsCache(
          queryClient,
          currentUser.userName.toString(),
          old => {
            const newPages = [...old.pages]
            newPages[0] = {
              ...newPages[0],
              data: [newPost, ...newPages[0].data],
            }
            return { ...old, pages: newPages }
          }
        )
      }
    },
  })
}

// Хук для получения всех постов
export const useGetAllPosts = ({ limit }: PostsRequest) => {
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
  const currentUser = useStore(useUserStore, state => state.user)!

  return useMutation<Post, ApiErrorResponse, { id: string }>({
    mutationFn: ({ id }) => apiClient.delete<string, Post>(`/posts/${id}`),
    onSuccess: (_, { id }) => {
      // --- Удаляем из всех feed-кэшей ---
      updateAllFeedCaches(queryClient, old => {
        const filteredPages = old.pages.map((page: PostsDTO) => ({
          ...page,
          data: page.data.filter((post: Post) => post.id !== id),
        }))
        return { ...old, pages: filteredPages }
      })

      // b) Удаляем кэш отдельного запроса
      queryClient.removeQueries({ queryKey: postKeys.postId(id) })

      // c) Обновляем кэш постов пользователя
      if (currentUser?.id) {
        updateUserPostsCache(
          queryClient,
          currentUser.userName.toString(),
          old => {
            const filteredPages = old.pages.map((page: PostsDTO) => ({
              ...page,
              data: page.data.filter((post: Post) => post.id !== id),
            }))
            return { ...old, pages: filteredPages }
          }
        )
      }
    },
  })
}

// Хук для увеличения счетчика просмотров поста
export const useIncrementViewCount = () => {
  return useMutation({
    mutationFn: async (postId: string) => {
      try {
        return await apiClient.post(`/posts/${postId}/view`)
      } catch (error) {
        throw handleAxiosError(error as AxiosError<ErrorResponseData>)
      }
    },
    onSuccess: (_, postId) => {},
    onError: error => {
      console.error('Ошибка при увеличении просмотров', error)
    },
  })
}

// Хук для увеличения счетчика "поделиться"
export const useIncrementShareCount = () => {
  return useMutation({
    mutationFn: async (postId: string) => {
      try {
        return await apiClient.post(`/posts/${postId}/share`)
      } catch (error) {
        throw handleAxiosError(error as AxiosError<ErrorResponseData>)
      }
    },
    onSuccess: (_, postId) => {},
    onError: error => {
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
      console.error('Ошибка при batch просмотрах', error)
    },
  })
}

// Хук для получения ленты с разными типами
export const useGetFeed = ({ limit, feedType }: FeedRequest) => {
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

// Вспомогательная функция для обновления всех feed-кэшей
function updateAllFeedCaches(
  queryClient: ReturnType<typeof useQueryClient>,
  updater: (old: InfiniteData<PostsDTO>) => InfiniteData<PostsDTO>
) {
  const feedQueries = queryClient
    .getQueryCache()
    .findAll({ queryKey: ['posts', 'feed'] })
  feedQueries.forEach(query => {
    queryClient.setQueryData<InfiniteData<PostsDTO>>(query.queryKey, old => {
      if (!old || !('pages' in old)) return old
      return updater(old)
    })
  })
}

// Вспомогательная функция для обновления кэша постов пользователя
function updateUserPostsCache(
  queryClient: ReturnType<typeof useQueryClient>,
  username: string,
  updater: (old: InfiniteData<PostsDTO>) => InfiniteData<PostsDTO>
) {
  const key = userKeys.posts(username)
  queryClient.setQueryData<InfiniteData<PostsDTO>>(key, old => {
    if (!old) return old
    return updater(old)
  })
}
