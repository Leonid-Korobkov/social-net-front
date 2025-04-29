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

function Following({ params }: PageProps) {
  const unwrappedParams = use(params)
  const { id } = unwrappedParams

  const currentUser = useUserStore.use.current()
  const { data: user, isPending: isLoading } = useGetUserById(id)

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
        {currentUser?.id === user.id ? 'Мои подписки' : `Подписки ${user.name}`}
      </h1>
      {user.following?.length > 0 ? (
        <div className="gap-5 flex flex-col">
          {user.following.map(followingItem => {
            if (!followingItem.following) {
              return null
            }

            const isFollowing = followingItem.following.isFollowing ?? false

            const isPending = !isFollowing
              ? (isPendingFollow &&
                  variablesFollow?.followingId ===
                    followingItem.following.id) ||
                (isPendingUnfollow &&
                  variablesFollow?.followingId === followingItem.following.id)
              : (isPendingFollow &&
                  variablesUnfollow?.followingId ===
                    followingItem.following.id) ||
                (isPendingUnfollow &&
                  variablesUnfollow?.followingId === followingItem.following.id)

            return (
              <Link
                href={`/users/${followingItem.following.id}`}
                key={followingItem.following.id}
              >
                <Card>
                  <CardBody className="flex flex-row items-center justify-between">
                    <User
                      name={followingItem.following.name ?? ''}
                      avatarUrl={followingItem.following.avatarUrl ?? ''}
                      description={followingItem.following.email ?? ''}
                      className="!justify-start"
                    />

                    {currentUser &&
                      currentUser.id !== followingItem.following.id && (
                        <Button
                          color={isFollowing ? 'default' : 'secondary'}
                          variant="flat"
                          className="gap-2"
                          isLoading={isPending}
                          onClick={e => {
                            e.preventDefault()
                            handleFollow(
                              followingItem.following?.id ?? '',
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
        <h2>У пользователя нет подписок</h2>
      )}
    </>
  )
}

export default Following
