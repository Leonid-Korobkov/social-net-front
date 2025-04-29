'use client'
import GoBack from '@/components/layout/GoBack'
import User from '@/components/ui/User'
import { useCreateFollow, useDeleteFollow } from '@/services/api/follow.api'
import { useGetUserById } from '@/services/api/user.api'
import { useUserStore } from '@/store/user.store'
import { Button, Card, CardBody, Spinner } from '@heroui/react'
import Link from 'next/link'
import { use } from 'react'

interface PageProps {
  params: Promise<{
    id: string
  }>
}

function Followers({ params }: PageProps) {
  const unwrappedParams = use(params)
  const { id } = unwrappedParams

  const currentUser = useUserStore.use.current()
  const { data: user, isPending: isLoading, isFetching } = useGetUserById(id)

  const {
    mutateAsync: followUser,
    isPending: isPendingFollow,
    variables: variablesFollow,
  } = useCreateFollow()
  const {
    mutateAsync: unfollowUser,
    isPending: isPendingUnfollow,
    variables: variablesUnfollow,
  } = useDeleteFollow()

  const handleFollow = async (followingId: string, isFollowing: boolean) => {
    try {
      if (isFollowing) {
        unfollowUser({ followingId, userId: id })
      } else {
        followUser({ followingId, userId: id })
      }
    } catch (error) {
      console.error(error)
    }
  }

  function onCardClick(
    e: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
    id: string
  ) {
    if (id === 'button') {
      e.preventDefault()
      return
    }
  }

  if (isLoading) {
    return <Spinner />
  }

  if (!user) {
    return <h2>Пользователь не найден</h2>
  }

  return (
    <>
      <GoBack />
      <h1 className="text-2xl font-bold mb-5">
        {currentUser?.id === user.id
          ? 'Мои подписчики'
          : `Подписчики ${user.name}`}
      </h1>
      {user.followers?.length > 0 ? (
        <div className="gap-5 flex flex-col">
          {user.followers.map(followerItem => {
            if (!followerItem.follower) {
              return null
            }

            const isFollowing = followerItem.follower.isFollowing ?? false

            const isPending = !isFollowing
              ? (isPendingFollow &&
                  variablesFollow?.followingId === followerItem.follower.id) ||
                (isPendingUnfollow &&
                  variablesFollow?.followingId === followerItem.follower.id)
              : (isPendingFollow &&
                  variablesUnfollow?.followingId ===
                    followerItem.follower.id) ||
                (isPendingUnfollow &&
                  variablesUnfollow?.followingId === followerItem.follower.id)

            const isFetchingUser = !isFollowing
              ? (isFetching &&
                  variablesFollow?.followingId === followerItem.follower.id) ||
                (isFetching &&
                  variablesFollow?.followingId === followerItem.follower.id)
              : (isFetching &&
                  variablesUnfollow?.followingId ===
                    followerItem.follower.id) ||
                (isFetching &&
                  variablesUnfollow?.followingId === followerItem.follower.id)

            return (
              <Link
                href={`/users/${followerItem.follower.id}`}
                key={followerItem.follower.id}
              >
                <Card>
                  <CardBody className="flex flex-row items-center justify-between">
                    <User
                      name={followerItem.follower.name ?? ''}
                      avatarUrl={followerItem.follower.avatarUrl ?? ''}
                      description={followerItem.follower.email ?? ''}
                      className="!justify-start"
                    />
                    {currentUser &&
                      currentUser.id !== followerItem.follower.id && (
                        <Button
                          color={isFollowing ? 'default' : 'secondary'}
                          variant="flat"
                          className="gap-2"
                          onClick={e => {
                            e.preventDefault()
                            e.stopPropagation()
                          }}
                          isLoading={isPending || isFetchingUser}
                          onPress={e => {
                            handleFollow(
                              followerItem.follower?.id ?? '',
                              isFollowing
                            )
                          }}
                        >
                          {isFollowing ? 'Отписаться' : 'Подписаться'}
                        </Button>
                      )}
                  </CardBody>
                </Card>
              </Link>
            )
          })}
        </div>
      ) : (
        <h2>У пользователя нет подписчиков</h2>
      )}
    </>
  )
}

export default Followers
