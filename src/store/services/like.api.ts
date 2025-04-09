// @ts-nocheck
import { Like, Post, User } from '../types'
import { api } from './api'
import { PostsResponse } from '../../services/post.api'
import { toast } from 'react-hot-toast'

export const likeApi = api.injectEndpoints({
  endpoints: builder => ({
    createLike: builder.mutation<Like, { postId: string; userId: string }>({
      query: ({ postId }) => ({
        url: '/like',
        method: 'POST',
        body: { postId },
      }),
      invalidatesTags: ['Post', 'Posts', 'User'],
      async onQueryStarted(
        { postId, userId },
        { dispatch, queryFulfilled, getState }
      ) {
        // Обновляем профиль пользователя
        const patchUserProfile = dispatch(
          api.util.updateQueryData(
            'getUserById' as never,
            { id: userId.toString() } as never,
            (draft: User) => {
              const post = draft.posts.find(p => p.id === postId)
              if (post) {
                post.likedByUser = true
                post.likes.push({} as Like)
              }
            }
          )
        )

        // Обновляем отдельный пост
        const patchSinglePost = dispatch(
          api.util.updateQueryData(
            'getPostById' as never,
            postId.toString() as never,
            (draft: Post) => {
              draft.likedByUser = true
              draft.likes.push({} as Like)
            }
          )
        )

        // Получаем все закешированные запросы getAllPosts
        const queries = api.util.selectInvalidatedBy(getState(), [
          { type: 'Posts' },
        ])
        const patchAllPostsResults = queries
          .filter(query => query.endpointName === 'getAllPosts')
          .map(query => {
            return dispatch(
              api.util.updateQueryData(
                'getAllPosts' as never,
                query.originalArgs as never,
                (draft: PostsResponse) => {
                  const post = draft.posts.find(p => p.id === postId)
                  if (post) {
                    post.likedByUser = true
                    post.likes.push({} as Like)
                  }
                }
              )
            )
          })

        try {
          await queryFulfilled
        } catch (error) {
          // Отменяем все оптимистичные обновления
          patchAllPostsResults.forEach(patchResult => patchResult.undo())
          patchSinglePost.undo()
          patchUserProfile.undo()

          // Показываем ошибку пользователю
          toast.error('Не удалось поставить лайк')
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
      async onQueryStarted(
        { postId, userId },
        { dispatch, queryFulfilled, getState }
      ) {
        // Обновляем профиль пользователя
        const patchUserProfile = dispatch(
          api.util.updateQueryData(
            'getUserById' as never,
            { id: userId.toString() } as never,
            (draft: User) => {
              const post = draft.posts.find(p => p.id === postId)
              if (post) {
                post.likedByUser = false
                post.likes.pop()
              }
            }
          )
        )

        // Обновляем отдельный пост
        const patchSinglePost = dispatch(
          api.util.updateQueryData(
            'getPostById' as never,
            postId.toString() as never,
            (draft: Post) => {
              if (draft) {
                draft.likedByUser = false
                draft.likes.pop()
              }
            }
          )
        )

        // Получаем все закешированные запросы getAllPosts
        const queries = api.util.selectInvalidatedBy(getState(), [
          { type: 'Posts' },
        ])
        const patchAllPostsResults = queries
          .filter(query => query.endpointName === 'getAllPosts')
          .map(query => {
            return dispatch(
              api.util.updateQueryData(
                'getAllPosts' as never,
                query.originalArgs as never,
                (draft: PostsResponse) => {
                  const post = draft.posts.find(p => p.id === postId)
                  if (post) {
                    post.likedByUser = false
                    post.likes.pop()
                  }
                }
              )
            )
          })

        try {
          await queryFulfilled
        } catch (error) {
          // Отменяем все оптимистичные обновления
          patchAllPostsResults.forEach(patchResult => patchResult.undo())
          patchSinglePost.undo()
          patchUserProfile.undo()

          // Показываем ошибку пользователю
          toast.error('Не удалось убрать лайк')
        }
      },
    }),
  }),
})

export const { useCreateLikeMutation, useDeleteLikeMutation } = likeApi
