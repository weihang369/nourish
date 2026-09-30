import { useState } from 'react'
import { photoUrl } from '@/data/photos'
import { cn } from '@/lib/cn'

interface FoodImageProps {
  photo?: string
  emoji: string
  alt: string
  /** Rendered CSS width in px — used to request the right image size */
  width?: number
  height?: number
  className?: string
  priority?: boolean
}

/**
 * Photo with a shimmer placeholder and a graceful emoji fallback
 * (offline, missing photo, or a failed request).
 */
export function FoodImage({ photo, emoji, alt, width = 400, height, className, priority }: FoodImageProps) {
  const [loaded, setLoaded] = useState(false)
  const [failed, setFailed] = useState(false)

  if (!photo || failed) {
    return (
      <div
        role="img"
        aria-label={alt}
        className={cn(
          '@container grid place-items-center overflow-hidden bg-linear-to-br from-surface-2 to-surface-3',
          className,
        )}
      >
        <span className="text-[46cqw] leading-none drop-shadow-sm select-none">{emoji}</span>
      </div>
    )
  }

  const h2 = height ? height * 2 : undefined
  return (
    <div className={cn('relative overflow-hidden bg-surface-2', className)}>
      {!loaded && <div className="skeleton absolute inset-0" />}
      <img
        src={photoUrl(photo, width * 2, h2)}
        alt={alt}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        draggable={false}
        onLoad={() => setLoaded(true)}
        onError={() => setFailed(true)}
        className={cn(
          'size-full object-cover transition-[opacity,transform] duration-700 ease-out-expo',
          loaded ? 'scale-100 opacity-100' : 'scale-105 opacity-0',
        )}
      />
    </div>
  )
}
