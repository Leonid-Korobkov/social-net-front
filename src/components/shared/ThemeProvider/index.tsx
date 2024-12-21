import { NextUIProvider } from '@nextui-org/react'
import { ThemeProvider as NextThemesProvider } from 'next-themes'
import { Toaster } from 'react-hot-toast'
import { BackgroundBeamsWithCollision } from '../../ui/background-beams-with-collision/background-beams-with-collision'

function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextUIProvider>
      <NextThemesProvider attribute="class" defaultTheme="system">
        <main className="min-h-screen flex flex-col">{children}</main>
        <Toaster />
        <BackgroundBeamsWithCollision className="fixed inset-0 z-[-1]">
          <div className="fixed inset-0"></div>
        </BackgroundBeamsWithCollision>
      </NextThemesProvider>
    </NextUIProvider>
  )
}

export default ThemeProvider
