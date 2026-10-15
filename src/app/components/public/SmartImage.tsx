import { useState } from 'react'
import { cloudinarySrcSet, cloudinaryUrl, isCloudinaryUrl } from '@/app/lib/cloudinary'

interface SmartImageProps {
  src: string
  alt: string
  className?: string
  width?: number
  height?: number
  priority?: boolean
  sizes?: string
}

export function SmartImage({
  src,
  alt,
  className = '',
  width = 1200,
  height = 900,
  priority = false,
  sizes = '(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw',
}: SmartImageProps) {
  const [loaded, setLoaded] = useState(false)
  const [failed, setFailed] = useState(false)
  if (!src || failed) {
    return <div className={`pk-fallback ${className}`} aria-hidden={!alt} />
  }

  const full = cloudinaryUrl(src, { width: Math.min(width, 1600) })
  const blur = isCloudinaryUrl(src) ? cloudinaryUrl(src, { blur: true }) : ''

  return (
    <span className="relative block h-full w-full">
      {blur && !loaded && (
        <img
          src={blur}
          alt=""
          aria-hidden="true"
          className={`absolute inset-0 h-full w-full scale-105 object-cover blur-md ${className}`}
        />
      )}
      <img
        src={full}
        srcSet={cloudinarySrcSet(src, [480, 800, 1200, 1600])}
        sizes={sizes}
        alt={alt}
        width={width}
        height={height}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        onLoad={() => setLoaded(true)}
        onError={() => setFailed(true)}
        className={`h-full w-full object-cover ${className}`}
      />
    </span>
  )
}
