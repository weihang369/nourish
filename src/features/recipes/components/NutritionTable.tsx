import { motion } from 'motion/react'
import { cn } from '@/lib/cn'
import { formatGrams, formatInt } from '@/lib/format'
import { macroMeta } from '@/lib/nutrition'
import { riseIn, stagger } from '@/lib/motion'
import type { MacroKey, Nutrients } from '@/types/nutrition'

/** FDA reference daily values (2,000 kcal diet). */
const DV = { fat: 78, satFat: 20, sodium: 2300, carbs: 275, fiber: 28, protein: 50 } as const

interface Row {
  label: string
  value: string
  dv?: number
  sub?: boolean
  macro?: MacroKey
}

/** Nutrition-label structure, restyled for the app: bold rules, calm type, %DV on the right. */
export function NutritionTable({ nutrients: n }: { nutrients: Nutrients }) {
  const rows: Row[] = [
    { label: 'Total fat', value: `${formatGrams(n.fat)} g`, dv: n.fat / DV.fat, macro: 'fat' },
    { label: 'Saturated fat', value: `${formatGrams(n.satFat)} g`, dv: n.satFat / DV.satFat, sub: true },
    { label: 'Sodium', value: `${formatInt(n.sodium)} mg`, dv: n.sodium / DV.sodium },
    { label: 'Total carbs', value: `${formatGrams(n.carbs)} g`, dv: n.carbs / DV.carbs, macro: 'carbs' },
    { label: 'Dietary fiber', value: `${formatGrams(n.fiber)} g`, dv: n.fiber / DV.fiber, sub: true },
    { label: 'Total sugars', value: `${formatGrams(n.sugar)} g`, sub: true },
    { label: 'Protein', value: `${formatGrams(n.protein)} g`, dv: n.protein / DV.protein, macro: 'protein' },
  ]

  return (
    <div className="rounded-[28px] bg-surface p-5 shadow-card ring-1 ring-line ring-inset">
      <p className="text-[11px] font-semibold tracking-[0.14em] text-ink-3 uppercase">Amount per serving</p>
      <div className="mt-1 flex items-end justify-between border-b-[6px] border-ink pb-2">
        <span className="font-display text-[26px] leading-none font-medium">Calories</span>
        <span className="font-display text-[40px] leading-none font-medium tabular">{formatInt(n.kcal)}</span>
      </div>
      <p className="border-b border-line py-2 text-right text-[11px] font-semibold text-ink-3">% Daily Value</p>

      <motion.dl variants={stagger} initial="hidden" animate="show">
        {rows.map((row) => (
          <motion.div
            key={row.label}
            variants={riseIn}
            className={cn('flex items-center gap-2 border-b border-line py-2.5 last:border-b-0', row.sub && 'pl-5')}
          >
            <dt className={cn('flex flex-1 items-center gap-2 text-[14px]', row.sub ? 'text-ink-2' : 'font-semibold text-ink')}>
              {row.macro && (
                <span aria-hidden className="size-2 rounded-full" style={{ background: macroMeta[row.macro].color }} />
              )}
              {row.label}
            </dt>
            <dd className="text-[14px] text-ink-2 tabular">{row.value}</dd>
            <dd className="w-12 text-right text-[14px] font-semibold text-ink tabular">
              {row.dv !== undefined ? `${Math.round(row.dv * 100)}%` : '—'}
            </dd>
          </motion.div>
        ))}
      </motion.dl>

      <p className="mt-3 text-[11.5px] leading-snug text-ink-3">
        % Daily Value shows how much one serving contributes to a 2,000 kcal day.
      </p>
    </div>
  )
}
