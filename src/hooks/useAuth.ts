import { useUserStore } from '@/store/user.store'
import { useStore } from 'zustand'
import { useLogout } from '@/services/api/user.api'
import { useSessionStore } from '@/store/sessionStore'
import { UserSettingsStore } from '@/store/userSettings.store'
import Cookies from 'js-cookie'
import { useQueryClient } from '@tanstack/react-query'

export const useAuth = () => {
  const user = useStore(useUserStore, state => state.user)
  const isLoadingUser = useStore(useUserStore, state => state.isLoadingUser)
  const isAuthenticated = !!user

  const { mutateAsync: logout } = useLogout()
  const logoutSettings = useStore(UserSettingsStore, state => state.logout)
  const logoutUser = useStore(useUserStore, state => state.logout)
  const disconnectSocket = useStore(
    useSessionStore,
    state => state.disconnectSocket
  )
  const queryClient = useQueryClient()

  const handleLogout = async () => {
    logoutSettings()
    logoutUser()
    await logout()
    disconnectSocket()
    queryClient.removeQueries()
    queryClient.clear()
    Cookies.remove('sessionId')
  }
  return {
    user,
    isAuthenticated,
    isLoadingUser,
    handleLogout,
  }
}
