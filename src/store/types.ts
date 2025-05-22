export type User = {
  id: string
  email: string
  password: string
  name?: string
  userName: string
  avatarUrl?: string
  dateOfBirth?: Date
  createdAt: Date
  updatedAt: Date
  bio?: string
  location?: string
  posts: Post[]
  likes: Like[]
  comments: Comment[]
  followers: Follows[]
  following: Follows[]
  isFollowing?: boolean
  postCount: number

  // Настройки приватности
  showEmail?: boolean
  showBio?: boolean
  showLocation?: boolean
  showDateOfBirth?: boolean
  // Настройки анимации
  reduceAnimation: boolean

  _count: {
    followers: number
  }
}

export type Follows = {
  id: string
  follower?: User
  followerId?: string
  following?: User
  followingId?: string
}

export type Post = {
  id: string
  title: string
  content: string
  author: User
  authorId: string
  viewCount: number
  shareCount: number
  commentCount: number
  comments: Comment[]
  likeCount: number
  createdAt: Date
  likedByUser?: boolean
  isFollowing?: boolean
  media?: string[] // Массив URL медиафайлов
  idEdited?: boolean
}

export type Like = {
  id: string
  user?: User
  userId?: string
  post?: Post
  postId?: string
  createdAt: Date
}

export type Comment = {
  id: string
  content: string
  post: Post
  postId: string
  user?: User
  userId?: string
  likes: CommentLike[]
  likedByUser?: boolean
  likeCount: number
  createdAt: Date
  media?: string[]
}

export type CommentLike = {
  id: string
  Comment?: Comment
  commentId?: string
  user?: User
  userId?: string
  createdAt: Date
}

// Перечисление типов медиафайлов
export enum MediaType {
  IMAGE = 'image',
  VIDEO = 'video',
}

// Тип для медиа-элемента
export interface MediaItem {
  url: string
  type: MediaType
  thumbnail?: string // Для видео может быть превью
}
