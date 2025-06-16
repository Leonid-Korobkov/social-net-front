'use client'
import { useUserStore } from '@/store/user.store'
import { usePathname } from 'next/navigation'
import { useStore } from 'zustand'

export function useActiveNavLink(path: string) {
  const pathname = usePathname()
  const currentUser = useStore(useUserStore, state => state.user)

  // Функция для проверки соответствия URL паттерну (замена matchPath из react-router)
  const matchPath = (pattern: string, pathname: string) => {
    if (!pathname) return false

    // Простой вариант для точного совпадения
    if (pattern === pathname) return true

    // Для путей с параметрами (например, /:username)
    const patternSegments = pattern.split('/')
    const pathnameSegments = pathname.split('/')

    if (patternSegments.length !== pathnameSegments.length) return false

    for (let i = 0; i < patternSegments.length; i++) {
      if (patternSegments[i].startsWith(':')) continue // Пропускаем параметры
      if (patternSegments[i] !== pathnameSegments[i]) return false
    }

    return true
  }

  const match = matchPath(path, pathname || '')
  const userProfileMatch = matchPath('/:username', pathname || '')

  // Для профиля пользователя проверяем точное совпадение
  if (
    path === `/${currentUser?.userName}` &&
    pathname === `/${currentUser?.userName}`
  ) {
    return (
      userProfileMatch &&
      !pathname.includes('/following') &&
      !pathname.includes('/followers')
    )
  }

  return !!match
}
