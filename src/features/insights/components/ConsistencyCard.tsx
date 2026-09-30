import { useMemo } from 'react'
import { AdherenceHeatmap } from '@/components/charts'
import { adherence } from '@/data/insights'
import { InsightCard } from './InsightCard'

export function ConsistencyCard() {
  const days = useMemo(() => adherence(), [])
  const onTrack = days.filter((d) => d.level >= 3).length

  return (
    <InsightCard
      title="Consistency"
      trailing={
        <p className="text-right">
          <span className="font-display text-[22px] leading-none font-medium tabular">{onTrack}</span>
          <span className="text-[13px] font-semibold text-ink-3 tabular">/{days.length}</span>
        </p>
      }
    >
      <p className="mt-1 mb-4 text-[13.5px] text-ink-2">Days on track over the last five weeks. Tap a day for detail.</p>
      <AdherenceHeatmap days={days} />
    </InsightCard>
  )
}
