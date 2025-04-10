'use client'
import { useSelector } from 'react-redux'
import { Card, CardHeader, CardBody, Image as NextImage } from '@heroui/react'
import { selectCurrent } from '../../../features/user/user.slice'
import Link from 'next/link'
import { MdAlternateEmail } from 'react-icons/md'
import Image from '../../ui/Image'

function Profile() {
  const current = useSelector(selectCurrent)

  if (!current) {
    return <p>Не найден</p>
  }
  const { name, email, avatarUrl, id } = current

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
