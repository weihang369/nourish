export type MacroKey = 'protein' | 'carbs' | 'fat'

export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack'

export interface Nutrients {
  kcal: number
  protein: number
  carbs: number
  fat: number
  fiber: number
  sugar: number
  satFat: number
  /** milligrams */
  sodium: number
}

export type MicroKey =
  | 'vitA'
  | 'vitC'
  | 'vitD'
  | 'vitB12'
  | 'iron'
  | 'calcium'
  | 'potassium'
  | 'magnesium'
  | 'omega3'

/** Percent of daily value, keyed by micronutrient. */
export type MicroProfile = Partial<Record<MicroKey, number>>

export type FoodCategory =
  | 'Breakfast'
  | 'Bowls'
  | 'Protein'
  | 'Produce'
  | 'Salads'
  | 'Comfort'
  | 'Pantry'
  | 'Drinks'

export interface Food {
  id: string
  name: string
  brand?: string
  category: FoodCategory
  /** Unsplash photo id — see `data/photos.ts` */
  photo?: string
  /** Fallback when there is no photo */
  emoji: string
  serving: { label: string; grams: number }
  nutrients: Nutrients
  micros: MicroProfile
  /** 0–100 Nourish Score (nutrient density vs. processing) */
  score: number
  tags: string[]
  verified?: boolean
}

export interface DiaryEntry {
  id: string
  foodId: string
  meal: MealType
  servings: number
  /** 24h HH:mm */
  time: string
}

export interface Goals {
  kcal: number
  protein: number
  carbs: number
  fat: number
  fiber: number
  waterMl: number
  startWeightKg: number
  currentWeightKg: number
  targetWeightKg: number
}

export interface Ingredient {
  name: string
  amount: number
  unit: string
  note?: string
}

export interface RecipeStep {
  title: string
  body: string
  minutes?: number
}

export type Difficulty = 'Easy' | 'Medium' | 'Chef'

export interface Recipe {
  id: string
  title: string
  blurb: string
  photo: string
  minutes: number
  servings: number
  difficulty: Difficulty
  rating: number
  reviews: number
  tags: string[]
  /** Per serving */
  nutrients: Nutrients
  ingredients: Ingredient[]
  steps: RecipeStep[]
  author: { name: string; photo: string; role: string }
}
