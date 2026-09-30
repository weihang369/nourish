import { MacroSplitBars } from '@/components/charts'
import { macroSplit } from '@/data/insights'
import { macroKeys, macroMeta } from '@/lib/nutrition'
import { InsightCard, StatusPill } from './InsightCard'

export function MacroBalanceCard() {
  const gaps = macroKeys.map((k) => ({ key: k, diff: macroSplit.actual[k] - macroSplit.target[k] }))
  const widest = gaps.reduce((a, b) => (Math.abs(b.diff) > Math.abs(a.diff) ? b : a))
  const maxGap = Math.abs(widest.diff)

  return (
    <InsightCard
      title="Macro balance"
      trailing={<StatusPill tone={maxGap <= 3 ? 'good' : 'warm'}>{maxGap <= 3 ? 'Balanced' : 'Drifting'}</StatusPill>}
    >
      <p className="mt-1 mb-5 text-[13.5px] text-ink-2">
        Within <span className="font-semibold text-ink tabular">{maxGap}%</span> of plan on every macro.{' '}
        {widest.diff !== 0 && (
          <>
            {macroMeta[widest.key].label} is {widest.diff < 0 ? 'a touch low' : 'a touch high'}.
          </>
        )}
      </p>
      <MacroSplitBars
        rows={[
          { label: 'You', split: macroSplit.actual },
          { label: 'Plan', split: macroSplit.target },
        ]}
      />
      <p className="mt-4 text-[11.5px] text-ink-3">Share of calories from each macro, 30-day average.</p>
    </InsightCard>
  )
}
