'use client'
import { makeStore, AppStore } from '@/store/store'
import { useEffect, useRef, useState } from 'react'
import { ThemeProvider } from 'next-themes'
import { Provider as RProvider } from 'react-redux'
import { useRouter } from 'next/navigation'
import { HeroUIProvider } from '@heroui/react'
import AuthGuard from '@/features/user'

export const Providers = ({
  children,
}: Readonly<{
  children: React.ReactNode
}>) => {
  const [isClient, setIsClient] = useState(false)

  const storeRef = useRef<AppStore>(undefined)
  if (!storeRef.current) {
    storeRef.current = makeStore()
  }

  useEffect(() => {
    setIsClient(true)
  }, [])

  return (
    <>
      <ThemeProvider>
        <HeroUIProvider>
          <RProvider store={storeRef.current}>
            <AuthGuard></AuthGuard>
            {children}
          </RProvider>
        </HeroUIProvider>
      </ThemeProvider>
    </>
  )
}
