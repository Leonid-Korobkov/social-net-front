'use client'

import { CSSProperties } from 'react'

interface OptimizedImageProps {
  src: string
  alt: string
  className?: string
  style?: CSSProperties
  loading?: 'lazy' | 'eager'
  maxHeight?: number
  objectFit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down'
}

/**
 * Компонент для оптимизации изображений с Cloudinary
 * Выводит тег picture с разными source для разных размеров экрана
 */
export default function OptimizedImage({
  src,
  alt,
  className = '',
  style,
  loading = 'lazy',
  maxHeight = 350,
  objectFit = 'contain',
}: OptimizedImageProps) {
  // Базовый URL Cloudinary (или обычный URL, если не Cloudinary)
  const isCloudinary = src.includes('cloudinary.com')

  // Функция для генерации оптимизированного URL Cloudinary
  const getOptimizedUrl = (
    url: string,
    width: number,
    format: string = 'auto'
  ) => {
    if (!isCloudinary) return url

    // Из URL типа https://res.cloudinary.com/djsmqdror/image/upload/v1746989517/zzj6kwgv3ssqy1o5yk59.jpg
    // Создаем URL с трансформациями: https://res.cloudinary.com/djsmqdror/image/upload/w_800,f_auto,q_auto/v1746989517/zzj6kwgv3ssqy1o5yk59.jpg
    const parts = url.split('/upload/')
    if (parts.length !== 2) return url

    return `${parts[0]}/upload/w_${width},f_${format},q_auto/${parts[1]}`
  }

  // Массив размеров для разных breakpoints
  const breakpoints = [
    { width: 384, mediaQuery: '(max-width: 480px)' },
    { width: 640, mediaQuery: '(max-width: 640px)' },
    { width: 750, mediaQuery: '(max-width: 768px)' },
    { width: 828, mediaQuery: '(max-width: 828px)' },
    { width: 1080, mediaQuery: '(max-width: 1080px)' },
    { width: 1200, mediaQuery: '(max-width: 1200px)' },
    { width: 1920, mediaQuery: '(max-width: 1920px)' },
    { width: 2048, mediaQuery: '(max-width: 2560px)' },
    { width: 3840, mediaQuery: '(min-width: 2561px)' },
  ]

  // Стили для изображения
  const imgStyle: CSSProperties = {
    maxHeight: `${maxHeight}px`,
    objectFit,
    ...style,
  }

  return (
    <picture>
      {breakpoints.map(bp => (
        <source
          key={bp.width}
          media={bp.mediaQuery}
          srcSet={getOptimizedUrl(src, bp.width, 'webp')}
          type="image/webp"
        />
      ))}

      {/* Fallback для браузеров без поддержки webp */}
      {breakpoints.map(bp => (
        <source
          key={`jpg-${bp.width}`}
          media={bp.mediaQuery}
          srcSet={getOptimizedUrl(src, bp.width, 'jpg')}
          type="image/jpeg"
        />
      ))}

      {/* Основное изображение */}
      <img
        src={getOptimizedUrl(src, 1200)}
        alt={alt}
        className={className}
        style={imgStyle}
        loading={loading}
        decoding="async"
      />
    </picture>
  )
}
