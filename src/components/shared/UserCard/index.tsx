'use client'
import { Card, CardBody, Avatar, Chip } from '@heroui/react'
import { User } from '@/store/types'
import Link from 'next/link'
import { pluralizeRu } from '@/utils/pluralizeRu'
import { RiUserFollowFill } from 'react-icons/ri'

interface UserCardProps {
  user: User
  className?: string
}

function UserCard({ user, className }: UserCardProps) {
  return (
    <>
      <Link href={`/users/${user.userName}`} className={className}>
        <Card>
          <CardBody className="flex flex-row items-center gap-4">
            <div>
              <Avatar src={user.avatarUrl} name={user.userName} size="md" />
            </div>
            <div className="flex flex-col w-full">
              <div className="text-sm font-semibold flex justify-between items-center">
                <span>@{user.userName}</span>
                {user.isFollowing && (
                  <Chip size='sm' color="success" variant="flat" className="opacity-65">
                    <RiUserFollowFill />
                  </Chip>
                )}
              </div>
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
