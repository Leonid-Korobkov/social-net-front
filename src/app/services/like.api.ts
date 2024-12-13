import { Like, Post } from '../types'
import { api } from './api'

export const likeApi = api.injectEndpoints({
  endpoints: builder => ({
    createLike: builder.mutation<Like, { postId: string }>({
      query: body => ({
        url: '/like',
        method: 'POST',
        body,
      }),
      async onQueryStarted({ postId }, { dispatch, queryFulfilled }) {
        // Оптимистичное обновление для getAllPosts
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

        // Оптимистичное обновление для getPostById
        const patchSinglePost = dispatch(
          api.util.updateQueryData(
            'getPostById' as never,
            postId as never,
            (draft: Post) => {
              if (draft) {
                draft.likedByUser = true
                draft.likes.push({} as Like)
              }
            },
          ),
        )

        try {
          await queryFulfilled
        } catch {
          // Откатываем изменения при ошибке
          patchAllPosts.undo()
          patchSinglePost.undo()
        }
      },
    }),

    deleteLike: builder.mutation<void, { postId: string }>({
      query: body => ({
        url: `/unlike`,
        method: 'DELETE',
        body,
      }),
      async onQueryStarted({ postId }, { dispatch, queryFulfilled }) {
        // Оптимистичное обновление для getAllPosts
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

        // Оптимистичное обновление для getPostById
        const patchSinglePost = dispatch(
          api.util.updateQueryData(
            'getPostById' as never,
            postId as never,
            (draft: Post) => {
              if (draft) {
                draft.likedByUser = false
                draft.likes.pop()
              }
            },
          ),
        )

        try {
          await queryFulfilled
        } catch {
          // Откатываем изменения при ошибке
          patchAllPosts.undo()
          patchSinglePost.undo()
        }
      },
    }),
  }),
})

export const { useCreateLikeMutation, useDeleteLikeMutation } = likeApi

// export const {
//   endpoints: { createLike, deleteLike },
// } = likeApi
