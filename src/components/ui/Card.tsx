import { type HTMLMotionProps, motion } from 'motion/react'
import { cn } from '@/lib/cn'

type Tone = 'surface' | 'deep' | 'soft' | 'brand-soft'

interface CardProps extends HTMLMotionProps<'div'> {
  tone?: Tone
  padded?: boolean
  interactive?: boolean
}

const tones: Record<Tone, string> = {
  surface: 'bg-surface shadow-card ring-1 ring-inset ring-line',
  deep: 'bg-deep text-on-deep',
  soft: 'bg-surface-2',
  'brand-soft': 'bg-brand-soft',
}

export function Card({ tone = 'surface', padded = true, interactive, className, ...props }: CardProps) {
  return (
    <motion.div
      whileTap={interactive ? { scale: 0.985 } : undefined}
      className={cn('relative rounded-[28px]', tones[tone], padded && 'p-5', interactive && 'cursor-pointer', className)}
      {...props}
    />
  )
}
