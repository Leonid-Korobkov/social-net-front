'use client'
import { Card, CardHeader, CardBody, Image as NextImage } from '@heroui/react'
import Link from 'next/link'
import { MdAlternateEmail } from 'react-icons/md'
import Image from '../../ui/Image'
import { useUserStore } from '@/store/user.store'

function Profile() {
  const currentUser = useUserStore.use.current()

  if (!currentUser) {
    return <p>Не найден</p>
  }
  const { name, email, avatarUrl, id } = currentUser

  return (
    <Card className="py-4 w-[302px]">
      <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
        <Image
          alt="Изображение профиля"
          src={`${avatarUrl}`}
          className="w-full"
        />
      </CardHeader>
      <CardBody className="overflow-visible py-2">
        <Link href={`/users/${id}`}>
          <h4 className="font-bold text-large mb-2">{name}</h4>
        </Link>
        <p className="text-default-500 flex items-center gap-2 font-mono">
          <MdAlternateEmail />
          {email}
        </p>
      </CardBody>
    </Card>
  )
}

export default Profile
