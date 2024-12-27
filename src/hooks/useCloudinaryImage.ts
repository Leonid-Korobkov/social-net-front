import { useState } from 'react'

interface UseCloudinaryImageProps {
  src: string | undefined
  width?: number
}

interface CloudinaryTransformations {
  format?: string
  width?: number
  quality?: string
  blur?: number
  progressive?: boolean
  cache?: boolean
}

export const useCloudinaryImage = ({
  src,
  width = 800,
}: UseCloudinaryImageProps) => {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(false)

  const getCloudinaryUrl = (transformations: CloudinaryTransformations) => {
    if (!src) return ''
    if (!src.includes('cloudinary.com')) return src

    const baseUrl = src.split('upload/')[0] + 'upload/'
    const imagePath = src.split('upload/')[1]

    const {
      format = 'auto',
      width: imageWidth = width,
      quality = 'auto:best',
      blur,
      progressive = false,
      cache = false,
    } = transformations

    const transforms = [
      `q_${quality}`,
      progressive && 'fl_progressive',
      `w_${imageWidth}`,
      format !== 'auto' && `f_${format}`,
      blur && `e_blur:${blur}`,
      cache && 'fl_immutable_cache',
    ]
      .filter(Boolean)
      .join(',')

    return `${baseUrl}${transforms}/${imagePath}`
  }

  const getOptimizedUrl = (
    format: string = 'auto',
    imageWidth: number = width,
  ) => {
    return getCloudinaryUrl({
      format,
      width: imageWidth,
      progressive: true,
      cache: true,
    })
  }

  const getBlurredUrl = () => {
    return getCloudinaryUrl({
      width: 50,
      quality: '10',
      blur: 1000,
    })
  }

  const handleLoad = () => setIsLoading(false)
  const handleError = () => {
    setError(true)
    setIsLoading(false)
  }

  return {
    isLoading,
    error,
    getOptimizedUrl,
    getBlurredUrl,
    handleLoad,
    handleError,
  }
}
