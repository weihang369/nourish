import { ArrowRight, Check, ChevronLeft, Timer } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { useState } from 'react'
import { Button, IconButton, Sheet } from '@/components/ui'
import { easeOutExpo } from '@/lib/motion'
import { useAppStore } from '@/store/useAppStore'
import type { Recipe } from '@/types/nutrition'

interface CookModeSheetProps {
  recipe: Recipe
  open: boolean
  onClose: () => void
}

const slide = {
  enter: (dir: number) => ({ x: dir * 48, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir * -48, opacity: 0 }),
}

/** State lives here so it resets every time the sheet opens. */
function CookModeContent({ recipe, onClose }: Omit<CookModeSheetProps, 'open'>) {
  const [[index, dir], setStep] = useState<[number, number]>([0, 1])
  const step = recipe.steps[index]
  const total = recipe.steps.length
  const isLast = index === total - 1

  const go = (next: number) => setStep([Math.max(0, Math.min(total - 1, next)), next > index ? 1 : -1])

  const finish = () => {
    onClose()
    useAppStore.getState().showToast('Bon appétit — enjoy every bite', 'sparkle')
  }

  return (
    <div className="flex h-full flex-col px-6">
      <p className="truncate text-[13px] text-ink-3">{recipe.title}</p>

      <div className="mt-4 flex gap-1.5" aria-hidden>
        {recipe.steps.map((s, i) => (
          <span key={s.title} className="h-1 flex-1 overflow-hidden rounded-full bg-surface-2">
            <motion.span
              className="block h-full rounded-full bg-brand"
              initial={false}
              animate={{ width: i <= index ? '100%' : '0%' }}
              transition={{ duration: 0.5, ease: easeOutExpo }}
            />
          </span>
        ))}
      </div>

      <div className="relative mt-7 min-h-0 flex-1 overflow-hidden" aria-live="polite">
        <AnimatePresence mode="popLayout" initial={false} custom={dir}>
          <motion.div
            key={index}
            custom={dir}
            variants={slide}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.4, ease: easeOutExpo }}
          >
            <div className="flex items-center gap-3">
              <span className="text-[11px] font-semibold tracking-[0.14em] text-ink-3 uppercase tabular">
                Step {index + 1} of {total}
              </span>
              {step.minutes ? (
                <span className="inline-flex h-6 items-center gap-1 rounded-full bg-brand-soft px-2 text-[11px] font-semibold text-ink tabular">
                  <Timer className="size-3" strokeWidth={2.6} aria-hidden />
                  {step.minutes} min
                </span>
              ) : null}
            </div>
            <h3 className="mt-3 font-display text-[34px] leading-[1.05] font-medium text-balance">{step.title}</h3>
            <p className="mt-4 text-[20px] leading-[1.55] text-ink-2">{step.body}</p>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="flex shrink-0 items-center gap-3 pt-4 pb-4">
        <IconButton label="Previous step" size="lg" variant="soft" disabled={index === 0} onClick={() => go(index - 1)} className="disabled:opacity-40">
          <ChevronLeft strokeWidth={2.4} />
        </IconButton>
        <Button
          size="lg"
          block
          className="flex-1"
          onClick={isLast ? finish : () => go(index + 1)}
          trailing={isLast ? <Check className="size-5" strokeWidth={2.6} /> : <ArrowRight className="size-5" strokeWidth={2.4} />}
        >
          {isLast ? 'Finish cooking' : 'Next step'}
        </Button>
      </div>
    </div>
  )
}

/** Large-type, one-step-at-a-time view for a propped-up phone. */
export function CookModeSheet({ recipe, open, onClose }: CookModeSheetProps) {
  return (
    <Sheet open={open} onClose={onClose} title="Cook mode" className="h-[86%]">
      <CookModeContent recipe={recipe} onClose={onClose} />
    </Sheet>
  )
}
