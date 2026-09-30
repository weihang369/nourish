import { Check, Dumbbell, Feather, Flower2, Leaf, type LucideIcon } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { cn } from '@/lib/cn'
import { riseIn, spring, stagger } from '@/lib/motion'
import type { GoalType } from '@/store/useAppStore'
import { StepHeading } from './StepHeading'

interface GoalOption {
  id: GoalType
  title: string
  detail: string
  icon: LucideIcon
  tile: string
}

export const goalOptions: GoalOption[] = [
  {
    id: 'lose',
    title: 'Lose weight',
    detail: 'A gentle deficit — no crash diets.',
    icon: Feather,
    tile: 'bg-water/15 text-water',
  },
  {
    id: 'maintain',
    title: 'Maintain & feel great',
    detail: 'Steady energy and balanced plates.',
    icon: Leaf,
    tile: 'bg-brand-soft text-brand',
  },
  {
    id: 'gain',
    title: 'Build muscle',
    detail: 'More protein to fuel your training.',
    icon: Dumbbell,
    tile: 'bg-ember/15 text-ember',
  },
  {
    id: 'mindful',
    title: 'Eat more mindfully',
    detail: 'Notice patterns, not just numbers.',
    icon: Flower2,
    tile: 'bg-lime/35 text-brand dark:bg-lime/15',
  },
]

interface GoalStepProps {
  value: GoalType | null
  onChange: (goal: GoalType) => void
}

/** Step 1 — pick the intention the plan is shaped around. */
export function GoalStep({ value, onChange }: GoalStepProps) {
  return (
    <motion.div variants={stagger} initial="hidden" animate="show" className="px-5">
      <StepHeading
        eyebrow="Your goal"
        title="What brings you to Nourish?"
        subtitle="We’ll shape your plan around it. You can change this anytime."
      />

      <div role="radiogroup" aria-label="Goal" className="mt-7 space-y-3">
        {goalOptions.map((opt) => {
          const selected = value === opt.id
          const Icon = opt.icon
          return (
            <motion.button
              key={opt.id}
              type="button"
              role="radio"
              aria-checked={selected}
              variants={riseIn}
              whileTap={{ scale: 0.98 }}
              onClick={() => onChange(opt.id)}
              className={cn(
                'relative flex w-full items-center gap-4 rounded-[24px] p-4 text-left shadow-card ring-1 ring-line ring-inset transition-colors duration-300',
                selected ? 'bg-brand-soft/60 dark:bg-brand-soft/70' : 'bg-surface',
              )}
            >
              {selected && (
                <motion.span
                  layoutId="goal-ring"
                  transition={spring.snappy}
                  className="pointer-events-none absolute inset-0 rounded-[24px] ring-2 ring-brand ring-inset"
                />
              )}
              <motion.span
                animate={{ scale: selected ? 1.06 : 1, rotate: selected ? -4 : 0 }}
                transition={spring.bouncy}
                className={cn('grid size-14 shrink-0 place-items-center rounded-[18px]', opt.tile)}
              >
                <Icon className="size-6" strokeWidth={2} />
              </motion.span>
              <span className="min-w-0 flex-1">
                <span className="block font-display text-[19px] leading-tight font-medium">{opt.title}</span>
                <span className="mt-1 block text-[13.5px] leading-snug text-ink-2">{opt.detail}</span>
              </span>
              <span
                className={cn(
                  'relative grid size-7 shrink-0 place-items-center rounded-full transition-colors duration-300',
                  selected ? 'bg-brand' : 'ring-2 ring-surface-3 ring-inset',
                )}
              >
                <AnimatePresence initial={false}>
                  {selected && (
                    <motion.span
                      key="check"
                      initial={{ scale: 0, rotate: -45 }}
                      animate={{ scale: 1, rotate: 0 }}
                      exit={{ scale: 0, opacity: 0 }}
                      transition={spring.bouncy}
                      className="text-brand-ink"
                    >
                      <Check className="size-4" strokeWidth={3} />
                    </motion.span>
                  )}
                </AnimatePresence>
              </span>
            </motion.button>
          )
        })}
      </div>
    </motion.div>
  )
}
