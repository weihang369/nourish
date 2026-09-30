import { Card, ProgressBar } from '@/components/ui'
import { formatInt, formatOneDp } from '@/lib/format'
import { microMeta } from '@/lib/nutrition'
import type { MicroKey, MicroProfile } from '@/types/nutrition'

interface MicronutrientListProps {
  micros: MicroProfile
  servings: number
}

/** Vitamins & minerals as %DV bars, richest first. ≥20% is flagged as a high source. */
export function MicronutrientList({ micros, servings }: MicronutrientListProps) {
  const items = (Object.entries(micros) as [MicroKey, number][])
    .map(([key, pct]) => ({ key, pct: pct * servings }))
    .sort((a, b) => b.pct - a.pct)

  if (items.length === 0) return null

  return (
    <Card>
      <div className="flex items-baseline justify-between gap-3">
        <h2 className="font-display text-[20px] font-medium">Vitamins & minerals</h2>
        <p className="text-[12px] text-ink-3">% Daily Value</p>
      </div>
      <ul className="mt-4 space-y-4">
        {items.map(({ key, pct }, i) => {
          const meta = microMeta[key]
          const amount = (meta.dvAmount * pct) / 100
          const high = pct >= 20
          return (
            <li key={key}>
              <div className="flex items-baseline gap-2">
                <span className="text-[14px] font-semibold">{meta.label}</span>
                <span className="text-[12px] text-ink-3 tabular">
                  {formatOneDp(amount)} {meta.unit}
                </span>
                {high && (
                  <span className="rounded-full bg-brand-soft px-1.5 py-px text-[10px] font-bold tracking-wide text-ink uppercase">
                    High
                  </span>
                )}
                <span className="ml-auto text-[13px] font-semibold tabular">{formatInt(pct)}%</span>
              </div>
              <ProgressBar
                value={pct / 100}
                delay={0.05 * i}
                label={`${meta.label} ${formatInt(pct)}% of daily value`}
                className="mt-2 h-2"
                color={high ? 'var(--nr-brand)' : 'var(--nr-ink-3)'}
              />
            </li>
          )
        })}
      </ul>
    </Card>
  )
}
