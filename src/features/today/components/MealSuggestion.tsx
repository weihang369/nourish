import { ChevronRight, Sparkles } from 'lucide-react'
import { motion } from 'motion/react'
import { useNavigate } from 'react-router'
import { FoodImage } from '@/components/food'
import { recipes } from '@/data/recipes'
import { formatInt } from '@/lib/format'
import type { Recipe } from '@/types/nutrition'

const PREFERRED = 'lemon-herb-salmon'

/** The most protein-rich recipe that fits what's left today (favouring our editor's pick). */
function pickRecipe(remainingKcal: number): Recipe {
  const fits = recipes.filter((r) => r.nutrients.kcal <= remainingKcal)
  const preferred = fits.find((r) => r.id === PREFERRED)
  if (preferred) return preferred
  if (fits.length) return [...fits].sort((a, b) => b.nutrients.protein - a.nutrients.protein)[0]
  return [...recipes].sort((a, b) => a.nutrients.kcal - b.nutrients.kcal)[0]
}

/** Empty-meal invitation: a smart, specific recipe that fits the remaining budget. */
export function MealSuggestion({ remainingKcal }: { remainingKcal: number }) {
  const navigate = useNavigate()
  const recipe = pickRecipe(remainingKcal)
  const fits = recipe.nutrients.kcal <= remainingKcal

  return (
    <motion.button
      type="button"
      whileTap={{ scale: 0.98 }}
      onClick={() => navigate(`/recipes/${recipe.id}`)}
      className="group mt-4 flex w-full items-center gap-3 rounded-[22px] bg-brand-soft/70 p-2.5 pr-3 text-left ring-1 ring-brand/10 ring-inset"
    >
      <FoodImage
        photo={recipe.photo}
        emoji="🍽️"
        alt={recipe.title}
        width={56}
        className="size-14 shrink-0 rounded-[16px]"
      />
      <span className="min-w-0 flex-1">
        <span className="flex items-center gap-1 text-[12px] font-semibold text-brand">
          <Sparkles className="size-3" strokeWidth={2.5} />
          {fits ? `Fits your remaining ${formatInt(remainingKcal)} kcal` : 'A light idea for later'}
        </span>
        <span className="mt-0.5 line-clamp-2 block text-[14px] leading-snug font-semibold">{recipe.title}</span>
        <span className="mt-0.5 block text-[12px] text-ink-2 tabular">
          {formatInt(recipe.nutrients.kcal)} kcal · {formatInt(recipe.nutrients.protein)} g protein · {recipe.minutes} min
        </span>
      </span>
      <ChevronRight className="size-4 shrink-0 text-ink-3 transition-transform group-hover:translate-x-0.5" />
    </motion.button>
  )
}
