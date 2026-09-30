import { AnimatePresence, motion } from 'motion/react'
import { AnimatedNumber, Button } from '@/components/ui'
import { mealLabel } from '@/data/diary'
import { pluralize } from '@/lib/format'
import { spring } from '@/lib/motion'
import type { Food, MealType } from '@/types/nutrition'
import { ThumbStack } from './ThumbStack'

interface TrayBarProps {
  foods: Food[]
  kcal: number
  meal: MealType
  onReview: () => void
  onLog: () => void
}

/** Floating "plate" summary that rises in once something is added. */
export function TrayBar({ foods, kcal, meal, onReview, onLog }: TrayBarProps) {
  const visible = foods.length > 0

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="tray"
          initial={{ y: 140, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 140, opacity: 0 }}
          transition={spring.smooth}
          className="pointer-events-none absolute inset-x-0 bottom-0 z-20 bg-linear-to-t from-canvas via-canvas/80 to-transparent px-4 pt-10 pb-safe"
        >
          <motion.div
            layout
            transition={spring.smooth}
            className="pointer-events-auto flex items-center gap-2 rounded-[26px] bg-deep p-2 pl-2.5 text-on-deep shadow-float"
          >
            <button
              type="button"
              onClick={onReview}
              aria-label={`Review plate: ${pluralize(foods.length, 'item')}`}
              className="flex min-w-0 flex-1 items-center gap-3 rounded-[20px] py-1 pr-1 text-left"
            >
              <ThumbStack foods={foods} size={38} ringClassName="ring-deep" />
              <span className="min-w-0">
                <span className="flex items-baseline gap-1 text-[16px] font-semibold tracking-[-0.01em]">
                  <AnimatedNumber value={kcal} duration={0.6} />
                  <span className="text-[12px] font-medium text-on-deep/60">kcal</span>
                </span>
                <span className="block truncate text-[12px] text-on-deep/60">{pluralize(foods.length, 'item')}</span>
              </span>
            </button>
            <Button variant="lime" onClick={onLog} className="px-5">
              Log to {mealLabel[meal]}
            </Button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
