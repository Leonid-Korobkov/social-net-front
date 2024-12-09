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
    }),

    getUserById: builder.query<User, { id: string }>({
      query: ({ id }) => ({
        url: `/users/${id}`,
        method: 'GET',
      }),
    }),

    updateUser: builder.mutation<User, { body: FormData; id: string }>({
      query: ({ id, body }) => ({
        url: `/users/${id}`,
        method: 'PUT',
        body,
      }),
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

// export const {
//   endpoints: { login, registerUser, currentUser, getUserById, updateUser },
// } = userApi
