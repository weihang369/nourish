import { AnimatedNumber, Card } from '@/components/ui'
import { cn } from '@/lib/cn'
import { formatGrams, formatInt } from '@/lib/format'
import type { Nutrients } from '@/types/nutrition'

interface Row {
  key: keyof Omit<Nutrients, 'kcal'>
  label: string
  unit: 'g' | 'mg'
  /** FDA daily value, when one exists */
  dv?: number
  sub?: boolean
}

const rows: Row[] = [
  { key: 'protein', label: 'Protein', unit: 'g', dv: 50 },
  { key: 'carbs', label: 'Carbohydrates', unit: 'g', dv: 275 },
  { key: 'fiber', label: 'Fiber', unit: 'g', dv: 28, sub: true },
  { key: 'sugar', label: 'Sugars', unit: 'g', sub: true },
  { key: 'fat', label: 'Fat', unit: 'g', dv: 78 },
  { key: 'satFat', label: 'Saturated fat', unit: 'g', dv: 20, sub: true },
  { key: 'sodium', label: 'Sodium', unit: 'mg', dv: 2300 },
]

export function NutritionFacts({ nutrients, portionLabel }: { nutrients: Nutrients; portionLabel: string }) {
  return (
    <Card>
      <div className="flex items-baseline justify-between gap-3">
        <h2 className="font-display text-[20px] font-medium">Nutrition facts</h2>
        <p className="truncate text-[12px] text-ink-3">{portionLabel}</p>
      </div>
      <table className="mt-3 w-full text-[14px]">
        <thead>
          <tr className="border-b border-line text-[10.5px] font-semibold tracking-[0.12em] text-ink-3 uppercase">
            <th scope="col" className="pb-2 text-left font-semibold">Nutrient</th>
            <th scope="col" className="pb-2 text-right font-semibold">Amount</th>
            <th scope="col" className="w-14 pb-2 text-right font-semibold">% DV</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-line">
          <tr>
            <th scope="row" className="py-3 text-left font-semibold">Calories</th>
            <td className="py-3 text-right font-display text-[18px] font-medium">
              <AnimatedNumber value={nutrients.kcal} duration={0.6} />
            </td>
            <td />
          </tr>
          {rows.map((r) => {
            const value = nutrients[r.key]
            return (
              <tr key={r.key}>
                <th
                  scope="row"
                  className={cn('py-2.5 text-left', r.sub ? 'pl-4 font-normal text-ink-2' : 'font-semibold')}
                >
                  {r.label}
                </th>
                <td className="py-2.5 text-right text-ink">
                  <AnimatedNumber value={value} format={r.unit === 'mg' ? formatInt : formatGrams} duration={0.6} />
                  <span className="text-ink-3"> {r.unit}</span>
                </td>
                <td className="py-2.5 text-right text-ink-3 tabular">
                  {r.dv ? `${formatInt((value / r.dv) * 100)}%` : '—'}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
      <p className="mt-3 text-[11.5px] leading-relaxed text-ink-3">
        % Daily Value is based on a 2,000 kcal reference diet. Your own targets live in Profile.
      </p>
    </Card>
  )
}
