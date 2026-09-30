const int = new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 })
const oneDp = new Intl.NumberFormat('en-US', { maximumFractionDigits: 1 })

export function formatInt(value: number) {
  return int.format(Math.round(value))
}

/** Grams: whole numbers above 10, one decimal below (e.g. 0.5 g, 3.6 g, 42 g). */
export function formatGrams(value: number) {
  return value >= 10 ? int.format(Math.round(value)) : oneDp.format(value)
}

export function formatOneDp(value: number) {
  return oneDp.format(value)
}

export function formatServings(value: number) {
  const fractions: Record<string, string> = { '0.25': '¼', '0.5': '½', '0.75': '¾', '1.5': '1½', '2.5': '2½' }
  return fractions[String(value)] ?? oneDp.format(value)
}

export function formatLiters(ml: number) {
  return `${oneDp.format(ml / 1000)} L`
}

export function pluralize(count: number, word: string, plural = `${word}s`) {
  return `${formatInt(count)} ${count === 1 ? word : plural}`
}
