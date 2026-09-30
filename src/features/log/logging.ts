import { mealLabel, meals, suggestMealForNow } from '@/data/diary'
import { type ToastIcon, useAppStore } from '@/store/useAppStore'
import type { MealType } from '@/types/nutrition'

/** Reads `?meal=` safely, falling back to whatever meal fits the clock. */
export function parseMeal(value: string | null): MealType {
  return meals.some((m) => m.type === value) ? (value as MealType) : suggestMealForNow()
}

export function mealWord(meal: MealType) {
  return mealLabel[meal].toLowerCase()
}

/**
 * Adds entries to the diary and raises a toast with an Undo action that
 * removes exactly the entries this call created.
 */
export function logWithUndo(
  meal: MealType,
  items: { foodId: string; servings: number }[],
  message: string,
  icon: ToastIcon = 'check',
) {
  if (items.length === 0) return
  const { addEntries, showToast } = useAppStore.getState()
  addEntries(meal, items)
  const added = useAppStore.getState().entries.slice(-items.length)
  showToast(message, icon, {
    label: 'Undo',
    onClick: () => {
      const { removeEntry } = useAppStore.getState()
      added.forEach((e) => removeEntry(e.id))
    },
  })
}
