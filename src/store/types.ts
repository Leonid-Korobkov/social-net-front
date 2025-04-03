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
  isFollowing?: boolean
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
  isFollowing?: boolean
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
  createdAt: Date
}

export type CommentLike = {
  id: string
  Comment?: Comment
  commentId?: string
  user?: User
  userId?: string
  createdAt: Date
}
