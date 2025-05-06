'use client'
import { UserSettingsStore } from '@/store/userSettings.store'
import { Card, CardBody, CardHeader } from '@heroui/react'
import Link from 'next/link'
import Image from '../../ui/Image'
import ProfileSkeleton from '@/components/ui/ProfileSkeleton'
import { useStore } from 'zustand'

function Profile() {
  const currentUser = useStore(UserSettingsStore, state => state.current)

  if (!currentUser) {
    return <ProfileSkeleton />
  }
  const { userName, name, avatarUrl, id } = currentUser

  return (
    <Card className="py-4 w-[302px]">
      <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
        <Image
          alt="Изображение профиля"
          src={`${avatarUrl}`}
          className="w-full min-w-full"
        />
      </CardHeader>
      <CardBody className="overflow-visible py-2">
        <Link href={`/users/${id}`}>
          <h4 className="font-bold text-large mb-2">@{userName}</h4>
        </Link>
        <p className="text-default-500 gap-2 font-mono">
          <span>{name}</span>
        </p>
      </CardBody>
    </Card>
  )
}

export default Profile
