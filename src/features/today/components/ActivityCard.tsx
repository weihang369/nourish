import { Flame, Footprints, Watch } from 'lucide-react'
import { ProgressRing } from '@/components/charts'
import { AnimatedNumber, Card } from '@/components/ui'
import { activity } from '@/data/user'
import { formatInt } from '@/lib/format'
import { riseIn } from '@/lib/motion'

export function ActivityCard() {
  const { steps, stepGoal, activeKcal, workout } = activity
  const share = steps / stepGoal

  return (
    <Card variants={riseIn} className="mt-3">
      <div className="flex items-center justify-between">
        <h3 className="font-display text-[19px] font-medium">Activity</h3>
        <span className="text-[11px] font-semibold tracking-[0.14em] text-ink-3 uppercase">Apple Health</span>
      </div>

      <div className="mt-4 flex items-center gap-5">
        <ProgressRing
          value={share}
          size={96}
          stroke={9}
          delay={0.3}
          label={`${formatInt(steps)} of ${formatInt(stepGoal)} steps`}
        >
          <span className="flex flex-col items-center">
            <Footprints className="size-4 text-brand" strokeWidth={2.4} />
            <span className="mt-0.5 text-[12px] font-semibold tabular">{Math.round(share * 100)}%</span>
          </span>
        </ProgressRing>

        <div className="min-w-0 flex-1">
          <p className="font-display text-[30px] leading-none font-medium">
            <AnimatedNumber value={steps} />
          </p>
          <p className="mt-1 text-[13px] text-ink-3 tabular">of {formatInt(stepGoal)} steps</p>
          <p className="mt-3 flex items-center gap-2 text-[13px] text-ink-2">
            <span className="grid size-6 place-items-center rounded-full bg-ember/15 text-ember">
              <Flame className="size-3.5" strokeWidth={2.4} />
            </span>
            <span>
              <span className="font-semibold text-ink tabular">{formatInt(activeKcal)}</span> active kcal
            </span>
          </p>
        </div>
      </div>

      <div className="mt-4 flex items-center gap-3 rounded-[22px] bg-surface-2/70 p-3">
        <span className="grid size-10 place-items-center rounded-[14px] bg-surface text-ember shadow-card">
          <Watch className="size-[18px]" strokeWidth={2.2} />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-[14px] font-semibold">{workout.name}</p>
          <p className="text-[12px] text-ink-3 tabular">
            {workout.minutes} min · {formatInt(workout.kcal)} kcal
          </p>
        </div>
        <span className="text-[12px] font-medium text-ink-3">7:05 am</span>
      </div>
    </Card>
  )
}
