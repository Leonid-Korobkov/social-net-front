import { User as NextUiUser } from "@heroui/react"
import { useCloudinaryImage } from '../../../hooks/useCloudinaryImage'

interface IUser {
  name: string
  avatarUrl: string
  description?: string | React.ReactNode
  className?: string
}

function User({
  name = '',
  description = '',
  avatarUrl = '',
  className = '',
}: IUser) {
  const { getOptimizedUrl } = useCloudinaryImage({
    src: avatarUrl,
    width: 200,
  })

  return (
    <NextUiUser
      name={name}
      className={className}
      description={description}
      avatarProps={{
        src: getOptimizedUrl(),
      }}
    />
  )
}

export default User
