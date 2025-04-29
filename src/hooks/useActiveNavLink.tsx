'use client'
import { useUserStore } from '@/store/user.store'
import { usePathname } from 'next/navigation'

export function useActiveNavLink(path: string) {
  const pathname = usePathname()
  const currentUser = useUserStore.use.current()

  // Функция для проверки соответствия URL паттерну (замена matchPath из react-router)
  const matchPath = (pattern: string, pathname: string) => {
    if (!pathname) return false

    // Простой вариант для точного совпадения
    if (pattern === pathname) return true

    // Для путей с параметрами (например, /users/:id)
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
  const userProfileMatch = matchPath('/users/:id', pathname || '')

  // Для профиля пользователя проверяем точное совпадение
  if (
    path === `/users/${currentUser?.id}` &&
    pathname === `/users/${currentUser?.id}`
  ) {
    return (
      userProfileMatch &&
      !pathname.includes('/following') &&
      !pathname.includes('/followers')
    )
  }

  return !!match
}
