'use client'
import { ThemeProvider as NextThemesProvider, useTheme } from 'next-themes'
import { HeroUIProvider } from '@heroui/react'
import { Toaster } from 'react-hot-toast'
import { UserSettingsStore } from '@/store/userSettings.store'
import { UserThemeStore } from '@/store/userTheme.store'
import { useState, useEffect } from 'react'
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa'

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
        <main className="min-h-dvh flex flex-col">{children}</main>
      ) : (
        <div className={getThemeClass()}>
          <main className="min-h-dvh flex flex-col">{children}</main>
        </div>
      )}
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: 'hsl(var(--heroui-content1))',
            color: 'hsl(var(--heroui-foreground))',
            borderRadius: '0.75rem',
            boxShadow: '0 4px 32px 0 rgba(80, 0, 120, 0.10)',
            border: '1px solid hsl(var(--heroui-content2))',
            padding: '12px 16px',
            fontWeight: 500,
          },
          success: {
            style: {
              background: 'hsl(var(--heroui-success))',
            },
            icon: (
              <FaCheckCircle className="text-content1-foreground" size={22} />
            ),
          },
          error: {
            style: {
              background: 'hsl(var(--heroui-danger))',
            },
            icon: (
              <FaTimesCircle className="text-content1-foreground" size={22} />
            ),
          },
        }}
      />
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
