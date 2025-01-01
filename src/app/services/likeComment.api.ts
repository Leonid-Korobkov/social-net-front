import { CommentLike, Like, Post } from '../types'
import { api } from './api'

export const likeCommentApi = api.injectEndpoints({
  endpoints: builder => ({
    toggleCommentLike: builder.mutation<
      Like,
      { commentId: string; isLiked: boolean; postId: string }
    >({
      query: ({ commentId }) => ({
        url: `/comments/${commentId}/like`,
        method: 'POST',
        body: { commentId },
      }),
      invalidatesTags: ['Post', 'Posts'],
      async onQueryStarted(
        { commentId, isLiked, postId },
        { dispatch, queryFulfilled },
      ) {
        // Update single post if viewing post details
        const patchSinglePost = dispatch(
          api.util.updateQueryData(
            'getPostById' as never,
            postId.toString() as never,
            (draft: Post) => {
              const comment = draft.comments?.find(c => c.id === commentId)
              if (comment) {
                comment.likedByUser = !isLiked
                if (!isLiked) {
                  comment.likes.push({} as Like)
                } else {
                  comment.likes.pop()
                }
              }
            },
          ),
        )

        try {
          await queryFulfilled
        } catch {
          patchSinglePost.undo()
        }
      },
    }),

    getCommentsLikes: builder.query<CommentLike[], { commentId: string }>({
      query: ({ commentId }) => ({
        url: `/comments/${commentId}/likes`,
        method: 'GET',
      }),
      providesTags: ['Post'],
    }),
  }),
})

export const {
  useGetCommentsLikesQuery,
  useLazyGetCommentsLikesQuery,
  useToggleCommentLikeMutation,
} = likeCommentApi
