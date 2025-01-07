import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Post } from '../../app/types'
import { RootState } from '../../app/store'

interface PostsState {
  posts: Post[]
  page: number
}

const initialState: PostsState = {
  posts: [],
  page: 1,
}

const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    addPosts: (state, action: PayloadAction<Post[]>) => {
      state.posts = [...state.posts, ...action.payload]
    },
    setPage: (state, action: PayloadAction<number>) => {
      state.page = action.payload
    },
    resetPosts: state => {
      state.posts = []
      state.page = 1
    },
  },
})

export const { addPosts, setPage, resetPosts } = postsSlice.actions

export const selectPosts = (state: RootState) => state.posts.posts
export const selectPostsPage = (state: RootState) => state.posts.page

export default postsSlice.reducer
