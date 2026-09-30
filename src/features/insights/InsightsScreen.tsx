import { AnimatePresence, motion } from 'motion/react'
import { useMemo, useState } from 'react'
import { Screen } from '@/components/layout'
import { SegmentedControl } from '@/components/ui'
import { caloriesFor, type InsightRange, weightTrend } from '@/data/insights'
import { user } from '@/data/user'
import { riseIn, stagger } from '@/lib/motion'
import { useAppStore } from '@/store/useAppStore'
import { AskCoachCard } from './components/AskCoachCard'
import { CaloriesCard } from './components/CaloriesCard'
import { ConsistencyCard } from './components/ConsistencyCard'
import { HighlightsList } from './components/HighlightsList'
import { MacroBalanceCard } from './components/MacroBalanceCard'
import { SummaryStats } from './components/SummaryStats'
import { WeightCard } from './components/WeightCard'
import { rangeMeta, summarizeCalories } from './summary'

const rangeOptions = (Object.keys(rangeMeta) as InsightRange[]).map((value) => ({
  value,
  label: rangeMeta[value].label,
}))

export function InsightsScreen() {
  const [range, setRange] = useState<InsightRange>('week')
  const goals = useAppStore((s) => s.goals)

  const calories = useMemo(() => caloriesFor(range), [range])
  const summary = useMemo(() => summarizeCalories(calories, goals.kcal), [calories, goals.kcal])
  const trend = useMemo(() => weightTrend(), [])

  return (
    <Screen withTabBar>
      <motion.header variants={stagger} initial="hidden" animate="show" className="px-5 pt-safe">
        <motion.p variants={riseIn} className="pt-5 text-[11px] font-semibold tracking-[0.14em] text-ink-3 uppercase">
          Insights
        </motion.p>
        <motion.div variants={riseIn} className="mt-1 flex items-end justify-between gap-3">
          <h1 className="font-display text-[34px] leading-[1.05] font-medium">Your progress</h1>
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={range}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.18 }}
              className="pb-1.5 text-[12px] font-medium whitespace-nowrap text-ink-3"
            >
              {rangeMeta[range].caption}
            </motion.span>
          </AnimatePresence>
        </motion.div>
        <motion.div variants={riseIn}>
          <SegmentedControl className="mt-5" options={rangeOptions} value={range} onChange={setRange} />
        </motion.div>
      </motion.header>

      <div className="mt-5 px-5">
        <SummaryStats
          avgKcal={summary.avg}
          onTarget={summary.onTarget}
          total={summary.total}
          unit={rangeMeta[range].unit}
          streakDays={user.streakDays}
        />
      </div>

      <div className="mt-4 space-y-4">
        <CaloriesCard range={range} data={calories} goal={goals.kcal} summary={summary} />
        <WeightCard
          trend={trend}
          startKg={goals.startWeightKg}
          currentKg={goals.currentWeightKg}
          targetKg={goals.targetWeightKg}
        />
        <MacroBalanceCard />
        <ConsistencyCard />
      </div>

      <div className="mt-8">
        <HighlightsList />
      </div>

      <div className="mt-6">
        <AskCoachCard />
      </div>
    </Screen>
  )
}
