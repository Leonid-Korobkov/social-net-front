import { NextUIProvider } from '@nextui-org/react'
import { ThemeProvider as NextThemesProvider } from 'next-themes'

function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextUIProvider>
      <NextThemesProvider attribute="class" defaultTheme="system">
        <main className="min-h-screen">{children}</main>
      </NextThemesProvider>
    </NextUIProvider>
  )
}

export default ThemeProvider
