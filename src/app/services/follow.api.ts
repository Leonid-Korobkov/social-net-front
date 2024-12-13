import { Follows, Post, User } from '../types'
import { api } from './api'

export const followApi = api.injectEndpoints({
  endpoints: builder => ({
    createFollow: builder.mutation<Follows, { followingId: string }>({
      query: body => ({
        url: '/follow',
        method: 'POST',
        body,
      }),
      async onQueryStarted({ followingId }, { dispatch, queryFulfilled }) {
        // Оптимистичное обновление для getAllPosts
        const patchAllPosts = dispatch(
          api.util.updateQueryData(
            'getAllPosts' as never,
            undefined as never,
            (draft: Post[]) => {
              draft.forEach(post => {
                if (post.authorId === followingId) {
                  post.isFollowing = true
                }
              })
            },
          ),
        )

        // Оптимистичное обновление для getPostById
        const patchSinglePost = dispatch(
          api.util.updateQueryData(
            'getPostById' as never,
            followingId as never,
            (draft: Post) => {
              if (draft && draft.authorId === followingId) {
                draft.isFollowing = true
              }
            },
          ),
        )

        // Оптимистичное обновление для getUserById
        const patchUser = dispatch(
          api.util.updateQueryData(
            'getUserById' as never,
            { id: followingId } as never,
            (draft: User) => {
              draft.isFollowing = true
            },
          ),
        )

        try {
          await queryFulfilled
        } catch {
          // Откатываем изменения при ошибке
          patchAllPosts.undo()
          patchSinglePost.undo()
          patchUser.undo()
        }
      },
    }),

    deleteFollow: builder.mutation<void, { followingId: string }>({
      query: body => ({
        url: '/unfollow',
        method: 'DELETE',
        body,
      }),
      async onQueryStarted({ followingId }, { dispatch, queryFulfilled }) {
        // Оптимистичное обновление для getAllPosts
        const patchAllPosts = dispatch(
          api.util.updateQueryData(
            'getAllPosts' as never,
            undefined as never,
            (draft: Post[]) => {
              draft.forEach(post => {
                if (post.authorId === followingId) {
                  post.isFollowing = false
                }
              })
            },
          ),
        )

        // Оптимистичное обновление для getPostById
        const patchSinglePost = dispatch(
          api.util.updateQueryData(
            'getPostById' as never,
            followingId as never,
            (draft: Post) => {
              if (draft && draft.authorId === followingId) {
                draft.isFollowing = false
              }
            },
          ),
        )

        // Оптимистичное обновление для getUserById
        const patchUser = dispatch(
          api.util.updateQueryData(
            'getUserById' as never,
            { id: followingId } as never,
            (draft: User) => {
              draft.isFollowing = false
            },
          ),
        )

        try {
          await queryFulfilled
        } catch {
          // Откатываем изменения при ошибке
          patchAllPosts.undo()
          patchSinglePost.undo()
          patchUser.undo()
        }
      },
    }),
  }),
})

export const { useCreateFollowMutation, useDeleteFollowMutation } = followApi

// export const {
//   endpoints: { createFollow, deleteFollow },
// } = followApi
