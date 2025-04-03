'use client'
import { HeroUIProvider } from '@heroui/react'
import { ThemeProvider as NextThemesProvider } from 'next-themes'
import { Toaster } from 'react-hot-toast'

function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <HeroUIProvider>
      <NextThemesProvider attribute="class" defaultTheme="system">
        <main className="min-h-dvh flex flex-col">{children}</main>
        <Toaster />
      </NextThemesProvider>
    </HeroUIProvider>
  )
}

export default ThemeProvider
