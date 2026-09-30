import { motion } from 'motion/react'
import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'
import { easeOutExpo } from '@/lib/motion'

interface ProgressRingProps {
  value: number
  size?: number
  stroke?: number
  color?: string
  trackColor?: string
  delay?: number
  label?: string
  className?: string
  children?: ReactNode
}

/** Single-series ring. Values above 1 are clamped; the center slot carries the number. */
export function ProgressRing({
  value,
  size = 64,
  stroke = 6,
  color = 'var(--nr-brand)',
  trackColor = 'var(--nr-surface-2)',
  delay = 0,
  label,
  className,
  children,
}: ProgressRingProps) {
  const r = (size - stroke) / 2
  const v = Math.max(0, Math.min(1, value))
  return (
    <div
      className={cn('relative inline-grid shrink-0 place-items-center', className)}
      style={{ width: size, height: size }}
      role="img"
      aria-label={label}
    >
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="absolute inset-0 -rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={trackColor} strokeWidth={stroke} />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: v, opacity: v > 0 ? 1 : 0 }}
          transition={{ duration: 1.2, delay, ease: easeOutExpo }}
        />
      </svg>
      {children && <div className="relative">{children}</div>}
    </div>
  )
}
