import { createStore } from 'zustand'
import { persist } from 'zustand/middleware'
import { User, MediaType } from './types'

// Определяем интерфейс для загружаемых файлов
export interface UploadStatus {
  id: string
  file: File
  progress: number
  status: 'pending' | 'uploading' | 'success' | 'error' | 'removing'
  url?: string
  error?: string
  type: MediaType
}

// Версия UploadStatus для хранения в localStorage (без File объекта)
export interface StorableUpload {
  id: string
  progress: number
  status: 'pending' | 'uploading' | 'success' | 'error' | 'removing'
  url?: string
  error?: string
  type: MediaType
  fileName?: string
  fileSize?: number
  fileType?: string
}

interface initialUserSettingsStore {
  reduceAnimation: boolean
  setReduceAnimation: (bool: boolean) => void

  searchText: string
  setSearchText: (str: string) => void
  searchActiveTab: string
  setSearchActiveTab: (tab: string) => void

  feedType: string
  setFeedType: (type: string) => void

  postText: string
  setPostText: (str: string) => void
  reset: () => void
  mediaUploads: StorableUpload[] // Изменил на сериализуемый тип
  setMediaUploads: (uploads: StorableUpload[]) => void
  resetMediaUploads: () => void

  logout: () => void
  viewedPosts: string[]
  pendingViewPosts: string[]
  addViewedPost: (id: string) => void
  wasPostViewed: (id: string) => boolean
  addPendingViewPost: (id: string) => void
  getAndClearPendingViewPosts: () => string[]
  clearViewedPosts: () => void

  current: User | null
  setUser: (user: User) => void
}

const initialState: initialUserSettingsStore = {
  reduceAnimation: false,
  setReduceAnimation: (bool: boolean) => {},

  searchText: '',
  setSearchText: (str: string) => {},
  searchActiveTab: 'posts',
  setSearchActiveTab: (tab: string) => {},

  feedType: 'new',
  setFeedType: (type: string) => {},

  postText: '',
  setPostText: (str: string) => {},
  reset: () => {},
  mediaUploads: [], // Изменил на новый ключ
  setMediaUploads: (uploads: StorableUpload[]) => {},
  resetMediaUploads: () => {},

  logout: () => {},
  viewedPosts: [],
  pendingViewPosts: [],
  addViewedPost: (id: string) => {},
  wasPostViewed: (id: string) => false,
  addPendingViewPost: (id: string) => {},
  getAndClearPendingViewPosts: () => [],
  clearViewedPosts: () => {},

  current: null,
  setUser: () => {},
}

// Вынесу тип отдельно, чтобы избежать циклической ссылки
export type UserSettingsStoreType = typeof initialState

export const UserSettingsStore = createStore<initialUserSettingsStore>()(
  persist(
    set => ({
      ...initialState,
      setReduceAnimation: (bool: boolean) => {
        set(state => ({ reduceAnimation: bool }))
      },

      setSearchText: (str: string) => {
        set(state => ({ searchText: str }))
      },
      setSearchActiveTab: (tab: string) => {
        set(state => ({ searchActiveTab: tab }))
      },

      setFeedType: (type: string) => {
        set(state => ({ feedType: type }))
      },

      setPostText: (str: string) => {
        set(state => ({ postText: str }))
      },
      reset: () => set({ postText: '' }),
      setMediaUploads: (uploads: StorableUpload[]) => {
        set(state => ({ mediaUploads: uploads }))
      },
      resetMediaUploads: () => set({ mediaUploads: [] }),

      logout: () => {
        set(initialState)
      },

      addViewedPost: (id: string) => {
        set(state => {
          if (state.viewedPosts.includes(id)) return state
          return { viewedPosts: [...state.viewedPosts, id] }
        })
      },
      wasPostViewed: (id: string): boolean => {
        return UserSettingsStore.getState().viewedPosts.includes(id)
      },
      addPendingViewPost: (id: string) => {
        set(state => {
          if (state.pendingViewPosts.includes(id)) return state
          return { pendingViewPosts: [...state.pendingViewPosts, id] }
        })
      },
      getAndClearPendingViewPosts: (): string[] => {
        const posts: string[] = UserSettingsStore.getState().pendingViewPosts
        set(state => ({ pendingViewPosts: [] }))
        return posts
      },
      clearViewedPosts: () => {
        set(state => ({ viewedPosts: [], pendingViewPosts: [] }))
      },

      setUser: user => {
        set({ current: user })
      },
    }),
    {
      name: 'user-settings',
      partialize: state => ({
        ...state,
        mediaUploads: state.mediaUploads.filter(
          upload => upload.status === 'success' && upload.url
        ),
      }),
    }
  )
)

// Вспомогательные функции для конвертации между UploadStatus и StorableUpload
export const uploadToStorable = (upload: UploadStatus): StorableUpload => ({
  id: upload.id,
  progress: upload.progress,
  status: upload.status,
  url: upload.url,
  error: upload.error,
  type: upload.type,
  fileName: upload.file.name,
  fileSize: upload.file.size,
  fileType: upload.file.type,
})

export const storableToUpload = (storable: StorableUpload): UploadStatus => ({
  id: storable.id,
  file: new File([], storable.fileName || 'file', { type: storable.fileType }),
  progress: storable.progress,
  status: storable.status,
  url: storable.url,
  error: storable.error,
  type: storable.type,
})

// export const useUserSettingsStore = createSelectors(UserSettingsStore)
