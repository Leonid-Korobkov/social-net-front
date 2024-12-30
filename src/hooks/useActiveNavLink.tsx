import React from 'react'
import { useSelector } from 'react-redux'
import { matchPath, useLocation } from 'react-router-dom'
import { selectCurrent } from '../features/user/user.slice'

export function useActiveNavLink(path: string) {
  const location = useLocation()
  const currentUser = useSelector(selectCurrent)

  const match = matchPath(path, location.pathname)
  const userProfileMatch = matchPath('/users/:id', location.pathname)

  // Для профиля пользователя проверяем точное совпадение
  if (
    path === `/users/${currentUser?.id}` &&
    location.pathname === `/users/${currentUser?.id}`
  ) {
    return (
      userProfileMatch &&
      !location.pathname.includes('/following') &&
      !location.pathname.includes('/followers')
    )
  }

  return !!match
}
