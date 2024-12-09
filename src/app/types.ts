export type User = {
  id: string
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
  likes: Like[]
  comments: Comment[]
  createdAt: Date
  likedByUser?: boolean
}

export type Like = {
  id: string
  User?: User
  userId?: string
  Post?: Post
  postId?: string
}

export type Comment = {
  id: string
  content: string
  post: Post
  postId: string
  User?: User
  userId?: string
}
