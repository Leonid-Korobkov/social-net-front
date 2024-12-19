import { useSelector } from 'react-redux'
import { selectCurrent } from '../../features/user/user.slice'
import { Link } from 'react-router-dom'
import { Card, CardBody } from '@nextui-org/react'
import User from '../../components/ui/User'

function Following() {
  const currentUser = useSelector(selectCurrent)

  if (!currentUser) {
    return null
  }

  return currentUser.following.length > 0 ? (
    <div className="gap-5 flex flex-col">
      {currentUser.following.map(user => {
        // Проверяем наличие following перед использованием
        if (!user.following) {
          return null
        }

        return (
          <Link to={`/users/${user.following.id}`} key={user.following.id}>
            <Card>
              <CardBody className="block">
                <User
                  name={user.following.name ?? ''}
                  avatarUrl={user.following.avatarUrl ?? ''}
                  description={user.following.email ?? ''}
                />
              </CardBody>
            </Card>
          </Link>
        )
      })}
    </div>
  ) : (
    <h2>У вас нет подписок</h2>
  )
}

export default Following
