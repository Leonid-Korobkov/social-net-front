'use client'
import { useSelector } from 'react-redux'
import { useEffect } from 'react'
import { selectIsAuthenticated } from '@/features/user/user.slice'
import { useRouter } from 'next/navigation'
import Header from '@/components/shared/Header'

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const isAuth = useSelector(selectIsAuthenticated)
  const router = useRouter()

  useEffect(() => {
    if (isAuth) {
      router.push('/')
    }
  }, [isAuth, router])

  return (
    <div className="flex items-center justify-start min-h-dvh flex-col">
      <Header />
      {children}
    </div>
  )
}
