'use client'

import { useRouter, usePathname } from 'next/navigation'
import { useEffect } from 'react'
import { useUserStore } from '@/store/user.store'
import { jwtDecode } from 'jwt-decode'
import Cookies from 'js-cookie'
import { UserSettingsStore } from '@/store/userSettings.store'
import { useStore } from 'zustand'

type ProtectedRouteProps = {
  children: React.ReactNode
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const router = useRouter()
  const pathname = usePathname()
  const isAuthPage = pathname.startsWith('/auth')
  const token = Cookies.get('token')

  const logout = useUserStore(state => state.logout)
  const logoutSettings = useStore(UserSettingsStore, state => state.logout)

  useEffect(() => {
    // Проверка токена
    const decodedToken = token != null ? jwtDecode(token) : null

    // Если нет токена и это не страница авторизации, перенаправляем на авторизацию
    if (!decodedToken && !isAuthPage) {
      logout()
      logoutSettings()
      router.push('/auth')
    }

    // Если есть токен и это страница авторизации, перенаправляем на главную
    if (decodedToken && isAuthPage) {
      router.push('/')
    }
  }, [isAuthPage, router])

  return <>{children}</>
}
