'use client'
import { useAuth } from '@/hooks/useAuth'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect } from 'react'

type ProtectedRouteProps = {
  children: React.ReactNode
  requireEmailVerification?: boolean
}

export default function ProtectedRoute({
  children,
  requireEmailVerification = true,
}: ProtectedRouteProps) {
  const router = useRouter()
  const pathname = usePathname()
  const isAuthPage = pathname.startsWith('/auth')
  const isVerificationPage = pathname.startsWith('/verify-email')
  const isResetPasswordPage = pathname.startsWith('/reset-password')

  const { user, isAuthenticated, isLoadingUser } = useAuth()

  useEffect(() => {
    const checkAuth = async () => {
      if (isResetPasswordPage || isLoadingUser) {
        return
      }

      if (!isAuthenticated && !isAuthPage && !isVerificationPage) {
        router.push('/auth')
        return
      }

      if (isAuthenticated && isAuthPage) {
        router.push('/')
        return
      }

      if (
        requireEmailVerification &&
        user &&
        !user.isEmailVerified &&
        !isVerificationPage &&
        isAuthenticated
      ) {
        const verificationToken = btoa(`${user.id}_${Date.now()}`)
        router.replace(`/verify-email?token=${verificationToken}`)
        return
      }

      if (user?.isEmailVerified && isVerificationPage) {
        router.replace('/')
        return
      }
    }

    checkAuth()
  }, [
    pathname,
    isLoadingUser,
    isAuthPage,
    isVerificationPage,
    router,
    requireEmailVerification,
    user,
    isAuthenticated,
  ])

  return <>{children}</>
}
