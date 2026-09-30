import { motion } from 'motion/react'
import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'
import { riseIn, spring } from '@/lib/motion'

interface QuickActionTileProps {
  icon: ReactNode
  title: string
  sub: string
  onClick: () => void
  /** Rich, dark treatment for the headline action */
  featured?: boolean
  badge?: string
  iconClassName?: string
}

export function QuickActionTile({ icon, title, sub, onClick, featured, badge, iconClassName }: QuickActionTileProps) {
  return (
    <motion.button
      type="button"
      variants={riseIn}
      whileTap={{ scale: 0.96 }}
      transition={spring.snappy}
      onClick={onClick}
      className={cn(
        'relative flex min-h-[132px] flex-col items-start overflow-hidden rounded-[24px] p-4 text-left',
        featured ? 'bg-deep text-on-deep' : 'bg-surface-2 text-ink',
      )}
    >
      {featured && (
        <span aria-hidden className="pointer-events-none absolute -top-10 -right-10 size-32 rounded-full bg-lime/25 blur-2xl" />
      )}
      <span className={cn('relative grid size-11 place-items-center rounded-[15px] [&_svg]:size-[21px]', iconClassName)}>
        {icon}
      </span>
      {badge && (
        <span className="absolute top-4 right-4 inline-flex h-6 items-center rounded-full bg-lime px-2.5 text-[11px] font-bold tracking-wide text-[#14201a]">
          {badge}
        </span>
      )}
      <span className="relative mt-auto pt-4 text-[15px] leading-tight font-semibold">{title}</span>
      <span className={cn('relative mt-1 text-[12.5px] leading-snug', featured ? 'text-on-deep/65' : 'text-ink-3')}>
        {sub}
      </span>
    </motion.button>
  )
}
