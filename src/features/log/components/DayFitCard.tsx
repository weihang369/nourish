import { motion } from 'motion/react'
import { AnimatedNumber, Card } from '@/components/ui'
import { cn } from '@/lib/cn'
import { formatInt } from '@/lib/format'
import { spring } from '@/lib/motion'

interface DayFitCardProps {
  eaten: number
  adding: number
  budget: number
  mealName: string
}

const hatch = 'repeating-linear-gradient(135deg, rgb(20 32 26 / 0.22) 0 2px, transparent 2px 6px)'

/** Stacked bar: already eaten + this food against today's budget. */
export function DayFitCard({ eaten, adding, budget, mealName }: DayFitCardProps) {
  const after = eaten + adding
  const scale = Math.max(budget, after) || 1
  const left = Math.round(budget - after)
  const over = left < 0
  const pct = (v: number) => `${(Math.max(0, v) / scale) * 100}%`
  const withinBudget = Math.max(0, Math.min(adding, budget - eaten))
  const overflow = adding - withinBudget

  return (
    <Card>
      <p className="text-[11px] font-semibold tracking-[0.14em] text-ink-3 uppercase">How it fits your day</p>
      <p className="mt-2 font-display text-[21px] leading-snug font-medium">
        {over ? (
          <>
            Takes you <AnimatedNumber value={-left} duration={0.6} className="text-ember" /> kcal past today’s budget
          </>
        ) : (
          <>
            Leaves <AnimatedNumber value={left} duration={0.6} /> kcal for the rest of today
          </>
        )}
      </p>
      <p className="mt-1 text-[13px] text-ink-2">
        {over
          ? 'Totally fine now and then — a lighter next meal evens it out.'
          : `A comfortable fit for ${mealName}, with room to spare.`}
      </p>

      <div
        role="img"
        aria-label={`Eaten ${formatInt(eaten)} kcal, this food ${formatInt(adding)} kcal, budget ${formatInt(budget)} kcal`}
        className="relative mt-5"
      >
        <div className="flex h-4 overflow-hidden rounded-full bg-surface-2">
          <motion.div
            className="h-full shrink-0 bg-ink/75"
            initial={{ width: 0 }}
            animate={{ width: pct(eaten) }}
            transition={spring.smooth}
          />
          <motion.div
            className={cn('h-full shrink-0 border-surface bg-lime', withinBudget > 0 && eaten > 0 && 'border-l-2')}
            style={{ backgroundImage: hatch }}
            initial={{ width: 0 }}
            animate={{ width: pct(withinBudget) }}
            transition={{ ...spring.smooth, delay: 0.15 }}
          />
          <motion.div
            className="h-full shrink-0 bg-ember"
            style={{ backgroundImage: hatch }}
            initial={{ width: 0 }}
            animate={{ width: pct(overflow) }}
            transition={{ ...spring.smooth, delay: 0.2 }}
          />
        </div>
        {over && (
          <motion.span
            aria-hidden
            className="absolute -top-1 -bottom-1 w-0.5 rounded-full bg-ink"
            initial={{ left: '100%' }}
            animate={{ left: pct(budget) }}
            transition={spring.smooth}
          />
        )}
      </div>

      <ul className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-[12px] text-ink-2 tabular">
        <li className="flex items-center gap-1.5">
          <span aria-hidden className="size-2.5 rounded-full bg-ink/75" />
          Eaten {formatInt(eaten)}
        </li>
        <li className="flex items-center gap-1.5">
          <span aria-hidden className="size-2.5 rounded-full bg-lime" style={{ backgroundImage: hatch }} />
          This food {formatInt(adding)}
        </li>
        <li className="ml-auto text-ink-3">of {formatInt(budget)} kcal</li>
      </ul>
    </Card>
  )
}
