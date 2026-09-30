import { type HTMLMotionProps, motion } from 'motion/react'
import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'
import { spring } from '@/lib/motion'

type Variant = 'surface' | 'soft' | 'ghost' | 'glass' | 'brand'

interface IconButtonProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
  label: string
  variant?: Variant
  size?: 'sm' | 'md' | 'lg'
  badge?: boolean
  children: ReactNode
}

const variants: Record<Variant, string> = {
  surface: 'bg-surface text-ink shadow-card ring-1 ring-inset ring-line',
  soft: 'bg-surface-2 text-ink',
  ghost: 'text-ink hover:bg-surface-2',
  glass: 'glass-dark text-white ring-1 ring-inset ring-white/15',
  brand: 'bg-brand text-brand-ink',
}

const sizes = { sm: 'size-8 [&_svg]:size-4', md: 'size-10 [&_svg]:size-[18px]', lg: 'size-12 [&_svg]:size-5' }

export function IconButton({ label, variant = 'surface', size = 'md', badge, className, children, ...props }: IconButtonProps) {
  return (
    <motion.button
      type="button"
      aria-label={label}
      title={label}
      whileTap={{ scale: 0.9 }}
      transition={spring.snappy}
      className={cn(
        'relative inline-grid shrink-0 place-items-center rounded-full transition-colors',
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    >
      {children}
      {badge && <span className="absolute top-2 right-2 size-2 rounded-full bg-ember ring-2 ring-surface" />}
    </motion.button>
  )
}
