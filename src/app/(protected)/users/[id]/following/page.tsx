'use client'
import GoBack from '@/components/layout/GoBack'
import FollowSkeleton from '@/components/ui/FollowSkeleton'
import User from '@/components/ui/User'
import { useCreateFollow, useDeleteFollow } from '@/services/api/follow.api'
import { useGetUserById } from '@/services/api/user.api'
import { useUserStore } from '@/store/user.store'
import { Button, Card, CardBody } from '@heroui/react'
import { AnimatePresence, motion } from 'framer-motion'
import Link from 'next/link'
import { useTopLoader } from 'nextjs-toploader'
import { MouseEvent, use, useRef } from 'react'

interface PageProps {
  params: Promise<{
    id: string
  }>
}

function Following({ params }: PageProps) {
  const unwrappedParams = use(params)
  const { id } = unwrappedParams
  const subscriptionsRef = useRef<HTMLButtonElement | null>(null)
  const topLoader = useTopLoader()

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

  if (isLoading) {
    return <FollowSkeleton />
  }

  if (!user) {
    return <h2>Пользователь не найден</h2>
  }

  return (
    <>
      <GoBack />
      <h1 className="text-2xl font-bold mb-5">
        {currentUser?.id === user.id
          ? 'Мои подписки'
          : `Подписки ${user.userName}`}
      </h1>

      {user.following?.length > 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <AnimatePresence mode="popLayout">
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
                      variablesFollow?.followingId ===
                        followingItem.following.id)
                  : (isPendingFollow &&
                      variablesUnfollow?.followingId ===
                        followingItem.following.id) ||
                    (isPendingUnfollow &&
                      variablesUnfollow?.followingId ===
                        followingItem.following.id)

                const isFetchingUser = !isFollowing
                  ? (isFetching &&
                      variablesFollow?.followingId ===
                        followingItem.following.id) ||
                    (isFetching &&
                      variablesFollow?.followingId ===
                        followingItem.following.id)
                  : (isFetching &&
                      variablesUnfollow?.followingId ===
                        followingItem.following.id) ||
                    (isFetching &&
                      variablesUnfollow?.followingId ===
                        followingItem.following.id)

                return (
                  <motion.div
                    key={followingItem.following.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5, bounce: 0 }}
                    layout="position"
                  >
                    <Link
                      href={`/users/${followingItem.following.id}`}
                      key={followingItem.following.id}
                    >
                      <Card>
                        <CardBody className="flex flex-row items-center justify-between">
                          <User
                            username={followingItem.following.userName ?? ''}
                            avatarUrl={followingItem.following.avatarUrl ?? ''}
                            description={followingItem.following.name ?? ''}
                            className="!justify-start"
                          />

                          {currentUser &&
                            currentUser.id !== followingItem.following.id && (
                              <Button
                                color={isFollowing ? 'default' : 'secondary'}
                                variant="flat"
                                className="gap-2"
                                isLoading={isPending || isFetchingUser}
                                ref={subscriptionsRef}
                                onClick={e => {
                                  handleFollow(
                                    followingItem.following?.id ?? '',
                                    isFollowing
                                  )
                                  e.preventDefault()
                                  e.stopPropagation()
                                  setTimeout(() => {
                                    topLoader.done(true)
                                  }, 0)
                                }}
                              >
                                {isFollowing ? 'Отписаться' : 'Подписаться'}
                              </Button>
                            )}
                        </CardBody>
                      </Card>
                    </Link>
                  </motion.div>
                )
              })}
            </div>
          </AnimatePresence>
        </motion.div>
      ) : (
        <h2>У пользователя нет подписок</h2>
      )}
    </>
  )
}

export default Following
