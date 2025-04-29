import { Post } from '@/store/types'
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
import { UserStore } from '@/store/user.store'
import { userKeys } from './user.api'

// Ключи для кэширования
export const postKeys = {
  all: ['posts'] as const,
  postId: (postId: string) => [...postKeys.all, postId] as const,
}

export interface PostsRequest {
  limit: number
  page?: number
}

export interface PostsDTO {
  data: Post[]
  total: number
}

// --- React Хуки ---
// Хук для создания поста
export const useCreatePost = () => {
  const queryClient = useQueryClient()
  const currentUser = UserStore(d => d.current)

  return useMutation({
    mutationFn: async (content: { content: string }) => {
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
      // onSuccess: () => {
      //   queryClient.invalidateQueries({ queryKey: postKeys.all })
      // },
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
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
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

// Хук для удаления поста по id
// export const useDeletePost = () => {
//   const queryClient = useQueryClient()
//   const currentuser = UserStore(d => d.current)

//   return useMutation({
//     mutationFn: async ({ id, userId }: { id: string; userId: string }) => {
//       try {
//         return await apiClient.delete<string, Post>(`/posts/${id}`)
//       } catch (error) {
//         throw handleAxiosError(error as AxiosError<ErrorResponseData>)
//       }
//     },
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: postKeys.all })
//       queryClient.invalidateQueries({
//         queryKey: userKeys.posts(currentuser?.id.toString() ?? ''),
//       })
//     },
//   })
// }

// 4) Удаление поста с ручным вырезанием из кэша
export const useDeletePost = () => {
  const queryClient = useQueryClient()
  const currentUser = UserStore(d => d.current)!

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
      queryClient.invalidateQueries({
        queryKey: userKeys.posts(currentUser.id.toString()),
      })
    },
  })
}
