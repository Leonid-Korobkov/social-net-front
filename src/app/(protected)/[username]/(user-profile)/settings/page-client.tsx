'use client'
import SettingsProfile from '@/components/shared/SettingsProfile'
import { useUserStore } from '@/store/user.store'
import { useRouter } from 'next/navigation'
import GoBack from '@/components/layout/GoBack'
import { use } from 'react'

type PageProps = {
  params: Promise<{ username: string }>
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>
}

export default function SettingsProfileClient({ params }: PageProps) {
  const { username } = use(params)
  const currentUser = useUserStore(state => state.user)
  const router = useRouter()

  // Если пользователь не авторизован — редирект на логин
  if (!currentUser) {
    if (typeof window !== 'undefined') router.push('/auth')
    return null
  }

  // Если username не совпадает с текущим пользователем — редирект на свои settings
  if (username !== currentUser.userName) {
    if (typeof window !== 'undefined')
      router.push(`/${currentUser.userName}/settings`)
    return null
  }

  return (
    <>
      <GoBack />
      <h1 className="text-2xl font-bold mb-5">Настройки</h1>
      <SettingsProfile user={currentUser} />
    </>
  )
}
