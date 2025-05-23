import { Post, User } from '@/store/types'
import { useInfiniteQuery } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { apiClient, ErrorResponseData, handleAxiosError } from '../ApiConfig'

// Типы для API поиска
export interface SearchRequest {
  query: string
  type?: 'all' | 'users' | 'posts' | 'comments'
  limit?: number
  page?: number
}

interface Comment {
  id: string
  content: string
  user: {
    id: string
    name: string
    avatarUrl: string
    userName: string
  }
  post: {
    id: string
    title: string
    content: string
  }
  _count: {
    likes: number
  }
}

type SearchPost = {
  id: string
  title: string
  content: string
  author: {
    userName: string
  }
}
type SearchComment = Comment & {
  post: SearchPost
}

export interface SearchResponse {
  users: (User & { _count: { followers: number } })[]
  posts: Post[]
  comments: SearchComment[]
}

// Ключи для кэширования
export const searchKeys = {
  all: ['search'] as const,
  query: (query: string, type?: string) =>
    [...searchKeys.all, query, type || 'all'] as const,
}

// Хук для поиска по пользователям, постам и комментариям
export const useSearch = ({
  query,
  type = 'all',
  limit = 10,
}: SearchRequest) => {
  return useInfiniteQuery<SearchResponse, Error>({
    queryKey: searchKeys.query(query, type),
    queryFn: async ({ pageParam: page = 1 }) => {
      try {
        return await apiClient.get<SearchRequest, SearchResponse>('/search', {
          params: {
            query,
            type,
            page,
            limit,
          },
        })
      } catch (error) {
        throw handleAxiosError(error as AxiosError<ErrorResponseData>)
      }
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages, lastPageParam) => {
      const totalItems =
        (type === 'all' || type === 'users' ? lastPage.users.length : 0) +
        (type === 'all' || type === 'posts' ? lastPage.posts.length : 0) +
        (type === 'all' || type === 'comments' ? lastPage.comments.length : 0)

      if (totalItems < limit) {
        return undefined
      }
      return (lastPageParam as number) + 1
    },
    enabled: query.trim().length > 0,
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
  })
}
