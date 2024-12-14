import { Comment, Post } from '../types'
import { api } from './api'

export const commentApi = api.injectEndpoints({
  endpoints: builder => ({
    createComment: builder.mutation<Comment, Partial<Comment>>({
      query: body => ({
        url: '/comments',
        method: 'POST',
        body,
      }),
      invalidatesTags: (result, error, { postId }) => [
        { type: 'Post', id: postId },
      ],
    }),

    deleteComment: builder.mutation<
      void,
      { commentId: string; postId: string }
    >({
      query: ({ commentId }) => ({
        url: `/comments/${commentId}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, { postId }) => [
        { type: 'Post', id: postId },
      ],
    }),
  }),
})

export const { useCreateCommentMutation, useDeleteCommentMutation } = commentApi
