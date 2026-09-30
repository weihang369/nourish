import { useEffect } from 'react'
import { useResolvedPath } from 'react-router'
import { create } from 'zustand'

export type StatusTone = 'dark' | 'light'

/**
 * Device-chrome state. The status bar ink is remembered per route path so
 * screens sitting on dark imagery can flip it without racing page transitions.
 */
interface ChromeState {
  tones: Record<string, StatusTone>
  setTone: (path: string, tone: StatusTone) => void
}

export const useChromeStore = create<ChromeState>()((set) => ({
  tones: {},
  setTone: (path, tone) => set((s) => (s.tones[path] === tone ? s : { tones: { ...s.tones, [path]: tone } })),
}))

/** Declare the status bar ink for the calling screen. */
export function useStatusTone(tone: StatusTone) {
  const { pathname } = useResolvedPath('.')
  const setTone = useChromeStore((s) => s.setTone)
  useEffect(() => setTone(pathname, tone), [pathname, tone, setTone])
}
