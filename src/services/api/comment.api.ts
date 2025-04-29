import { Comment } from '@/store/types'
import {
  InfiniteData,
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { apiClient, ErrorResponseData, handleAxiosError } from '../ApiConfig'

export interface CommentsRequest {
  limit: number
  page?: number
}

export interface CommentsDTO {
  data: Comment[]
  total: number
}

// Ключи для кэширования
export const commentKeys = {
  all: ['comments'] as const,
  postId: (postId: string) => [...commentKeys.all, postId] as const,
}

// --- React Хуки ---
// Хук для создания комментария
export const useCreateComment = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (
      comment: Partial<Comment> & Required<Pick<Comment, 'postId' | 'content'>>
    ) => {
      try {
        return await apiClient.post<Comment>(`/comments`, comment)
      } catch (error) {
        throw handleAxiosError(error as AxiosError<ErrorResponseData>)
      }
    },
    onSuccess: (data, comment) => {
      queryClient.invalidateQueries({
        queryKey: commentKeys.postId(comment.postId.toString()),
      })
    },
  })
}

// Хук для получения всех комментариев поста
export const useGetCommentsByPostId = ({
  limit,
  postId,
}: CommentsRequest & { postId: string }) => {
  const queryClient = useQueryClient()

  return useInfiniteQuery({
    queryKey: commentKeys.postId(postId),
    queryFn: async ({ pageParam: page = 1 }) => {
      try {
        return await apiClient.get<CommentsRequest, CommentsDTO>(
          `/posts/${postId}/comments`,
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
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  })
}

// Хук для удаления поста по id
export const useDeleteComment = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (comment: Pick<Comment, 'id' | 'postId'>) => {
      try {
        return await apiClient.delete<string, Comment>(
          `/comments/${comment.id}`
        )
      } catch (error) {
        throw handleAxiosError(error as AxiosError<ErrorResponseData>)
      }
    },
    onSuccess: (data, comment) => {
      queryClient.invalidateQueries({
        queryKey: commentKeys.postId(comment.postId.toString()),
      })
    },
  })
}
