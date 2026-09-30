import { CalendarCheck, Flame, Utensils } from 'lucide-react'
import { motion } from 'motion/react'
import type { ReactNode } from 'react'
import { AnimatedNumber } from '@/components/ui'
import { cn } from '@/lib/cn'
import { riseIn, stagger } from '@/lib/motion'

interface SummaryStatsProps {
  avgKcal: number
  onTarget: number
  total: number
  unit: string
  streakDays: number
}

export function SummaryStats({ avgKcal, onTarget, total, unit, streakDays }: SummaryStatsProps) {
  const pct = Math.round((onTarget / total) * 100)
  return (
    <motion.div variants={stagger} initial="hidden" animate="show" className="grid grid-cols-3 gap-2.5">
      <StatTile icon={<Utensils />} iconClass="bg-brand-soft text-brand" label="Avg kcal / day">
        <AnimatedNumber value={avgKcal} />
      </StatTile>
      <StatTile icon={<CalendarCheck />} iconClass="bg-surface-2 text-ink-2" label={`${onTarget} of ${total} ${unit}`}>
        <AnimatedNumber value={pct} />
        <span className="ml-0.5 text-[15px] text-ink-3">%</span>
      </StatTile>
      <StatTile
        icon={<Flame className="fill-ember/25" />}
        iconClass="bg-ember/15 text-ember"
        label="Day streak"
        className="bg-linear-to-b from-ember/[0.07] to-surface"
      >
        <AnimatedNumber value={streakDays} />
      </StatTile>
    </motion.div>
  )
}

interface StatTileProps {
  icon: ReactNode
  iconClass: string
  label: string
  children: ReactNode
  className?: string
}

function StatTile({ icon, iconClass, label, children, className }: StatTileProps) {
  return (
    <motion.div
      variants={riseIn}
      className={cn('rounded-[22px] bg-surface p-3.5 shadow-card ring-1 ring-line ring-inset', className)}
    >
      <span className={cn('grid size-7 place-items-center rounded-full [&_svg]:size-3.5', iconClass)}>{icon}</span>
      <p className="mt-3 font-display text-[26px] leading-none font-medium">{children}</p>
      <p className="mt-1.5 truncate text-[11px] font-medium text-ink-3">{label}</p>
    </motion.div>
  )
}
