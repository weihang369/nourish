import { Plus } from 'lucide-react'
import { motion } from 'motion/react'
import { FoodImage } from '@/components/food'
import { getFood, recentFoodIds } from '@/data/foods'
import { formatInt } from '@/lib/format'
import { spring } from '@/lib/motion'
import type { Food } from '@/types/nutrition'

const recentFoods = recentFoodIds.map(getFood).filter((f): f is Food => Boolean(f))

/** One-tap re-logging of recent foods. */
export function LogAgainRow({ onPick }: { onPick: (food: Food) => void }) {
  return (
    <ul className="no-scrollbar snap-x flex gap-3 overflow-x-auto scroll-px-6 px-6 pb-1">
      {recentFoods.map((food) => (
        <li key={food.id} className="w-[104px] shrink-0">
          <motion.button
            type="button"
            whileTap={{ scale: 0.95 }}
            transition={spring.snappy}
            onClick={() => onPick(food)}
            aria-label={`Log ${food.name} again, ${formatInt(food.nutrients.kcal)} kcal`}
            className="group block w-full text-left"
          >
            <span className="relative block">
              <FoodImage
                photo={food.photo}
                emoji={food.emoji}
                alt=""
                width={104}
                className="aspect-square w-full rounded-[20px]"
              />
              <span className="absolute right-1.5 bottom-1.5 grid size-7 place-items-center rounded-full bg-surface text-ink shadow-card transition-transform group-hover:scale-110">
                <Plus className="size-4" strokeWidth={2.6} />
              </span>
            </span>
            <span className="mt-2 line-clamp-2 block text-[12.5px] leading-snug font-semibold">{food.name}</span>
            <span className="mt-0.5 block text-[11.5px] text-ink-3 tabular">
              {formatInt(food.nutrients.kcal)} kcal · {food.serving.label}
            </span>
          </motion.button>
        </li>
      ))}
    </ul>
  )
}
