import { MacroDonut } from '@/components/charts'
import { AnimatedNumber, Card } from '@/components/ui'
import { cn } from '@/lib/cn'
import { formatGrams } from '@/lib/format'
import { macroEnergySplit, macroKeys, macroMeta } from '@/lib/nutrition'
import type { Nutrients } from '@/types/nutrition'

/** Calories in the donut's centre; the legend carries grams and energy share. */
export function EnergyCard({ nutrients }: { nutrients: Nutrients }) {
  const split = macroEnergySplit(nutrients)

  return (
    <Card>
      <p className="text-[11px] font-semibold tracking-[0.14em] text-ink-3 uppercase">Energy & macros</p>
      <div className="mt-4 flex items-center gap-5">
        <MacroDonut split={split} size={136} stroke={14}>
          <AnimatedNumber value={nutrients.kcal} duration={0.7} className="block font-display text-[30px] leading-none font-medium" />
          <span className="mt-1 block text-[11px] font-semibold tracking-[0.1em] text-ink-3 uppercase">kcal</span>
        </MacroDonut>
        <ul className="min-w-0 flex-1 space-y-3">
          {macroKeys.map((key) => (
            <li key={key} className="flex items-center gap-2.5">
              <span aria-hidden className={cn('h-8 w-1.5 shrink-0 rounded-full', macroMeta[key].bg)} />
              <div className="min-w-0 flex-1">
                <p className="text-[12px] font-medium text-ink-2">{macroMeta[key].label}</p>
                <p className="text-[16px] leading-tight font-semibold">
                  <AnimatedNumber value={nutrients[key]} format={formatGrams} duration={0.7} />
                  <span className="text-[12px] font-medium text-ink-3"> g</span>
                </p>
              </div>
              <span className="text-[13px] font-semibold text-ink-3 tabular">{split[key]}%</span>
            </li>
          ))}
        </ul>
      </div>
    </Card>
  )
}
