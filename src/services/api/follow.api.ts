import { Follows } from '@/store/types'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import {
  apiClient,
  ApiErrorResponse,
  ErrorResponseData,
  handleAxiosError,
} from '../ApiConfig'
import { userKeys } from './user.api'

// Ключи для кэширования
export const followsKeys = {
  all: ['folows'] as const,
  follow: (userId: string) => [...followsKeys.all, userId] as const,
}

// --- React Хуки ---
// Хук для поставления лайка
export const useCreateFollow = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      followingId,
      userId,
    }: {
      followingId: string
      userId: string
    }) => {
      try {
        return await apiClient.post<Follows>(`/follow`, { followingId })
      } catch (error) {
        throw handleAxiosError(error as AxiosError<ErrorResponseData>)
      }
    },
    onMutate: async ({ followingId, userId }) => {
      await queryClient.cancelQueries({
        queryKey: userKeys.profile(followingId.toString()),
      })

      const previousUserData = queryClient.getQueryData(
        userKeys.profile(followingId.toString())
      )

      queryClient.setQueryData(
        userKeys.profile(followingId.toString()),
        (old: any) => {
          if (!old) return old
          return {
            ...old,
            isFollowing: true,
            followers: [
              ...old.followers,
              {
                followerId: userId,
              },
            ],
          }
        }
      )

      return { previousUserData }
    },
    onError: (error: ApiErrorResponse, { followingId, userId }, context) => {
      if (context?.previousUserData) {
        queryClient.setQueryData(
          userKeys.profile(followingId),
          context.previousUserData
        )
      }
    },
    onSuccess: (data, { followingId, userId }) => {
      queryClient.invalidateQueries({
        queryKey: userKeys.profile(userId.toString()),
      })
      queryClient.invalidateQueries({
        queryKey: userKeys.profile(followingId.toString()),
      })
    },
  })
}

// --- React Хуки ---
// Хук для поставления лайка
export const useDeleteFollow = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({
      followingId,
      userId,
    }: {
      followingId: string
      userId: string
    }) => {
      try {
        return await apiClient.delete<void, Follows>(`/unfollow`, {
          data: { followingId },
        })
      } catch (error) {
        throw handleAxiosError(error as AxiosError<ErrorResponseData>)
      }
    },
    onMutate: async ({ followingId, userId }) => {
      await queryClient.cancelQueries({
        queryKey: userKeys.profile(followingId.toString()),
      })

      const previousFollowingData = queryClient.getQueryData(
        userKeys.profile(followingId.toString())
      )

      queryClient.setQueryData(
        userKeys.profile(followingId.toString()),
        (old: any) => {
          if (!old) return old
          const followersArr = old.followers.filter(
            (user: any) => user.followerId !== userId
          )
          return {
            ...old,
            isFollowing: false,
            followers: followersArr,
          }
        }
      )

      return {
        previousFollowingData,
      }
    },
    onError: (error: ApiErrorResponse, { followingId, userId }, context) => {
      if (context?.previousFollowingData) {
        queryClient.setQueryData(
          userKeys.profile(followingId.toString()),
          context.previousFollowingData
        )
      }
    },
    onSuccess: (data, { followingId, userId }) => {
      queryClient.invalidateQueries({
        queryKey: userKeys.profile(userId.toString()),
      })
      queryClient.invalidateQueries({
        queryKey: userKeys.profile(followingId.toString()),
      })
    },
  })
}
