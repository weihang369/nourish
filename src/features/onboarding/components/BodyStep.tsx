import { Armchair, Bike, Flame, Footprints, type LucideIcon } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import type { ReactNode } from 'react'
import { Card, Chip, SegmentedControl, Stepper } from '@/components/ui'
import { riseIn, stagger } from '@/lib/motion'
import { type ActivityLevel, type BodyProfile, type Sex, activityLevels, formatKg } from '../plan'
import { StepHeading } from './StepHeading'
import { WeightCard } from './WeightCard'

const activityIcons: Record<ActivityLevel, LucideIcon> = {
  sedentary: Armchair,
  light: Footprints,
  active: Bike,
  very: Flame,
}

const sexOptions: { value: Sex; label: string }[] = [
  { value: 'female', label: 'Female' },
  { value: 'male', label: 'Male' },
]

export type BodyDraft = Omit<BodyProfile, 'activity'> & { activity: ActivityLevel | null }

interface BodyStepProps {
  body: BodyDraft
  onChange: (patch: Partial<BodyDraft>) => void
}

function Row({ label, hint, children }: { label: string; hint: string; children: ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4 px-5 py-3.5">
      <div className="min-w-0">
        <p className="text-[15px] font-semibold">{label}</p>
        <p className="text-[12.5px] text-ink-3">{hint}</p>
      </div>
      {children}
    </div>
  )
}

function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <motion.p variants={riseIn} className="mt-8 mb-3 text-[11px] font-semibold tracking-[0.14em] text-ink-3 uppercase">
      {children}
    </motion.p>
  )
}

/** Step 2 — the handful of numbers the energy estimate needs. */
export function BodyStep({ body, onChange }: BodyStepProps) {
  const delta = Math.round((body.targetKg - body.weightKg) * 10) / 10
  const direction = delta < 0 ? 'down' : delta > 0 ? 'up' : 'hold'
  const activeLevel = activityLevels.find((a) => a.id === body.activity)

  return (
    <motion.div variants={stagger} initial="hidden" animate="show" className="px-5">
      <StepHeading
        eyebrow="About you"
        title="A little about you"
        subtitle="Just enough to estimate your energy needs. It stays on your device."
      />

      <Card variants={riseIn} padded={false} className="mt-7 divide-y divide-line">
        <Row label="Sex" hint="For your estimate">
          <SegmentedControl options={sexOptions} value={body.sex} onChange={(sex) => onChange({ sex })} className="w-[164px]" />
        </Row>
        <Row label="Age" hint="Years">
          <Stepper value={body.age} min={16} max={90} onChange={(age) => onChange({ age })} />
        </Row>
        <Row label="Height" hint="Centimetres">
          <Stepper value={body.heightCm} min={130} max={220} onChange={(heightCm) => onChange({ heightCm })} />
        </Row>
      </Card>

      <Eyebrow>Weight</Eyebrow>
      <div className="space-y-3">
        <WeightCard label="Current weight" value={body.weightKg} onChange={(weightKg) => onChange({ weightKg })} />
        <WeightCard
          label="Target weight"
          value={body.targetKg}
          onChange={(targetKg) => onChange({ targetKg })}
          badgeKey={direction}
          badge={
            direction === 'hold'
              ? 'Hold steady'
              : `${direction === 'down' ? '−' : '+'}${formatKg(Math.abs(delta))} kg`
          }
        />
      </div>

      <Eyebrow>Activity level</Eyebrow>
      <motion.div variants={riseIn} role="group" aria-label="Activity level" className="grid grid-cols-2 gap-2">
        {activityLevels.map((level) => {
          const Icon = activityIcons[level.id]
          return (
            <Chip
              key={level.id}
              selected={body.activity === level.id}
              onClick={() => onChange({ activity: level.id })}
              icon={<Icon className="size-4" strokeWidth={2.2} />}
              className="h-11 justify-center"
            >
              {level.label}
            </Chip>
          )
        })}
      </motion.div>
      <div className="relative mt-3 h-5 overflow-hidden">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.p
            key={activeLevel?.id ?? 'none'}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
            className="text-center text-[13px] text-ink-3"
          >
            {activeLevel?.detail ?? 'Pick the one that sounds most like your week.'}
          </motion.p>
        </AnimatePresence>
      </div>
    </motion.div>
  )
}
