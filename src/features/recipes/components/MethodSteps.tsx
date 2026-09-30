import { Timer } from 'lucide-react'
import { motion } from 'motion/react'
import { riseIn, stagger } from '@/lib/motion'
import type { RecipeStep } from '@/types/nutrition'

/** Numbered steps on a timeline rail, each with its hands-on minutes where known. */
export function MethodSteps({ steps }: { steps: RecipeStep[] }) {
  const timed = steps.reduce((sum, s) => sum + (s.minutes ?? 0), 0)

  return (
    <div>
      <p className="text-[11px] font-semibold tracking-[0.14em] text-ink-3 uppercase">
        {steps.length} steps{timed > 0 && ` · about ${timed} min at the stove`}
      </p>
      <motion.ol variants={stagger} initial="hidden" animate="show" className="mt-4">
        {steps.map((step, i) => {
          const last = i === steps.length - 1
          return (
            <motion.li key={step.title} variants={riseIn} className="relative flex gap-4 pb-7 last:pb-0">
              {!last && <span aria-hidden className="absolute top-11 bottom-2 left-[19px] w-px bg-line" />}
              <span className="grid size-10 shrink-0 place-items-center rounded-full bg-surface font-display text-[17px] font-medium text-ink shadow-card ring-1 ring-line ring-inset tabular">
                {i + 1}
              </span>
              <div className="min-w-0 flex-1 pt-1.5">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-[16px] leading-snug font-semibold text-ink">{step.title}</h3>
                  {step.minutes ? (
                    <span className="inline-flex h-6 shrink-0 items-center gap-1 rounded-full bg-brand-soft px-2 text-[11px] font-semibold text-ink tabular">
                      <Timer className="size-3" strokeWidth={2.6} aria-hidden />
                      {step.minutes} min
                    </span>
                  ) : null}
                </div>
                <p className="mt-1.5 text-[14.5px] leading-relaxed text-ink-2">{step.body}</p>
              </div>
            </motion.li>
          )
        })}
      </motion.ol>
    </div>
  )
}
