'use client'

import { MediaItem, MediaType } from '@/store/types'
import { cn } from '@heroui/react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { IoChevronBack, IoChevronForward, IoClose } from 'react-icons/io5'
import VideoPlayer from '../VideoPlayer'
import { createPortal } from 'react-dom'
import Image from 'next/image'
import { useCloudinaryImage } from '@/hooks/useCloudinaryImage'

interface MediaModalProps {
  isOpen: boolean
  onClose: () => void
  media: string[]
  initialIndex?: number
}

export default function MediaModal({
  isOpen,
  onClose,
  media,
  initialIndex = 0,
}: MediaModalProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex)
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([])
  const [mounted, setMounted] = useState(false)

  // Для перетаскивания
  const modalRef = useRef<HTMLDivElement>(null)
  const carouselRef = useRef<HTMLDivElement>(null)
  const slideRefs = useRef<(HTMLDivElement | null)[]>([])
  const [isMouseDown, setIsMouseDown] = useState(false)
  const [startX, setStartX] = useState(0)
  const [scrollLeft, setScrollLeft] = useState(0)
  const [isDragging, setIsDragging] = useState(false)

  const { getOptimizedUrlByCustomSrc } = useCloudinaryImage({})

  // Для анимации появления
  const [isVisible, setIsVisible] = useState(false)

  // Для определения типа устройства
  const [isMobile, setIsMobile] = useState(false)

  // Монтирование компонента и определение типа устройства
  useEffect(() => {
    setMounted(true)

    // Определяем мобильное устройство
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)

    return () => {
      setMounted(false)
      window.removeEventListener('resize', checkMobile)
    }
  }, [])

  // Определение типа медиа по URL
  useEffect(() => {
    if (!media || media.length === 0) return

    const items = media.map(url => ({
      url,
      type:
        url.includes('/video/') || url.includes('.mp4')
          ? MediaType.VIDEO
          : MediaType.IMAGE,
      thumbnail: undefined,
    }))

    setMediaItems(items)

    // Инициализируем массив ссылок на слайды
    slideRefs.current = items.map(() => null)
  }, [media])

  // Анимация появления и сброс индекса при открытии
  useEffect(() => {
    if (isOpen) {
      // Блокируем скролл на html
      document.documentElement.style.overflow = 'hidden'
      setCurrentIndex(initialIndex)
      // Анимация при открытии
      setTimeout(() => {
        setIsVisible(true)
      }, 10)
    } else {
      // Сначала запускаем анимацию закрытия
      setIsVisible(false)
      // Затем убираем блокировку скролла после завершения анимации
      const timer = setTimeout(() => {
        document.documentElement.style.overflow = ''
      }, 300)
      return () => clearTimeout(timer)
    }
  }, [isOpen, initialIndex])

  // Прокрутка к активному слайду при изменении индекса
  useEffect(() => {
    if (!carouselRef.current) return

    // Прокручиваем карусель к текущему слайду
    const slideWidth = carouselRef.current.offsetWidth
    carouselRef.current.scrollLeft = currentIndex * slideWidth
  }, [currentIndex])

  // Переключение на следующий элемент
  const nextItem = useCallback(() => {
    if (!mediaItems.length) return
    setCurrentIndex(prev => (prev + 1) % mediaItems.length)
  }, [mediaItems.length])

  // Переключение на предыдущий элемент
  const prevItem = useCallback(() => {
    if (!mediaItems.length) return
    setCurrentIndex(prev => (prev - 1 + mediaItems.length) % mediaItems.length)
  }, [mediaItems.length])

  // Обработчики для управления с клавиатуры
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return

      switch (e.key) {
        case 'ArrowRight':
          nextItem()
          break
        case 'ArrowLeft':
          prevItem()
          break
        case 'Escape':
          e.preventDefault()
          onClose()
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, nextItem, onClose, prevItem])

  // Обработка окончания скролла для обновления текущего индекса
  const handleScrollEnd = useCallback(() => {
    if (!carouselRef.current) return

    // Определяем новый индекс на основе позиции прокрутки
    const scrollPosition = carouselRef.current.scrollLeft
    const slideWidth = carouselRef.current.offsetWidth
    const newIndex = Math.round(scrollPosition / slideWidth)

    if (
      newIndex !== currentIndex &&
      newIndex >= 0 &&
      newIndex < mediaItems.length
    ) {
      setCurrentIndex(newIndex)
    }
  }, [currentIndex, mediaItems.length])

  // Отслеживание прокрутки
  useEffect(() => {
    if (!carouselRef.current) return

    const carousel = carouselRef.current
    let scrollTimeout: NodeJS.Timeout

    const handleScroll = () => {
      // Очищаем предыдущий таймер при новой прокрутке
      clearTimeout(scrollTimeout)

      // Устанавливаем новый таймер для обработки окончания прокрутки
      scrollTimeout = setTimeout(() => {
        handleScrollEnd()
      }, 100)
    }

    carousel.addEventListener('scroll', handleScroll)
    return () => {
      carousel.removeEventListener('scroll', handleScroll)
      clearTimeout(scrollTimeout)
    }
  }, [handleScrollEnd])

  // Логика перетаскивания для ПК (только для десктопных устройств)
  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (!carouselRef.current || isMobile) return

      setIsMouseDown(true)
      setIsDragging(false)
      setStartX(e.clientX - carouselRef.current.offsetLeft)
      setScrollLeft(carouselRef.current.scrollLeft)
      document.body.style.cursor = 'grabbing'
      e.preventDefault()
    },
    [isMobile]
  )

  const handleMouseUp = useCallback(() => {
    if (isMobile) return

    setIsMouseDown(false)
    document.body.style.cursor = 'default'

    // Отключаем режим перетаскивания через небольшую задержку
    setTimeout(() => {
      setIsDragging(false)
      handleScrollEnd()
    }, 50)
  }, [handleScrollEnd, isMobile])

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isMouseDown || !carouselRef.current || isMobile) return

      e.preventDefault()
      const x = e.clientX - carouselRef.current.offsetLeft
      const walk = (x - startX) * 10

      if (Math.abs(x - startX) > 2) {
        setIsDragging(true)
      }

      carouselRef.current.scrollLeft = scrollLeft - walk
    },
    [isMouseDown, isMobile, scrollLeft, startX]
  )

  // Добавляем глобальные слушатели событий для обработки перетаскивания (только на ПК)
  useEffect(() => {
    if (isMobile) return // Пропускаем настройку для мобильных устройств

    // Используем глобальные обработчики для отслеживания мыши за пределами карусели
    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (isMouseDown) {
        handleMouseMove(e)
      }
    }

    const handleGlobalMouseUp = () => {
      if (isMouseDown) {
        handleMouseUp()
      }
    }

    document.addEventListener('mousemove', handleGlobalMouseMove)
    document.addEventListener('mouseup', handleGlobalMouseUp)

    return () => {
      document.removeEventListener('mousemove', handleGlobalMouseMove)
      document.removeEventListener('mouseup', handleGlobalMouseUp)
    }
  }, [handleMouseMove, handleMouseUp, isMobile, isMouseDown])

  // Если нет медиафайлов или компонент не смонтирован, не рендерим модальное окно
  if (!mediaItems || mediaItems.length === 0 || !mounted) return null

  // Если модальное окно закрыто, не рендерим его содержимое
  if (!isOpen) return null

  return createPortal(
    <div
      className={cn(
        'fixed inset-0 z-50 flex items-center justify-center transition-all duration-300',
        isVisible ? 'opacity-100' : 'opacity-0',
        ' bg-black/60 transition-all duration-300',
        isVisible ? 'backdrop-blur-[12px]' : 'backdrop-blur-none'
      )}
      style={{
        willChange: 'opacity',
        backdropFilter: isVisible ? 'blur(12px)' : 'blur(0px)',
        WebkitBackdropFilter: isVisible ? 'blur(12px)' : 'blur(0px)',
      }}
    >
      <div ref={modalRef} className="absolute inset-0" />

      {/* Контент модального окна */}
      <div
        className={cn(
          'relative z-10 w-full h-full flex items-center justify-center',
          'transition-transform duration-300',
          isVisible ? 'scale-100' : 'scale-95'
        )}
      >
        {/* Карусель с горизонтальной прокруткой */}
        <div
          ref={carouselRef}
          className={cn(
            'w-full h-full flex overflow-x-auto scrollbar-hide select-none',
            !isMobile && (isDragging ? 'cursor-grabbing' : 'cursor-grab')
          )}
          style={{
            scrollBehavior: 'smooth',
            scrollSnapType: 'x mandatory',
            WebkitOverflowScrolling: 'touch',
          }}
          onMouseDown={handleMouseDown}
        >
          {mediaItems.map((item, index) => {
            // const optimizedUrl = getOptimizedUrlByCustomSrc(
            //   item.url,
            //   'auto',
            //   1200
            // )
            return (
              <div
                key={index}
                ref={el => {
                  slideRefs.current[index] = el
                }}
                className={cn(
                  'min-w-full h-full flex-shrink-0 flex items-center justify-center',
                  'snap-center'
                )}
              >
                {item.type === MediaType.IMAGE ? (
                  <div className="relative h-full w-full flex items-center justify-center">
                    <img
                      src={item.url}
                      alt={`Изображение ${index + 1}`}
                      className="absolute max-w-full max-h-full object-contain"
                    />
                  </div>
                ) : (
                  <div className="h-full w-full flex items-center justify-center overflow-hidden">
                    <VideoPlayer
                      src={item.url}
                      autoPlay={index === currentIndex}
                      controls={true}
                      loop={true}
                      muted={false}
                      mode="modal"
                    />
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Кнопка закрытия */}
        <button
          className="absolute top-4 right-4 bg-default-100 text-default-800 z-50 hover:bg-default-200 p-2 rounded-full"
          onClick={onClose}
          aria-label="Закрыть"
        >
          <IoClose size={24} />
        </button>

        {/* Полноразмерные навигационные кнопки */}
        {mediaItems.length > 1 && (
          <>
            <div
              className="absolute left-0 top-0 bottom-0 w-[70px] flex items-center justify-start px-4 cursor-pointer bg-gradient-to-r from-black/10 to-transparent hidden md:flex hover:bg-black/20 transition-all"
              onClick={prevItem}
            >
              <button
                className="bg-default-100 text-default-800 hover:bg-default-200 z-10 p-2 rounded-full"
                aria-label="Предыдущее изображение"
              >
                <IoChevronBack size={24} />
              </button>
            </div>

            <div
              className="absolute right-0 top-0 bottom-0 w-[70px] flex items-center justify-end px-4 cursor-pointer bg-gradient-to-l from-black/10 to-transparent hidden md:flex hover:bg-black/20 transition-all"
              onClick={nextItem}
            >
              <button
                className="bg-default-100 text-default-800 hover:bg-default-200 z-10 p-2 rounded-full"
                aria-label="Следующее изображение"
              >
                <IoChevronForward size={24} />
              </button>
            </div>
          </>
        )}

        {/* Индикаторы слайдов */}
        {mediaItems.length > 1 && !isMobile && (
          <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-1">
            {mediaItems.map((_, index) => (
              <button
                key={index}
                className={cn(
                  'w-2 h-2 rounded-full transition-all',
                  index === currentIndex ? 'bg-white w-4' : 'bg-white/50'
                )}
                onClick={() => setCurrentIndex(index)}
                aria-label={`Перейти к изображению ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Стили для скрытия скроллбара */}
      <style jsx global>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>,
    document.body
  )
}
