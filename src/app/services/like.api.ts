import { Like, Post, User } from '../types'
import { api } from './api'

export const likeApi = api.injectEndpoints({
  endpoints: builder => ({
    createLike: builder.mutation<Like, { postId: string; userId: string }>({
      query: ({ postId }) => ({
        url: '/like',
        method: 'POST',
        body: { postId },
      }),
      invalidatesTags: ['Post', 'Posts', 'User'],
      async onQueryStarted({ postId, userId }, { dispatch, queryFulfilled }) {
        const userIdString = userId.toString()
        const patchUserProfile = dispatch(
          api.util.updateQueryData(
            'getUserById' as never,
            { id: userIdString } as never,
            (draft: User) => {
              const post = draft.posts.find(p => p.id === postId)
              if (post) {
                post.likedByUser = true
                post.likes.push({} as Like)
              }
            },
          ),
        )

        const patchSinglePost = dispatch(
          api.util.updateQueryData(
            'getPostById' as never,
            postId.toString() as never,
            (draft: Post) => {
              draft.likedByUser = true
              draft.likes.push({} as Like)
            },
          ),
        )

        const patchAllPosts = dispatch(
          api.util.updateQueryData(
            'getAllPosts' as never,
            undefined as never,
            (draft: Post[]) => {
              const post = draft.find(p => p.id === postId)
              if (post) {
                post.likedByUser = true
                post.likes.push({} as Like)
              }
            },
          ),
        )

        try {
          await queryFulfilled
        } catch {
          patchAllPosts.undo()
          patchSinglePost.undo()
          patchUserProfile.undo()
        }
      },
    }),

    deleteLike: builder.mutation<void, { postId: string; userId: string }>({
      query: ({ postId }) => ({
        url: `/unlike`,
        method: 'DELETE',
        body: { postId },
      }),
      invalidatesTags: ['Post', 'Posts'],
      async onQueryStarted({ postId, userId }, { dispatch, queryFulfilled }) {
        const userIdString = userId.toString()
        const patchUserProfile = dispatch(
          api.util.updateQueryData(
            'getUserById' as never,
            { id: userIdString } as never,
            (draft: User) => {
              const post = draft.posts.find(p => p.id === postId)
              if (post) {
                post.likedByUser = false
                post.likes.pop()
              }
            },
          ),
        )

        const patchSinglePost = dispatch(
          api.util.updateQueryData(
            'getPostById' as never,
            postId.toString() as never,
            (draft: Post) => {
              if (draft) {
                draft.likedByUser = false
                draft.likes.pop()
              }
            },
          ),
        )

        const patchAllPosts = dispatch(
          api.util.updateQueryData(
            'getAllPosts' as never,
            undefined as never,
            (draft: Post[]) => {
              const post = draft.find(p => p.id === postId)
              if (post) {
                post.likedByUser = false
                post.likes.pop()
              }
            },
          ),
        )

        try {
          await queryFulfilled
        } catch {
          patchAllPosts.undo()
          patchSinglePost.undo()
          patchUserProfile.undo()
        }
      },
    }),
  }),
})

export const { useCreateLikeMutation, useDeleteLikeMutation } = likeApi
