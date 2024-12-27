import { motion } from 'framer-motion'
import { Image as NextImage, Skeleton } from '@nextui-org/react'
import { useCloudinaryImage } from '../../../hooks/useCloudinaryImage'

interface ImageWithSkeletonProps {
  src: string
  alt: string
  className?: string
  sizes?: string
  width?: number
  [key: string]: any
}

function ImageWithSkeleton({
  src,
  alt,
  className = '',
  sizes = '(max-width: 768px) 100vw, 50vw',
  width = 800,
  ...props
}: ImageWithSkeletonProps) {
  const { isLoading, error, getOptimizedUrl, handleLoad, handleError } =
    useCloudinaryImage({ src, width })

  return (
    <div className={`relative aspect-square lg:w-full lg:h-full`}>
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
          {/* AVIF формат */}
          <source
            type="image/avif"
            sizes={sizes}
            srcSet={`
                ${getOptimizedUrl('avif', 400)} 400w,
                ${getOptimizedUrl('avif', 800)} 800w,
                ${getOptimizedUrl('avif', 1200)} 1200w
              `}
          />
          {/* WebP формат */}
          <source
            type="image/webp"
            sizes={sizes}
            srcSet={`
                ${getOptimizedUrl('webp', 400)} 400w,
                ${getOptimizedUrl('webp', 800)} 800w,
                ${getOptimizedUrl('webp', 1200)} 1200w
              `}
          />
          {/* png формат */}
          <source
            type="image/png"
            sizes={sizes}
            srcSet={`
                ${getOptimizedUrl('png', 400)} 400w,
                ${getOptimizedUrl('png', 800)} 800w,
                ${getOptimizedUrl('png', 1200)} 1200w
              `}
          />
          {/* jpg формат */}
          <source
            type="image/jpg"
            sizes={sizes}
            srcSet={`
                ${getOptimizedUrl('jpg', 400)} 400w,
                ${getOptimizedUrl('jpg', 800)} 800w,
                ${getOptimizedUrl('jpg', 1200)} 1200w
              `}
          />
          {/* Оригинальный формат как fallback */}
          <NextImage
            src={getOptimizedUrl()}
            alt={alt}
            className={`w-full h-full object-cover rounded-xl aspect-square ${className}`}
            {...props}
            onLoad={handleLoad}
            onError={handleError}
          />
        </picture>
      )}
      {/* </motion.div> */}

      {error && (
        <div className="w-full h-[200px] flex items-center justify-center bg-default-100 rounded-xl">
          <p className="text-default-500">Ошибка загрузки изображения</p>
        </div>
      )}
    </div>
  )
}

export default ImageWithSkeleton
