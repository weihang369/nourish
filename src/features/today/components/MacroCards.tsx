import { motion } from 'motion/react'
import { AnimatedNumber, ProgressBar } from '@/components/ui'
import { useDiary } from '@/hooks/useDiary'
import { cn } from '@/lib/cn'
import { formatInt } from '@/lib/format'
import { riseIn } from '@/lib/motion'
import { macroKeys, macroMeta } from '@/lib/nutrition'
import type { MacroKey } from '@/types/nutrition'

export function MacroCards() {
  const { total, goals } = useDiary()
  return (
    <motion.section variants={riseIn} aria-label="Macros" className="mt-3 grid grid-cols-3 gap-2.5 px-5">
      {macroKeys.map((key, i) => (
        <MacroCard key={key} macro={key} eaten={total[key]} goal={goals[key]} delay={0.25 + i * 0.08} />
      ))}
    </motion.section>
  )
}

function MacroCard({ macro, eaten, goal, delay }: { macro: MacroKey; eaten: number; goal: number; delay: number }) {
  const meta = macroMeta[macro]
  const left = Math.round(goal - eaten)
  return (
    <div className="rounded-[22px] bg-surface px-3 py-3.5 shadow-card ring-1 ring-line ring-inset">
      <p className="flex items-center gap-1.5 text-[12px] font-semibold text-ink-2">
        <span className={cn('size-2 rounded-full', meta.bg)} />
        {meta.label}
      </p>
      <p className="mt-2 flex items-baseline gap-0.5 whitespace-nowrap">
        <AnimatedNumber value={eaten} className="font-display text-[23px] leading-none font-medium tracking-[-0.03em]" />
        <span className="text-[11.5px] font-medium text-ink-3 tabular">/{formatInt(goal)} g</span>
      </p>
      <ProgressBar
        value={goal > 0 ? eaten / goal : 0}
        color={meta.color}
        delay={delay}
        className="mt-3"
        label={`${meta.label} ${Math.round(eaten)} of ${goal} grams`}
      />
      <p className="mt-2 text-[11.5px] font-medium text-ink-3 tabular">
        {left >= 0 ? `${formatInt(left)} g left` : `${formatInt(-left)} g over`}
      </p>
    </div>
  )
}
