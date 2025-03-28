import { useSelector } from 'react-redux'
import { selectCurrent } from '../../features/user/user.slice'
import { Link, useParams } from 'react-router-dom'
import { Button, Card, CardBody, Spinner } from "@heroui/react"
import User from '../../components/ui/User'
import OpenGraphMeta from '../../components/shared/OpenGraphMeta'
import { APP_URL } from '../../constants'
import { useGetUserByIdQuery } from '../../app/services/user.api'
import GoBack from '../../components/shared/GoBack'
import {
  useCreateFollowMutation,
  useDeleteFollowMutation,
} from '../../app/services/follow.api'

function Followers() {
  const { id } = useParams<{ id: string }>()
  const currentUser = useSelector(selectCurrent)
  const { data: user, isLoading } = useGetUserByIdQuery(
    { id: id ?? '' },
    { skip: !id },
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

  function onCardClick(
    e: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
    id: string,
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
      <OpenGraphMeta
        title={`Подписчики | ${user.name} | Zling`}
        description={`Подписчики пользователя ${user.name}`}
        url={`${APP_URL}/users/${user.id}/followers`}
        image={user.avatarUrl ?? ''}
        siteName="Zling"
        type="profile"
      />
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

            return (
              <Link
                to={`/users/${followerItem.follower.id}`}
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
                        }
                        }
                          onPress={e => {
                            handleFollow(
                              followerItem.follower?.id ?? '',
                              isFollowing,
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
