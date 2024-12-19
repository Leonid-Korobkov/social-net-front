import { Post } from '../types'
import { api } from './api'

export const postApi = api.injectEndpoints({
  endpoints: builder => ({
    createPost: builder.mutation<Post, { content: string }>({
      query: body => ({
        url: '/posts',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Posts'],
    }),

    getAllPosts: builder.query<Post[], void>({
      query: () => ({
        url: '/posts',
        method: 'GET',
      }),
      providesTags: result =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Posts' as const, id })),
              { type: 'Posts', id: 'LIST' },
            ]
          : [{ type: 'Posts', id: 'LIST' }],
    }),

    getPostById: builder.query<Post, string>({
      query: id => ({
        url: `/posts/${id}`,
        method: 'GET',
      }),
      providesTags: (result, error, id) => [{ type: 'Post', id }],
    }),

    deletePost: builder.mutation<Post, string>({
      query: id => ({
        url: `/posts/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [{ type: 'Posts', id }],
    }),
  }),
})

export const {
  useCreatePostMutation,
  useGetAllPostsQuery,
  useLazyGetAllPostsQuery,
  useGetPostByIdQuery,
  useLazyGetPostByIdQuery,
  useDeletePostMutation,
} = postApi
