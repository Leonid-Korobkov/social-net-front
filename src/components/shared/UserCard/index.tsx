'use client'
import { Card, CardBody, Avatar } from '@heroui/react'
import { User } from '@/store/types'
import Link from 'next/link'

interface UserCardProps {
  user: User
}

function UserCard({ user }: UserCardProps) {
  return (
    <>
      <Link href={`/users/${user.userName}`}>
        <Card>
          <CardBody className="flex flex-row items-center gap-4">
            <div>
              <Avatar src={user.avatarUrl} name={user.userName} size="lg" />
            </div>
            <div className="flex flex-col">
              <p className="text-lg font-semibold">@{user.userName}</p>
              <p className="text-default-500">{user.name}</p>
              {user.bio && (
                <p className="text-sm text-default-400 line-clamp-2">
                  {user.bio}
                </p>
              )}
            </div>
          </CardBody>
        </Card>
      </Link>
    </>
  )
}

export default UserCard
