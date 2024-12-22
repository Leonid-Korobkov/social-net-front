import { useSelector } from 'react-redux'
import { selectCurrent } from '../../features/user/user.slice'
import { Link } from 'react-router-dom'
import { Card, CardBody } from '@nextui-org/react'
import User from '../../components/ui/User'
import OpenGraphMeta from '../../components/OpenGraphMeta'
import { APP_URL } from '../../constants'

function Following() {
  const currentUser = useSelector(selectCurrent)

  if (!currentUser) {
    return null
  }

  return (
    <>
      <OpenGraphMeta
        title={`Подписки | ${currentUser.name} | Zling`}
        description={`Подписки пользователя ${currentUser.name}`}
        url={`${APP_URL}/following`}
        image={currentUser.avatarUrl ?? ''}
        siteName="Zling"
        type="profile"
      />
      {currentUser.following?.length > 0 ? (
        <div className="gap-5 flex flex-col">
          {currentUser.following.map(user => {
            // Проверяем наличие following перед использованием
            if (!user.following) {
              return null
            }

            return (
              <Link to={`/users/${user.following.id}`} key={user.following.id}>
                <Card>
                  <CardBody>
                    <User
                      name={user.following.name ?? ''}
                      avatarUrl={user.following.avatarUrl ?? ''}
                      description={user.following.email ?? ''}
                      className="!justify-start"
                    />
                  </CardBody>
                </Card>
              </Link>
            )
          })}
        </div>
      ) : (
        <h2>У вас нет подписок</h2>
      )}
    </>
  )
}

export default Following
