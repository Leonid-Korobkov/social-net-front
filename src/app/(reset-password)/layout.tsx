import Header from '@/components/layout/Header'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Сброс пароля',
}

export default function VerifyEmailLayout({
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
