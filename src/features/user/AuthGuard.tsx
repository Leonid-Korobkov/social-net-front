import { Image, Spinner } from "@heroui/react"
import { useCurrentUserQuery } from '../../app/services/user.api'
import { useTheme } from 'next-themes'

interface AuthGuardProps {
  children: React.ReactNode
}

function AuthGuard({ children }: AuthGuardProps) {
  const { isLoading } = useCurrentUserQuery()
  const { resolvedTheme } = useTheme()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-dvh flex-col">
        <img
          src={
            resolvedTheme === 'dark'
              ? '/assets/Zling-logo-white.svg'
              : '/assets/Zling-logo-black.svg'
          }
          alt="Zling"
          className="h-[100px] animate-spinner-ease-spin"
        />
        {/* <Spinner
          size="lg"
          color="secondary"
          label="Загрузка..."
          labelColor="secondary"
          
        /> */}
      </div>
    )
  }
  return children
}

export default AuthGuard
