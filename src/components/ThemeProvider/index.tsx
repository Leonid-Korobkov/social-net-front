import { NextUIProvider } from '@nextui-org/react'
import { ThemeProvider as NextThemesProvider } from 'next-themes'
import { Toaster } from 'react-hot-toast'

function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextUIProvider>
      <NextThemesProvider attribute="class" defaultTheme="system">
        <main className="min-h-screen">{children}</main>
        <Toaster />
      </NextThemesProvider>
    </NextUIProvider>
  )
}

export default ThemeProvider
