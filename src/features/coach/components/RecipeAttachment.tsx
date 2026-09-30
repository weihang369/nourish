import { ArrowUpRight, Clock } from 'lucide-react'
import { motion } from 'motion/react'
import { useNavigate } from 'react-router'
import { FoodImage } from '@/components/food'
import { getRecipe } from '@/data/recipes'
import { formatInt } from '@/lib/format'
import { spring } from '@/lib/motion'

export function RecipeAttachment({ recipeId }: { recipeId: string }) {
  const navigate = useNavigate()
  const recipe = getRecipe(recipeId)
  if (!recipe) return null

  return (
    <motion.button
      type="button"
      onClick={() => navigate(`/recipes/${recipe.id}`)}
      whileTap={{ scale: 0.97 }}
      transition={spring.snappy}
      aria-label={`Open recipe: ${recipe.title}`}
      className="block w-[264px] overflow-hidden rounded-[22px] bg-surface text-left shadow-card ring-1 ring-line ring-inset"
    >
      <div className="relative">
        <FoodImage photo={recipe.photo} emoji="🍽️" alt="" width={264} height={132} className="h-[132px] w-full" />
        <span className="glass-dark absolute top-2.5 left-2.5 inline-flex h-6 items-center gap-1 rounded-full px-2 text-[11px] font-semibold text-white">
          <Clock className="size-3" />
          {recipe.minutes} min
        </span>
      </div>
      <div className="flex items-end gap-3 p-3.5">
        <div className="min-w-0 flex-1">
          <p className="line-clamp-2 text-[14.5px] leading-snug font-semibold">{recipe.title}</p>
          <p className="mt-1 text-[12px] text-ink-3 tabular">
            <span className="font-semibold text-ink-2">{formatInt(recipe.nutrients.kcal)} kcal</span> ·{' '}
            {formatInt(recipe.nutrients.protein)} g protein
          </p>
        </div>
        <span className="grid size-9 shrink-0 place-items-center rounded-full bg-surface-2 text-ink">
          <ArrowUpRight className="size-4" />
        </span>
      </div>
    </motion.button>
  )
}
