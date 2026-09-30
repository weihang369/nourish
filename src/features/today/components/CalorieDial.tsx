import { animate, motion, type MotionValue, useMotionValue, useTransform } from 'motion/react'
import { type ReactNode, useEffect, useId } from 'react'
import { easeOutExpo } from '@/lib/motion'

const SIZE = 232
const C = SIZE / 2
const R = 88
const STROKE = 13
const TICKS = 60
const KNOB = 20

interface CalorieDialProps {
  /** eaten / budget — may exceed 1 */
  progress: number
  over: boolean
  label: string
  children: ReactNode
}

/**
 * The signature ring: a watch-bezel of ticks that light up as the arc sweeps
 * past them, a softly glowing arc and a knob riding its leading edge.
 */
export function CalorieDial({ progress, over, label, children }: CalorieDialProps) {
  const id = useId().replace(/:/g, '')
  const value = Math.max(0, Math.min(1, progress))
  const mv = useMotionValue(0)

  useEffect(() => {
    const controls = animate(mv, value, { duration: 1.6, ease: easeOutExpo, delay: 0.15 })
    return () => controls.stop()
  }, [mv, value])

  const rotate = useTransform(mv, (v) => v * 360)
  const arcOpacity = useTransform(mv, (v) => (v > 0.004 ? 1 : 0))
  const glowOpacity = useTransform(arcOpacity, (o) => o * 0.45)
  const accent = over ? 'var(--nr-ember)' : 'var(--nr-brand)'
  const accentEnd = over
    ? 'color-mix(in oklab, var(--nr-ember) 70%, var(--nr-protein))'
    : 'color-mix(in oklab, var(--nr-brand) 62%, var(--nr-lime))'

  return (
    <div className="relative mx-auto" style={{ width: SIZE, height: SIZE }} role="img" aria-label={label}>
      <svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`} className="absolute inset-0 overflow-visible">
        <defs>
          <linearGradient id={`arc-${id}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" style={{ stopColor: accent, transition: 'stop-color .6s' }} />
            <stop offset="100%" style={{ stopColor: accentEnd, transition: 'stop-color .6s' }} />
          </linearGradient>
          <filter id={`glow-${id}`} x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="7" />
          </filter>
        </defs>

        {Array.from({ length: TICKS }, (_, i) => (
          <BezelTick key={i} index={i} progress={mv} accent={accent} />
        ))}

        <g transform={`rotate(-90 ${C} ${C})`}>
          <circle cx={C} cy={C} r={R} fill="none" stroke="var(--nr-surface-2)" strokeWidth={STROKE} />
          <motion.circle
            cx={C}
            cy={C}
            r={R}
            fill="none"
            stroke={`url(#arc-${id})`}
            strokeWidth={STROKE}
            strokeLinecap="round"
            filter={`url(#glow-${id})`}
            style={{ pathLength: mv, opacity: glowOpacity }}
          />
          <motion.circle
            cx={C}
            cy={C}
            r={R}
            fill="none"
            stroke={`url(#arc-${id})`}
            strokeWidth={STROKE}
            strokeLinecap="round"
            style={{ pathLength: mv, opacity: arcOpacity }}
          />
        </g>
      </svg>

      {/* Knob riding the arc's leading edge */}
      <motion.div className="pointer-events-none absolute inset-0" style={{ rotate, opacity: arcOpacity }} aria-hidden>
        <span
          className="absolute left-1/2 -translate-x-1/2 rounded-full bg-surface transition-[box-shadow] duration-500"
          style={{
            top: C - R - KNOB / 2,
            width: KNOB,
            height: KNOB,
            boxShadow: `inset 0 0 0 5px ${accentEnd}, 0 0 0 4px color-mix(in oklab, ${accent} 18%, transparent), 0 0 18px 2px color-mix(in oklab, ${accentEnd} 70%, transparent)`,
          }}
        />
      </motion.div>

      <div className="absolute inset-0 grid place-items-center text-center">{children}</div>
    </div>
  )
}

/** One bezel tick — lights up once the arc has swept past its angle. */
function BezelTick({ index, progress, accent }: { index: number; progress: MotionValue<number>; accent: string }) {
  const at = index / TICKS
  const major = index % 5 === 0
  const inner = major ? R + 13 : R + 15
  const outer = major ? R + 22 : R + 19
  const angle = at * Math.PI * 2 - Math.PI / 2
  const cos = Math.cos(angle)
  const sin = Math.sin(angle)
  const lit = useTransform(progress, (v) => v > 0.004 && v >= at)
  const stroke = useTransform(lit, (on) => (on ? accent : 'var(--nr-ink-3)'))
  const opacity = useTransform(lit, (on) => (on ? (major ? 0.95 : 0.6) : major ? 0.4 : 0.22))

  return (
    <motion.line
      x1={C + cos * inner}
      y1={C + sin * inner}
      x2={C + cos * outer}
      y2={C + sin * outer}
      strokeWidth={major ? 2 : 1.4}
      strokeLinecap="round"
      style={{ stroke, opacity }}
    />
  )
}
