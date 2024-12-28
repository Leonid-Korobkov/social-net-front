import { useSelector } from 'react-redux'
import { selectCurrent } from '../../features/user/user.slice'
import { Link, useParams } from 'react-router-dom'
import { Card, CardBody, Spinner } from '@nextui-org/react'
import User from '../../components/ui/User'
import OpenGraphMeta from '../../components/shared/OpenGraphMeta'
import { APP_URL } from '../../constants'
import { useGetUserByIdQuery } from '../../app/services/user.api'
import GoBack from '../../components/shared/GoBack'

function Following() {
  const { id } = useParams<{ id: string }>()
  const currentUser = useSelector(selectCurrent)
  const { data: user, isLoading } = useGetUserByIdQuery(
    { id: id ?? '' },
    { skip: !id },
  )

  if (isLoading) {
    return <Spinner />
  }

  if (!user) {
    return <h2>Пользователь не найден</h2>
  }

  return (
    <>
      <OpenGraphMeta
        title={`Подписки | ${user.name} | Zling`}
        description={`Подписки пользователя ${user.name}`}
        url={`${APP_URL}/users/${user.id}/following`}
        image={user.avatarUrl ?? ''}
        siteName="Zling"
        type="profile"
      />
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

            return (
              <Link
                to={`/users/${followingItem.following.id}`}
                key={followingItem.following.id}
              >
                <Card>
                  <CardBody>
                    <User
                      name={followingItem.following.name ?? ''}
                      avatarUrl={followingItem.following.avatarUrl ?? ''}
                      description={followingItem.following.email ?? ''}
                      className="!justify-start"
                    />
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
