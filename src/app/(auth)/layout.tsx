'use client'
import Header from '@/components/layout/Header'
import ProtectedRoute from '@/components/layout/ProtectedRoute'

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ProtectedRoute>
      <div className="flex items-center justify-start min-h-dvh flex-col">
        <Header />
        {children}
      </div>
    </ProtectedRoute>
  )
}
