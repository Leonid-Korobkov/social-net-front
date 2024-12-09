import { Follows } from '../types'
import { api } from './api'

export const followApi = api.injectEndpoints({
  endpoints: builder => ({
    createFollow: builder.mutation<Follows, { followingId: string }>({
      query: body => ({
        url: '/follow',
        method: 'POST',
        body,
      }),
    }),

    deleteFollow: builder.mutation<void, { followingId: string }>({
      query: body => ({
        url: '/follow',
        method: 'DELETE',
        body,
      }),
    }),
  }),
})

export const { useCreateFollowMutation, useDeleteFollowMutation } = followApi

// export const {
//   endpoints: { createFollow, deleteFollow },
// } = followApi
