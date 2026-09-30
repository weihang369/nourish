import { TrendingDown } from 'lucide-react'
import { WeightLineChart } from '@/components/charts'
import { ProgressBar } from '@/components/ui'
import type { WeightPoint } from '@/data/insights'
import { formatOneDp } from '@/lib/format'
import { projectGoalDate, weightProgress } from '../summary'
import { InsightCard } from './InsightCard'

interface WeightCardProps {
  trend: WeightPoint[]
  startKg: number
  currentKg: number
  targetKg: number
}

export function WeightCard({ trend, startKg, currentKg, targetKg }: WeightCardProps) {
  const change = currentKg - startKg
  const progress = weightProgress(startKg, currentKg, targetKg)
  const toGo = Math.max(0, currentKg - targetKg)
  const projection = projectGoalDate(trend, targetKg)

  return (
    <InsightCard
      title="Weight"
      trailing={
        <span className="inline-flex h-7 shrink-0 items-center gap-1 rounded-full bg-brand-soft px-2.5 text-[11.5px] font-semibold text-brand tabular">
          <TrendingDown className="size-3.5" strokeWidth={2.5} />
          {change <= 0 ? '−' : '+'}
          {formatOneDp(Math.abs(change))} kg since start
        </span>
      }
    >
      <p className="mt-1 flex items-baseline gap-1">
        <span className="font-display text-[34px] leading-none font-medium tabular">{formatOneDp(currentKg)}</span>
        <span className="text-[13px] font-semibold text-ink-3">kg now</span>
      </p>

      <div className="mt-1">
        <WeightLineChart data={trend} goal={targetKg} height={200} />
      </div>

      <div className="mt-4 rounded-[22px] bg-surface-2/70 p-4">
        <div className="flex items-baseline justify-between text-[12px] font-medium text-ink-3 tabular">
          <span>Start {formatOneDp(startKg)} kg</span>
          <span className="text-[13px] font-semibold text-ink">{Math.round(progress * 100)}% of the way</span>
          <span>Goal {formatOneDp(targetKg)} kg</span>
        </div>
        <ProgressBar
          value={progress}
          label="Progress toward target weight"
          className="mt-2.5 h-2"
          trackClassName="bg-surface-3"
          delay={0.3}
        />
        <p className="mt-2.5 text-[12.5px] text-ink-2">
          <span className="font-semibold text-ink tabular">{formatOneDp(toGo)} kg</span> to go
          {projection && (
            <>
              {' '}· at {formatOneDp(projection.perWeek)} kg/week you’ll arrive around{' '}
              <span className="font-semibold text-ink">{projection.label}</span>
            </>
          )}
        </p>
      </div>
    </InsightCard>
  )
}
