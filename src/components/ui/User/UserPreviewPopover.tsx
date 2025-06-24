import React, { useState } from 'react'
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Avatar,
  Button,
  Skeleton,
} from '@heroui/react'
import Link from 'next/link'
import { useUserStore } from '@/store/user.store'
import { useCreateFollow, useDeleteFollow } from '@/services/api/follow.api'
import { pluralizeRu } from '@/utils/pluralizeRu'
import { formatNumberShort } from '@/utils/formatNumberShort'

interface UserPreviewPopoverProps {
  username?: string
  name?: string
  avatarUrl: string
  description?: string
  followers?: number
  following?: number
  isFollowing?: boolean
  userId?: string
  isLoading?: boolean
}

const UserPreviewPopover: React.FC<UserPreviewPopoverProps> = ({
  username,
  name,
  avatarUrl,
  description,
  followers = 0,
  following = 0,
  isFollowing = false,
  userId,
  isLoading = false,
}) => {
  const currentUser = useUserStore.use.user()
  const { mutateAsync: followUser, isPending: isFollowPending } =
    useCreateFollow()
  const { mutateAsync: unfollowUser, isPending: isUnfollowPending } =
    useDeleteFollow()
  const [localFollowing, setLocalFollowing] = useState(isFollowing)
  const isOwnProfile = currentUser?.userName === username

  const handleFollow = async () => {
    if (!currentUser) return
    if (localFollowing && username) {
      await unfollowUser({
        followingId: userId || username,
        userId: currentUser.id,
      })
      setLocalFollowing(false)
    } else if (username) {
      await followUser({
        followingId: userId || username,
        userId: currentUser.id,
      })
      setLocalFollowing(true)
    }
  }

  return (
    <Card
      className="max-w-[280px] min-w-[250px] border-none bg-transparent"
      shadow="none"
    >
      <CardHeader className="justify-between items-start">
        <div className="flex gap-3 flex-col">
          {isLoading ? (
            <Skeleton className="w-14 h-14 rounded-full" />
          ) : (
            <Avatar isBordered radius="full" size="lg" src={avatarUrl} />
          )}
          <div className="flex flex-col items-start justify-center min-w-0">
            {isLoading ? (
              <>
                <Skeleton className="h-4 w-24 mb-1 rounded-lg" />
                <Skeleton className="h-3 w-16 rounded-lg" />
              </>
            ) : (
              <>
                <h4 className="text-medium font-semibold leading-none text-default-600 truncate max-w-[160px]">
                  {name || username}
                </h4>
                <h5 className="text-small tracking-tight text-default-500 truncate max-w-[160px]">
                  @{username}
                </h5>
              </>
            )}
          </div>
        </div>
        {isLoading && <Skeleton className="h-8 w-24 rounded-full " />}
        {!isOwnProfile && currentUser && !isLoading && (
          <Button
            className={
              localFollowing
                ? 'bg-transparent text-foreground border-default-200'
                : ''
            }
            color="primary"
            radius="full"
            size="sm"
            variant={localFollowing ? 'bordered' : 'solid'}
            onPress={handleFollow}
            isLoading={isFollowPending || isUnfollowPending}
            disabled={isFollowPending || isUnfollowPending}
          >
            {localFollowing ? 'Отписаться' : 'Подписаться'}
          </Button>
        )}
      </CardHeader>
      <CardBody className="px-3 py-0">
        {isLoading ? (
          <>
            <Skeleton className="h-4 w-full rounded-lg mt-2" />
            <Skeleton className="h-4 w-40 rounded-lg mt-2" />
          </>
        ) : (
          description && (
            <p className="text-small pl-px text-default-500">{description}</p>
          )
        )}
      </CardBody>
      <CardFooter className="gap-3">
        {isLoading ? (
          <>
            <Skeleton className="h-6 w-24 rounded-lg" />
            <Skeleton className="h-6 w-24 rounded-lg" />
          </>
        ) : (
          <>
            <Link
              href={`/${username}/following`}
              className="flex gap-1 hover:underline"
            >
              <p className="font-semibold text-default-600 text-small">
                {formatNumberShort(following)}
              </p>
              <p className=" text-default-500 text-small">
                {pluralizeRu(following, ['подписка', 'подписки', 'подписок'])}
              </p>
            </Link>
            <Link
              href={`/${username}/followers`}
              className="flex gap-1 hover:underline"
            >
              <p className="font-semibold text-default-600 text-small">
                {formatNumberShort(followers)}
              </p>
              <p className="text-default-500 text-small">
                {pluralizeRu(followers, [
                  'подписчик',
                  'подписчика',
                  'подписчиков',
                ])}
              </p>
            </Link>
          </>
        )}
      </CardFooter>
    </Card>
  )
}

export default UserPreviewPopover
