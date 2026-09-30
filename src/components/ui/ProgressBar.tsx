import { motion } from 'motion/react'
import { cn } from '@/lib/cn'
import { easeOutExpo } from '@/lib/motion'

interface ProgressBarProps {
  value: number
  color?: string
  className?: string
  trackClassName?: string
  delay?: number
  label?: string
}

export function ProgressBar({ value, color = 'var(--nr-brand)', className, trackClassName, delay = 0, label }: ProgressBarProps) {
  const pct = Math.max(0, Math.min(1, value)) * 100
  return (
    <div
      role="progressbar"
      aria-label={label}
      aria-valuenow={Math.round(pct)}
      aria-valuemin={0}
      aria-valuemax={100}
      className={cn('h-1.5 overflow-hidden rounded-full bg-surface-2', trackClassName, className)}
    >
      <motion.div
        className="h-full rounded-full"
        style={{ background: color }}
        initial={{ width: 0 }}
        animate={{ width: `${pct}%` }}
        transition={{ duration: 1, delay, ease: easeOutExpo }}
      />
    </div>
  )
}
