import { type HTMLMotionProps, motion } from 'motion/react'
import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'
import { spring } from '@/lib/motion'

type Variant = 'primary' | 'secondary' | 'ghost' | 'deep' | 'lime' | 'outline' | 'glass'
type Size = 'sm' | 'md' | 'lg'

export interface ButtonProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
  variant?: Variant
  size?: Size
  block?: boolean
  leading?: ReactNode
  trailing?: ReactNode
  children?: ReactNode
}

const variants: Record<Variant, string> = {
  primary: 'bg-brand text-brand-ink shadow-glow',
  secondary: 'bg-surface-2 text-ink',
  ghost: 'bg-transparent text-ink hover:bg-surface-2',
  deep: 'bg-deep text-on-deep',
  lime: 'bg-lime text-[#14201a]',
  outline: 'bg-transparent text-ink ring-1 ring-inset ring-line',
  glass: 'glass-dark text-white ring-1 ring-inset ring-white/15',
}

const sizes: Record<Size, string> = {
  sm: 'h-9 gap-1.5 px-3.5 text-[13px]',
  md: 'h-12 gap-2 px-5 text-[15px]',
  lg: 'h-14 gap-2.5 px-6 text-base',
}

export function Button({
  variant = 'primary',
  size = 'md',
  block,
  leading,
  trailing,
  className,
  children,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <motion.button
      type="button"
      whileTap={disabled ? undefined : { scale: 0.97 }}
      transition={spring.snappy}
      disabled={disabled}
      className={cn(
        'inline-flex shrink-0 items-center justify-center rounded-full font-semibold tracking-[-0.01em] whitespace-nowrap transition-colors select-none disabled:cursor-not-allowed disabled:opacity-40',
        variants[variant],
        sizes[size],
        block && 'w-full',
        className,
      )}
      {...props}
    >
      {leading}
      {children}
      {trailing}
    </motion.button>
  )
}
