import { motion } from 'motion/react'
import type { ReactNode } from 'react'
import { easeOutExpo } from '@/lib/motion'

interface EmptyStateProps {
  emoji: string
  title: string
  body: string
  children?: ReactNode
}

/** Soft, centered empty state — an emoji "plate", a title and a nudge. */
export function EmptyState({ emoji, title, body, children }: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: easeOutExpo }}
      className="flex flex-col items-center px-6 pt-10 pb-6 text-center"
    >
      <div className="relative grid size-24 place-items-center">
        <span aria-hidden className="absolute inset-0 rounded-full bg-surface-2" />
        <span aria-hidden className="absolute inset-3 rounded-full bg-surface shadow-card ring-1 ring-line" />
        <span aria-hidden className="relative text-[34px]">{emoji}</span>
      </div>
      <h3 className="mt-5 font-display text-[22px] leading-tight font-medium text-balance">{title}</h3>
      <p className="mt-2 max-w-[270px] text-[14px] leading-relaxed text-pretty text-ink-2">{body}</p>
      {children && <div className="mt-5 flex flex-wrap justify-center gap-2">{children}</div>}
    </motion.div>
  )
}
