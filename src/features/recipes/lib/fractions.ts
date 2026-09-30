import { formatInt } from '@/lib/format'
import type { Ingredient } from '@/types/nutrition'

/** Kitchen fractions, nearest-match. Eighths and thirds are what cooks actually measure. */
const fractions: [number, string][] = [
  [0, ''],
  [1 / 8, '⅛'],
  [1 / 4, '¼'],
  [1 / 3, '⅓'],
  [3 / 8, '⅜'],
  [1 / 2, '½'],
  [5 / 8, '⅝'],
  [2 / 3, '⅔'],
  [3 / 4, '¾'],
  [7 / 8, '⅞'],
  [1, ''],
]

/** 0.75 → "¾", 1.5 → "1½", 0.33 → "⅓", 12.4 → "12". */
export function prettyFraction(value: number): string {
  if (value <= 0) return '0'
  if (value >= 10) return formatInt(value)

  let whole = Math.floor(value)
  const rest = value - whole
  let nearest = fractions[0]
  for (const f of fractions) {
    if (Math.abs(f[0] - rest) < Math.abs(nearest[0] - rest)) nearest = f
  }
  if (nearest[0] === 1) {
    whole += 1
    nearest = fractions[0]
  }
  // Never round a real ingredient down to nothing.
  if (whole === 0 && nearest[0] === 0) return '⅛'
  return `${whole > 0 ? whole : ''}${nearest[1]}`
}

const plural: Record<string, string> = { cup: 'cups', clove: 'cloves', can: 'cans' }
const singular: Record<string, string> = Object.fromEntries(Object.entries(plural).map(([s, p]) => [p, s]))

function unitFor(unit: string, qty: number) {
  const base = singular[unit] ?? unit
  return qty > 1 && plural[base] ? plural[base] : base
}

/** Metric weights read best as round numbers, never fractions. */
function roundMetric(value: number) {
  if (value >= 50) return Math.round(value / 5) * 5
  return Math.max(1, Math.round(value))
}

export interface ScaledAmount {
  qty: string
  unit: string
  /** Stable string for keyed transitions */
  label: string
}

/** Scale an ingredient by `factor` and format it the way a recipe card would. */
export function scaleIngredient(ingredient: Ingredient, factor: number): ScaledAmount {
  let value = ingredient.amount * factor
  let unit = ingredient.unit

  if (unit === 'kg' && value < 1) {
    value *= 1000
    unit = 'g'
  }

  const qty = unit === 'g' || unit === 'ml' ? formatInt(roundMetric(value)) : prettyFraction(value)
  const u = unitFor(unit, value)
  return { qty, unit: u, label: `${qty} ${u}` }
}
