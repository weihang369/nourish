import { motion } from 'motion/react'
import { useId, useState } from 'react'
import type { WeightPoint } from '@/data/insights'
import { useElementWidth } from '@/hooks/useElementWidth'
import { formatOneDp } from '@/lib/format'
import { easeOutExpo } from '@/lib/motion'
import { ChartTooltip } from './ChartTooltip'

interface WeightLineChartProps {
  data: WeightPoint[]
  goal: number
  height?: number
}

const PAD = { top: 44, right: 10, bottom: 24, left: 30 }

/** Monotone-ish smoothing: cubic Bézier through points with horizontal tangents. */
function smoothPath(points: [number, number][]) {
  return points.reduce((acc, [x, y], i) => {
    if (i === 0) return `M${x},${y}`
    const [px, py] = points[i - 1]
    const cx = (px + x) / 2
    return `${acc} C${cx},${py} ${cx},${y} ${x},${y}`
  }, '')
}

export function WeightLineChart({ data, goal, height = 220 }: WeightLineChartProps) {
  const [ref, width] = useElementWidth<HTMLDivElement>()
  const [active, setActive] = useState<number | null>(null)
  const gradientId = `wg${useId().replace(/[^a-zA-Z0-9]/g, '')}`
  const shown = active ?? data.length - 1

  const values = data.map((d) => d.kg)
  const lo = Math.floor(Math.min(goal, ...values) - 0.5)
  const hi = Math.ceil(Math.max(...values) + 0.5)
  const plotW = width - PAD.left - PAD.right
  const plotH = height - PAD.top - PAD.bottom
  const x = (i: number) => PAD.left + (i / (data.length - 1)) * plotW
  const y = (v: number) => PAD.top + ((hi - v) / (hi - lo)) * plotH

  const pts = data.map((d, i) => [x(i), y(d.kg)] as [number, number])
  const line = smoothPath(pts)
  const area = `${line} L${x(data.length - 1)},${PAD.top + plotH} L${x(0)},${PAD.top + plotH} Z`
  const ticks = [hi, (hi + lo) / 2, lo]

  const pick = (clientX: number, rect: DOMRect) => {
    // rect is in screen px (the device frame may be scaled); convert to chart px
    const px = ((clientX - rect.left) / rect.width) * width
    const rel = (px - PAD.left) / plotW
    setActive(Math.max(0, Math.min(data.length - 1, Math.round(rel * (data.length - 1)))))
  }

  const p = data[shown]
  const change = p.kg - data[0].kg

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
        aria-label={`Weight trend from ${data[0].kg} to ${data[data.length - 1].kg} kg. Goal ${goal} kg.`}
      >
        <defs>
          <linearGradient id={gradientId} x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="var(--nr-brand)" stopOpacity="0.22" />
            <stop offset="100%" stopColor="var(--nr-brand)" stopOpacity="0" />
          </linearGradient>
        </defs>

        {ticks.map((t) => (
          <g key={t}>
            <line x1={PAD.left} x2={width - PAD.right} y1={y(t)} y2={y(t)} stroke="var(--nr-line)" />
            <text x={0} y={y(t) + 4} className="fill-ink-3 text-[10.5px] font-medium tabular">
              {formatOneDp(t)}
            </text>
          </g>
        ))}

        <line
          x1={PAD.left}
          x2={width - PAD.right}
          y1={y(goal)}
          y2={y(goal)}
          stroke="var(--nr-fiber)"
          strokeDasharray="3 4"
        />
        <text x={width - PAD.right} y={y(goal) - 6} textAnchor="end" className="fill-ink-2 text-[10.5px] font-semibold">
          Goal {goal} kg
        </text>

        <motion.path
          d={area}
          fill={`url(#${gradientId})`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        />
        <motion.path
          d={line}
          fill="none"
          stroke="var(--nr-brand)"
          strokeWidth={2}
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.3, ease: easeOutExpo }}
        />

        {/* Crosshair */}
        <line
          x1={x(shown)}
          x2={x(shown)}
          y1={PAD.top - 4}
          y2={PAD.top + plotH}
          stroke="var(--nr-ink-3)"
          strokeOpacity={0.35}
        />
        <circle cx={x(shown)} cy={y(p.kg)} r={6} fill="var(--nr-brand)" stroke="var(--nr-surface)" strokeWidth={2.5} />
      </svg>

      <ChartTooltip
        x={x(shown)}
        y={y(p.kg)}
        bounds={width}
        title={`${formatOneDp(p.kg)} kg`}
        detail={shown === 0 ? p.detail : `${p.detail} · ${change > 0 ? '+' : '−'}${formatOneDp(Math.abs(change))} kg`}
      />
    </div>
  )
}
