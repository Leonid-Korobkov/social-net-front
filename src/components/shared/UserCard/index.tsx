'use client'
import { Card, CardBody, Avatar } from '@heroui/react'
import { User } from '@/store/types'
import Link from 'next/link'
import { pluralizeRu } from '@/utils/pluralizeRu'

interface UserCardProps {
  user: User & { _count: { followers: number } }
}

function UserCard({ user }: UserCardProps) {
  return (
    <>
      <Link href={`/users/${user.userName}`}>
        <Card>
          <CardBody className="flex flex-row items-center gap-4">
            <div>
              <Avatar src={user.avatarUrl} name={user.userName} size="md" />
            </div>
            <div className="flex flex-col">
              <p className="text-sm font-semibold">@{user.userName}</p>
              <p className="text-default-500 text-xs">
                {user.name} - {user._count.followers}{' '}
                {pluralizeRu(user._count.followers, [
                  'подписчик',
                  'подписчика',
                  'подписчиков',
                ])}
              </p>
              {user.bio && (
                <p className="text-sm text-default-400 line-clamp-2 text-xs">
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
