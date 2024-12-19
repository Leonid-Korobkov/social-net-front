import { User as NextUiUser } from '@nextui-org/react'
import { BASE_URL } from '../../../constants'

interface IUser {
  name: string
  avatarUrl: string
  description?: string
  className?: string
}

function User({
  name = '',
  description = '',
  avatarUrl = '',
  className = '',
}: IUser) {
  return (
    <NextUiUser
      name={name}
      className={className}
      description={description}
      avatarProps={{
        src: `${BASE_URL}${avatarUrl}`,
      }}
    />
  )
}

export default User
