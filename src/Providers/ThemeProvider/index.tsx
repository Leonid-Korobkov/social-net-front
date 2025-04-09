import { ThemeProvider as NextThemesProvider } from 'next-themes'
import { HeroUIProvider } from '@heroui/react'

export const ThemeProvider = ({
  children,
}: Readonly<{
  children: React.ReactNode
}>) => {
  return (
    <NextThemesProvider>
      <HeroUIProvider>{children}</HeroUIProvider>
    </NextThemesProvider>
  )
}
