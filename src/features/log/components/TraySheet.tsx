import { X } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { FoodImage, MacroLine } from '@/components/food'
import { Button, IconButton } from '@/components/ui'
import { mealLabel } from '@/data/diary'
import { formatInt } from '@/lib/format'
import { spring } from '@/lib/motion'
import { sumEntries } from '@/lib/nutrition'
import type { Food, MealType } from '@/types/nutrition'

interface TraySheetContentProps {
  foods: Food[]
  meal: MealType
  onRemove: (id: string) => void
  onLog: () => void
}

/** Body of the "Your plate" sheet: what's about to be logged, with remove. */
export function TraySheetContent({ foods, meal, onRemove, onLog }: TraySheetContentProps) {
  const totals = sumEntries(foods.map((f) => ({ foodId: f.id, servings: 1 })))

  return (
    <div className="px-6 pb-6">
      <p className="text-[13px] text-ink-2 tabular">
        {formatInt(totals.kcal)} kcal · <MacroLine nutrients={totals} className="align-middle" />
      </p>
      <ul className="mt-4 divide-y divide-line">
        <AnimatePresence initial={false}>
          {foods.map((food) => (
            <motion.li
              key={food.id}
              layout
              exit={{ opacity: 0, x: -24, height: 0 }}
              transition={spring.smooth}
              className="flex items-center gap-3 overflow-hidden py-3"
            >
              <FoodImage photo={food.photo} emoji={food.emoji} alt="" width={48} height={48} className="size-12 shrink-0 rounded-2xl" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-[15px] font-semibold">{food.name}</p>
                <p className="text-[12.5px] text-ink-2 tabular">
                  {food.serving.label} · {formatInt(food.nutrients.kcal)} kcal
                </p>
              </div>
              <IconButton label={`Remove ${food.name}`} variant="soft" size="md" onClick={() => onRemove(food.id)}>
                <X strokeWidth={2.4} />
              </IconButton>
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>
      <Button block size="lg" className="mt-5" onClick={onLog} disabled={foods.length === 0}>
        Log {formatInt(totals.kcal)} kcal to {mealLabel[meal]}
      </Button>
    </div>
  )
}
