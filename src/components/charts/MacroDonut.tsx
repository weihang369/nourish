import { motion } from 'motion/react'
import type { ReactNode } from 'react'
import { easeOutExpo } from '@/lib/motion'
import { macroKeys, macroMeta } from '@/lib/nutrition'
import type { MacroKey } from '@/types/nutrition'

interface MacroDonutProps {
  /** Percent of energy per macro (sums to 100) */
  split: Record<MacroKey, number>
  size?: number
  stroke?: number
  children?: ReactNode
}

const GAP_DEG = 3

/** Three-part donut with surface-colored gaps between segments. */
export function MacroDonut({ split, size = 132, stroke = 14, children }: MacroDonutProps) {
  const r = (size - stroke) / 2
  const c = 2 * Math.PI * r
  const gap = (GAP_DEG / 360) * c

  let offset = 0
  const segments = macroKeys.map((key) => {
    const len = (split[key] / 100) * c
    const seg = { key, dash: Math.max(0, len - gap), offset }
    offset += len
    return seg
  })

  return (
    <div className="relative grid shrink-0 place-items-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="absolute inset-0 -rotate-90">
        {segments.map((s, i) => (
          <motion.circle
            key={s.key}
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke={macroMeta[s.key].color}
            strokeWidth={stroke}
            strokeDashoffset={-s.offset}
            initial={{ strokeDasharray: `0 ${c}` }}
            animate={{ strokeDasharray: `${s.dash} ${c}` }}
            transition={{ duration: 0.9, delay: 0.15 + i * 0.12, ease: easeOutExpo }}
          >
            <title>{`${macroMeta[s.key].label} ${split[s.key]}%`}</title>
          </motion.circle>
        ))}
      </svg>
      <div className="relative text-center">{children}</div>
    </div>
  )
}
