import { AnimatePresence, motion } from 'motion/react'
import { CalorieBarChart } from '@/components/charts'
import type { CaloriePoint, InsightRange } from '@/data/insights'
import { formatInt } from '@/lib/format'
import { type CalorieSummary, describeDelta } from '../summary'
import { InsightCard, StatusPill } from './InsightCard'

interface CaloriesCardProps {
  range: InsightRange
  data: CaloriePoint[]
  goal: number
  summary: CalorieSummary
}

export function CaloriesCard({ range, data, goal, summary }: CaloriesCardProps) {
  const within = Math.abs(summary.deltaPct) <= 5
  const status = within ? 'On track' : summary.deltaPct < 0 ? 'Running light' : 'Running warm'

  return (
    <InsightCard
      title="Calories"
      trailing={<StatusPill tone={within ? 'good' : 'warm'}>{status}</StatusPill>}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.p
          key={range}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.2 }}
          className="mt-1 text-[13.5px] text-ink-2"
        >
          Averaging <span className="font-semibold text-ink tabular">{formatInt(summary.avg)} kcal</span> —{' '}
          {describeDelta(summary.deltaPct)}
        </motion.p>
      </AnimatePresence>
      <div className="mt-1">
        {/* Keyed on range so the bars regrow from the baseline on every switch */}
        <CalorieBarChart key={range} data={data} goal={goal} />
      </div>
    </InsightCard>
  )
}
