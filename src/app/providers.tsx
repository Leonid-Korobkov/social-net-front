'use client'
import { store } from '@/store/store'
import { useEffect, useState } from 'react'
import { ThemeProvider } from 'next-themes'
import { Provider as RProvider } from 'react-redux'
import { useRouter } from 'next/navigation'
import { HeroUIProvider } from '@heroui/react'

export const Providers = (props: React.PropsWithChildren) => {
  const router = useRouter()
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) return null

  return (
    <ThemeProvider>
      <HeroUIProvider navigate={router.push}>
        <RProvider store={store}>{props.children}</RProvider>
      </HeroUIProvider>
    </ThemeProvider>
  )
}
