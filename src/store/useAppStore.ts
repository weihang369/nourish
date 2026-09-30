import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { seedEntries, seedWaterMl } from '@/data/diary'
import { defaultGoals } from '@/data/user'
import { nowHHMM } from '@/lib/date'
import type { DiaryEntry, Goals, MealType } from '@/types/nutrition'

export type Theme = 'light' | 'dark'
export type GoalType = 'lose' | 'maintain' | 'gain' | 'mindful'
export type ToastIcon = 'check' | 'water' | 'heart' | 'sparkle' | 'trash'

export interface Toast {
  id: number
  message: string
  icon: ToastIcon
  action?: { label: string; onClick: () => void }
}

interface PersistedState {
  theme: Theme
  onboarded: boolean
  goalType: GoalType
  goals: Goals
  entries: DiaryEntry[]
  waterMl: number
  savedRecipeIds: string[]
  favoriteFoodIds: string[]
}

interface EphemeralState {
  toast: Toast | null
  quickAddOpen: boolean
}

interface Actions {
  toggleTheme: () => void
  setTheme: (theme: Theme) => void
  completeOnboarding: (goalType: GoalType, goals: Partial<Goals>) => void
  updateGoals: (goals: Partial<Goals>) => void
  /** Returns the ids of the created entries (for undo). */
  addEntries: (meal: MealType, items: { foodId: string; servings: number }[]) => string[]
  removeEntry: (id: string) => void
  restoreEntry: (entry: DiaryEntry) => void
  addWater: (ml: number) => void
  toggleSavedRecipe: (id: string) => boolean
  toggleFavoriteFood: (id: string) => boolean
  showToast: (message: string, icon?: ToastIcon, action?: Toast['action']) => void
  dismissToast: () => void
  setQuickAddOpen: (open: boolean) => void
  resetDemo: () => void
}

export type AppState = PersistedState & EphemeralState & Actions

const initialState: PersistedState = {
  theme: 'light',
  onboarded: false,
  goalType: 'lose',
  goals: defaultGoals,
  entries: seedEntries,
  waterMl: seedWaterMl,
  savedRecipeIds: ['lemon-herb-salmon', 'berry-overnight-oats'],
  favoriteFoodIds: ['rainbow-buddha-bowl', 'seared-salmon', 'blueberries', 'avocado', 'quinoa-pilaf'],
}

let toastSeq = 0
let uid = 100

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      ...initialState,
      toast: null,
      quickAddOpen: false,

      toggleTheme: () => set((s) => ({ theme: s.theme === 'light' ? 'dark' : 'light' })),
      setTheme: (theme) => set({ theme }),

      completeOnboarding: (goalType, goals) =>
        set((s) => ({ onboarded: true, goalType, goals: { ...s.goals, ...goals } })),

      updateGoals: (goals) => set((s) => ({ goals: { ...s.goals, ...goals } })),

      addEntries: (meal, items) => {
        const created = items.map((item) => ({ id: `e${++uid}-${Date.now()}`, meal, time: nowHHMM(), ...item }))
        set((s) => ({ entries: [...s.entries, ...created] }))
        return created.map((e) => e.id)
      },

      removeEntry: (id) => set((s) => ({ entries: s.entries.filter((e) => e.id !== id) })),
      restoreEntry: (entry) => set((s) => ({ entries: [...s.entries, entry] })),

      addWater: (ml) => set((s) => ({ waterMl: Math.max(0, Math.min(s.waterMl + ml, 5000)) })),

      toggleSavedRecipe: (id) => {
        const saved = get().savedRecipeIds.includes(id)
        set((s) => ({
          savedRecipeIds: saved ? s.savedRecipeIds.filter((r) => r !== id) : [...s.savedRecipeIds, id],
        }))
        return !saved
      },

      toggleFavoriteFood: (id) => {
        const fav = get().favoriteFoodIds.includes(id)
        set((s) => ({
          favoriteFoodIds: fav ? s.favoriteFoodIds.filter((f) => f !== id) : [...s.favoriteFoodIds, id],
        }))
        return !fav
      },

      showToast: (message, icon = 'check', action) => set({ toast: { id: ++toastSeq, message, icon, action } }),
      dismissToast: () => set({ toast: null }),

      setQuickAddOpen: (quickAddOpen) => set({ quickAddOpen }),

      resetDemo: () => set({ ...initialState, theme: get().theme, onboarded: false }),
    }),
    {
      name: 'nourish.app',
      version: 1,
      storage: createJSONStorage(() => localStorage),
      partialize: (s): PersistedState => ({
        theme: s.theme,
        onboarded: s.onboarded,
        goalType: s.goalType,
        goals: s.goals,
        entries: s.entries,
        waterMl: s.waterMl,
        savedRecipeIds: s.savedRecipeIds,
        favoriteFoodIds: s.favoriteFoodIds,
      }),
    },
  ),
)
