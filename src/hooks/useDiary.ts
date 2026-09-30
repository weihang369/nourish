import { useMemo } from 'react'
import { sumEntries, totalsByMeal } from '@/lib/nutrition'
import { useAppStore } from '@/store/useAppStore'
import { activity } from '@/data/user'

/** Derived diary numbers for today. Memoised on the entry list. */
export function useDiary() {
  const entries = useAppStore((s) => s.entries)
  const goals = useAppStore((s) => s.goals)

  return useMemo(() => {
    const total = sumEntries(entries)
    const byMeal = totalsByMeal(entries)
    const budget = goals.kcal + activity.activeKcal
    const remaining = Math.round(budget - total.kcal)
    return { entries, goals, total, byMeal, budget, remaining, burned: activity.activeKcal }
  }, [entries, goals])
}
