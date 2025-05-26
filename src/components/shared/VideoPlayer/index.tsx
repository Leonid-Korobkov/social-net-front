'use client'

import { Button, Slider, cn } from '@heroui/react'
import { useEffect, useRef, useState } from 'react'
import { IoVolumeHigh, IoVolumeMute } from 'react-icons/io5'
import { useInView } from 'react-intersection-observer'

interface VideoPlayerProps {
  src: string
  thumbnail?: string
  className?: string
  autoPlay?: boolean
  controls?: boolean
  loop?: boolean
  muted?: boolean
  mode?: 'carousel' | 'modal'
  onVideoLoad?: (video: HTMLVideoElement) => void
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
  onVideoLoad,
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [isMuted, setIsMuted] = useState(muted)
  const [progress, setProgress] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [isVideoLoaded, setIsVideoLoaded] = useState(false)
  const [isVideoLoading, setIsVideoLoading] = useState(true)
  const [isPlaying, setIsPlaying] = useState(false)

  const { ref: inViewRef, inView } = useInView({
    threshold: 0.6,
  })

  // Ref assignment for both video and inView observation
  const setRefs = (node: HTMLVideoElement | null) => {
    videoRef.current = node
    inViewRef(node)
  }

  // Функция для форматирования времени (в секундах) в формат MM:SS
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`
  }

  // Обработчик обновления прогресса воспроизведения
  const handleTimeUpdate = () => {
    if (!videoRef.current) return
    const currentTime = videoRef.current.currentTime
    setCurrentTime(currentTime)
  }

  // Изменение прогресса воспроизведения через перетаскивание
  const handleSliderChange = (value: number | number[]) => {
    const newValue = Array.isArray(value) ? value[0] : value
    handleSliderChangeStart()
    setProgress(newValue)
    if (videoRef.current) {
      const newTime = (newValue / 100) * videoRef.current.duration
      videoRef.current.currentTime = newTime
      setCurrentTime(newTime)
    }
  }

  // Обработка начала и конца перетаскивания слайдера
  const handleSliderChangeStart = () => {
    if (videoRef.current) {
      videoRef.current.pause()
      setIsPlaying(false)
    }
  }

  const handleSliderChangeEnd = (value: number | number[]) => {
    handleSliderChange(value)
    if (videoRef.current && inView) {
      videoRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => setIsPlaying(false))
    }
  }

  // Управление воспроизведением
  const togglePlay = () => {
    if (!videoRef.current) return
    if (videoRef.current.paused) {
      videoRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => setIsPlaying(false))
    } else {
      videoRef.current.pause()
      setIsPlaying(false)
    }
  }

  // Управление звуком
  const toggleMute = (e?: React.MouseEvent) => {
    e?.stopPropagation()
    if (!videoRef.current) return
    const newMutedState = !isMuted
    videoRef.current.muted = newMutedState
    setIsMuted(newMutedState)
  }

  // Обработчик загрузки данных видео
  const handleLoadedData = () => {
    setIsVideoLoaded(true)
    setIsVideoLoading(false)
    if (onVideoLoad && videoRef.current) {
      onVideoLoad(videoRef.current)
    }
  }

  // Обработчик ожидания загрузки данных
  const handleWaiting = () => {
    setIsVideoLoading(true)
    setIsPlaying(false)
  }

  const animateProgress = () => {
    if (!videoRef.current) return

    const duration = videoRef.current.duration
    const currentTime = videoRef.current.currentTime
    const newProgress = (currentTime / duration) * 100

    setProgress(newProgress)

    if (!videoRef.current.paused && !videoRef.current.ended) {
      requestAnimationFrame(animateProgress)
    }
  }

  // Обработчик возобновления воспроизведения
  const handlePlaying = () => {
    setIsVideoLoading(false)
    setIsPlaying(true)
    requestAnimationFrame(animateProgress)
  }

  // Обработка окончания воспроизведения
  const handleEnded = () => {
    setProgress(0)
    setCurrentTime(0)
    setIsPlaying(false)
    if (loop && videoRef.current) {
      videoRef.current.currentTime = 0
      videoRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => setIsPlaying(false))
    }
  }

  // Обработчик паузы
  const handlePause = () => {
    setIsPlaying(false)
  }

  useEffect(() => {
    if (videoRef.current) {
      setIsMuted(muted)

      const video = videoRef.current
      video.addEventListener('timeupdate', handleTimeUpdate)
      video.addEventListener('loadeddata', handleLoadedData)
      video.addEventListener('waiting', handleWaiting)
      video.addEventListener('playing', handlePlaying)
      video.addEventListener('ended', handleEnded)

      return () => {
        video.removeEventListener('timeupdate', handleTimeUpdate)
        video.removeEventListener('loadeddata', handleLoadedData)
        video.removeEventListener('waiting', handleWaiting)
        video.removeEventListener('playing', handlePlaying)
        video.removeEventListener('ended', handleEnded)
      }
    }
  }, [muted])

  useEffect(() => {
    if (autoPlay && inView && videoRef.current && !isPlaying) {
      // Для iOS важно, чтобы видео было muted
      videoRef.current.muted = muted
      setIsMuted(muted)

      videoRef.current
        .play()
        .then(() => {
          setIsPlaying(true)
          setIsVideoLoading(false)
        })
        .catch(error => {
          console.error('Ошибка автовоспроизведения:', error)
          setIsPlaying(false)
          setIsVideoLoading(false)
        })
    } else if (!inView && videoRef.current && isPlaying) {
      videoRef.current.pause()
      setIsPlaying(false)
    }
  }, [autoPlay, inView, isPlaying])

  if (mode === 'carousel') {
    return (
      <div
        ref={containerRef}
        className={cn(
          'relative h-full flex items-center justify-start',
          className
        )}
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
            }}
            alt="Video thumbnail"
          />
        )}

        <video
          ref={setRefs}
          src={src}
          poster={thumbnail}
          className={cn(
            'rounded-lg border border-default-200 object-contain z-10',
            isVideoLoaded ? 'opacity-100' : 'opacity-0'
          )}
          style={{
            maxHeight: '100%',
            maxWidth: '100%',
            width: 'auto',
            height: 'auto',
          }}
          playsInline
          webkit-playsinline="true"
          x-webkit-airplay="allow"
          preload="metadata"
          muted={isMuted}
          loop={loop}
          autoPlay={autoPlay}
        />

        {isVideoLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-lg">
            <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        <button
          onClick={toggleMute}
          className="absolute bottom-2 right-2 text-white backdrop-blur-md bg-content1/30 hover:bg-content1/50 p-2 rounded-full z-30"
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
        'relative group block w-auto h-full max-w-[100vw] flex items-center',
        className
      )}
    >
      <video
        ref={setRefs}
        src={src}
        poster={thumbnail}
        className="object-cover w-full h-full"
        playsInline
        webkit-playsinline="true"
        x-webkit-airplay="allow"
        onClick={togglePlay}
        muted={isMuted}
        loop={loop}
        style={{
          maxHeight: '100%',
          maxWidth: '100%',
          width: 'auto',
          height: 'auto',
        }}
      />

      {/* Элементы управления для модального окна */}
      {controls && (
        <>
          {/* Время видео */}
          <div
            className={cn(
              'absolute bottom-6 left-2 text-xs text-white bg-black/40 px-2 py-1 rounded-lg transition-opacity z-10 opacity-0',
              !isPlaying && 'opacity-100'
            )}
          >
            {formatTime(currentTime)} /{' '}
            {formatTime(videoRef.current?.duration || 0)}
          </div>

          {/* Кнопка звука */}
          <button
            onClick={toggleMute}
            className={cn(
              'absolute bottom-6 right-2 text-white backdrop-blur-md bg-content1/30 hover:bg-content1/50 p-2 rounded-full z-30'
            )}
          >
            {isMuted ? <IoVolumeMute size={16} /> : <IoVolumeHigh size={16} />}
          </button>

          {/* Полоса прогресса через Slider */}
          <div
            className={cn(
              'absolute bottom-0 left-0 right-0 flex items-center px-2'
            )}
          >
            <Slider
              aria-label="Player progress"
              className="w-full max-w-full"
              size="sm"
              color="foreground"
              value={progress}
              minValue={0}
              maxValue={100}
              onChange={handleSliderChange}
              onChangeEnd={handleSliderChangeEnd}
              hideThumb={true}
              classNames={{
                track: 'h-2 border-none rounded-full',
                filler: 'h-2 border-none rounded-full',
              }}
            />
          </div>

          {isVideoLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/20">
              <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin" />
            </div>
          )}
        </>
      )}
    </div>
  )
}
