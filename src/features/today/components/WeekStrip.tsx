import { motion } from 'motion/react'
import { useState } from 'react'
import { ProgressRing } from '@/components/charts'
import { useDiary } from '@/hooks/useDiary'
import { cn } from '@/lib/cn'
import { isSameDay, weekOf } from '@/lib/date'
import { riseIn, spring } from '@/lib/motion'

/** Mock adherence for days already behind us this week (Mon → Sun). */
const pastProgress = [0.94, 0.86, 1, 0.78, 0.97, 0.9, 0.83]

const weekdayLetter = new Intl.DateTimeFormat('en-US', { weekday: 'narrow' })
const weekdayLong = new Intl.DateTimeFormat('en-US', { weekday: 'long', month: 'long', day: 'numeric' })

export function WeekStrip() {
  const { total, budget } = useDiary()
  const today = new Date()
  const days = weekOf(today)
  const [selected, setSelected] = useState(() => days.findIndex((d) => isSameDay(d, today)))
  const todayProgress = budget > 0 ? total.kcal / budget : 0

  return (
    <motion.div variants={riseIn} className="mt-6 px-5">
      <div role="tablist" aria-label="This week" className="flex justify-between gap-1">
        {days.map((day, i) => {
          const isToday = isSameDay(day, today)
          const isFuture = !isToday && day > today
          const value = isToday ? todayProgress : isFuture ? 0 : pastProgress[i]
          const active = selected === i
          return (
            <button
              key={day.toISOString()}
              type="button"
              role="tab"
              aria-selected={active}
              aria-label={`${weekdayLong.format(day)}${isToday ? ', today' : ''}${isFuture ? '' : `, ${Math.round(value * 100)}% of budget`}`}
              onClick={() => setSelected(i)}
              className="relative flex h-[76px] flex-1 flex-col items-center justify-center gap-1.5 rounded-full"
            >
              {active && (
                <motion.span
                  layoutId="week-strip-pill"
                  transition={spring.snappy}
                  className="absolute inset-0 rounded-full bg-ink shadow-float"
                />
              )}
              <span
                className={cn(
                  'relative text-[11px] font-semibold transition-colors',
                  active ? 'text-canvas/70' : 'text-ink-3',
                  isFuture && !active && 'opacity-60',
                )}
              >
                {weekdayLetter.format(day)}
              </span>
              <ProgressRing
                value={value}
                size={32}
                stroke={2.5}
                delay={0.2 + i * 0.05}
                color={active ? 'currentColor' : 'var(--nr-brand)'}
                trackColor={active ? 'color-mix(in oklab, var(--nr-canvas) 18%, transparent)' : 'var(--nr-surface-3)'}
                className={cn('relative', active && 'text-lime dark:text-[#1e5a42]', isFuture && !active && 'opacity-45')}
              >
                <span
                  className={cn(
                    'text-[12px] font-semibold tabular transition-colors',
                    active ? 'text-canvas' : isFuture ? 'text-ink-3' : 'text-ink',
                  )}
                >
                  {day.getDate()}
                </span>
              </ProgressRing>
              {isToday && !active && <span className="absolute bottom-1.5 size-1 rounded-full bg-brand" />}
            </button>
          )
        })}
      </div>
    </motion.div>
  )
}
