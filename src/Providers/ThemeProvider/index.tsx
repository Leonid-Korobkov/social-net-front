'use client'
import { ThemeProvider as NextThemesProvider } from 'next-themes'
import { HeroUIProvider } from '@heroui/react'
import { Toaster } from 'react-hot-toast'

export const ThemeProvider = ({
  children,
}: Readonly<{
  children: React.ReactNode
}>) => {
  return (
    <NextThemesProvider attribute="class" defaultTheme="system">
      <HeroUIProvider>
        <main className="min-h-dvh flex flex-col">{children}</main>
        <Toaster />
      </HeroUIProvider>
    </NextThemesProvider>
  )
}
