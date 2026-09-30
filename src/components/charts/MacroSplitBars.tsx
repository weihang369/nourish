import { motion } from 'motion/react'
import { easeOutExpo } from '@/lib/motion'
import { macroKeys, macroMeta } from '@/lib/nutrition'
import type { MacroKey } from '@/types/nutrition'

interface MacroSplitBarsProps {
  rows: { label: string; split: Record<MacroKey, number> }[]
}

/** 100%-stacked bars (2px surface gaps), direct-labelled, with a legend. */
export function MacroSplitBars({ rows }: MacroSplitBarsProps) {
  return (
    <div className="space-y-3.5">
      <div className="flex gap-4">
        {macroKeys.map((k) => (
          <span key={k} className="flex items-center gap-1.5 text-[11.5px] font-medium text-ink-2">
            <span className="size-2 rounded-full" style={{ background: macroMeta[k].color }} />
            {macroMeta[k].label}
          </span>
        ))}
      </div>
      {rows.map((row, r) => (
        <div key={row.label} className="flex items-center gap-3">
          <span className="w-10 shrink-0 text-[12px] font-semibold text-ink-2">{row.label}</span>
          <div className="flex h-7 flex-1 gap-[2px] overflow-hidden rounded-[8px]">
            {macroKeys.map((k, i) => (
              <motion.div
                key={k}
                className="flex h-full items-center justify-center first:rounded-l-[8px] last:rounded-r-[8px]"
                style={{ background: macroMeta[k].color }}
                initial={{ width: 0 }}
                animate={{ width: `${row.split[k]}%` }}
                transition={{ duration: 0.9, delay: 0.1 + r * 0.15 + i * 0.05, ease: easeOutExpo }}
              >
                <span className="text-[11px] font-bold text-white tabular">{row.split[k]}%</span>
              </motion.div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
