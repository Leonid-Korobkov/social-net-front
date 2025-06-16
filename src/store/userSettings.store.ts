import { createStore } from 'zustand'
import { persist } from 'zustand/middleware'
import { MediaType } from './types'

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

// Интерфейс только для данных состояния
interface UserSettingsDataState {
  reduceAnimation: boolean
  searchText: string
  searchActiveTab: string
  feedType: string
  postText: string
  mediaUploads: StorableUpload[]
  viewedPosts: string[]
  pendingViewPosts: string[]
}

// Начальные данные состояния
const initialSettingsData: UserSettingsDataState = {
  reduceAnimation: false,
  searchText: '',
  searchActiveTab: 'posts',
  feedType: 'for-you',
  postText: '',
  mediaUploads: [],
  viewedPosts: [],
  pendingViewPosts: [],
}

// Интерфейс для действий + полный тип состояния
export interface UserSettingsStoreState extends UserSettingsDataState {
  setReduceAnimation: (bool: boolean) => void
  setSearchText: (str: string) => void
  setSearchActiveTab: (tab: string) => void
  setFeedType: (type: string) => void
  setPostText: (str: string) => void
  reset: () => void
  setMediaUploads: (uploads: StorableUpload[]) => void
  resetMediaUploads: () => void
  logout: () => void
  addViewedPost: (id: string) => void
  wasPostViewed: (id: string) => boolean
  addPendingViewPost: (id: string) => void
  getAndClearPendingViewPosts: () => string[]
  clearViewedPosts: () => void
}

export const UserSettingsStore = createStore<UserSettingsStoreState>()(
  persist(
    (set, get) => ({
      ...initialSettingsData,

      setReduceAnimation: (bool: boolean) => {
        set({ reduceAnimation: bool })
      },
      setSearchText: (str: string) => {
        set({ searchText: str })
      },
      setSearchActiveTab: (tab: string) => {
        set({ searchActiveTab: tab })
      },
      setFeedType: (type: string) => {
        set({ feedType: type })
      },
      setPostText: (str: string) => {
        set({ postText: str })
      },
      reset: () => set({ postText: '' }),
      setMediaUploads: (uploads: StorableUpload[]) => {
        set({ mediaUploads: uploads })
      },
      resetMediaUploads: () => set({ mediaUploads: [] }),

      logout: () => {
        set(initialSettingsData)
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
        const posts: string[] = get().pendingViewPosts
        set({ pendingViewPosts: [] })
        return posts
      },
      clearViewedPosts: () => {
        set({ viewedPosts: [], pendingViewPosts: [] })
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
