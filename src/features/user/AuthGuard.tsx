import { Spinner } from '@nextui-org/react'
import { useCurrentUserQuery } from '../../app/services/user.api'

interface AuthGuardProps {
  children: React.ReactNode
}

function AuthGuard({ children }: AuthGuardProps) {
  const { isLoading } = useCurrentUserQuery()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-dvh">
        <Spinner
          size="lg"
          color="primary"
          label="Загрузка..."
          labelColor="primary"
        />
      </div>
    )
  }
  return children
}

export default AuthGuard
