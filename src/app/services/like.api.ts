import { Like } from '../types'
import { api } from './api'

export const likeApi = api.injectEndpoints({
  endpoints: builder => ({
    createLike: builder.mutation<Like, { postId: string }>({
      query: body => ({
        url: '/like',
        method: 'POST',
        body,
      }),
    }),

    deleteLike: builder.mutation<void, { postId: string }>({
      query: body => ({
        url: `/unlike`,
        method: 'DELETE',
        body,
      }),
    }),
  }),
})

export const { useCreateLikeMutation, useDeleteLikeMutation } = likeApi

// export const {
//   endpoints: { createLike, deleteLike },
// } = likeApi
