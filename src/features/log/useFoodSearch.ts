import { useEffect, useState } from 'react'
import { searchFoods } from '@/services/mockApi'
import type { Food } from '@/types/nutrition'

/** Debounced search against the mock API. `loading` covers debounce + latency. */
export function useFoodSearch(query: string, delay = 220) {
  const [results, setResults] = useState<Food[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const q = query.trim()
    if (!q) {
      setResults([])
      setLoading(false)
      return
    }
    setLoading(true)
    let cancelled = false
    const timer = setTimeout(async () => {
      const found = await searchFoods(q)
      if (cancelled) return
      // Verified entries first, then by Nourish Score.
      setResults([...found].sort((a, b) => Number(!!b.verified) - Number(!!a.verified) || b.score - a.score))
      setLoading(false)
    }, delay)
    return () => {
      cancelled = true
      clearTimeout(timer)
    }
  }, [query, delay])

  return { results, loading }
}
