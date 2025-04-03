import { api } from './api'
import { Post, User } from '../types'

// Базовый пользователь для моков
const baseUser = {
  password: 'password123',
  likes: [],
  comments: [],
  followers: [],
  following: [],
  posts: [],
}

// Моковые данные для тестирования
const mockUsers = [
  {
    ...baseUser,
    id: '1',
    name: 'Анна Иванова',
    email: 'anna@example.com',
    avatarUrl: 'https://i.pravatar.cc/150?u=1',
    bio: 'Frontend разработчик, люблю React и TypeScript',
    location: 'Москва',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    ...baseUser,
    id: '2',
    name: 'Петр Сидоров',
    email: 'petr@example.com',
    avatarUrl: 'https://i.pravatar.cc/150?u=2',
    bio: 'Backend developer, Node.js enthusiast',
    location: 'Санкт-Петербург',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    ...baseUser,
    id: '3',
    name: 'Мария Петрова',
    email: 'maria@example.com',
    avatarUrl: 'https://i.pravatar.cc/150?u=3',
    bio: 'UI/UX дизайнер',
    location: 'Казань',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
]

// Базовый пост для моков
const basePost = {
  title: '',
  comments: [],
}

const mockPosts = [
  {
    ...basePost,
    id: '1',
    authorId: '1',
    content:
      'Изучаю React и TypeScript. Отличная комбинация для современной веб-разработки!',
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    author: mockUsers[0],
    likes: [],
    likedByUser: false,
  },
  {
    ...basePost,
    id: '2',
    authorId: '2',
    content:
      'Node.js и Express - мощный бэкенд стек. Работаю над новым проектом.',
    createdAt: new Date(Date.now() - 7200000).toISOString(),
    author: mockUsers[1],
    likes: [],
    likedByUser: false,
  },
  {
    ...basePost,
    id: '3',
    authorId: '3',
    content:
      'Поделюсь новым дизайн-концептом. Как вам такой минималистичный подход?',
    createdAt: new Date(Date.now() - 10800000).toISOString(),
    author: mockUsers[2],
    likes: [],
    likedByUser: false,
  },
]

export const searchApi = api.injectEndpoints({
  endpoints: builder => ({
    searchPosts: builder.query<Post[], string>({
      queryFn: arg => {
        if (!arg) return { data: [] }
        const data = mockPosts.map(post => ({
          ...post,
          createdAt: new Date(post.createdAt),
          author: {
            ...post.author,
            createdAt: new Date(post.author.createdAt),
            updatedAt: new Date(post.author.updatedAt),
          },
        }))
        return {
          data: data.filter(
            post =>
              post.content.toLowerCase().includes(arg.toLowerCase()) ||
              (post.author?.name || '')
                .toLowerCase()
                .includes(arg.toLowerCase()),
          ),
        }
      },
    }),
    searchUsers: builder.query<User[], string>({
      queryFn: arg => {
        if (!arg) return { data: [] }
        const data = mockUsers.map(user => ({
          ...user,
          createdAt: new Date(user.createdAt),
          updatedAt: new Date(user.updatedAt),
        }))
        return {
          data: data.filter(
            user =>
              (user.name || '').toLowerCase().includes(arg.toLowerCase()) ||
              (user.email || '').toLowerCase().includes(arg.toLowerCase()) ||
              (user.bio || '').toLowerCase().includes(arg.toLowerCase()),
          ),
        }
      },
    }),
  }),
})

export const { useSearchPostsQuery, useSearchUsersQuery } = searchApi

// import { api } from './api'
// import { Post, User } from '../types'

// export const searchApi = api.injectEndpoints({
//   endpoints: builder => ({
//     searchPosts: builder.query<Post[], string>({
//       query: searchQuery => ({
//         url: `/posts/search?q=${searchQuery}`,
//         method: 'GET',
//       }),
//     }),
//     searchUsers: builder.query<User[], string>({
//       query: searchQuery => ({
//         url: `/users/search?q=${searchQuery}`,
//         method: 'GET',
//       }),
//     }),
//   }),
// })

// export const { useSearchPostsQuery, useSearchUsersQuery } = searchApi
