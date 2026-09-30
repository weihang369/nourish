import { motion } from 'motion/react'
import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'
import { spring } from '@/lib/motion'

interface ChipProps {
  selected?: boolean
  onClick?: () => void
  icon?: ReactNode
  children: ReactNode
  className?: string
  size?: 'sm' | 'md'
}

export function Chip({ selected, onClick, icon, children, className, size = 'md' }: ChipProps) {
  return (
    <motion.button
      type="button"
      aria-pressed={selected}
      whileTap={{ scale: 0.94 }}
      transition={spring.snappy}
      onClick={onClick}
      className={cn(
        'inline-flex shrink-0 items-center gap-1.5 rounded-full font-medium whitespace-nowrap transition-colors duration-300',
        size === 'md' ? 'h-10 px-4 text-[13px]' : 'h-7 px-3 text-xs',
        selected ? 'bg-ink text-canvas' : 'bg-surface text-ink-2 ring-1 ring-inset ring-line hover:text-ink',
        className,
      )}
    >
      {icon}
      {children}
    </motion.button>
  )
}

export function Tag({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex h-6 items-center rounded-full bg-surface-2 px-2.5 text-[11px] font-semibold tracking-wide text-ink-2',
        className,
      )}
    >
      {children}
    </span>
  )
}
