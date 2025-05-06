'use client'
import { useModalsStore } from '@/store/modals.store'
import EditProfile from '../../components/shared/EditProfile'
import SettingsProfile from '../../components/shared/SettingsProfile'
import { UserSettingsStore } from '@/store/userSettings.store'
import { useStore } from 'zustand'

export default function ModalsProvider() {
  const {
    isEditProfileOpen,
    isSettingsOpen,
    userId,
    closeEditProfile,
    closeSettings,
  } = useModalsStore()
  const user = useStore(UserSettingsStore, state => state.current)

  if (!userId) return null

  return (
    <>
      <EditProfile
        isOpen={isEditProfileOpen}
        onClose={closeEditProfile}
        user={user}
        params={{
          id: userId,
        }}
      />
      <SettingsProfile
        isOpen={isSettingsOpen}
        onClose={closeSettings}
        user={user}
        params={{
          id: userId,
        }}
      />
    </>
  )
}
