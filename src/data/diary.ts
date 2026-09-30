import type { DiaryEntry, MealType } from '@/types/nutrition'

export interface MealMeta {
  type: MealType
  label: string
  emoji: string
  window: string
  /** Share of the daily calorie goal this meal usually takes */
  share: number
}

export const meals: MealMeta[] = [
  { type: 'breakfast', label: 'Breakfast', emoji: '🌅', window: '7 – 9 am', share: 0.25 },
  { type: 'lunch', label: 'Lunch', emoji: '☀️', window: '12 – 2 pm', share: 0.35 },
  { type: 'dinner', label: 'Dinner', emoji: '🌙', window: '6 – 8 pm', share: 0.3 },
  { type: 'snack', label: 'Snacks', emoji: '🍎', window: 'Anytime', share: 0.1 },
]

export const mealLabel: Record<MealType, string> = {
  breakfast: 'Breakfast',
  lunch: 'Lunch',
  dinner: 'Dinner',
  snack: 'Snack',
}

/** Today's diary as it stands mid-afternoon — dinner intentionally open. */
export const seedEntries: DiaryEntry[] = [
  { id: 'e1', foodId: 'greek-yogurt-parfait', meal: 'breakfast', servings: 1, time: '07:42' },
  { id: 'e2', foodId: 'oat-latte', meal: 'breakfast', servings: 1, time: '07:45' },
  { id: 'e3', foodId: 'blueberries', meal: 'breakfast', servings: 0.5, time: '07:46' },
  { id: 'e4', foodId: 'salmon-poke-bowl', meal: 'lunch', servings: 1, time: '12:58' },
  { id: 'e5', foodId: 'apple', meal: 'snack', servings: 1, time: '15:20' },
  { id: 'e6', foodId: 'almond-butter', meal: 'snack', servings: 1, time: '15:21' },
]

export const seedWaterMl = 1250

export function suggestMealForNow(date = new Date()): MealType {
  const h = date.getHours()
  if (h < 11) return 'breakfast'
  if (h < 16) return 'lunch'
  if (h < 21) return 'dinner'
  return 'snack'
}
