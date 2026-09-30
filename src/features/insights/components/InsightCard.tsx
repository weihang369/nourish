import { motion } from 'motion/react'
import type { ReactNode } from 'react'
import { Card } from '@/components/ui'
import { cn } from '@/lib/cn'
import { riseIn } from '@/lib/motion'

interface InsightCardProps {
  title: string
  trailing?: ReactNode
  children: ReactNode
  className?: string
}

/** Card with a Fraunces title row; rises in as it scrolls into view. */
export function InsightCard({ title, trailing, children, className }: InsightCardProps) {
  return (
    <motion.section
      variants={riseIn}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.25 }}
      className={cn('px-5', className)}
    >
      <Card>
        <div className="flex items-start justify-between gap-3">
          <h2 className="font-display text-[20px] leading-tight font-medium">{title}</h2>
          {trailing}
        </div>
        {children}
      </Card>
    </motion.section>
  )
}

/** Status pill — the dot colour is always paired with a word. */
export function StatusPill({ tone, children }: { tone: 'good' | 'warm' | 'neutral'; children: ReactNode }) {
  const dot = { good: 'bg-brand', warm: 'bg-ember', neutral: 'bg-ink-3' }[tone]
  return (
    <span className="inline-flex h-7 shrink-0 items-center gap-1.5 rounded-full bg-surface-2 px-2.5 text-[11.5px] font-semibold text-ink-2">
      <span className={cn('size-1.5 rounded-full', dot)} />
      {children}
    </span>
  )
}
