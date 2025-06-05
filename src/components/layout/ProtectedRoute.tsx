'use client'

import { useRouter, usePathname } from 'next/navigation'
import { useEffect } from 'react'
import { jwtDecode } from 'jwt-decode'
import Cookies from 'js-cookie'
import { UserSettingsStore } from '@/store/userSettings.store'
import { useStore } from 'zustand'
import { useLogout } from '@/services/api/user.api'
import { UserStore } from '@/store/user.store'
import { useQueryClient } from '@tanstack/react-query'

type ProtectedRouteProps = {
  children: React.ReactNode
  requireEmailVerification?: boolean
}

interface DecodedToken {
  exp: number
  userId: number
}

export default function ProtectedRoute({
  children,
  requireEmailVerification = true,
}: ProtectedRouteProps) {
  const router = useRouter()
  const pathname = usePathname()
  const isAuthPage = pathname.startsWith('/auth')
  const accessToken = Cookies.get('accessToken')
  const isVerificationPage = pathname.startsWith('/verify-email')

  const logoutSettings = useStore(UserSettingsStore, state => state.logout)
  const logout = useStore(UserStore, state => state.logout)
  const currentUser = useStore(UserSettingsStore, state => state.current)

  const queryClient = useQueryClient()

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Проверка токена
        const decodedToken = accessToken
          ? jwtDecode<DecodedToken>(accessToken)
          : null

        const hasValidToken =
          decodedToken && decodedToken.exp * 1000 > Date.now()

        // Если нет токена и это не страница авторизации/верификации, перенаправляем на авторизацию
        if (!hasValidToken && !isAuthPage && !isVerificationPage) {
          logout()
          logoutSettings()
          router.push('/auth')
          queryClient.removeQueries()
          queryClient.clear()
          return
        }

        // Если есть токен и это страница авторизации, перенаправляем на главную
        if (hasValidToken && isAuthPage) {
          router.push('/')
          return
        }

        // Проверка верификации email если требуется
        if (
          requireEmailVerification &&
          currentUser &&
          !currentUser.isEmailVerified &&
          !isVerificationPage &&
          hasValidToken // Добавляем проверку валидности токена
        ) {
          const verificationToken = btoa(`${currentUser.id}_${Date.now()}`)
          router.replace(`/verify-email?token=${verificationToken}`)
          return
        }

        // Если email верифицирован и мы на странице верификации, перенаправляем на главную
        if (currentUser?.isEmailVerified && isVerificationPage) {
          router.replace('/')
          return
        }
      } catch (error) {
        console.error('Auth check error:', error)
        // В случае ошибки, очищаем состояние и перенаправляем на страницу входа
        logout()
        logoutSettings()
        router.push('/auth')
      }
    }

    checkAuth()
  }, [
    isAuthPage,
    isVerificationPage,
    router,
    accessToken,
    requireEmailVerification,
    currentUser,
    logout,
    logoutSettings,
    queryClient,
  ])

  return <>{children}</>
}
