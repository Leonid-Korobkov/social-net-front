import { User } from '../types'
import { api } from './api'

export const userApi = api.injectEndpoints({
  endpoints: builder => ({
    login: builder.mutation<
      { token: string },
      { email: string; password: string }
    >({
      query: body => ({
        url: '/login',
        method: 'POST',
        body,
      }),
    }),

    registerUser: builder.mutation<
      User,
      { email: string; password: string; name: string }
    >({
      query: body => ({
        url: '/register',
        method: 'POST',
        body,
      }),
    }),

    currentUser: builder.query<User, void>({
      query: () => ({
        url: '/current',
        method: 'GET',
      }),
      providesTags: [{ type: 'CurrentUser', id: 'LIST' }],
    }),

    getUserById: builder.query<User, { id: string }>({
      query: ({ id }) => ({
        url: `/users/${id}`,
        method: 'GET',
      }),
      providesTags: (result, error, { id }) => [{ type: 'User', id }],
    }),

    updateUser: builder.mutation<User, { body: FormData; id: string }>({
      query: ({ id, body }) => ({
        url: `/users/${id}`,
        method: 'PUT',
        body,
      }),
      async onQueryStarted({ id, body }, { dispatch, queryFulfilled }) {
        // Создаем FormData из тела запроса для предварительного просмотра изменений
        const previewChanges: Partial<User> = {}
        for (const [key, value] of body.entries()) {
          if (key !== 'avatar') {
            // Пропускаем файл аватара для оптимистичного обновления
            previewChanges[key as keyof User] = value as any
          }
        }

        // Оптимистичное обновление для getUserById
        const patchGetUserById = dispatch(
          api.util.updateQueryData(
            'getUserById' as never,
            { id } as never,
            (draft: User) => {
              Object.assign(draft, previewChanges)
            },
          ),
        )

        // Оптимистичное обновление для currentUser
        const patchCurrentUser = dispatch(
          api.util.updateQueryData(
            'currentUser' as never,
            undefined as never,
            (draft: User) => {
              if (draft.id === id) {
                Object.assign(draft, previewChanges)
              }
            },
          ),
        )

        try {
          const { data: updatedUser } = await queryFulfilled

          // Обновляем кэш окончательными данными
          dispatch(
            api.util.updateQueryData(
              'getUserById' as never,
              { id } as never,
              (draft: User) => {
                Object.assign(draft, updatedUser)
              },
            ),
          )

          dispatch(
            api.util.updateQueryData(
              'currentUser' as never,
              undefined as never,
              (draft: User) => {
                if (draft.id === id) {
                  Object.assign(draft, updatedUser)
                }
              },
            ),
          )
        } catch {
          // Откатываем оптимистичные обновления при ошибке
          patchGetUserById.undo()
          patchCurrentUser.undo()
        }
      },
    }),
  }),
})

export const {
  useRegisterUserMutation,
  useLoginMutation,
  useCurrentUserQuery,
  useLazyCurrentUserQuery,
  useGetUserByIdQuery,
  useLazyGetUserByIdQuery,
  useUpdateUserMutation,
} = userApi
