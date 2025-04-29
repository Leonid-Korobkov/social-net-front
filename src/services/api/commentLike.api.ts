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
import { commentKeys } from './comment.api'

// Ключи для кэширования
export const commentLikesKeys = {
  all: ['comment-likes'] as const,
  commentLikes: (commentId: string) =>
    [...commentLikesKeys.all, commentId] as const,
}

interface CommentLikeRequest {
  postId: string
  commentId: string
  isLiked: boolean
}

// --- React Хуки ---
// Хук для поставления лайка комментарию
export const useToggleCommentLike = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ postId, commentId, isLiked }: CommentLikeRequest) => {
      try {
        return await apiClient.post<Like>(`/comments/${commentId}/like`)
      } catch (error) {
        throw handleAxiosError(error as AxiosError<ErrorResponseData>)
      }
    },
    onMutate: async ({ postId, commentId, isLiked }) => {
      await queryClient.cancelQueries({
        queryKey: commentKeys.postId(postId.toString()),
      })

      const previousPostIdData = queryClient.getQueryData(
        commentKeys.postId(postId.toString())
      )

      queryClient.setQueryData(
        commentKeys.postId(postId.toString()),
        (oldData?: { pages: any[]; pageParams: any[] }) => {
          if (!oldData) return oldData

          const newPages = oldData.pages.map(page => {
            const newData = page.data.map((comment: any) =>
              comment.id === commentId
                ? {
                    ...comment,
                    likedByUser: !isLiked,
                    likeCount: isLiked
                      ? comment.likeCount - 1
                      : comment.likeCount + 1,
                  }
                : comment
            )
            return { ...page, data: newData }
          })


          return {
            ...oldData,
            pages: newPages,
          }
        }
      )

      return { previousPostIdData }
    },
    onError: (error: ApiErrorResponse, { postId }, context) => {
      if (context?.previousPostIdData) {
        queryClient.setQueryData(
          commentKeys.postId(postId.toString()),
          context.previousPostIdData
        )
      }

      console.error(
        'Ошибка при добавлении лайка:',
        error || 'Неизвестная ошибка'
      )
    },
    onSuccess: (data, { postId, commentId, isLiked }) => {
      // queryClient.invalidateQueries({
      //   queryKey: commentKeys.postId(postId.toString()),
      // })
    },
  })
}
