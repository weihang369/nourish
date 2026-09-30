import { useNavigate } from 'react-router'
import { FoodImage, MacroLine } from '@/components/food'
import { formatInt } from '@/lib/format'
import type { Recipe } from '@/types/nutrition'
import { SaveHeart } from './SaveHeart'

/** Fixed height of the caption under the photo — lets the grid compute masonry positions. */
export const RECIPE_CARD_CAPTION_H = 96

interface RecipeCardProps {
  recipe: Recipe
  width: number
  imageHeight: number
}

/**
 * Editorial grid card: photo carries the weight, caption sits on the paper.
 * A transparent overlay button opens the recipe so the heart can stay a real, separate button.
 */
export function RecipeCard({ recipe, width, imageHeight }: RecipeCardProps) {
  const navigate = useNavigate()
  return (
    <div className="group relative" style={{ width }}>
      <button
        type="button"
        aria-label={`${recipe.title}, ${recipe.minutes} minutes, ${recipe.nutrients.kcal} kcal`}
        onClick={() => navigate(`/recipes/${recipe.id}`)}
        className="peer absolute inset-0 z-[1] rounded-[22px]"
      />
      <div
        className="pointer-events-none relative z-[2] overflow-hidden rounded-[22px] bg-surface-2 shadow-card transition-transform duration-300 ease-out-expo peer-active:scale-[0.97]"
        style={{ height: imageHeight }}
      >
        <FoodImage photo={recipe.photo} emoji="🍽️" alt="" width={Math.round(width)} height={imageHeight} className="size-full" />
        <div className="absolute inset-x-0 top-0 h-16 bg-linear-to-b from-black/25 to-transparent" />
        <SaveHeart recipeId={recipe.id} title={recipe.title} className="pointer-events-auto absolute top-2 right-2" />
        <span className="glass-dark absolute bottom-2 left-2 inline-flex h-6 items-center rounded-full px-2.5 text-[11px] font-semibold text-white tabular ring-1 ring-white/15 ring-inset">
          {recipe.minutes} min
        </span>
      </div>
      <div className="px-0.5 pt-2.5" style={{ height: RECIPE_CARD_CAPTION_H }}>
        <h3 className="line-clamp-2 min-h-[2.4em] font-display text-[16px] leading-[1.2] font-medium text-ink">
          {recipe.title}
        </h3>
        <p className="mt-1 text-[12px] font-medium text-ink-2 tabular">
          {formatInt(recipe.nutrients.kcal)} kcal · {recipe.difficulty}
        </p>
        <MacroLine nutrients={recipe.nutrients} className="mt-1.5 gap-2 text-[10.5px]" />
      </div>
    </div>
  )
}
