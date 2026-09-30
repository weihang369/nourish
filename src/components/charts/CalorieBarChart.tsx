import { motion } from 'motion/react'
import { useState } from 'react'
import type { CaloriePoint } from '@/data/insights'
import { useElementWidth } from '@/hooks/useElementWidth'
import { formatInt } from '@/lib/format'
import { easeOutExpo } from '@/lib/motion'
import { ChartTooltip } from './ChartTooltip'

interface CalorieBarChartProps {
  data: CaloriePoint[]
  goal: number
  height?: number
}

const PAD_TOP = 44
const PAD_BOTTOM = 26
const RADIUS = 4

/** Bar path with 4px rounded data-end, square at the baseline. */
function barPath(x: number, y: number, w: number, h: number) {
  const r = Math.min(RADIUS, w / 2, h)
  return `M${x},${y + h} V${y + r} Q${x},${y} ${x + r},${y} H${x + w - r} Q${x + w},${y} ${x + w},${y + r} V${y + h} Z`
}

export function CalorieBarChart({ data, goal, height = 210 }: CalorieBarChartProps) {
  const [ref, width] = useElementWidth<HTMLDivElement>()
  const [active, setActive] = useState<number | null>(null)
  const shown = active ?? data.length - 1

  const plotH = height - PAD_TOP - PAD_BOTTOM
  const max = Math.max(goal * 1.18, ...data.map((d) => d.kcal))
  const slot = width / data.length
  const barW = Math.max(3, Math.min(26, slot - 2))
  const y = (v: number) => PAD_TOP + plotH - (v / max) * plotH
  const goalY = y(goal)
  const labelEvery = data.length > 14 ? 5 : 1

  const pick = (clientX: number, rect: DOMRect) => {
    const i = Math.floor(((clientX - rect.left) / rect.width) * data.length)
    setActive(Math.max(0, Math.min(data.length - 1, i)))
  }

  const d = data[shown]
  const delta = d.kcal - goal

  return (
    <div ref={ref} className="relative select-none" style={{ height }}>
      <svg
        width={width}
        height={height}
        className="block touch-pan-y overflow-visible"
        onPointerMove={(e) => pick(e.clientX, e.currentTarget.getBoundingClientRect())}
        onPointerDown={(e) => pick(e.clientX, e.currentTarget.getBoundingClientRect())}
        onPointerLeave={() => setActive(null)}
        role="img"
        aria-label={`Daily calories. Goal ${formatInt(goal)} kcal.`}
      >
        {/* Baseline */}
        <line x1={0} x2={width} y1={PAD_TOP + plotH} y2={PAD_TOP + plotH} stroke="var(--nr-line)" />

        {data.map((p, i) => {
          const h = Math.max(2, PAD_TOP + plotH - y(p.kcal))
          const x = i * slot + (slot - barW) / 2
          const isActive = i === shown
          return (
            <g key={p.key}>
              <motion.path
                d={barPath(x, PAD_TOP + plotH - h, barW, h)}
                fill={isActive ? 'var(--nr-brand)' : 'color-mix(in oklab, var(--nr-brand) 32%, var(--nr-surface-2))'}
                initial={{ scaleY: 0 }}
                animate={{ scaleY: 1 }}
                style={{ originY: 1, transformBox: 'fill-box' }}
                transition={{ duration: 0.7, delay: i * (0.4 / data.length), ease: easeOutExpo }}
              />
              {(i % labelEvery === 0 || isActive) && (
                <text
                  x={x + barW / 2}
                  y={height - 6}
                  textAnchor="middle"
                  className={isActive ? 'fill-ink text-[11px] font-semibold' : 'fill-ink-3 text-[11px] font-medium'}
                >
                  {p.label}
                </text>
              )}
            </g>
          )
        })}

        {/* Goal reference — dashed and recessive; label sits on the side away from the tooltip */}
        <line x1={0} x2={width} y1={goalY} y2={goalY} stroke="var(--nr-ink-3)" strokeDasharray="3 4" strokeWidth={1} />
        <text
          x={shown > data.length / 2 ? 0 : width}
          y={goalY - 6}
          textAnchor={shown > data.length / 2 ? 'start' : 'end'}
          className="fill-ink-3 text-[10.5px] font-semibold"
        >
          Goal {formatInt(goal)}
        </text>
      </svg>

      <ChartTooltip
        x={shown * slot + slot / 2}
        y={y(d.kcal)}
        bounds={width}
        title={`${formatInt(d.kcal)} kcal`}
        detail={`${d.detail} · ${delta > 0 ? '+' : '−'}${formatInt(Math.abs(delta))}`}
      />
    </div>
  )
}
