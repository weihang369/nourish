import { Flame, Target, UtensilsCrossed } from 'lucide-react'
import type { ReactNode } from 'react'
import { AnimatedNumber, Card } from '@/components/ui'
import { useDiary } from '@/hooks/useDiary'
import { cn } from '@/lib/cn'
import { formatInt } from '@/lib/format'
import { riseIn } from '@/lib/motion'
import { CalorieDial } from './CalorieDial'

/** The home screen's signature moment: calories remaining, at a glance. */
export function CalorieHero() {
  const { total, budget, remaining, burned } = useDiary()
  const eaten = Math.round(total.kcal)
  const over = remaining < 0
  const progress = budget > 0 ? eaten / budget : 0

  return (
    <Card variants={riseIn} padded={false} className="overflow-hidden px-5 pt-6 pb-5">
      {/* Soft halo behind the dial */}
      <div
        aria-hidden
        className={cn(
          'pointer-events-none absolute -top-24 left-1/2 size-[340px] -translate-x-1/2 rounded-full blur-3xl transition-colors duration-700',
          over ? 'bg-ember/12' : 'bg-lime/22 dark:bg-brand/10',
        )}
      />

      <div className="relative">
        <CalorieDial
          progress={progress}
          over={over}
          label={`${formatInt(eaten)} of ${formatInt(budget)} kcal eaten, ${formatInt(Math.abs(remaining))} kcal ${over ? 'over' : 'left'}`}
        >
          <div className="flex flex-col items-center">
            <span className="text-[11px] font-semibold tracking-[0.14em] text-ink-3 uppercase">
              {over ? 'Over budget' : 'Remaining'}
            </span>
            <AnimatedNumber
              value={Math.abs(remaining)}
              className={cn(
                'mt-1 font-display text-[54px] leading-none font-medium tracking-[-0.035em] transition-colors',
                over && 'text-ember',
              )}
            />
            <span className="mt-1.5 text-[13px] font-medium text-ink-2">{over ? 'kcal over' : 'kcal left'}</span>
          </div>
        </CalorieDial>

        <p className="mx-auto mt-3 max-w-[260px] text-center text-[13px] leading-snug text-ink-2">
          {over ? (
            <>Enjoy mindfully — a lighter, veggie-rich dinner balances the day.</>
          ) : progress > 0.85 ? (
            <>Nearly there. A light snack still fits comfortably.</>
          ) : (
            <>
              On a steady pace — room for a satisfying dinner of up to{' '}
              <span className="font-semibold text-ink tabular">{formatInt(remaining)} kcal</span>.
            </>
          )}
        </p>

        <div className="mt-5 grid grid-cols-3 divide-x divide-line rounded-[22px] bg-surface-2/70 py-3.5">
          <HeroStat
            icon={<UtensilsCrossed className="size-3.5" strokeWidth={2.4} />}
            iconClass="bg-brand/15 text-brand"
            label="Eaten"
            value={eaten}
          />
          <HeroStat
            icon={<Flame className="size-3.5" strokeWidth={2.4} />}
            iconClass="bg-ember/15 text-ember"
            label="Burned"
            value={burned}
          />
          <HeroStat
            icon={<Target className="size-3.5" strokeWidth={2.4} />}
            iconClass="bg-ink/8 text-ink-2"
            label="Budget"
            value={budget}
          />
        </div>
      </div>
    </Card>
  )
}

function HeroStat({ icon, iconClass, label, value }: { icon: ReactNode; iconClass: string; label: string; value: number }) {
  return (
    <div className="flex flex-col items-center gap-1 px-2">
      <span className="flex items-center gap-1.5">
        <span className={cn('grid size-5 place-items-center rounded-full', iconClass)}>{icon}</span>
        <span className="text-[11px] font-semibold tracking-[0.08em] text-ink-3 uppercase">{label}</span>
      </span>
      <span className="text-[17px] leading-tight font-semibold">
        <AnimatedNumber value={value} />
        <span className="ml-0.5 text-[11px] font-medium text-ink-3">kcal</span>
      </span>
    </div>
  )
}
