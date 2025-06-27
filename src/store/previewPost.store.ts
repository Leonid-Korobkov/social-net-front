import { create } from 'zustand'

interface PreviewPostState {
  post: any | null
  setPost: (post: any) => void
  clear: () => void
}

export const usePreviewPostStore = create<PreviewPostState>(set => ({
  post: null,
  setPost: post => set({ post }),
  clear: () => set({ post: null }),
}))
