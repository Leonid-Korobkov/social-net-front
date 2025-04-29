import {
  CloudinaryTransformations,
  UseCloudinaryImageProps,
} from '@/hooks/useCloudinaryImage'

// Demo: https://res.cloudinary.com/demo/image/upload/w_300,c_limit,q_auto/turtles.jpg
export default function cloudinaryLoader({
  src,
  format = 'auto',
  width = 800,
  quality = 'auto',
  progressive = true,
  cache = true,
}: UseCloudinaryImageProps & CloudinaryTransformations) {
  if (!src) return ''
  if (!src.includes('cloudinary.com')) return src

  const transforms = [
    `f_${format || 'auto'}`,
    'c_limit',
    `w_${width || 800}`,
    `q_${quality || 'auto'}`,
    progressive && 'fl_progressive',
    cache && 'fl_immutable_cache',
  ]
    .filter(Boolean)
    .join(',')

  const baseUrl = src.split('upload/')[0] + 'upload/'
  const imagePath = src.split('upload/')[1]

  return `${baseUrl}${transforms}/${imagePath}`
}
