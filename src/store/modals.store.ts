import { create } from 'zustand'

interface ModalsStore {
  isEditProfileOpen: boolean
  isSettingsOpen: boolean
  userId: string | null
  openEditProfile: (userId: string) => void
  openSettings: (userId: string) => void
  closeEditProfile: () => void
  closeSettings: () => void
}

export const useModalsStore = create<ModalsStore>(set => ({
  isEditProfileOpen: false,
  isSettingsOpen: false,
  userId: null,
  openEditProfile: userId => set({ isEditProfileOpen: true, userId }),
  openSettings: userId => set({ isSettingsOpen: true, userId }),
  closeEditProfile: () => set({ isEditProfileOpen: false, userId: null }),
  closeSettings: () => set({ isSettingsOpen: false, userId: null }),
}))
