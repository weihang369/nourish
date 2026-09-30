import { useAppStore } from '@/store/useAppStore'

/** Saved state for one recipe plus a toggle that confirms with a toast (and undo on remove). */
export function useSavedRecipe(id: string) {
  const saved = useAppStore((s) => s.savedRecipeIds.includes(id))

  const toggle = () => {
    const { toggleSavedRecipe, showToast } = useAppStore.getState()
    const nowSaved = toggleSavedRecipe(id)
    if (nowSaved) showToast('Saved to your recipes', 'heart')
    else showToast('Removed from saved', 'heart', { label: 'Undo', onClick: () => toggleSavedRecipe(id) })
  }

  return [saved, toggle] as const
}
