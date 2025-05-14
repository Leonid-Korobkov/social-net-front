'use client'

import { Button, Slider, cn } from '@heroui/react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { IoVolumeHigh, IoVolumeMute } from 'react-icons/io5'
import { IoPlayCircleOutline } from 'react-icons/io5'

interface VideoPlayerProps {
  src: string
  thumbnail?: string
  className?: string
  autoPlay?: boolean
  controls?: boolean
  loop?: boolean
  muted?: boolean
  mode?: 'carousel' | 'modal'
}

export default function VideoPlayer({
  src,
  thumbnail,
  className,
  autoPlay = true,
  controls = true,
  loop = true,
  muted = true,
  mode = 'carousel',
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const progressRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(muted)
  const [progress, setProgress] = useState(0)
  const [duration, setDuration] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [isInViewport, setIsInViewport] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [isDraggingProgress, setIsDraggingProgress] = useState(false)
  const [videoWidth, setVideoWidth] = useState(0)
  const [videoHeight, setVideoHeight] = useState(0)
  const [isVideoLoaded, setIsVideoLoaded] = useState(false)
  const [isVideoLoading, setIsVideoLoading] = useState(true)

  // Функция для форматирования времени (в секундах) в формат MM:SS
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`
  }

  // Обработчик обновления прогресса воспроизведения
  const handleTimeUpdate = useCallback(() => {
    if (!videoRef.current || isDraggingProgress) return

    const currentTime = videoRef.current.currentTime
    const duration = videoRef.current.duration
    setCurrentTime(currentTime)

    // Плавное обновление прогресса
    requestAnimationFrame(() => {
      setProgress((currentTime / duration) * 100)
    })
  }, [isDraggingProgress])

  // Изменение прогресса воспроизведения через перетаскивание
  const handleProgressChange = useCallback((value: number | number[]) => {
    const newValue = Array.isArray(value) ? value[0] : value
    setProgress(newValue)
    if (videoRef.current) {
      const newTime = (newValue / 100) * videoRef.current.duration
      videoRef.current.currentTime = newTime
      setCurrentTime(newTime)
    }
  }, [])

  // Обработчик клика на полосу прогресса
  const handleProgressClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!progressRef.current || !videoRef.current) return

      const rect = progressRef.current.getBoundingClientRect()
      const offsetX = e.clientX - rect.left
      const newProgress = (offsetX / rect.width) * 100
      setProgress(newProgress)

      // Обновляем текущее время видео
      const newTime = (newProgress / 100) * videoRef.current.duration
      videoRef.current.currentTime = newTime
      setCurrentTime(newTime)
    },
    []
  )

  // Управление воспроизведением
  const togglePlay = useCallback(
    (e?: React.MouseEvent) => {
      // Важно: не блокируем всплытие, иначе не работает в модальном окне
      // e?.stopPropagation();

      if (!videoRef.current) return

      try {
        if (isPlaying) {
          videoRef.current.pause()
          setIsPlaying(false)
        } else {
          videoRef.current
            .play()
            .then(() => setIsPlaying(true))
            .catch(error => {
              console.error('Ошибка воспроизведения:', error)
              setIsPlaying(false)
            })
        }
      } catch (error) {
        console.error('Ошибка при управлении воспроизведением:', error)
      }
    },
    [isPlaying]
  )

  // Управление звуком
  const toggleMute = useCallback(
    (e?: React.MouseEvent) => {
      e?.stopPropagation() // Предотвращаем всплытие события

      if (!videoRef.current) return

      const newMutedState = !isMuted
      videoRef.current.muted = newMutedState
      setIsMuted(newMutedState)
    },
    [isMuted]
  )

  // Обработчик события loadedmetadata для установки длительности видео и размеров
  const handleLoadedMetadata = useCallback(() => {
    if (!videoRef.current) return

    setDuration(videoRef.current.duration)
    setVideoWidth(videoRef.current.videoWidth)
    setVideoHeight(videoRef.current.videoHeight)
  }, [])

  // Обработчик загрузки данных видео
  const handleLoadedData = useCallback(() => {
    setIsVideoLoaded(true)
    setIsVideoLoading(false)
  }, [])

  // Обработчик ожидания загрузки данных
  const handleWaiting = useCallback(() => {
    setIsVideoLoading(true)
  }, [])

  // Обработчик возобновления воспроизведения
  const handlePlaying = useCallback(() => {
    setIsVideoLoading(false)
  }, [])

  // Обработка окончания воспроизведения
  const handleEnded = useCallback(() => {
    setIsPlaying(false)
    setProgress(0)
    setCurrentTime(0)

    if (loop && videoRef.current) {
      videoRef.current.currentTime = 0
      videoRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch(e =>
          console.error('Ошибка воспроизведения после завершения:', e)
        )
    }
  }, [loop])

  // Наблюдатель за видимостью видео для автовоспроизведения (только для карусели)
  useEffect(() => {
    if (!videoRef.current || !autoPlay || mode === 'modal') return

    const options = {
      root: null,
      rootMargin: '0px',
      threshold: 0.6, // 60% видео должно быть видимым
    }

    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        setIsInViewport(entry.isIntersecting)

        if (entry.isIntersecting && videoRef.current && !isPlaying) {
          // Автовоспроизведение при появлении в viewport
          videoRef.current
            .play()
            .then(() => setIsPlaying(true))
            .catch(e => console.error('Ошибка автовоспроизведения:', e))
        } else if (!entry.isIntersecting && videoRef.current && isPlaying) {
          // Пауза при исчезновении из viewport
          videoRef.current.pause()
          setIsPlaying(false)
        }
      })
    }, options)

    observer.observe(videoRef.current)

    return () => {
      observer.disconnect()
    }
  }, [autoPlay, isPlaying, mode])

  // Автовоспроизведение в модальном режиме, если указан autoPlay
  useEffect(() => {
    if (mode === 'modal' && autoPlay && videoRef.current && !isPlaying) {
      videoRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch(e =>
          console.error('Ошибка автовоспроизведения в модальном режиме:', e)
        )
    }
  }, [autoPlay, isPlaying, mode])

  // Инициализация видео при монтировании компонента
  useEffect(() => {
    if (!videoRef.current) return

    videoRef.current.muted = muted
    setIsMuted(muted)

    // Добавляем обработчики событий
    const video = videoRef.current
    video.addEventListener('timeupdate', handleTimeUpdate)
    video.addEventListener('loadedmetadata', handleLoadedMetadata)
    video.addEventListener('loadeddata', handleLoadedData)
    video.addEventListener('waiting', handleWaiting)
    video.addEventListener('playing', handlePlaying)
    video.addEventListener('ended', handleEnded)

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate)
      video.removeEventListener('loadedmetadata', handleLoadedMetadata)
      video.removeEventListener('loadeddata', handleLoadedData)
      video.removeEventListener('waiting', handleWaiting)
      video.removeEventListener('playing', handlePlaying)
      video.removeEventListener('ended', handleEnded)
    }
  }, [
    handleEnded,
    handleLoadedMetadata,
    handleLoadedData,
    handleWaiting,
    handlePlaying,
    handleTimeUpdate,
    muted,
  ])

  // Для карусели - адаптируем стили для совместимости с изображениями
  if (mode === 'carousel') {
    return (
      <div
        ref={containerRef}
        className={cn(
          'relative h-full flex items-center justify-start',
          className
        )}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Превью видео (отображается до загрузки) */}
        {thumbnail && !isVideoLoaded && (
          <img
            src={thumbnail}
            className={cn(
              'rounded-lg border border-default-200 object-contain z-10',
              !isVideoLoaded ? 'opacity-100' : 'opacity-0'
            )}
            style={{
              height: 'auto',
              maxHeight: '100%',
              maxWidth: '100%',
              width: 'auto',
              transition: 'opacity 0.3s ease-in',
            }}
          />
        )}

        <video
          ref={videoRef}
          src={src}
          poster={thumbnail}
          className={cn(
            'rounded-lg border border-default-200 object-contain z-10',
            isVideoLoaded ? 'opacity-100' : 'opacity-0'
          )}
          style={{
            maxHeight: '100%',
            maxWidth: '100%',
            transition: 'opacity 0.3s ease-in',
            width: isVideoLoaded ? 'auto' : 0,
            height: isVideoLoaded ? 'auto' : 0,
          }}
          playsInline
          onClick={togglePlay}
          muted={isMuted}
          loop={loop}
          preload="metadata"
        />

        {/* Индикатор загрузки */}
        {isVideoLoading && isPlaying && (
          <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
            <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        <button
          onClick={toggleMute}
          className="absolute bottom-2 right-2 text-white backdrop-blur-md bg-black/30 hover:bg-black/40 p-1 rounded-full z-30"
        >
          {isMuted ? <IoVolumeMute size={16} /> : <IoVolumeHigh size={16} />}
        </button>
      </div>
    )
  }

  // Для модального режима
  return (
    <div
      ref={containerRef}
      className={cn(
        'relative group flex items-center justify-center w-full h-full',
        'px-4 py-4',
        className
      )}
      style={{
        maxWidth: '100vw',
        maxHeight: '100vh',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Обертка для видео и элементов управления */}
      <div className="relative w-auto h-auto">
        {/* Превью видео (отображается до загрузки) */}
        {thumbnail && !isVideoLoaded && (
          <div
            className={cn(
              'absolute inset-0 bg-no-repeat bg-cover bg-center z-0 rounded-lg',
              isVideoLoaded ? 'opacity-0' : 'opacity-100'
            )}
            style={{
              backgroundImage: `url('${thumbnail}')`,
              transition: 'opacity 0.3s ease-out',
              width: '100%',
              height: '100%',
            }}
          />
        )}

        {/* Видео */}
        <video
          ref={videoRef}
          src={src}
          poster={thumbnail}
          className={cn(
            'object-contain rounded-lg z-10',
            isVideoLoaded ? 'opacity-100' : 'opacity-0'
          )}
          style={{
            height: 'auto',
            maxHeight: '100%',
            maxWidth: '100%',
            width: 'auto',
            transition: 'opacity 0.3s ease-in',
          }}
          playsInline
          onClick={togglePlay}
          muted={isMuted}
          loop={loop}
          preload="metadata"
        />

        {/* Индикатор загрузки */}
        {isVideoLoading && isPlaying && (
          <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
            <div className="w-10 h-10 border-3 border-white border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {/* Элементы управления для модального окна */}
        {controls && (
          <>
            {/* Время видео */}
            <div
              className={cn(
                'absolute bottom-3 left-3 text-xs text-white bg-black/40 px-2 py-1 rounded transition-opacity z-30',
                isHovered || !isPlaying ? 'opacity-100' : 'opacity-0'
              )}
            >
              {formatTime(currentTime)} / {formatTime(duration)}
            </div>

            {/* Кнопка звука */}
            <button
              onClick={toggleMute}
              className={cn(
                'absolute bottom-3 right-3 text-white backdrop-blur-md bg-black/40 hover:bg-black/50 p-1 rounded-full transition-opacity z-30',
                isHovered || !isPlaying ? 'opacity-100' : 'opacity-0'
              )}
            >
              {isMuted ? (
                <IoVolumeMute size={16} />
              ) : (
                <IoVolumeHigh size={16} />
              )}
            </button>

            {/* Полоса прогресса */}
            <div
              className={cn(
                'absolute bottom-0 left-0 right-0 transition-all z-30',
                isDraggingProgress ? 'h-2' : 'h-1',
                isHovered || isDraggingProgress ? 'opacity-100' : 'opacity-0'
              )}
            >
              <div
                ref={progressRef}
                className="w-full h-full bg-white/20 cursor-pointer"
                onClick={handleProgressClick}
                onMouseDown={() => setIsDraggingProgress(true)}
                onMouseUp={() => setIsDraggingProgress(false)}
                onMouseLeave={() => setIsDraggingProgress(false)}
                onTouchStart={() => setIsDraggingProgress(true)}
                onTouchEnd={() => setIsDraggingProgress(false)}
              >
                <div
                  className="h-full bg-white transition-all duration-300 ease-linear"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
