import { getFood } from '@/data/foods'
import type { DiaryEntry, MacroKey, MealType, MicroKey, Nutrients } from '@/types/nutrition'

export const emptyNutrients: Nutrients = {
  kcal: 0,
  protein: 0,
  carbs: 0,
  fat: 0,
  fiber: 0,
  sugar: 0,
  satFat: 0,
  sodium: 0,
}

export function scaleNutrients(n: Nutrients, factor: number): Nutrients {
  return {
    kcal: n.kcal * factor,
    protein: n.protein * factor,
    carbs: n.carbs * factor,
    fat: n.fat * factor,
    fiber: n.fiber * factor,
    sugar: n.sugar * factor,
    satFat: n.satFat * factor,
    sodium: n.sodium * factor,
  }
}

export function addNutrients(a: Nutrients, b: Nutrients): Nutrients {
  return {
    kcal: a.kcal + b.kcal,
    protein: a.protein + b.protein,
    carbs: a.carbs + b.carbs,
    fat: a.fat + b.fat,
    fiber: a.fiber + b.fiber,
    sugar: a.sugar + b.sugar,
    satFat: a.satFat + b.satFat,
    sodium: a.sodium + b.sodium,
  }
}

export function entryNutrients(entry: Pick<DiaryEntry, 'foodId' | 'servings'>): Nutrients {
  const food = getFood(entry.foodId)
  return food ? scaleNutrients(food.nutrients, entry.servings) : emptyNutrients
}

export function sumEntries(entries: Pick<DiaryEntry, 'foodId' | 'servings'>[]): Nutrients {
  return entries.reduce((acc, e) => addNutrients(acc, entryNutrients(e)), emptyNutrients)
}

export function totalsByMeal(entries: DiaryEntry[]): Record<MealType, Nutrients> {
  const pick = (meal: MealType) => sumEntries(entries.filter((e) => e.meal === meal))
  return { breakfast: pick('breakfast'), lunch: pick('lunch'), dinner: pick('dinner'), snack: pick('snack') }
}

export const kcalPerGram: Record<MacroKey, number> = { protein: 4, carbs: 4, fat: 9 }

/** Share of calories coming from each macro, as 0–100 percentages that sum to 100. */
export function macroEnergySplit(n: Pick<Nutrients, MacroKey>) {
  const p = n.protein * 4
  const c = n.carbs * 4
  const f = n.fat * 9
  const total = p + c + f || 1
  const protein = Math.round((p / total) * 100)
  const carbs = Math.round((c / total) * 100)
  return { protein, carbs, fat: 100 - protein - carbs }
}

export const macroMeta: Record<MacroKey, { label: string; short: string; color: string; bg: string; text: string }> = {
  protein: { label: 'Protein', short: 'P', color: 'var(--nr-protein)', bg: 'bg-protein', text: 'text-protein' },
  carbs: { label: 'Carbs', short: 'C', color: 'var(--nr-carbs)', bg: 'bg-carbs', text: 'text-carbs' },
  fat: { label: 'Fat', short: 'F', color: 'var(--nr-fat)', bg: 'bg-fat', text: 'text-fat' },
}

export const macroKeys: MacroKey[] = ['protein', 'carbs', 'fat']

export const microMeta: Record<MicroKey, { label: string; dvAmount: number; unit: string }> = {
  vitA: { label: 'Vitamin A', dvAmount: 900, unit: 'mcg' },
  vitC: { label: 'Vitamin C', dvAmount: 90, unit: 'mg' },
  vitD: { label: 'Vitamin D', dvAmount: 20, unit: 'mcg' },
  vitB12: { label: 'Vitamin B12', dvAmount: 2.4, unit: 'mcg' },
  iron: { label: 'Iron', dvAmount: 18, unit: 'mg' },
  calcium: { label: 'Calcium', dvAmount: 1300, unit: 'mg' },
  potassium: { label: 'Potassium', dvAmount: 4700, unit: 'mg' },
  magnesium: { label: 'Magnesium', dvAmount: 420, unit: 'mg' },
  omega3: { label: 'Omega-3', dvAmount: 1.6, unit: 'g' },
}

export interface ScoreBand {
  label: string
  blurb: string
  tone: 'excellent' | 'good' | 'fair' | 'limit'
}

export function scoreBand(score: number): ScoreBand {
  if (score >= 85) return { label: 'Excellent', blurb: 'Nutrient-dense, minimally processed.', tone: 'excellent' }
  if (score >= 70) return { label: 'Good', blurb: 'A solid everyday choice.', tone: 'good' }
  if (score >= 50) return { label: 'Fair', blurb: 'Fine in balance — watch the sodium.', tone: 'fair' }
  return { label: 'Enjoy mindfully', blurb: 'Best as an occasional treat.', tone: 'limit' }
}
