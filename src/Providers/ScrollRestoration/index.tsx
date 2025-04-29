'use client'
import { usePathname, useSearchParams } from 'next/navigation'
import React, { useEffect, useRef } from 'react'

// Глобальное хранилище для позиций
const positions = new Map<string, number>()

function ScrollRestoration({ children }: { children: React.ReactNode }) {
  useScrollRestoration()
  return <>{children}</>
}

export default ScrollRestoration

const useScrollRestoration = () => {
  const path = usePathname()
  const searchParams = useSearchParams()
  const fullPath = `${path}${
    searchParams.toString() ? `?${searchParams.toString()}` : ''
  }`
  const scrollTimeout = useRef<NodeJS.Timeout | null>(null)
  const isRestoring = useRef(false)

  // Сохраняем позицию перед уходом со страницы
  useEffect(() => {
    // Функция для сохранения позиции скролла с дебаунсом
    const handleScroll = () => {
      if (scrollTimeout.current) {
        clearTimeout(scrollTimeout.current)
      }

      if (isRestoring.current) return // Не сохраняем во время восстановления

      scrollTimeout.current = setTimeout(() => {
        positions.set(fullPath, window.scrollY)
      }, 100)
    }

    window.addEventListener('scroll', handleScroll)

    return () => {
      window.removeEventListener('scroll', handleScroll)

      if (scrollTimeout.current) {
        clearTimeout(scrollTimeout.current)
      }
    }
  }, [fullPath])

  // Восстанавливаем позицию при монтировании компонента
  useEffect(() => {
    // Используем requestAnimationFrame для более надежного восстановления
    const restorePosition = () => {
      if (positions.has(fullPath)) {
        const scrollY = positions.get(fullPath) ?? 0
        isRestoring.current = true
        window.scrollTo(0, scrollY)

        // Сбрасываем флаг восстановления после короткой задержки
        setTimeout(() => {
          isRestoring.current = false
        }, 100)
      } else {
        // Новый путь - скроллим в начало
        window.scrollTo(0, 0)
        positions.set(fullPath, 0)
      }
    }

    // Используем requestAnimationFrame для уверенности, что DOM готов
    if (typeof window !== 'undefined') {
      // Отложенное восстановление для надежности
      setTimeout(() => {
        requestAnimationFrame(restorePosition)
      }, 0)
    }
  }, [fullPath])

  return null
}
