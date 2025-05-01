'use client'
import { useModalsStore } from '@/store/modals.store'
import EditProfile from '../../components/shared/EditProfile'
import SettingsProfile from '../../components/shared/SettingsProfile'
import { useGetUserById } from '@/services/api/user.api'
import { useUserStore } from '@/store/user.store'

export default function ModalsProvider() {
  const {
    isEditProfileOpen,
    isSettingsOpen,
    userId,
    closeEditProfile,
    closeSettings,
  } = useModalsStore()
  const user = useUserStore.use.current()

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
