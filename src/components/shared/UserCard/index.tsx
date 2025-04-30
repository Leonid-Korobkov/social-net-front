'use client'
import { Card, CardBody, Avatar } from '@heroui/react'
import { User } from '@/store/types'
import Link from 'next/link'

interface UserCardProps {
  user: User
}

function UserCard({ user }: UserCardProps) {
  return (
    <Card>
      <CardBody className="flex flex-row items-center gap-4">
        <Link href={`/users/${user.id}`}>
          <Avatar src={user.avatarUrl} name={user.userName} size="lg" />
        </Link>
        <div className="flex flex-col">
          <Link
            href={`/users/${user.id}`}
            className="text-lg font-semibold hover:text-primary transition-colors"
          >
            {user.userName}
          </Link>
          <p className="text-default-500">{user.email}</p>
          {user.bio && (
            <p className="text-sm text-default-400 line-clamp-2">{user.bio}</p>
          )}
        </div>
      </CardBody>
    </Card>
  )
}

export default UserCard
