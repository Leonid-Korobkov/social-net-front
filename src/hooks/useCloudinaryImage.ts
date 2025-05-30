'use client'

import { useState } from 'react'

export interface UseCloudinaryImageProps {
  src?: string | undefined
  width?: number
}

export interface CloudinaryTransformations {
  format?: string
  width?: number
  quality?: string
  blur?: number
  progressive?: boolean
  cache?: boolean
}

export const useCloudinaryImage = ({
  src = '',
  width = 800,
}: UseCloudinaryImageProps) => {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(false)

  const getCloudinaryUrl = (
    transformations: CloudinaryTransformations,
    customSrc = src
  ) => {
    if (!customSrc) return ''
    if (!customSrc.includes('cloudinary.com')) return customSrc

    const baseUrl = customSrc.split('upload/')[0] + 'upload/'
    const imagePath = customSrc.split('upload/')[1]

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
    imageWidth: number = width
  ) => {
    return getCloudinaryUrl({
      format,
      width: imageWidth,
      progressive: true,
      cache: true,
    })
  }

  const getOptimizedUrlByCustomSrc = (
    customSrc: string,
    format: string = 'auto',
    imageWidth: number = width
  ) => {
    return getCloudinaryUrl(
      {
        format,
        width: imageWidth,
        progressive: true,
        cache: true,
      },
      customSrc
    )
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
    getOptimizedUrlByCustomSrc,
  }
}
