import { motion } from 'motion/react'
import { useId } from 'react'
import { useElementWidth } from '@/hooks/useElementWidth'
import { easeOutExpo, spring } from '@/lib/motion'

interface ProjectionCurveProps {
  direction: 'down' | 'up' | 'hold'
  delay?: number
}

const H = 92
const PAD = 10

/** A tiny, decorative trajectory from today to the target: eases in like real progress does. */
export function ProjectionCurve({ direction, delay = 0 }: ProjectionCurveProps) {
  const [ref, width] = useElementWidth<HTMLDivElement>(310)
  const gradientId = useId()

  const x0 = PAD
  const x1 = width - PAD
  const dx = x1 - x0
  const top = 16
  const bottom = H - 16
  const y0 = direction === 'down' ? top : direction === 'up' ? bottom : H / 2
  const y1 = direction === 'down' ? bottom : direction === 'up' ? top : H / 2

  const line =
    direction === 'hold'
      ? `M${x0},${y0} C${x0 + dx * 0.2},${y0 - 9} ${x0 + dx * 0.3},${y0 + 9} ${x0 + dx * 0.5},${y0} S${x0 + dx * 0.8},${y0 - 9} ${x1},${y1}`
      : `M${x0},${y0} C${x0 + dx * 0.34},${y0 + (y1 - y0) * 0.62} ${x0 + dx * 0.62},${y1} ${x1},${y1}`
  const area = `${line} L${x1},${H} L${x0},${H} Z`

  return (
    <div ref={ref} className="relative" aria-hidden>
      <svg width={width} height={H} viewBox={`0 0 ${width} ${H}`} className="block overflow-visible">
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--nr-brand)" stopOpacity={0.22} />
            <stop offset="100%" stopColor="var(--nr-brand)" stopOpacity={0} />
          </linearGradient>
        </defs>
        {[top, H / 2, bottom].map((y) => (
          <line key={y} x1={0} x2={width} y1={y} y2={y} stroke="var(--nr-line)" strokeDasharray="3 5" />
        ))}
        <motion.path
          d={area}
          fill={`url(#${gradientId})`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: delay + 0.6 }}
        />
        <motion.path
          d={line}
          fill="none"
          stroke="var(--nr-brand)"
          strokeWidth={3}
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.3, delay, ease: easeOutExpo }}
        />
        <circle cx={x0} cy={y0} r={5} fill="var(--nr-surface)" stroke="var(--nr-ink-3)" strokeWidth={2.5} />
        <motion.g
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ ...spring.bouncy, delay: delay + 0.9 }}
          style={{ transformOrigin: `${x1}px ${y1}px` }}
        >
          <circle cx={x1} cy={y1} r={11} fill="var(--nr-lime)" opacity={0.45} />
          <circle cx={x1} cy={y1} r={6} fill="var(--nr-brand)" stroke="var(--nr-surface)" strokeWidth={2.5} />
        </motion.g>
      </svg>
    </div>
  )
}
