import { Spinner } from '@nextui-org/react'
import { useCurrentUserQuery } from '../../app/services/user.api'

interface AuthGuardProps {
  children: React.ReactNode
}

function AuthGuard({ children }: AuthGuardProps) {
  const { isLoading } = useCurrentUserQuery()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Spinner
          size="lg"
          color="primary"
          label="Loading..."
          labelColor="primary"
        />
      </div>
    )
  }
  return children
}

export default AuthGuard
