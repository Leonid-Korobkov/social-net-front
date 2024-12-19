import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Image, Skeleton } from '@nextui-org/react'

interface ImageWithSkeletonProps {
  src: string
  alt: string
  className?: string
}

function ImageWithSkeleton({ src, alt, className }: ImageWithSkeletonProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(false)

  return (
    <div className={`relative ${className}`}>
      <AnimatePresence mode="wait">
        {isLoading && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0"
          >
            <Skeleton className="w-full h-full rounded-xl">
              <div className="h-[300px] rounded-xl bg-default-300"></div>
            </Skeleton>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isLoading ? 0 : 1 }}
        transition={{ duration: 0.2 }}
      >
        <Image
          src={src}
          alt={alt}
          className={`object-cover rounded-xl ${error ? 'hidden' : ''}`}
          onLoad={() => setIsLoading(false)}
          onError={() => {
            setError(true)
            setIsLoading(false)
          }}
        />
      </motion.div>

      {error && (
        <div className="w-full h-[200px] flex items-center justify-center bg-default-100 rounded-xl">
          <p className="text-default-500">Ошибка загрузки изображения</p>
        </div>
      )}
    </div>
  )
}

export default ImageWithSkeleton
