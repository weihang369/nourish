import { motion, useReducedMotion } from 'motion/react'
import { useId } from 'react'
import { cn } from '@/lib/cn'
import { spring } from '@/lib/motion'

const W = 28
const H = 42
/** Tapered tumbler silhouette */
const GLASS = `M3 3 H${W - 3} L${W - 5.5} ${H - 4} Q${W - 6} ${H - 1} ${W - 9} ${H - 1} H9 Q6 ${H - 1} 5.5 ${H - 4} Z`
/** Two wave periods so a one-period loop is seamless */
const WAVE = `M0 4 Q7 0 14 4 T28 4 T42 4 T56 4 V${H + 4} H0 Z`

interface WaterGlassProps {
  /** 0–1 */
  fill: number
  label: string
  onClick: () => void
}

/** A tumbler whose liquid rises with a gentle, living wave. */
export function WaterGlass({ fill, label, onClick }: WaterGlassProps) {
  const id = useId().replace(/:/g, '')
  const reduce = useReducedMotion()
  const level = Math.max(0, Math.min(1, fill))
  const surfaceY = 4 + (H - 6) * (1 - level) - 3

  return (
    <motion.button
      type="button"
      aria-label={label}
      aria-pressed={level >= 1}
      onClick={onClick}
      whileTap={{ scale: 0.88 }}
      transition={spring.snappy}
      className="grid h-14 min-w-0 flex-1 place-items-center rounded-[14px]"
    >
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} className="overflow-visible">
        <defs>
          <clipPath id={`glass-${id}`}>
            <path d={GLASS} />
          </clipPath>
        </defs>
        <path d={GLASS} className="fill-surface-2" />
        <g clipPath={`url(#glass-${id})`}>
          <motion.g initial={{ y: H }} animate={{ y: level > 0 ? surfaceY : H + 2 }} transition={spring.gentle}>
            <motion.path
              d={WAVE}
              className="fill-water/35"
              animate={reduce || level === 0 ? { x: -14 } : { x: [-28, 0] }}
              transition={{ duration: 3.2, repeat: Infinity, ease: 'linear' }}
            />
            <motion.path
              d={WAVE}
              className="fill-water"
              style={{ y: 1.5 }}
              animate={reduce || level === 0 ? { x: 0 } : { x: [0, -28] }}
              transition={{ duration: 2.2, repeat: Infinity, ease: 'linear' }}
            />
          </motion.g>
          {/* Glass sheen */}
          <path d={`M6 6 L8 ${H - 6}`} className="stroke-white/35" strokeWidth={1.6} strokeLinecap="round" />
        </g>
        <path
          d={GLASS}
          fill="none"
          strokeWidth={1.2}
          className={cn('transition-colors', level > 0 ? 'stroke-water/45' : 'stroke-ink-3/35')}
        />
      </svg>
    </motion.button>
  )
}
