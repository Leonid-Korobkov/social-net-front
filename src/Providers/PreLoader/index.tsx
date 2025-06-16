'use client'
import { useSessions } from '@/hooks/useSessions'
import { useGetCurrentUser } from '@/services/api/user.api'
import { useUserStore } from '@/store/user.store'
import { UserSettingsStore } from '@/store/userSettings.store'
import { useEffect } from 'react'

function PreLoader() {
  const { error, data: user, isLoading, isSuccess } = useGetCurrentUser()
  const setError = useUserStore(state => state.setError)

  // Обрабатываем ошибки, кроме 401 (неавторизован)
  useEffect(() => {
    if (error && error.status !== 401) {
      setError(error.errorMessage)
    }
    if (isSuccess && user) {
      useUserStore.setState({ user })
      UserSettingsStore.setState({
        reduceAnimation: user.reduceAnimation,
      })
    }

    useUserStore.setState({ isLoadingUser: isLoading })
  }, [error, setError, user, isLoading, isSuccess])

  useSessions()

  return <></>
}

export default PreLoader
