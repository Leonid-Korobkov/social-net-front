'use client'
import { useSelector } from 'react-redux'
import { selectCurrent } from '@/features/user/user.slice'
import { Button, Card, CardBody, Spinner } from '@heroui/react'
import User from '@/components/ui/User'
import { useGetUserByIdQuery } from '@/store/services/user.api'
import GoBack from '@/components/layout/GoBack'
import {
  useCreateFollowMutation,
  useDeleteFollowMutation,
} from '@/store/services/follow.api'
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

  const currentUser = useSelector(selectCurrent)
  const { data: user, isLoading } = useGetUserByIdQuery(
    { id: id ?? '' },
    { skip: !id }
  )
  const [followUser] = useCreateFollowMutation()
  const [unfollowUser] = useDeleteFollowMutation()

  const handleFollow = async (followingId: string, isFollowing: boolean) => {
    try {
      if (isFollowing) {
        unfollowUser({ followingId }).unwrap()
      } else {
        followUser({ followingId }).unwrap()
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
