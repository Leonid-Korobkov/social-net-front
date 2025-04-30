'use client'
import GoBack from '@/components/layout/GoBack'
import User from '@/components/ui/User'
import { useCreateFollow, useDeleteFollow } from '@/services/api/follow.api'
import { useGetUserById } from '@/services/api/user.api'
import { useUserStore } from '@/store/user.store'
import { Button, Card, CardBody, Spinner } from '@heroui/react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useTopLoader } from 'nextjs-toploader'
import { use } from 'react'

interface PageProps {
  params: Promise<{
    id: string
  }>
}

function Followers({ params }: PageProps) {
  const unwrappedParams = use(params)
  const { id } = unwrappedParams
  const loader = useTopLoader()
  const router = useRouter()

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
          : `Подписчики ${user.userName}`}
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
              // <div
              //   onClick={e => {
              //     if (followerItem.follower) {
              //       router.push(`/users/${followerItem.follower.id}`)
              //     }
              //   }}
              //   key={followerItem.follower.id}
              // >
              <Link
                href={`/users/${followerItem.follower.id}`}
                key={followerItem.follower.id}
              >
                <Card>
                  <CardBody className="flex flex-row items-center justify-between">
                    <User
                      username={followerItem.follower.userName ?? ''}
                      avatarUrl={followerItem.follower.avatarUrl ?? ''}
                      description={followerItem.follower.name ?? ''}
                      className="!justify-start"
                    />
                    {currentUser &&
                      currentUser.id !== followerItem.follower.id && (
                        <Button
                          color={isFollowing ? 'default' : 'secondary'}
                          variant="flat"
                          className="gap-2"
                          isLoading={isPending || isFetchingUser}
                          onClick={e => {
                            e.preventDefault()
                            e.stopPropagation()
                            handleFollow(
                              followerItem.follower?.id ?? '',
                              isFollowing
                            )
                          }}
                          onMouseDown={e => {
                            e.preventDefault()
                            e.stopPropagation()
                          }}
                          onMouseUp={e => {
                            e.preventDefault()
                            e.stopPropagation()
                          }}
                          onPointerDown={e => {
                            e.preventDefault()
                            e.stopPropagation()
                          }}
                          onPointerUp={e => {
                            e.preventDefault()
                            e.stopPropagation()
                          }}
                        >
                          {isFollowing ? 'Отписаться' : 'Подписаться'}
                        </Button>
                      )}
                  </CardBody>
                </Card>
              </Link>
              // </div>
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
