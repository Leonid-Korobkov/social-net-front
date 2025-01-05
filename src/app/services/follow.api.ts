import { Follows, User } from '../types'
import { api } from './api'

export const followApi = api.injectEndpoints({
  endpoints: builder => ({
    createFollow: builder.mutation<Follows, { followingId: string }>({
      query: body => ({
        url: '/follow',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['CurrentUser', 'User'],
      async onQueryStarted({ followingId }, { dispatch, queryFulfilled }) {
        // Оптимистичное обновление для getUserById
        const patchUser = dispatch(
          api.util.updateQueryData(
            'getUserById' as never,
            { id: followingId } as never,
            (draft: User) => {
              draft.isFollowing = true
              draft.followers.push({} as Follows) // Увеличиваем счетчик подписчиков
            },
          ),
        )

        // Оптимистичное обновление для currentUser
        const patchCurrentUser = dispatch(
          api.util.updateQueryData(
            'currentUser' as never,
            undefined as never,
            (draft: User) => {
              draft.following.push({} as Follows) // Увеличиваем счетчик подписок
            },
          ),
        )

        try {
          await queryFulfilled
        } catch {
          // Откатываем изменения при ошибке
          patchUser.undo()
          patchCurrentUser.undo()
        }
      },
    }),

    deleteFollow: builder.mutation<void, { followingId: string }>({
      query: body => ({
        url: '/unfollow',
        method: 'DELETE',
        body,
      }),
      invalidatesTags: ['CurrentUser', 'User'],
      async onQueryStarted({ followingId }, { dispatch, queryFulfilled }) {
        // Оптимистичное обновление для getUserById
        const patchUser = dispatch(
          api.util.updateQueryData(
            'getUserById' as never,
            { id: followingId } as never,
            (draft: User) => {
              draft.isFollowing = false
              draft.followers.pop() // Уменьшаем счетчик подписчиков
            },
          ),
        )

        // Оптимистичное обновление для currentUser
        const patchCurrentUser = dispatch(
          api.util.updateQueryData(
            'currentUser' as never,
            undefined as never,
            (draft: User) => {
              draft.following.pop() // Уменьшаем счетчик подписок
            },
          ),
        )

        try {
          await queryFulfilled
        } catch {
          // Откатываем изменения при ошибке
          patchUser.undo()
          patchCurrentUser.undo()
        }
      },
    }),
  }),
})

export const { useCreateFollowMutation, useDeleteFollowMutation } = followApi
