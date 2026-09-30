import { motion } from 'motion/react'
import { useState } from 'react'
import { useNavigate } from 'react-router'
import { FoodImage } from '@/components/food'
import { AnimatedNumber, Button, Sheet, Stepper } from '@/components/ui'
import { mealLabel, meals, suggestMealForNow } from '@/data/diary'
import { recipeFoodId } from '@/data/foods'
import { cn } from '@/lib/cn'
import { formatInt, formatServings } from '@/lib/format'
import { spring } from '@/lib/motion'
import { useAppStore } from '@/store/useAppStore'
import type { MealType, Recipe } from '@/types/nutrition'

interface LogMealSheetProps {
  recipe: Recipe
  open: boolean
  onClose: () => void
}

function LogMealContent({ recipe, onClose }: Omit<LogMealSheetProps, 'open'>) {
  const navigate = useNavigate()
  const [meal, setMeal] = useState<MealType>(suggestMealForNow)
  const [portion, setPortion] = useState(1)
  const kcal = recipe.nutrients.kcal * portion
  const protein = recipe.nutrients.protein * portion

  const confirm = () => {
    onClose()
    const { addEntries, removeEntry, showToast } = useAppStore.getState()
    const [id] = addEntries(meal, [{ foodId: recipeFoodId(recipe.id), servings: portion }])
    showToast(`Logged to ${mealLabel[meal]}`, 'check', { label: 'Undo', onClick: () => removeEntry(id) })
    navigate('/')
  }

  return (
    <div className="px-6 pb-4">
      <div className="flex items-center gap-3.5 rounded-[22px] bg-surface-2 p-2.5">
        <FoodImage photo={recipe.photo} emoji="🍽️" alt="" width={56} height={56} className="size-14 shrink-0 rounded-[16px]" />
        <div className="min-w-0 flex-1">
          <p className="truncate text-[14.5px] font-semibold text-ink">{recipe.title}</p>
          <p className="mt-0.5 text-[12.5px] text-ink-3 tabular">
            <AnimatedNumber value={kcal} from={kcal} duration={0.5} /> kcal ·{' '}
            <AnimatedNumber value={protein} from={protein} duration={0.5} /> g protein
          </p>
        </div>
      </div>

      <p className="mt-6 text-[11px] font-semibold tracking-[0.14em] text-ink-3 uppercase">Which meal?</p>
      <div role="radiogroup" aria-label="Meal" className="mt-2.5 grid grid-cols-2 gap-2.5">
        {meals.map((m) => {
          const selected = m.type === meal
          return (
            <motion.button
              key={m.type}
              type="button"
              role="radio"
              aria-checked={selected}
              whileTap={{ scale: 0.97 }}
              transition={spring.snappy}
              onClick={() => setMeal(m.type)}
              className={cn(
                'relative flex items-center gap-3 rounded-[20px] p-3 text-left transition-colors duration-300',
                selected ? 'bg-brand-soft ring-2 ring-brand ring-inset' : 'bg-surface ring-1 ring-line ring-inset',
              )}
            >
              <span className="grid size-10 place-items-center rounded-full bg-surface text-[20px] shadow-card">{m.emoji}</span>
              <span className="min-w-0">
                <span className="block text-[14px] font-semibold text-ink">{mealLabel[m.type]}</span>
                <span className="block text-[11.5px] text-ink-3">{m.window}</span>
              </span>
            </motion.button>
          )
        })}
      </div>

      <div className="mt-6 flex items-center justify-between gap-4">
        <div>
          <p className="text-[14px] font-semibold text-ink">How much did you eat?</p>
          <p className="text-[12px] text-ink-3">In servings · {formatInt(recipe.nutrients.kcal)} kcal each</p>
        </div>
        <Stepper value={portion} onChange={setPortion} min={0.5} max={4} step={0.5} format={formatServings} />
      </div>

      <Button size="lg" block className="mt-7" onClick={confirm}>
        Log to {mealLabel[meal]}
      </Button>
    </div>
  )
}

/** Choose a meal and portion, then confirm. */
export function LogMealSheet({ recipe, open, onClose }: LogMealSheetProps) {
  return (
    <Sheet open={open} onClose={onClose} title="Log this meal">
      <LogMealContent recipe={recipe} onClose={onClose} />
    </Sheet>
  )
}
