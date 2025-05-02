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
  const { isLoading, error, getOptimizedUrl, handleLoad, handleError } =
    useCloudinaryImage({ src, width })

  return (
    <div
      className={`relative aspect-square min-h-[200px] min-w-[200px] max-h-[200px] max-w-[200px] lg:max-h-[300px] w-full lg:max-w-[300px]`}
    >
      {/* {isLoading && (
        <Skeleton className="h-full w-full rounded-xl">
          <div className="aspect-square rounded-xl bg-default-300 absolute inset-0 min-h-[200px]"></div>
        </Skeleton>
      )} */}
      {/* <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isLoading ? 0 : 1 }}
        transition={{ duration: 0.5 }}
      > */}
      {src && !error && (
        <picture className={error ? 'hidden' : ''}>
          {/* <source
            type="image/avif"
            sizes={sizes}
            srcSet={`
                ${getOptimizedUrl('avif', 400)} 400w,
                ${getOptimizedUrl('avif', 800)} 800w,
                ${getOptimizedUrl('avif', 1200)} 1200w
              `}
          />
          <source
            type="image/webp"
            sizes={sizes}
            srcSet={`
                ${getOptimizedUrl('webp', 400)} 400w,
                ${getOptimizedUrl('webp', 800)} 800w,
                ${getOptimizedUrl('webp', 1200)} 1200w
              `}
          />
          <source
            type="image/png"
            sizes={sizes}
            srcSet={`
                ${getOptimizedUrl('png', 400)} 400w,
                ${getOptimizedUrl('png', 800)} 800w,
                ${getOptimizedUrl('png', 1200)} 1200w
              `}
          />
          <source
            type="image/jpg"
            sizes={sizes}
            srcSet={`
                ${getOptimizedUrl('jpg', 400)} 400w,
                ${getOptimizedUrl('jpg', 800)} 800w,
                ${getOptimizedUrl('jpg', 1200)} 1200w
              `}
          /> */}
          {/* Оригинальный формат как fallback */}
          <NextImage
            src={src}
            alt={alt}
            fill={true}
            className={`object-cover rounded-xl z-10 ${className}`}
            onLoad={handleLoad}
            onError={handleError}
            onClick={onClick}
          />
          <img
            src={getOptimizedUrl()}
            alt={alt}
            className={`absolute z-0 inset-0 w-full h-full object-cover aspect-square filter blur-xl scale-105 saturate-150 opacity-70 translate-y-1 rounded-large`}
          />
        </picture>
      )}
      {/* </motion.div> */}

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
