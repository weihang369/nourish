import type { CaloriePoint, InsightRange, WeightPoint } from '@/data/insights'
import { addDays } from '@/lib/date'

/** A day (or week, for the 3-month view) counts as on target within ±8% of goal. */
const ON_TARGET_TOLERANCE = 0.08

export const rangeMeta: Record<InsightRange, { label: string; caption: string; unit: string }> = {
  week: { label: 'Week', caption: 'Last 7 days', unit: 'days' },
  month: { label: 'Month', caption: 'Last 30 days', unit: 'days' },
  quarter: { label: '3 months', caption: 'Last 12 weeks', unit: 'weeks' },
}

export function summarizeCalories(data: CaloriePoint[], goal: number) {
  const avg = data.reduce((sum, d) => sum + d.kcal, 0) / data.length
  const onTarget = data.filter((d) => Math.abs(d.kcal - goal) <= goal * ON_TARGET_TOLERANCE).length
  const deltaPct = Math.round(((avg - goal) / goal) * 100)
  return { avg, onTarget, total: data.length, onTargetPct: onTarget / data.length, deltaPct }
}

/** "1% under goal" · "right on goal" · "3% over goal" */
export function describeDelta(deltaPct: number) {
  if (deltaPct === 0) return 'right on goal'
  return `${Math.abs(deltaPct)}% ${deltaPct < 0 ? 'under' : 'over'} goal`
}

const monthFmt = new Intl.DateTimeFormat('en-US', { month: 'long' })

/** Linear projection of the current pace to the target, phrased loosely ("mid-December"). */
export function projectGoalDate(trend: WeightPoint[], targetKg: number) {
  const first = trend[0].kg
  const last = trend[trend.length - 1].kg
  const perWeek = (first - last) / (trend.length - 1)
  if (perWeek <= 0 || last <= targetKg) return null
  const weeks = (last - targetKg) / perWeek
  const date = addDays(new Date(), Math.round(weeks * 7))
  const day = date.getDate()
  const part = day <= 10 ? 'early' : day <= 20 ? 'mid' : 'late'
  return { perWeek, label: `${part}-${monthFmt.format(date)}` }
}

export function weightProgress(start: number, current: number, target: number) {
  const span = start - target
  return span === 0 ? 1 : Math.max(0, Math.min(1, (start - current) / span))
}

export type CalorieSummary = ReturnType<typeof summarizeCalories>
