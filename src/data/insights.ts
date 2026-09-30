import { addDays, startOfDay } from '@/lib/date'

export type InsightRange = 'week' | 'month' | 'quarter'

export interface CaloriePoint {
  key: string
  label: string
  /** Long label for tooltips */
  detail: string
  kcal: number
}

const dayFmt = new Intl.DateTimeFormat('en-US', { weekday: 'short' })
const longFmt = new Intl.DateTimeFormat('en-US', { weekday: 'long', month: 'short', day: 'numeric' })
const shortFmt = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' })

// Deterministic "random" so the prototype looks identical on every load.
function seeded(seed: number) {
  let s = seed
  return () => {
    s = (s * 16807) % 2147483647
    return (s - 1) / 2147483646
  }
}

const week = [2080, 1940, 2310, 2420, 1985, 2045, 2110]

function lastDays(count: number, values: (i: number) => number): CaloriePoint[] {
  const today = startOfDay(new Date())
  return Array.from({ length: count }, (_, i) => {
    const d = addDays(today, i - count)
    return {
      key: d.toISOString(),
      label: count <= 7 ? dayFmt.format(d).slice(0, 1) : String(d.getDate()),
      detail: longFmt.format(d),
      kcal: values(i),
    }
  })
}

export function caloriesFor(range: InsightRange): CaloriePoint[] {
  if (range === 'week') return lastDays(7, (i) => week[i])
  if (range === 'month') {
    const rand = seeded(42)
    return lastDays(30, () => Math.round(1850 + rand() * 600))
  }
  const rand = seeded(7)
  const today = startOfDay(new Date())
  return Array.from({ length: 12 }, (_, i) => {
    const d = addDays(today, (i - 12) * 7)
    return {
      key: d.toISOString(),
      label: shortFmt.format(d).split(' ')[1],
      detail: `Week of ${shortFmt.format(d)}`,
      kcal: Math.round(2020 + rand() * 260),
    }
  })
}

export interface WeightPoint {
  key: string
  label: string
  detail: string
  kg: number
}

const weightSeries = [72.0, 71.6, 71.5, 70.9, 70.8, 70.2, 70.3, 69.6, 69.4, 69.1, 68.7, 68.4]

export function weightTrend(): WeightPoint[] {
  const today = startOfDay(new Date())
  return weightSeries.map((kg, i) => {
    const d = addDays(today, (i - (weightSeries.length - 1)) * 7)
    return { key: d.toISOString(), label: shortFmt.format(d), detail: `Week of ${shortFmt.format(d)}`, kg }
  })
}

/** Average macro split (% of calories) vs. plan */
export const macroSplit = {
  actual: { protein: 24, carbs: 46, fat: 30 },
  target: { protein: 26, carbs: 45, fat: 29 },
}

/** Daily goal adherence for the last 35 days, 0 (missed) – 4 (nailed it) */
export function adherence(): { date: Date; level: number }[] {
  const rand = seeded(11)
  const today = startOfDay(new Date())
  return Array.from({ length: 35 }, (_, i) => {
    const date = addDays(today, i - 34)
    const r = rand()
    const level = i === 34 ? 2 : r > 0.86 ? 1 : r > 0.62 ? 2 : r > 0.3 ? 3 : 4
    return { date, level }
  })
}

export const highlights = [
  {
    id: 'fiber',
    title: 'Fiber is trending up',
    body: 'You averaged 29 g/day — up 18% from last week. Beans at lunch made the difference.',
    stat: '+18%',
    tone: 'fiber' as const,
  },
  {
    id: 'protein',
    title: 'Protein dips at dinner',
    body: 'Dinner provides only 22% of your protein. Aim for 35–40 g at your evening meal.',
    stat: '22%',
    tone: 'protein' as const,
  },
  {
    id: 'weekend',
    title: 'Weekends run warm',
    body: 'Saturday averages 270 kcal over goal. Planning brunch ahead keeps you on track.',
    stat: '+270',
    tone: 'carbs' as const,
  },
]
