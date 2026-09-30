import { photoUrl } from '@/data/photos'
import { cn } from '@/lib/cn'

interface AvatarProps {
  photo: string
  name: string
  size?: number
  className?: string
  ring?: boolean
}

export function Avatar({ photo, name, size = 40, className, ring }: AvatarProps) {
  return (
    <img
      src={photoUrl(photo, size * 2, size * 2)}
      alt={name}
      width={size}
      height={size}
      className={cn('shrink-0 rounded-full bg-surface-2 object-cover', ring && 'ring-2 ring-surface', className)}
      style={{ width: size, height: size }}
    />
  )
}
