'use client'
import GoBack from '@/components/layout/GoBack'
import FollowSkeleton from '@/components/ui/FollowSkeleton'
import User from '@/components/ui/User'
import { useCreateFollow, useDeleteFollow } from '@/services/api/follow.api'
import { useGetUserById } from '@/services/api/user.api'
import { UserSettingsStore } from '@/store/userSettings.store'
import { pluralizeRu } from '@/utils/pluralizeRu'
import { Button, Card, CardBody } from '@heroui/react'
import { AnimatePresence, motion } from 'framer-motion'
import Link from 'next/link'
import { useTopLoader } from 'nextjs-toploader'
import { use, useRef } from 'react'
import { useStore } from 'zustand'

type PageProps = {
  params: Promise<{ username: string }>
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>
}

function FollowersClient({ params }: PageProps) {
  const { username: id } = use(params)

  const currentUser = useStore(UserSettingsStore, state => state.current)
  const { data: user, isPending: isLoading, isFetching } = useGetUserById(id)

  const subscriptionsRef = useRef<HTMLButtonElement | null>(null)
  const topLoader = useTopLoader()

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
          ? 'Мои подписчики'
          : `Подписчики ${user.userName}`}
      </h1>
      {user.followers?.length > 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <AnimatePresence mode="popLayout">
            <div className="gap-5 flex flex-col">
              {user.followers.map(followerItem => {
                if (!followerItem.follower) {
                  return null
                }

                const isFollowing = followerItem.follower.isFollowing ?? false

                const isPending = !isFollowing
                  ? (isPendingFollow &&
                      variablesFollow?.followingId ===
                        followerItem.follower.id) ||
                    (isPendingUnfollow &&
                      variablesFollow?.followingId === followerItem.follower.id)
                  : (isPendingFollow &&
                      variablesUnfollow?.followingId ===
                        followerItem.follower.id) ||
                    (isPendingUnfollow &&
                      variablesUnfollow?.followingId ===
                        followerItem.follower.id)

                const isFetchingUser = !isFollowing
                  ? (isFetching &&
                      variablesFollow?.followingId ===
                        followerItem.follower.id) ||
                    (isFetching &&
                      variablesFollow?.followingId === followerItem.follower.id)
                  : (isFetching &&
                      variablesUnfollow?.followingId ===
                        followerItem.follower.id) ||
                    (isFetching &&
                      variablesUnfollow?.followingId ===
                        followerItem.follower.id)

                return (
                  <Link
                    href={`/${followerItem.follower.userName}`}
                    key={followerItem.follower.id}
                  >
                    <Card>
                      <CardBody className="flex flex-row items-center justify-between">
                        <User
                          username={followerItem.follower.userName ?? ''}
                          avatarUrl={followerItem.follower.avatarUrl ?? ''}
                          description={`${followerItem.follower.name} - ${
                            followerItem.follower._count.followers
                          }
                          ${pluralizeRu(
                            followerItem.follower._count.followers,
                            ['подписчик', 'подписчика', 'подписчиков']
                          )}`}
                          className="!justify-start"
                        />
                        {currentUser &&
                          currentUser.id !== followerItem.follower.id && (
                            <Button
                              color={isFollowing ? 'default' : 'primary'}
                              variant="flat"
                              className="gap-2"
                              isLoading={isPending || isFetchingUser}
                              ref={subscriptionsRef}
                              onClick={e => {
                                handleFollow(
                                  followerItem.follower?.id ?? '',
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
                )
              })}
            </div>
          </AnimatePresence>
        </motion.div>
      ) : (
        <h2>У пользователя нет подписчиков</h2>
      )}
    </>
  )
}

export default FollowersClient
