import type { Like } from "../types"
import { api } from "./api"

export const likeApi = api.injectEndpoints({
  endpoints: builder => ({
    createLike: builder.mutation<Like, { postId: string }>({
      query: body => ({
        url: "/likes",
        method: "POST",
        body,
      }),
    }),

    deleteLike: builder.mutation<void, string>({
      query: id => ({
        url: `/likes/${id}`,
        method: "DELETE",
      }),
    }),
  }),
})

export const { useCreateLikeMutation, useDeleteLikeMutation } = likeApi

// export const {
//   endpoints: { createLike, deleteLike },
// } = likeApi
