'use client'
import Header from '@/components/layout/Header'
import { useUserStore } from '@/store/user.store'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const isAuth = useUserStore.use.isAuthenticated()
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
