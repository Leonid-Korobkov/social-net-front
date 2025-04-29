import { Like, Post } from '@/store/types'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import {
  apiClient,
  ApiErrorResponse,
  ErrorResponseData,
  handleAxiosError,
} from '../ApiConfig'
import { postKeys } from './post.api'
import { userKeys } from './user.api'

// Ключи для кэширования
export const likeKeys = {
  all: ['likes'] as const,
  postLikes: (postId: string) => [...likeKeys.all, postId] as const,
  commentLikes: (postId: string, commentId?: string) =>
    [...likeKeys.all, postId, commentId] as const,
}

interface LikeRequest {
  postId: string
  userId: string
}

// --- React Хуки ---
// Хук для поставления лайка
export const useCreateLike = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ postId, userId }: LikeRequest) => {
      try {
        return await apiClient.post<Like>(`/like`, { postId })
      } catch (error) {
        throw handleAxiosError(error as AxiosError<ErrorResponseData>)
      }
    },
    onMutate: async ({ postId, userId }) => {
      await queryClient.cancelQueries({ queryKey: userKeys.profile(userId) })
      await queryClient.cancelQueries({ queryKey: postKeys.postId(postId) })
      await queryClient.cancelQueries({ queryKey: postKeys.all })

      const previousUserData = queryClient.getQueryData(
        userKeys.profile(userId)
      )
      const previousPostIdData = queryClient.getQueryData(
        postKeys.postId(postId)
      )
      const previousPostsData = queryClient.getQueryData(postKeys.all)

      // Обновляем список всех постов в профиле пользователя
      queryClient.setQueryData(
        userKeys.posts(userId.toString()),
        (oldData?: { pages: any[]; pageParams: any[] }) => {
          if (!oldData) return oldData

          const newPages = oldData.pages.map(page => {
            const newData = page.data.map((post: any) =>
              post.id === postId
                ? {
                    ...post,
                    likedByUser: true,
                    likeCount: post.likeCount + 1,
                  }
                : post
            )
            return { ...page, data: newData }
          })

          return {
            ...oldData,
            pages: newPages,
          }
        }
      )

      // Обновляем кэш для отдельного поста
      queryClient.setQueryData(
        postKeys.postId(postId.toString()),
        (old: Post) => {
          if (!old) return old
          return {
            ...old,
            likedByUser: true,
            likeCount: old.likeCount + 1,
          }
        }
      )

      // Обновляем список всех постов
      queryClient.setQueryData(
        postKeys.all,
        (oldData?: { pages: any[]; pageParams: any[] }) => {
          if (!oldData) return oldData

          const newPages = oldData.pages.map(page => {
            const newData = page.data.map((post: any) =>
              post.id === postId
                ? {
                    ...post,
                    likedByUser: true,
                    likeCount: post.likeCount + 1,
                  }
                : post
            )
            return { ...page, data: newData }
          })

          return {
            ...oldData,
            pages: newPages,
          }
        }
      )

      return { previousUserData, previousPostIdData, previousPostsData }
    },
    onError: (error: ApiErrorResponse, { postId, userId }, context) => {
      if (context?.previousUserData) {
        queryClient.setQueryData(
          userKeys.profile(userId),
          context.previousUserData
        )
      }
      if (context?.previousPostIdData) {
        queryClient.setQueryData(
          postKeys.postId(postId),
          context.previousPostIdData
        )
      }
      if (context?.previousPostsData) {
        queryClient.setQueryData(postKeys.all, context.previousPostsData)
      }
      console.error(
        'Ошибка при добавлении лайка:',
        error || 'Неизвестная ошибка'
      )
    },
    onSuccess: (data, { postId, userId }) => {
      // queryClient.invalidateQueries({ queryKey: userKeys.profile(userId) })
      // queryClient.invalidateQueries({ queryKey: postKeys.postId(postId) })
      // queryClient.invalidateQueries({ queryKey: postKeys.all })
    },
  })
}

// Хук для удаления лайка
export const useDeleteLike = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ postId, userId }: LikeRequest) => {
      try {
        return await apiClient.delete<void, Like>(`/unlike`, {
          data: { postId },
        })
      } catch (error) {
        throw handleAxiosError(error as AxiosError<ErrorResponseData>)
      }
    },
    onMutate: async ({ postId, userId }) => {
      await queryClient.cancelQueries({ queryKey: userKeys.profile(userId) })
      await queryClient.cancelQueries({ queryKey: postKeys.postId(postId) })
      await queryClient.cancelQueries({ queryKey: postKeys.all })

      const previousUserData = queryClient.getQueryData(
        userKeys.profile(userId)
      )
      const previousPostIdData = queryClient.getQueryData(
        postKeys.postId(postId)
      )
      const previousPostsData = queryClient.getQueryData(postKeys.all)

      // Обновляем список всех постов в профиле пользователя
      queryClient.setQueryData(
        userKeys.posts(userId.toString()),
        (oldData?: { pages: any[]; pageParams: any[] }) => {
          if (!oldData) return oldData

          const newPages = oldData.pages.map(page => {
            const newData = page.data.map((post: any) =>
              post.id === postId
                ? {
                    ...post,
                    likedByUser: false,
                    likeCount: post.likeCount - 1,
                  }
                : post
            )
            return { ...page, data: newData }
          })

          return {
            ...oldData,
            pages: newPages,
          }
        }
      )

      // Обновляем кэш для отдельного поста
      queryClient.setQueryData(
        postKeys.postId(postId.toString()),
        (old: any) => {
          if (!old) return old
          return {
            ...old,
            likedByUser: false,
            likeCount: old.likeCount - 1,
          }
        }
      )

      // Обновляем список всех постов
      queryClient.setQueryData(
        postKeys.all,
        (oldData?: { pages: any[]; pageParams: any[] }) => {
          if (!oldData) return oldData

          const newPages = oldData.pages.map(page => {
            const newData = page.data.map((post: any) =>
              post.id === postId
                ? {
                    ...post,
                    likedByUser: false,
                    likeCount: post.likeCount - 1,
                  }
                : post
            )
            return { ...page, data: newData }
          })

          return {
            ...oldData,
            pages: newPages,
          }
        }
      )

      return { previousUserData, previousPostIdData, previousPostsData }
    },
    onError: (error: ApiErrorResponse, { postId, userId }, context) => {
      if (context?.previousUserData) {
        queryClient.setQueryData(
          userKeys.profile(userId),
          context.previousUserData
        )
      }
      if (context?.previousPostIdData) {
        queryClient.setQueryData(
          postKeys.postId(postId),
          context.previousPostIdData
        )
      }
      if (context?.previousPostsData) {
        queryClient.setQueryData(postKeys.all, context.previousPostsData)
      }
      console.error(
        'Ошибка при удалении лайка:',
        error?.errorMessage || 'Неизвестная ошибка'
      )
    },
    onSuccess: (data, { postId, userId }) => {
      // queryClient.invalidateQueries({ queryKey: userKeys.profile(userId) })
      // queryClient.invalidateQueries({ queryKey: postKeys.postId(postId) })
      // queryClient.invalidateQueries({ queryKey: postKeys.all })
    },
  })
}

// Хук для получения лайков по id поста или комментария
export const useGetLikes = (postId: string, commentId?: string) => {
  const queryClient = useQueryClient()

  if (commentId !== '') {
    return useQuery({
      queryKey: likeKeys.commentLikes(postId, commentId),
      queryFn: async id => {
        try {
          return await apiClient.get<string, Like[]>(
            `/comments/${commentId}/likes`
          )
        } catch (error) {
          throw handleAxiosError(error as AxiosError<ErrorResponseData>)
        }
      },
      retry: 0,
      enabled: false,
    })
  } else {
    return useQuery({
      queryKey: likeKeys.postLikes(postId),
      queryFn: async id => {
        try {
          return await apiClient.get<string, Like[]>(`/likes/${postId}`)
        } catch (error) {
          throw handleAxiosError(error as AxiosError<ErrorResponseData>)
        }
      },
      retry: 0,
      enabled: false,
    })
  }
}
