import type { Recipe } from '@/types/nutrition'

export interface DayFit {
  recipe: Recipe
  /** Share of today's remaining energy one serving would use (0–1+) */
  kcalShare: number
}

export interface DayFitResult {
  mode: 'fits' | 'light'
  picks: DayFit[]
}

/**
 * Rank recipes against what's left of today. We favour dishes that close the
 * protein gap while leaving a little breathing room in the energy budget.
 */
export function rankForDay(
  recipes: Recipe[],
  remainingKcal: number,
  remainingProtein: number,
  limit = 5,
): DayFitResult {
  const budget = Math.max(remainingKcal, 1)

  // Budget is (nearly) spent — offer the lightest ideas instead of "nothing fits".
  if (remainingKcal < 250) {
    const picks = [...recipes]
      .sort((a, b) => a.nutrients.kcal - b.nutrients.kcal)
      .slice(0, limit)
      .map((recipe) => ({ recipe, kcalShare: recipe.nutrients.kcal / budget }))
    return { mode: 'light', picks }
  }

  const target = remainingKcal * 0.7
  const proteinGap = Math.max(remainingProtein, 15)

  const picks = recipes
    .filter((r) => r.nutrients.kcal <= remainingKcal)
    .map((recipe) => {
      const { kcal, protein } = recipe.nutrients
      const proteinScore = Math.min(protein / proteinGap, 1)
      const energyScore = Math.max(0, 1 - Math.abs(kcal - target) / target)
      return { recipe, kcalShare: kcal / budget, score: proteinScore * 0.6 + energyScore * 0.4 }
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ recipe, kcalShare }) => ({ recipe, kcalShare }))

  return { mode: 'fits', picks }
}
