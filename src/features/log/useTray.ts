import { create } from 'zustand'

/**
 * The "plate" being assembled on the log screen. Lives outside the screen
 * so a detour into a food's detail page doesn't empty it. Not persisted.
 */
interface TrayState {
  ids: string[]
  toggle: (id: string) => void
  addMany: (ids: string[]) => void
  removeMany: (ids: string[]) => void
  clear: () => void
}

export const useTray = create<TrayState>()((set) => ({
  ids: [],
  toggle: (id) => set((s) => ({ ids: s.ids.includes(id) ? s.ids.filter((x) => x !== id) : [...s.ids, id] })),
  addMany: (ids) => set((s) => ({ ids: [...s.ids, ...ids.filter((id) => !s.ids.includes(id))] })),
  removeMany: (ids) => set((s) => ({ ids: s.ids.filter((id) => !ids.includes(id)) })),
  clear: () => set({ ids: [] }),
}))
