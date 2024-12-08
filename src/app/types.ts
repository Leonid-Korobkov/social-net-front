export type User = {
  id: number
  email: string
  password: string
  name?: string
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
}

export type Follows = {
  id: number
  follower?: User
  followerId?: number
  following?: User
  followingId?: number
}

export type Post = {
  id: number
  title: string
  content: string
  author: User
  authorId: number
  likes: Like[]
  comments: Comment[]
  createdAt: Date
}

export type Like = {
  id: number
  User?: User
  userId?: number
  Post?: Post
  postId?: number
}

export type Comment = {
  id: number
  content: string
  post: Post
  postId: number
  User?: User
  userId?: number
}
