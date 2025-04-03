'use client'
import { Spinner } from '@heroui/react'
import { useCurrentUserQuery } from '@/store/services/user.api'
import { useTheme } from 'next-themes'
import Image from 'next/image'

interface AuthGuardProps {
  children: React.ReactNode
}

function AuthGuard({ children }: AuthGuardProps) {
  const { isLoading } = useCurrentUserQuery()
  const { resolvedTheme } = useTheme()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-dvh flex-col">
        <Image
          src={
            resolvedTheme === 'dark'
              ? '/Zling-logo-white.svg'
              : '/Zling-logo-black.svg'
          }
          alt="Zling"
          className="h-[100px] animate-spinner-ease-spin"
          width={100}
          height={100}
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
