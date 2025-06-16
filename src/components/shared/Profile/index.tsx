'use client'
import ProfileSkeleton from '@/components/ui/ProfileSkeleton'
import { useUserStore } from '@/store/user.store'
import { Card, CardBody, CardHeader } from '@heroui/react'
import Link from 'next/link'
import { useStore } from 'zustand'
import Image from '../../ui/Image'

function Profile() {
  const currentUser = useStore(useUserStore, state => state.user)

  if (!currentUser) {
    return <ProfileSkeleton />
  }
  const { userName, name, avatarUrl } = currentUser

  return (
    <Card className="py-4 w-[302px]">
      <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
        <Image
          alt="Изображение профиля"
          src={avatarUrl}
          width={1000}
          className="w-full min-w-full"
        />
      </CardHeader>
      <CardBody className="overflow-visible py-2">
        <Link href={`/${userName}`}>
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
