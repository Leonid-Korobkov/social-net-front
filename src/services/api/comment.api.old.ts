import { Comment, Post } from '@/store/types'
import {
  InfiniteData,
  useInfiniteQuery,
  useMutation,
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

interface MutationContext {
  optimisticComment?: Comment
  previousComments?: InfiniteData<CommentsDTO>
}

// --- React Хуки ---
// Хук для создания комментария
export const useCreateComment = () => {
  const queryClient = useQueryClient()
  const currentUser = UserStore(d => d.current)!

  return useMutation<
    Comment,
    ApiErrorResponse,
    Partial<Comment> & Required<Pick<Comment, 'postId' | 'content'>>,
    MutationContext
  >({
    mutationFn: async comment => {
      try {
        const response = await apiClient.post<Comment>(`/comments`, comment)
        return response.data
      } catch (error) {
        throw handleAxiosError(error as AxiosError<ErrorResponseData>)
      }
    },
    onMutate: async newComment => {
      // Отменяем исходящие запросы
      await queryClient.cancelQueries({
        queryKey: commentKeys.postId(newComment.postId.toString()),
      })

      // Создаем оптимистичный комментарий
      const optimisticComment: Comment = {
        id: Date.now().toString(),
        content: newComment.content,
        postId: newComment.postId,
        post: {} as Post,
        userId: currentUser.id,
        user: currentUser,
        likes: [],
        likeCount: 0,
        createdAt: new Date(),
      }

      // Добавляем оптимистичный комментарий в кэш
      queryClient.setQueryData<InfiniteData<CommentsDTO>>(
        commentKeys.postId(newComment.postId.toString()),
        old => {
          if (!old) return old
          const newPages = [...old.pages]
          newPages[0] = {
            ...newPages[0],
            data: [optimisticComment, ...newPages[0].data],
          }
          return { ...old, pages: newPages }
        }
      )

      return { optimisticComment }
    },
    onError: (err, newComment, context) => {
      // Откатываем изменения при ошибке
      if (context?.optimisticComment) {
        queryClient.setQueryData<InfiniteData<CommentsDTO>>(
          commentKeys.postId(newComment.postId.toString()),
          old => {
            if (!old) return old
            const newPages = [...old.pages]
            newPages[0] = {
              ...newPages[0],
              data: newPages[0].data.filter(
                comment => comment.id !== context.optimisticComment!.id
              ),
            }
            return { ...old, pages: newPages }
          }
        )
      }
    },
    onSettled: (data, error, comment) => {
      // В любом случае инвалидируем кэш для синхронизации
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
  })
}

// Хук для удаления комментария
export const useDeleteComment = () => {
  const queryClient = useQueryClient()

  return useMutation<
    Comment,
    ApiErrorResponse,
    Pick<Comment, 'id' | 'postId'>,
    MutationContext
  >({
    mutationFn: async comment => {
      try {
        const response = await apiClient.delete<string, Comment>(
          `/comments/${comment.id}`
        )
        return response as unknown as Comment // Приводим к нужному типу, так как нам важен только успешный ответ
      } catch (error) {
        throw handleAxiosError(error as AxiosError<ErrorResponseData>)
      }
    },
    onMutate: async comment => {
      // Отменяем исходящие запросы
      await queryClient.cancelQueries({
        queryKey: commentKeys.postId(comment.postId.toString()),
      })

      // Сохраняем предыдущее состояние
      const previousComments = queryClient.getQueryData<
        InfiniteData<CommentsDTO>
      >(commentKeys.postId(comment.postId.toString()))

      // Оптимистично удаляем комментарий из кэша
      queryClient.setQueryData<InfiniteData<CommentsDTO>>(
        commentKeys.postId(comment.postId.toString()),
        old => {
          if (!old) return old
          const filteredPages = old.pages.map(page => ({
            ...page,
            data: page.data.filter(c => c.id !== comment.id),
          }))
          return { ...old, pages: filteredPages }
        }
      )

      return { previousComments }
    },
    onError: (err, comment, context) => {
      // Восстанавливаем предыдущее состояние при ошибке
      if (context?.previousComments) {
        queryClient.setQueryData(
          commentKeys.postId(comment.postId.toString()),
          context.previousComments
        )
      }
    },
    onSettled: (data, error, comment) => {
      // В любом случае инвалидируем кэш для синхронизации
      queryClient.invalidateQueries({
        queryKey: commentKeys.postId(comment.postId.toString()),
      })
    },
  })
}
