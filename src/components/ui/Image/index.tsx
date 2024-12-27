import { ImageProps } from '@nextui-org/react'
import ImageWithSkeleton from '../ImageWithSkeleton'

function Image({ src, alt, className, width, ...props }: ImageProps) {
  return (
    <ImageWithSkeleton
      src={src || ''}
      alt={alt || ''}
      className={className}
      width={typeof width === 'string' ? parseInt(width) : width}
      {...props}
    />
  )
}

export default Image
