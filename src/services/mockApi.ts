/**
 * The whole "backend". Everything resolves from local mock data after a
 * realistic delay so loading states and optimistic UI can be designed for.
 * Swap these functions for real fetch calls when an API exists.
 */
import { coachReplyFor } from '@/data/coach'
import { foods } from '@/data/foods'

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export interface ScanDetection {
  foodId: string
  label: string
  grams: number
  confidence: number
  /** Position of the tag over the photo, in % */
  x: number
  y: number
}

export async function analyzeMealPhoto(): Promise<ScanDetection[]> {
  await wait(2200)
  return [
    { foodId: 'seared-salmon', label: 'Salmon', grams: 120, confidence: 0.97, x: 58, y: 38 },
    { foodId: 'quinoa-pilaf', label: 'Sushi rice', grams: 150, confidence: 0.91, x: 30, y: 55 },
    { foodId: 'avocado', label: 'Avocado', grams: 50, confidence: 0.95, x: 66, y: 64 },
    { foodId: 'kale-chickpea-salad', label: 'Greens & edamame', grams: 80, confidence: 0.84, x: 34, y: 30 },
  ]
}

export async function searchFoods(query: string) {
  await wait(180)
  const q = query.trim().toLowerCase()
  if (!q) return foods
  return foods.filter(
    (f) =>
      f.name.toLowerCase().includes(q) ||
      f.category.toLowerCase().includes(q) ||
      f.tags.some((t) => t.toLowerCase().includes(q)),
  )
}

export async function askCoach(prompt: string) {
  await wait(1100 + Math.random() * 600)
  return coachReplyFor(prompt)
}
