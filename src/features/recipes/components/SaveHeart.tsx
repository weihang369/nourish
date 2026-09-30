import { Heart } from 'lucide-react'
import { motion } from 'motion/react'
import { IconButton } from '@/components/ui'
import { cn } from '@/lib/cn'
import { spring } from '@/lib/motion'
import { useSavedRecipe } from '../lib/useSavedRecipe'

interface SaveHeartProps {
  recipeId: string
  title: string
  variant?: 'glass' | 'surface'
  className?: string
}

/** Heart toggle with a small "pop" when it fills. Works on photos (glass) and on surfaces. */
export function SaveHeart({ recipeId, title, variant = 'glass', className }: SaveHeartProps) {
  const [saved, toggle] = useSavedRecipe(recipeId)
  return (
    <IconButton
      label={saved ? `Remove ${title} from saved` : `Save ${title}`}
      aria-pressed={saved}
      variant={variant}
      onClick={toggle}
      className={className}
    >
      <motion.span
        className="grid place-items-center"
        initial={false}
        animate={{ scale: saved ? [1, 1.35, 1] : 1 }}
        transition={saved ? { duration: 0.42, times: [0, 0.4, 1] } : spring.snappy}
      >
        <Heart className={cn('transition-[fill] duration-200', saved && 'fill-current')} strokeWidth={2.2} />
      </motion.span>
    </IconButton>
  )
}
