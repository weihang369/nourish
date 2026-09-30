import { Camera, Check, HeartHandshake, type LucideIcon, TrendingUp } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useState } from 'react'
import { ProgressRing } from '@/components/charts'
import { AnimatedNumber, Card, ProgressBar } from '@/components/ui'
import { formatInt } from '@/lib/format'
import { easeOutExpo, riseIn, spring, stagger } from '@/lib/motion'
import { macroKeys, macroMeta } from '@/lib/nutrition'
import type { GoalType } from '@/store/useAppStore'
import { type Plan, formatKg, formatReachDate, weeklyRate } from '../plan'
import { ProjectionCurve } from './ProjectionCurve'
import { StepHeading } from './StepHeading'

interface PlanStepProps {
  goal: GoalType
  weightKg: number
  plan: Plan
  ready: boolean
}

const promises: { icon: LucideIcon; text: string }[] = [
  { icon: TrendingUp, text: 'Adapt your target to the activity you log' },
  { icon: Camera, text: 'Log a whole meal from one photo, in seconds' },
  { icon: HeartHandshake, text: 'Check in gently each week — guidance, never guilt' },
]

const buildingLines = ['Estimating your energy needs', 'Balancing your macros', 'Plotting your path']

/** Brief, honest "working on it" beat so the reveal lands. */
function Building() {
  const [line, setLine] = useState(0)
  useEffect(() => {
    const t = window.setInterval(() => setLine((l) => Math.min(l + 1, buildingLines.length - 1)), 520)
    return () => window.clearInterval(t)
  }, [])

  return (
    <motion.div
      key="building"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.96, transition: { duration: 0.25 } }}
      className="flex min-h-[520px] flex-col items-center justify-center px-5 text-center"
      role="status"
    >
      <div className="relative grid size-24 place-items-center">
        <span className="absolute inset-0 animate-pulse-ring rounded-full bg-brand/25" />
        <motion.span
          className="absolute inset-0 rounded-full border-[3px] border-surface-3 border-t-brand"
          animate={{ rotate: 360 }}
          transition={{ duration: 0.9, repeat: Infinity, ease: 'linear' }}
        />
        <span className="font-display text-2xl text-brand italic">n</span>
      </div>
      <div className="relative mt-7 h-6 w-full overflow-hidden">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.p
            key={line}
            initial={{ y: 16, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -16, opacity: 0 }}
            transition={{ duration: 0.35, ease: easeOutExpo }}
            className="text-[15px] font-semibold text-ink-2"
          >
            {buildingLines[line]}…
          </motion.p>
        </AnimatePresence>
      </div>
    </motion.div>
  )
}

/** Soft confetti of dots that radiate once from behind the ring. */
function Burst() {
  const dots = Array.from({ length: 14 }, (_, i) => {
    const angle = (i / 14) * Math.PI * 2 + (i % 2 ? 0.2 : 0)
    const r = 118 + (i % 3) * 16
    return {
      x: Math.cos(angle) * r,
      y: Math.sin(angle) * r,
      size: i % 3 === 0 ? 7 : 5,
      color: i % 4 === 0 ? 'var(--nr-ember)' : i % 2 ? 'var(--nr-lime)' : 'rgb(255 255 255 / 0.8)',
    }
  })
  return (
    <div aria-hidden className="pointer-events-none absolute top-1/2 left-1/2">
      {dots.map((d, i) => (
        <motion.span
          key={i}
          className="absolute rounded-full"
          style={{ width: d.size, height: d.size, background: d.color, marginLeft: -d.size / 2, marginTop: -d.size / 2 }}
          initial={{ x: 0, y: 0, opacity: 0, scale: 0.4 }}
          animate={{ x: d.x, y: d.y, opacity: [0, 1, 0], scale: [0.4, 1, 0.6] }}
          transition={{ duration: 1.5, delay: 0.55 + (i % 4) * 0.03, ease: easeOutExpo }}
        />
      ))}
    </div>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex-1 text-center">
      <p className="text-[11px] font-semibold tracking-[0.12em] text-on-deep/55 uppercase">{label}</p>
      <p className="mt-1 text-[15px] font-semibold tabular">{value}</p>
    </div>
  )
}

function adjustmentLabel(plan: Plan) {
  if (Math.abs(plan.adjustment) < 10) return 'Balanced'
  return `${plan.adjustment > 0 ? '+' : '−'}${formatInt(Math.abs(plan.adjustment))} kcal`
}

/** Step 3 — the celebratory reveal of the computed plan. */
export function PlanStep({ goal, weightKg, plan, ready }: PlanStepProps) {
  const moving = plan.reachDate !== null
  const direction = !moving ? 'hold' : plan.targetKg < weightKg ? 'down' : 'up'
  const rate = weeklyRate[goal] || 0.5

  return (
    <AnimatePresence mode="wait" initial={false}>
      {!ready ? (
        <Building key="building" />
      ) : (
        <motion.div key="plan" variants={stagger} initial="hidden" animate="show" className="px-5">
          <StepHeading
            eyebrow="Your plan"
            title={
              <>
                Your plan is <em className="font-normal text-brand">ready</em>.
              </>
            }
            subtitle="Built from your goal, body and routine — and it adapts as you log."
          />

          {/* Calorie reveal */}
          <Card tone="deep" variants={riseIn} className="mt-7 overflow-hidden pt-7">
            <div className="pointer-events-none absolute -top-16 left-1/2 size-72 -translate-x-1/2 rounded-full bg-lime/15 blur-3xl" />
            <div className="relative flex justify-center">
              <Burst />
              <ProgressRing
                value={1}
                size={212}
                stroke={14}
                color="var(--nr-lime)"
                trackColor="rgb(255 255 255 / 0.08)"
                delay={0.25}
                label={`Daily target ${formatInt(plan.kcal)} calories`}
              >
                <div className="text-center">
                  <p className="text-[11px] font-semibold tracking-[0.14em] text-on-deep/60 uppercase">Daily target</p>
                  <AnimatedNumber
                    value={plan.kcal}
                    duration={1.6}
                    className="mt-1 block font-display text-[50px] leading-none font-medium"
                  />
                  <p className="mt-1.5 text-[13px] font-semibold text-on-deep/70">kcal a day</p>
                </div>
              </ProgressRing>
            </div>
            <div className="relative mt-6 flex divide-x divide-white/10 border-t border-white/10 pt-4">
              <Stat label="Maintenance" value={`${formatInt(plan.maintenance)} kcal`} />
              <Stat label="Adjustment" value={adjustmentLabel(plan)} />
            </div>
          </Card>

          {/* Macro split */}
          <motion.div variants={riseIn} className="mt-3 grid grid-cols-3 gap-2.5">
            {macroKeys.map((key, i) => {
              const meta = macroMeta[key]
              return (
                <div key={key} className="rounded-[22px] bg-surface p-3.5 shadow-card ring-1 ring-line ring-inset">
                  <p className="flex items-center gap-1.5 text-[12px] font-semibold text-ink-2">
                    <span className={`size-2 rounded-full ${meta.bg}`} />
                    {meta.label}
                  </p>
                  <p className="mt-2 flex items-baseline gap-0.5 font-display font-medium">
                    <AnimatedNumber value={plan[key]} duration={1.4} className="text-[28px] leading-none" />
                    <span className="font-sans text-[13px] font-semibold text-ink-3">g</span>
                  </p>
                  <ProgressBar
                    value={plan.split[key] / 100}
                    color={meta.color}
                    delay={0.5 + i * 0.1}
                    className="mt-3"
                    label={`${meta.label} ${plan.split[key]} percent of energy`}
                  />
                  <p className="mt-1.5 text-[11px] font-medium text-ink-3 tabular">{plan.split[key]}% of energy</p>
                </div>
              )
            })}
          </motion.div>

          {/* Projection */}
          <Card variants={riseIn} className="mt-3">
            <p className="text-[11px] font-semibold tracking-[0.14em] text-ink-3 uppercase">Projection</p>
            <h2 className="mt-1.5 font-display text-[22px] leading-tight font-medium">
              {moving && plan.reachDate ? (
                <>
                  Reach {formatKg(plan.targetKg)} kg by{' '}
                  <em className="font-normal text-brand">{formatReachDate(plan.reachDate)}</em>
                </>
              ) : (
                <>
                  Hold steady around <em className="font-normal text-brand">{formatKg(weightKg)} kg</em>
                </>
              )}
            </h2>
            <p className="mt-1 text-[13.5px] text-ink-2">
              {moving
                ? `A sustainable ~${formatKg(rate)} kg a week — about ${plan.weeks} weeks.`
                : 'Energy in balance, so you can focus on how food makes you feel.'}
            </p>
            <div className="mt-4">
              <ProjectionCurve direction={direction} delay={0.5} />
            </div>
            <div className="mt-2 flex justify-between text-[12px] font-semibold tabular">
              <span className="text-ink-3">
                <span className="text-ink">{formatKg(weightKg)} kg</span> · Today
              </span>
              <span className="text-ink-3">
                <span className="text-ink">{formatKg(plan.targetKg)} kg</span> ·{' '}
                {plan.reachDate ? formatReachDate(plan.reachDate) : 'Ongoing'}
              </span>
            </div>
          </Card>

          {/* What we'll do */}
          <motion.p
            variants={riseIn}
            className="mt-8 mb-3 text-[11px] font-semibold tracking-[0.14em] text-ink-3 uppercase"
          >
            What Nourish will do
          </motion.p>
          <ul className="space-y-2.5">
            {promises.map(({ icon: Icon, text }, i) => (
              <motion.li key={text} variants={riseIn} className="flex items-center gap-3.5">
                <span className="relative grid size-10 shrink-0 place-items-center rounded-[14px] bg-brand-soft text-brand">
                  <Icon className="size-[18px]" strokeWidth={2.2} />
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ ...spring.bouncy, delay: 0.9 + i * 0.12 }}
                    className="absolute -right-1 -bottom-1 grid size-[18px] place-items-center rounded-full bg-brand text-brand-ink ring-2 ring-canvas"
                  >
                    <Check className="size-2.5" strokeWidth={3.5} />
                  </motion.span>
                </span>
                <span className="text-[14.5px] leading-snug font-medium">{text}</span>
              </motion.li>
            ))}
          </ul>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
