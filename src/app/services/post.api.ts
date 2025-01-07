import { Post } from '../types'
import { api } from './api'

interface PostsResponse {
  posts: Post[]
  total: number
  hasMore: boolean
}

interface QueryMetaType {
  response?: {
    headers: {
      get(key: string): string | null
    }
  }
}

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

    getAllPosts: builder.query<PostsResponse, { page?: number; limit?: number }>({
      query: ({ page, limit }) => ({
        url: '/posts',
        method: 'GET',
        params: { page, limit },
      }),
      transformResponse: (
        response: Post[],
        meta: QueryMetaType,
        arg: { limit: number },
      ) => {
        return {
          posts: response,
          total: parseInt(meta?.response?.headers?.get('x-total-count') || '0'),
          hasMore: response.length === arg.limit,
        }
      },
      providesTags: result =>
        result?.posts
          ? [
              ...result.posts.map(({ id }) => ({ type: 'Posts' as const, id })),
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

    deletePost: builder.mutation<Post, { id: string; userId?: string }>({
      query: ({ id, userId }) => ({
        url: `/posts/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, { id, userId }) => [
        { type: 'User', id: userId },
        { type: 'Posts', id },
      ],
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
