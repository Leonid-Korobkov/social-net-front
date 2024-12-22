import { useSelector } from 'react-redux'
import { selectCurrent } from '../../features/user/user.slice'
import { Link } from 'react-router-dom'
import { Card, CardBody } from '@nextui-org/react'
import User from '../../components/ui/User'
import OpenGraphMeta from '../../components/shared/OpenGraphMeta'
import { APP_URL } from '../../constants'

function Followers() {
  const currentUser = useSelector(selectCurrent)

  if (!currentUser) {
    return null
  }

  return (
    <>
      <OpenGraphMeta
        title={`Подписчики | ${currentUser.name} | Zling`}
        description={`Подписчики пользователя ${currentUser.name}`}
        url={`${APP_URL}/followers`}
        image={currentUser.avatarUrl ?? ''}
        siteName="Zling"
        type="profile"
      />
      {currentUser.followers?.length > 0 ? (
        <div className="gap-5 flex flex-col">
          {currentUser.followers.map(user => {
            // Проверяем наличие follower перед использованием
            if (!user.follower) {
              return null
            }

            return (
              <Link to={`/users/${user.follower.id}`} key={user.follower.id}>
                <Card>
                  <CardBody>
                    <User
                      name={user.follower.name ?? ''}
                      avatarUrl={user.follower.avatarUrl ?? ''}
                      description={user.follower.email ?? ''}
                      className="!justify-start"
                    />
                  </CardBody>
                </Card>
              </Link>
            )
          })}
        </div>
      ) : (
        <h2>У вас нет подписчиков</h2>
      )}
    </>
  )
}

export default Followers
