'use client'

import { useRouter, usePathname } from 'next/navigation'
import { useEffect } from 'react'
import { useUserStore } from '@/store/user.store'
import Cookies from 'js-cookie'

type ProtectedRouteProps = {
  children: React.ReactNode
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const router = useRouter()
  const pathname = usePathname()
  const isAuthPage = pathname.startsWith('/auth')
  const token = Cookies.get('token')
  const logout = useUserStore.use.logout

  useEffect(() => {
    // Если нет токена и это не страница авторизации, перенаправляем на авторизацию
    if (!token && !isAuthPage) {
      router.push('/auth')
    }

    // Если есть токен и это страница авторизации, перенаправляем на главную
    if (token && isAuthPage) {
      router.push('/')
    }
  }, [token, isAuthPage, router])

  // Если нет токена и это не страница авторизации, не показываем детей (предотвращаем кратковременное отображение контента)
  if (!token && !isAuthPage) {
    logout()
    return null
  }

  // Если есть токен и это страница авторизации, не показываем детей
  if (token && isAuthPage) {
    return null
  }

  return <>{children}</>
}
