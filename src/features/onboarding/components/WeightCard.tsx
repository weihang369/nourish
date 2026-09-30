import { AnimatePresence, motion } from 'motion/react'
import type { ReactNode } from 'react'
import { Card } from '@/components/ui'
import { riseIn, spring } from '@/lib/motion'
import { RulerPicker } from './RulerPicker'

interface WeightCardProps {
  label: string
  value: number
  onChange: (value: number) => void
  /** Optional pill on the right of the reading (e.g. the delta to target) */
  badge?: ReactNode
  badgeKey?: string
}

/** A big live Fraunces reading above a draggable ruler. */
export function WeightCard({ label, value, onChange, badge, badgeKey }: WeightCardProps) {
  const [whole, tenth] = value.toFixed(1).split('.')

  return (
    <Card variants={riseIn} className="overflow-hidden pb-3">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[11px] font-semibold tracking-[0.14em] text-ink-3 uppercase">{label}</p>
          <p className="mt-1 flex items-baseline font-display leading-none font-medium tabular" aria-hidden>
            <span className="text-[52px]">{whole}</span>
            <span className="text-[34px] text-ink-3">.{tenth}</span>
            <span className="ml-1.5 font-sans text-[15px] font-semibold text-ink-2">kg</span>
          </p>
        </div>
        <AnimatePresence mode="popLayout" initial={false}>
          {badge && (
            <motion.span
              key={badgeKey}
              initial={{ opacity: 0, y: -6, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 6, scale: 0.9 }}
              transition={spring.snappy}
              className="mt-0.5 inline-flex h-7 items-center rounded-full bg-brand-soft px-3 text-[12px] font-semibold text-ink tabular"
            >
              {badge}
            </motion.span>
          )}
        </AnimatePresence>
      </div>
      <RulerPicker label={label} value={value} onChange={onChange} className="-mx-5 mt-4" />
    </Card>
  )
}
