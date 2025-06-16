'use client'
import { useModalsStore } from '@/store/modals.store'
import { useStore } from 'zustand'
import EditProfile from '../../components/shared/EditProfile'
import SettingsProfile from '../../components/shared/SettingsProfile'
import { useUserStore } from '@/store/user.store'
import SessionTerminationModal from '@/components/sessions/SessionTerminationModal'

export default function ModalsProvider() {
  const {
    isEditProfileOpen,
    isSettingsOpen,
    isSessionTerminationOpen,
    userId,
    closeEditProfile,
    closeSettings,
    closeSessionTermination,
  } = useModalsStore()

  const user = useStore(useUserStore, state => state.user)

  return (
    <>
      <SessionTerminationModal
        isOpen={isSessionTerminationOpen}
        onClose={closeSessionTermination}
        title="Эта сессия была завершена с другого устройства"
        message="Ваша сессия истекла, пожалуйста, войдите снова"
      />
      {userId && (
        <EditProfile
          isOpen={isEditProfileOpen}
          onClose={closeEditProfile}
          user={user}
          params={{
            id: userId,
          }}
        />
      )}
      {userId && (
        <SettingsProfile
          isOpen={isSettingsOpen}
          onClose={closeSettings}
          user={user}
          params={{
            id: userId,
          }}
        />
      )}
    </>
  )
}
