'use client'
import EditProfile from '@/components/shared/EditProfile'
import { useUserStore } from '@/store/user.store'
import { useRouter } from 'next/navigation'
import GoBack from '@/components/layout/GoBack'
import { use } from 'react'

type PageProps = {
  params: Promise<{ username: string }>
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>
}

function EditProfileClient({ params }: PageProps) {
  const { username } = use(params)
  const currentUser = useUserStore(state => state.user)
  const router = useRouter()

  // Если пользователь не авторизован — редирект на логин
  if (!currentUser) {
    if (typeof window !== 'undefined') router.push('/auth')
    return null
  }

  // Если username не совпадает с текущим пользователем — редирект на свой edit
  if (username !== currentUser.userName) {
    if (typeof window !== 'undefined')
      router.push(`/${currentUser.userName}/edit`)
    return null
  }

  return (
    <>
      <GoBack />
      <h1 className="text-2xl font-bold mb-5">Редактирование профиля</h1>
      <EditProfile user={currentUser} />
    </>
  )
}
export default EditProfileClient
