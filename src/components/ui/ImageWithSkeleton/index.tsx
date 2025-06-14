'use client'
import { ImageProps, Image } from '@heroui/react'
import { useCloudinaryImage } from '../../../hooks/useCloudinaryImage'
import NextImage from 'next/image'

interface ImageWithSkeletonProps extends Omit<ImageProps, 'src' | 'alt'> {
  src: string
  alt: string
  className?: string
  sizes?: string
  width?: number
}

function ImageWithSkeleton({
  src,
  alt,
  className = '',
  sizes = '(max-width: 768px) 100vw, 50vw',
  width = 800,
  onClick,
  ...props
}: ImageWithSkeletonProps) {
  const { error, getOptimizedUrl, handleLoad, handleError } =
    useCloudinaryImage({ src, width })

  return (
    <div className={`relative object-cover aspect-square ${className}`}>
      {src && !error && (
        <>
          <NextImage
            src={src}
            alt={alt}
            fill={true}
            className={`absolute inset-0 w-full h-full object-cover rounded-xl z-10`}
            onLoad={handleLoad}
            onError={handleError}
            onClick={onClick}
          />
          <img
            src={getOptimizedUrl()}
            alt={alt}
            className={`absolute z-0 inset-0 w-full h-full object-cover filter blur-xl scale-105 saturate-150 opacity-70 translate-y-1 rounded-large`}
          />
        </>
      )}

      {error && (
        <div
          className={`object-cover rounded-xl aspect-square !${className} flex items-center justify-center bg-default-100`}
        >
          <p className="text-default-500">Ошибка загрузки изображения</p>
        </div>
      )}
    </div>
  )
}

export default ImageWithSkeleton
