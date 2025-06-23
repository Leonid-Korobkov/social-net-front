'use client'
import { BACKEND_URL_FOR_WEBPUSH } from '@/app/constants'
import { useSessions } from '@/hooks/useSessions'
import { useGetCurrentUser } from '@/services/api/user.api'
import { useUserStore } from '@/store/user.store'
import { UserSettingsStore } from '@/store/userSettings.store'
import axios from 'axios'
import { useEffect } from 'react'
import { User } from '@/store/types'

function urlBase64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')
  const rawData = atob(base64)
  const outputArray = new Uint8Array(rawData.length)
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i)
  }
  return outputArray
}

async function subscribeUserToPush() {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) return
  try {
    const reg = await navigator.serviceWorker.register('/sw.js')

    const data = await axios.get(`/apis/push/public-key`)

    let subscription = await reg.pushManager.getSubscription()
    if (!subscription) {
      subscription = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(data.data.publicKey),
      })
    }
    if (subscription) {
      await axios.post(`/apis/push/subscribe`, subscription, {
        withCredentials: true,
      })
    }
  } catch (e) {
    console.error('Ошибка при подписке на push', e)
  }
}

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
      // Push-уведомления: подписка или отписка
      if (user.enablePushNotifications) {
        subscribeUserToPush()
      } else {
        // Если выключено — отписываем
        if ('serviceWorker' in navigator) {
          navigator.serviceWorker.ready.then(async reg => {
            const subscription = await reg.pushManager.getSubscription()
            if (subscription) {
              await axios.post(
                `/apis/push/unsubscribe`,
                { endpoint: subscription.endpoint },
                { withCredentials: true }
              )
              await subscription.unsubscribe()
            }
          })
        }
      }
    }

    useUserStore.setState({ isLoadingUser: isLoading })
  }, [error, setError, user, isLoading, isSuccess])

  useSessions()

  return <></>
}

export default PreLoader
