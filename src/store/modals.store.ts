import { create } from 'zustand'

interface ModalsStore {
  isEditProfileOpen: boolean
  isSettingsOpen: boolean
  isSessionTerminationOpen: boolean
  userId: string | null

  openEditProfile: (userId: string) => void
  openSettings: (userId: string) => void
  openSessionTermination: () => void

  closeEditProfile: () => void
  closeSettings: () => void
  closeSessionTermination: () => void
}

export const useModalsStore = create<ModalsStore>(set => ({
  isEditProfileOpen: false,
  isSettingsOpen: false,
  isSessionTerminationOpen: false,
  userId: null,

  openEditProfile: userId => set({ isEditProfileOpen: true, userId }),
  openSettings: userId => set({ isSettingsOpen: true, userId }),
  openSessionTermination: () => {
    console.log('openSessionTermination')
    set({ isSessionTerminationOpen: true })
  },

  closeEditProfile: () => set({ isEditProfileOpen: false, userId: null }),
  closeSettings: () => set({ isSettingsOpen: false, userId: null }),
  closeSessionTermination: () => set({ isSessionTerminationOpen: false }),
}))
