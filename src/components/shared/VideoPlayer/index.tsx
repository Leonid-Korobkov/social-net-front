'use client'

import { Button, Slider, cn } from '@heroui/react'
import { useCallback, useEffect, useRef, useState } from 'react'
import {
  IoMdPause,
  IoMdPlay,
  IoMdVolumeHigh,
  IoMdVolumeMute,
} from 'react-icons/io'

interface VideoPlayerProps {
  src: string
  thumbnail?: string
  className?: string
  autoPlay?: boolean
  controls?: boolean
  loop?: boolean
  muted?: boolean
}

export default function VideoPlayer({
  src,
  thumbnail,
  className,
  autoPlay = true,
  controls = true,
  loop = true,
  muted = true,
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const progressRef = useRef<HTMLDivElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(muted)
  const [progress, setProgress] = useState(0)
  const [duration, setDuration] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [isInViewport, setIsInViewport] = useState(false)
  const [volume, setVolume] = useState(1)
  const [isHovered, setIsHovered] = useState(false)
  const [isDraggingProgress, setIsDraggingProgress] = useState(false)

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
    setProgress((currentTime / duration) * 100)
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

  // Обработчик изменения громкости
  const handleVolumeChange = useCallback((value: number | number[]) => {
    const newVolume = Array.isArray(value) ? value[0] : value
    setVolume(newVolume)
    if (videoRef.current) {
      videoRef.current.volume = newVolume
      setIsMuted(newVolume === 0)
    }
  }, [])

  // Управление воспроизведением
  const togglePlay = useCallback(() => {
    if (!videoRef.current) return

    if (isPlaying) {
      videoRef.current.pause()
    } else {
      videoRef.current.play()
    }

    setIsPlaying(!isPlaying)
  }, [isPlaying])

  // Управление звуком
  const toggleMute = useCallback(() => {
    if (!videoRef.current) return

    const newMutedState = !isMuted
    videoRef.current.muted = newMutedState
    setIsMuted(newMutedState)
  }, [isMuted])

  // Обработчик события loadedmetadata для установки длительности видео
  const handleLoadedMetadata = useCallback(() => {
    if (!videoRef.current) return

    setDuration(videoRef.current.duration)
  }, [])

  // Обработка окончания воспроизведения
  const handleEnded = useCallback(() => {
    setIsPlaying(false)
    setProgress(0)
    setCurrentTime(0)

    if (loop && videoRef.current) {
      videoRef.current.currentTime = 0
      videoRef.current.play()
      setIsPlaying(true)
    }
  }, [loop])

  // Наблюдатель за видимостью видео для автовоспроизведения
  useEffect(() => {
    if (!videoRef.current || !autoPlay) return

    const options = {
      root: null,
      rootMargin: '0px',
      threshold: 0.7, // 70% видео должно быть видимым
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
  }, [autoPlay, isPlaying])

  // Инициализация видео при монтировании компонента
  useEffect(() => {
    if (!videoRef.current) return

    videoRef.current.muted = muted
    setIsMuted(muted)

    // Добавляем обработчики событий
    const video = videoRef.current
    video.addEventListener('timeupdate', handleTimeUpdate)
    video.addEventListener('loadedmetadata', handleLoadedMetadata)
    video.addEventListener('ended', handleEnded)

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate)
      video.removeEventListener('loadedmetadata', handleLoadedMetadata)
      video.removeEventListener('ended', handleEnded)
    }
  }, [handleEnded, handleLoadedMetadata, handleTimeUpdate, muted])

  return (
    <div
      className={cn('relative group', className)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Видео */}
      <video
        ref={videoRef}
        src={src}
        poster={thumbnail}
        className="w-full h-full object-contain cursor-pointer"
        playsInline
        onClick={togglePlay}
        muted={isMuted}
        loop={loop}
      />

      {/* Кнопка Play/Pause по центру (показывается при наведении или паузе) */}
      {controls && (isHovered || !isPlaying) && (
        <Button
          isIconOnly
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-black/50 text-white"
          variant="flat"
          radius="full"
          size="lg"
          onClick={togglePlay}
        >
          {isPlaying ? <IoMdPause size={24} /> : <IoMdPlay size={24} />}
        </Button>
      )}

      {/* Контроллеры внизу видео */}
      {controls && (
        <div
          className={cn(
            'absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent px-2 pt-8 pb-2 transition-opacity',
            isHovered || isDraggingProgress ? 'opacity-100' : 'opacity-0'
          )}
        >
          {/* Полоса прогресса */}
          <div
            ref={progressRef}
            className="w-full h-2 bg-white/30 rounded-full mb-2 cursor-pointer relative"
            onClick={handleProgressClick}
          >
            <Slider
              value={progress}
              onChange={handleProgressChange}
              step={0.1}
              minValue={0}
              maxValue={100}
              size="sm"
              color="primary"
              classNames={{
                base: 'w-full h-2',
                track: 'h-2 rounded-full bg-white/30',
                filler: 'h-2 rounded-full bg-primary',
                thumb: 'w-3 h-3 bg-primary',
              }}
              aria-label="Прогресс видео"
              onPointerDown={() => setIsDraggingProgress(true)}
              onPointerUp={() => setIsDraggingProgress(false)}
            />
          </div>

          {/* Время воспроизведения и кнопки управления */}
          <div className="flex items-center justify-between">
            <div className="text-xs text-white">
              {formatTime(currentTime)} / {formatTime(duration)}
            </div>

            <div className="flex items-center gap-2">
              {/* Регулятор громкости */}
              <div className="flex items-center">
                <Button
                  isIconOnly
                  className="text-white"
                  variant="light"
                  size="sm"
                  onClick={toggleMute}
                >
                  {isMuted ? (
                    <IoMdVolumeMute size={18} />
                  ) : (
                    <IoMdVolumeHigh size={18} />
                  )}
                </Button>

                <div className="w-16 hidden md:block">
                  <Slider
                    value={isMuted ? 0 : volume}
                    onChange={handleVolumeChange}
                    step={0.1}
                    minValue={0}
                    maxValue={1}
                    size="sm"
                    aria-label="Громкость"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
