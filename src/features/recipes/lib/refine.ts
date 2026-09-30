import type { Recipe } from '@/types/nutrition'

export type SortKey = 'recommended' | 'quickest' | 'protein' | 'lightest'
export type TimeLimit = 'any' | '15' | '30'

export interface Refinement {
  sort: SortKey
  time: TimeLimit
}

export const defaultRefinement: Refinement = { sort: 'recommended', time: 'any' }

export const sortOptions: { value: SortKey; label: string; hint: string }[] = [
  { value: 'recommended', label: 'Recommended', hint: 'Balanced for your goals' },
  { value: 'quickest', label: 'Quickest first', hint: 'On the table fastest' },
  { value: 'protein', label: 'Most protein', hint: 'Grams per serving' },
  { value: 'lightest', label: 'Lightest first', hint: 'Fewest kcal per serving' },
]

export const timeOptions: { value: TimeLimit; label: string }[] = [
  { value: 'any', label: 'Any time' },
  { value: '15', label: '≤ 15 min' },
  { value: '30', label: '≤ 30 min' },
]

export function isRefined(r: Refinement) {
  return r.sort !== defaultRefinement.sort || r.time !== defaultRefinement.time
}

export function applyRefinement(list: Recipe[], r: Refinement): Recipe[] {
  const limited = r.time === 'any' ? list : list.filter((x) => x.minutes <= Number(r.time))
  const sorted = [...limited]
  switch (r.sort) {
    case 'quickest':
      return sorted.sort((a, b) => a.minutes - b.minutes)
    case 'protein':
      return sorted.sort((a, b) => b.nutrients.protein - a.nutrients.protein)
    case 'lightest':
      return sorted.sort((a, b) => a.nutrients.kcal - b.nutrients.kcal)
    default:
      return sorted
  }
}
