import { ProgressBar } from '@/components/ui'
import { useDiary } from '@/hooks/useDiary'
import { formatGrams, formatInt } from '@/lib/format'
import { macroKeys, macroMeta } from '@/lib/nutrition'

/** Live snapshot of what's left today — reflects anything added from the chat. */
export function MacroGapCard() {
  const { total, goals, remaining } = useDiary()

  return (
    <div className="w-[272px] rounded-[22px] bg-surface p-4 shadow-card ring-1 ring-line ring-inset">
      <div className="flex items-baseline justify-between">
        <p className="text-[11px] font-semibold tracking-[0.14em] text-ink-3 uppercase">Left for today</p>
        <p className="text-[12px] font-medium text-ink-2 tabular">
          <span className="font-semibold text-ink">{formatInt(Math.max(0, remaining))}</span> kcal
        </p>
      </div>
      <ul className="mt-3 space-y-3">
        {macroKeys.map((k, i) => {
          const eaten = total[k]
          const left = Math.max(0, goals[k] - eaten)
          return (
            <li key={k}>
              <div className="flex items-center justify-between text-[12.5px]">
                <span className="flex items-center gap-1.5 font-medium text-ink">
                  <span className="size-2 rounded-full" style={{ background: macroMeta[k].color }} />
                  {macroMeta[k].label}
                </span>
                <span className="text-ink-3 tabular">
                  <span className="font-semibold text-ink">{formatGrams(left)} g</span> left
                </span>
              </div>
              <ProgressBar
                value={eaten / goals[k]}
                color={macroMeta[k].color}
                className="mt-1.5"
                delay={0.2 + i * 0.08}
                label={`${macroMeta[k].label}: ${formatGrams(eaten)} of ${formatGrams(goals[k])} g eaten`}
              />
            </li>
          )
        })}
      </ul>
      <p className="mt-3 text-[11px] text-ink-3">Bars show what you’ve eaten so far.</p>
    </div>
  )
}
