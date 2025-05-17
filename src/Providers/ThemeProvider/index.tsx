'use client'
import { ThemeProvider as NextThemesProvider, useTheme } from 'next-themes'
import { HeroUIProvider } from '@heroui/react'
import { Toaster } from 'react-hot-toast'
import { UserSettingsStore } from '@/store/userSettings.store'
import { UserThemeStore } from '@/store/userTheme.store'
import { useState, useEffect } from 'react'

// Компонент-обертка для содержимого
const ThemeContent = ({ children }: { children: React.ReactNode }) => {
  const { resolvedTheme } = useTheme()
  const [theme, setTheme] = useState<string>('default')
  const [mounted, setMounted] = useState(false)
  const [reduce, setReduce] = useState(false)

  useEffect(() => {
    setMounted(true)
    setReduce(UserSettingsStore.getState().reduceAnimation)
    setTheme(UserThemeStore.getState().theme)

    // Подписка на изменения темы
    const unsubscribe = UserThemeStore.subscribe(state => {
      setTheme(state.theme)
    })

    return () => {
      unsubscribe()
    }
  }, [])

  // Получаем класс темы на основе системной темы
  const getThemeClass = () => {
    // Если есть информация о системной теме, добавляем суффикс для темной темы
    if (resolvedTheme === 'dark') {
      return `${theme}-dark`
    }

    return theme
  }

  // Устанавливаем класс темы на body
  useEffect(() => {
    if (!mounted) return

    const themeClass = getThemeClass()

    // Сначала удаляем все возможные классы тем с body
    document.body.classList.remove(
      'default',
      'default-dark',
      'purple',
      'purple-dark',
      'monochrome',
      'monochrome-dark',
      'brown',
      'brown-dark',
      'green',
      'green-dark'
    )

    // Затем добавляем нужный класс, если он есть
    if (themeClass) {
      document.body.classList.add(themeClass)
    }
  }, [mounted, theme, resolvedTheme])

  // Если не смонтировано, возвращаем пустой div для избежания мерцания
  if (!mounted) return <div style={{ visibility: 'hidden' }}>{children}</div>

  return (
    <HeroUIProvider disableAnimation={reduce}>
      {theme === 'default' ? (
        <main className="min-h-dvh flex flex-col overflow-hidden">{children}</main>
      ) : (
        <div className={getThemeClass()}>
          <main className="min-h-dvh flex flex-col overflow-hidden">{children}</main>
        </div>
      )}
      <Toaster />
    </HeroUIProvider>
  )
}

export const ThemeProvider = ({
  children,
}: Readonly<{
  children: React.ReactNode
}>) => {
  return (
    <NextThemesProvider attribute="class" defaultTheme="system">
      <ThemeContent>{children}</ThemeContent>
    </NextThemesProvider>
  )
}
