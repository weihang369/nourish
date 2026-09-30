import type { GoalType } from '@/store/useAppStore'

export type Sex = 'female' | 'male'
export type ActivityLevel = 'sedentary' | 'light' | 'active' | 'very'

export interface BodyProfile {
  sex: Sex
  age: number
  heightCm: number
  weightKg: number
  targetKg: number
  activity: ActivityLevel
}

export const activityLevels: { id: ActivityLevel; label: string; detail: string; factor: number }[] = [
  { id: 'sedentary', label: 'Mostly sitting', detail: 'Desk days, little planned exercise', factor: 1.2 },
  { id: 'light', label: 'Lightly active', detail: 'Walks and 1–3 easy workouts a week', factor: 1.375 },
  { id: 'active', label: 'Active', detail: 'On your feet, training 3–5 times a week', factor: 1.55 },
  { id: 'very', label: 'Very active', detail: 'Hard training most days or a physical job', factor: 1.725 },
]

/** Weight change we plan around, in kg per week. */
export const weeklyRate: Record<GoalType, number> = { lose: 0.5, gain: 0.25, maintain: 0, mindful: 0.25 }

const proteinPerKg: Record<GoalType, number> = { lose: 1.8, maintain: 1.4, gain: 2.0, mindful: 1.4 }
const fatShare: Record<GoalType, number> = { lose: 0.28, maintain: 0.3, gain: 0.25, mindful: 0.3 }

export interface Plan {
  kcal: number
  maintenance: number
  adjustment: number
  protein: number
  carbs: number
  fat: number
  fiber: number
  /** Percent of energy, sums to 100 */
  split: { protein: number; carbs: number; fat: number }
  /** The weight the plan steers toward (current weight when holding steady) */
  targetKg: number
  /** null when the plan holds weight steady */
  reachDate: Date | null
  weeks: number
}

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v))
const round10 = (v: number) => Math.round(v / 10) * 10

/** Mifflin-St Jeor BMR × activity, then a goal-specific, safety-capped adjustment. */
export function computePlan(goal: GoalType, p: BodyProfile, today = new Date()): Plan {
  const bmr = 10 * p.weightKg + 6.25 * p.heightCm - 5 * p.age + (p.sex === 'male' ? 5 : -161)
  const factor = activityLevels.find((a) => a.id === p.activity)?.factor ?? 1.375
  const maintenance = round10(bmr * factor)

  const delta = p.targetKg - p.weightKg
  let adjustment = 0
  if (goal === 'lose') adjustment = -Math.min(500, maintenance * 0.22)
  else if (goal === 'gain') adjustment = Math.min(300, maintenance * 0.15)
  else if (goal === 'mindful' && Math.abs(delta) >= 0.3) adjustment = Math.sign(delta) * 200

  const floor = p.sex === 'male' ? 1500 : 1200
  const kcal = clamp(round10(maintenance + adjustment), floor, 4200)

  const protein = Math.round(clamp(p.weightKg * proteinPerKg[goal], 60, 240))
  const fat = Math.round((kcal * fatShare[goal]) / 9)
  const carbs = Math.max(60, Math.round((kcal - protein * 4 - fat * 9) / 4))
  const fiber = Math.round(clamp((kcal / 1000) * 14, 25, 45))

  const energy = protein * 4 + carbs * 4 + fat * 9
  const pPct = Math.round(((protein * 4) / energy) * 100)
  const cPct = Math.round(((carbs * 4) / energy) * 100)

  const rate = weeklyRate[goal] || 0.5
  const conflicting = (goal === 'lose' && delta > 0) || (goal === 'gain' && delta < 0)
  const moving = goal !== 'maintain' && !conflicting && Math.abs(delta) >= 0.3
  const weeks = moving ? Math.ceil(Math.abs(delta) / rate) : 0
  const reachDate = moving ? new Date(today.getTime() + weeks * 7 * 86_400_000) : null

  return {
    kcal,
    maintenance,
    adjustment: kcal - maintenance,
    protein,
    carbs,
    fat,
    fiber,
    split: { protein: pPct, carbs: cPct, fat: 100 - pPct - cPct },
    targetKg: moving ? p.targetKg : p.weightKg,
    reachDate,
    weeks,
  }
}

/** Sensible starting target when the user picks a goal. */
export function suggestedTarget(goal: GoalType, weightKg: number) {
  const offset = goal === 'lose' ? -4.4 : goal === 'gain' ? 3 : 0
  return Math.round((weightKg + offset) * 10) / 10
}

const shortDate = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' })
const longDate = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' })

export function formatReachDate(date: Date, today = new Date()) {
  return date.getFullYear() === today.getFullYear() || date.getTime() - today.getTime() < 300 * 86_400_000
    ? shortDate.format(date)
    : longDate.format(date)
}

export function formatKg(kg: number) {
  return Number.isInteger(kg) ? String(kg) : kg.toFixed(1)
}
