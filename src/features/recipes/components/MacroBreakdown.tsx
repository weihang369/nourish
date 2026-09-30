import { motion } from 'motion/react'
import { MacroDonut } from '@/components/charts'
import { useDiary } from '@/hooks/useDiary'
import { formatGrams, formatInt } from '@/lib/format'
import { riseIn } from '@/lib/motion'
import { macroEnergySplit, macroKeys, macroMeta } from '@/lib/nutrition'
import type { Nutrients } from '@/types/nutrition'

/** Donut + labelled legend for one serving, tied back to what's left of today. */
export function MacroBreakdown({ nutrients }: { nutrients: Nutrients }) {
  const split = macroEnergySplit(nutrients)
  const { remaining } = useDiary()
  const share = remaining > 0 ? Math.round((nutrients.kcal / remaining) * 100) : null

  return (
    <motion.section variants={riseIn} className="mt-4 rounded-[28px] bg-surface p-5 shadow-card ring-1 ring-line ring-inset">
      <div className="flex items-baseline justify-between">
        <h2 className="font-display text-[19px] font-medium">Per serving</h2>
        <span className="text-[11px] font-semibold tracking-[0.14em] text-ink-3 uppercase">Energy split</span>
      </div>

      <div className="mt-4 flex items-center gap-5">
        <MacroDonut split={split} size={116} stroke={12}>
          <span className="block font-display text-[26px] leading-none font-medium tabular">{formatInt(nutrients.kcal)}</span>
          <span className="mt-1 block text-[11px] font-medium text-ink-3">kcal</span>
        </MacroDonut>

        <ul className="min-w-0 flex-1 space-y-3">
          {macroKeys.map((key) => (
            <li key={key}>
              <div className="flex items-baseline gap-2">
                <span className="size-2 shrink-0 translate-y-[-1px] self-center rounded-full" style={{ background: macroMeta[key].color }} />
                <span className="flex-1 text-[13px] font-medium text-ink-2">{macroMeta[key].label}</span>
                <span className="text-[14px] font-semibold text-ink tabular">{formatGrams(nutrients[key])} g</span>
                <span className="w-9 text-right text-[12px] text-ink-3 tabular">{split[key]}%</span>
              </div>
              <div className="mt-1.5 ml-4 h-1 overflow-hidden rounded-full bg-surface-2">
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: macroMeta[key].color }}
                  initial={{ width: 0 }}
                  whileInView={{ width: `${split[key]}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.9, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                />
              </div>
            </li>
          ))}
        </ul>
      </div>

      <p className="mt-4 border-t border-line pt-3.5 text-[12.5px] leading-snug text-ink-2">
        {share !== null ? (
          <>
            One serving uses <span className="font-semibold text-ink tabular">{share}%</span> of the{' '}
            <span className="tabular">{formatInt(remaining)}</span> kcal you have left today.
          </>
        ) : (
          'You’ve met today’s energy budget — enjoy this mindfully, or save it for tomorrow.'
        )}
      </p>
    </motion.section>
  )
}
