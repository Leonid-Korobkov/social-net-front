'use client'
import Header from '@/components/layout/Header'

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex items-center justify-start min-h-dvh flex-col">
      <Header />
      {children}
    </div>
  )
}
