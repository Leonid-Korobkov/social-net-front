import { motion } from 'framer-motion'
import { Image as NextImage } from '@nextui-org/react'
import { useCloudinaryImage } from '../../../hooks/useCloudinaryImage'

interface ImageWithBlurredLoaderProps {
  src: string
  alt: string
  className?: string
  sizes?: string
  width?: number
  [key: string]: any
}

function ImageWithBlurredLoader({
  src,
  alt,
  className = '',
  sizes = '(max-width: 768px) 100vw, 50vw',
  width = 800,
  ...props
}: ImageWithBlurredLoaderProps) {
  const {
    isLoading,
    error,
    getOptimizedUrl,
    getBlurredUrl,
    handleLoad,
    handleError,
  } = useCloudinaryImage({ src, width })

  if (error) {
    return (
      <div className="w-full h-full min-h-[200px] flex items-center justify-center bg-default-100 rounded-xl">
        <p className="text-default-500">Ошибка загрузки изображения</p>
      </div>
    )
  }

  return (
    <div className="relative w-full h-full">
      {/* Размытое превью */}
      {isLoading && (
        <div className="absolute inset-0">
          <img
            src={getBlurredUrl()}
            alt={alt}
            className="w-full h-full object-cover rounded-xl blur-md aspect-square"
          />
        </div>
      )}

      {/* Основное изображение */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isLoading ? 0 : 1 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
      >
        <picture>
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
          <NextImage
            src={getOptimizedUrl()}
            alt={alt}
            className={`w-full h-full object-cover rounded-xl aspect-square ${className}`}
            onLoad={handleLoad}
            onError={handleError}
            {...props}
          />
        </picture>
      </motion.div>
    </div>
  )
}

export default ImageWithBlurredLoader
