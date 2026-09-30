import { Check, Plus } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { useState } from 'react'
import { FoodImage } from '@/components/food'
import { mealLabel, suggestMealForNow } from '@/data/diary'
import { getFood } from '@/data/foods'
import { formatGrams, formatInt } from '@/lib/format'
import { spring } from '@/lib/motion'
import { cn } from '@/lib/cn'
import { useAppStore } from '@/store/useAppStore'
import type { Food } from '@/types/nutrition'

/** Horizontal rail of tappable food chips. Bleeds to the screen edge. */
export function FoodSuggestions({ foodIds }: { foodIds: string[] }) {
  const items = foodIds.map(getFood).filter((f): f is Food => Boolean(f))
  return (
    <ul className="no-scrollbar snap-x -mx-5 flex scroll-pl-14 gap-2.5 overflow-x-auto pt-0.5 pr-5 pb-2 pl-14">
      {items.map((food) => (
        <FoodChip key={food.id} food={food} />
      ))}
    </ul>
  )
}

function FoodChip({ food }: { food: Food }) {
  const addEntries = useAppStore((s) => s.addEntries)
  const [added, setAdded] = useState(false)

  const add = () => {
    const meal = suggestMealForNow()
    addEntries(meal, [{ foodId: food.id, servings: 1 }])
    setAdded(true)
    useAppStore.getState().showToast(`Added to ${mealLabel[meal].toLowerCase()}`, 'check')
  }

  return (
    <li className="flex w-[236px] shrink-0 items-center gap-2.5 rounded-[20px] bg-surface p-1.5 shadow-card ring-1 ring-line ring-inset">
      <FoodImage
        photo={food.photo}
        emoji={food.emoji}
        alt=""
        width={48}
        height={48}
        className="size-12 shrink-0 rounded-[14px]"
      />
      <div className="min-w-0 flex-1">
        <p className="truncate text-[13px] font-semibold">{food.name}</p>
        <p className="truncate text-[11px] text-ink-3 tabular">
          {formatGrams(food.nutrients.protein)} g protein · {formatInt(food.nutrients.kcal)} kcal
        </p>
      </div>
      <motion.button
        type="button"
        onClick={add}
        disabled={added}
        whileTap={{ scale: 0.88 }}
        transition={spring.snappy}
        aria-label={added ? `${food.name} added` : `Add ${food.name}`}
        className={cn(
          'grid size-10 shrink-0 place-items-center rounded-full transition-colors duration-300',
          added ? 'bg-brand-soft text-brand' : 'bg-ink text-canvas',
        )}
      >
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span
            key={added ? 'done' : 'add'}
            initial={{ scale: 0.4, opacity: 0, rotate: -45 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            exit={{ scale: 0.4, opacity: 0 }}
            transition={spring.bouncy}
          >
            {added ? <Check className="size-4" strokeWidth={2.75} /> : <Plus className="size-4" strokeWidth={2.75} />}
          </motion.span>
        </AnimatePresence>
      </motion.button>
    </li>
  )
}
