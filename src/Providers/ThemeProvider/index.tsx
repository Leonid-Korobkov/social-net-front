'use client'
import { ThemeProvider as NextThemesProvider } from 'next-themes'
import { HeroUIProvider } from '@heroui/react'
import { Toaster } from 'react-hot-toast'
import { UserSettingsStore } from '@/store/userSettings.store'
import { useState, useEffect } from 'react'

export const ThemeProvider = ({
  children,
}: Readonly<{
  children: React.ReactNode
}>) => {
  const [mounted, setMounted] = useState(false)
  const [reduce, setReduce] = useState(false)

  useEffect(() => {
    setMounted(true)
    setReduce(UserSettingsStore.getState().reduceAnimation)
  }, [])

  return (
    <NextThemesProvider attribute="class" defaultTheme="system">
      <HeroUIProvider disableAnimation={mounted ? reduce : false}>
        <main className="min-h-dvh flex flex-col">{children}</main>
        <Toaster />
      </HeroUIProvider>
    </NextThemesProvider>
  )
}
