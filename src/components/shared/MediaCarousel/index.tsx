'use client'

import { MediaItem, MediaType } from '@/store/types'
import { cn } from '@heroui/react'
import { useCallback, useEffect, useRef, useState } from 'react'
import VideoPlayer from '../VideoPlayer'
import Image from 'next/image'
import { useCloudinaryImage } from '@/hooks/useCloudinaryImage'

interface MediaCarouselProps {
  media: string[]
  className?: string
  onMediaClick?: (index: number) => void
}

export default function MediaCarousel({
  media,
  className,
  onMediaClick,
}: MediaCarouselProps) {
  const carouselRef = useRef<HTMLDivElement>(null)
  const [isMouseDown, setIsMouseDown] = useState(false)
  const [startX, setStartX] = useState(0)
  const [scrollLeft, setScrollLeft] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [position, setPosition] = useState(0)
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([])
  const [isTouchDevice, setIsTouchDevice] = useState(false)

  const { getOptimizedUrlByCustomSrc } = useCloudinaryImage({})

  // Определение сенсорного устройства
  useEffect(() => {
    setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0)
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
  }, [media])

  // Обработка клика на элемент карусели
  const handleItemClick = useCallback(
    (index: number, e: React.MouseEvent) => {
      // Предотвращаем клик при перетаскивании
      if (isDragging) {
        e.preventDefault()
        return
      }

      if (onMediaClick) {
        onMediaClick(index)
      }
    },
    [onMediaClick, isDragging]
  )

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (!carouselRef.current || isTouchDevice) return

      setIsMouseDown(true)
      setIsDragging(false)
      setPosition(e.clientX)
      setStartX(e.clientX - carouselRef.current.offsetLeft)
      setScrollLeft(carouselRef.current.scrollLeft)
      document.body.style.cursor = 'grabbing'
      e.preventDefault()
    },
    [isTouchDevice]
  )

  const handleMouseUp = useCallback(() => {
    if (isTouchDevice) return

    setIsMouseDown(false)
    document.body.style.cursor = 'default'

    // Отключаем режим перетаскивания через небольшую задержку
    setTimeout(() => {
      setIsDragging(false)
    }, 100)
  }, [isTouchDevice])

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isMouseDown || !carouselRef.current || isTouchDevice) return

      e.preventDefault()
      const x = e.clientX
      const walk = x - startX

      if (Math.abs(position - e.clientX) > 5) {
        setIsDragging(true)
      }

      carouselRef.current.scrollLeft = scrollLeft - walk
    },
    [isMouseDown, startX, scrollLeft, position, isTouchDevice]
  )

  // Добавляем глобальные слушатели событий для обработки перетаскивания
  // чтобы перетаскивание продолжалось, даже если курсор покидает элемент
  useEffect(() => {
    if (isTouchDevice) return

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
  }, [isMouseDown, handleMouseMove, handleMouseUp, isTouchDevice])

  // Если нет медиафайлов, не рендерим компонент
  if (!mediaItems || mediaItems.length === 0) return null

  // Одно изображение - отдельный рендер
  if (mediaItems.length === 1) {
    const item = mediaItems[0]
    const optimizedUrl = getOptimizedUrlByCustomSrc(item.url, 'auto', 1200)
    const imageForThumbnail = getOptimizedUrlByCustomSrc(item.url, 'jpg', 1000)

    return (
      <div
        className={cn('w-full flex justify-start cursor-pointer', className)}
        onClick={e => handleItemClick(0, e as React.MouseEvent)}
      >
        {item.type === MediaType.IMAGE ? (
          <div
            className="rounded-lg overflow-hidden border border-default-200"
            style={{ maxWidth: '100%' }}
          >
            <img
              src={optimizedUrl}
              alt="Медиа контент"
              className="max-w-full max-h-[430px] object-contain"
            />
          </div>
        ) : (
          <div
            className="flex justify-start w-full"
            style={{ maxWidth: '100%' }}
          >
            <VideoPlayer
              thumbnail={imageForThumbnail}
              src={optimizedUrl}
              className="max-h-[430px]"
              autoPlay={true}
              controls={true}
              loop={true}
              muted={true}
              mode="carousel"
            />
          </div>
        )}
      </div>
    )
  }

  // Два изображения - сетка 2 колонки
  if (mediaItems.length === 2) {
    return (
      <div
        className={cn(
          'grid grid-cols-2 gap-1 w-full  cursor-pointer',
          className
        )}
      >
        {mediaItems.map((item, index) => {
          const optimizedUrl = getOptimizedUrlByCustomSrc(item.url)

          return (
            <div
              key={index}
              className="aspect-auto overflow-hidden rounded-lg border border-default-200"
              onClick={e => handleItemClick(index, e as React.MouseEvent)}
            >
              {item.type === MediaType.IMAGE ? (
                <img
                  src={optimizedUrl}
                  alt={`Медиа ${index + 1}`}
                  className="w-full h-full max-h-[400px] object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-start">
                  <VideoPlayer
                    src={optimizedUrl}
                    thumbnail={item.thumbnail}
                    className="w-full h-full max-h-[430px]"
                    autoPlay={true}
                    controls={true}
                    loop={true}
                    muted={true}
                    mode="carousel"
                  />
                </div>
              )}
            </div>
          )
        })}
      </div>
    )
  }

  // Три и более изображений - карусель
  return (
    <div
      className={cn('w-full relative', className)}
      style={{ width: 'calc(100% + 2rem)', marginLeft: '-1rem' }}
    >
      <div
        ref={carouselRef}
        className={cn(
          'overflow-x-auto flex w-full gap-1 pt-1 pb-1',
          'scrollbar-hide select-none',
          isTouchDevice ? '' : 'cursor-grab',
          isDragging && !isTouchDevice ? 'cursor-grabbing' : ''
        )}
        style={{
          WebkitOverflowScrolling: 'touch',
          paddingLeft: '1rem',
          scrollBehavior: isTouchDevice ? 'smooth' : 'auto',
        }}
        onMouseDown={handleMouseDown}
      >
        {mediaItems.map((item, index) => {
          const optimizedUrl = getOptimizedUrlByCustomSrc(item.url)

          return (
            <div
              key={index}
              className={cn('shrink-0 first:pl-0 last:pr-4', 'snap-start')}
              onClick={e => handleItemClick(index, e as React.MouseEvent)}
            >
              {item.type === MediaType.IMAGE ? (
                <div className="rounded-lg overflow-hidden h-full w-full border border-default-200 ">
                  <img
                    loading="lazy"
                    src={optimizedUrl}
                    alt={`Медиа ${index + 1}`}
                    className="max-w-full max-h-[350px] object-contain"
                  />
                </div>
              ) : (
                <div className="rounded-lg overflow-hidden h-full border border-default-200 flex items-center justify-start">
                  <VideoPlayer
                    src={optimizedUrl}
                    thumbnail={item.thumbnail}
                    className="max-h-[350px]"
                    autoPlay={true}
                    controls={true}
                    loop={true}
                    muted={true}
                    mode="carousel"
                  />
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Стили для скроллбара */}
      <style jsx global>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  )
}
