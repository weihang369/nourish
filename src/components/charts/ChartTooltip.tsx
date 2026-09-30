import { motion } from 'motion/react'
import type { ReactNode } from 'react'
import { spring } from '@/lib/motion'

interface ChartTooltipProps {
  x: number
  y: number
  title: ReactNode
  detail?: ReactNode
  /** Keep the bubble inside the plot */
  bounds: number
}

/** Dark pill anchored above a point. Positioned in the chart's pixel space. */
export function ChartTooltip({ x, y, title, detail, bounds }: ChartTooltipProps) {
  const half = 62
  const left = Math.max(half, Math.min(bounds - half, x))
  return (
    <motion.div
      className="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-full"
      initial={false}
      animate={{ left, top: y - 10 }}
      transition={spring.snappy}
    >
      <div className="rounded-2xl bg-[#0f1411] px-3 py-2 text-center whitespace-nowrap text-white shadow-float">
        <div className="text-[13px] font-semibold tabular">{title}</div>
        {detail && <div className="text-[10.5px] font-medium text-white/60">{detail}</div>}
      </div>
    </motion.div>
  )
}
