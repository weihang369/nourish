import { type ReactNode, useEffect, useState } from 'react'
import { Button, Sheet, Stepper } from '@/components/ui'
import { formatInt } from '@/lib/format'
import { useAppStore } from '@/store/useAppStore'

interface EditGoalsSheetProps {
  open: boolean
  onClose: () => void
}

export function EditGoalsSheet({ open, onClose }: EditGoalsSheetProps) {
  const goals = useAppStore((s) => s.goals)
  const [kcal, setKcal] = useState(goals.kcal)
  const [protein, setProtein] = useState(goals.protein)

  // Start every edit from the saved values.
  useEffect(() => {
    if (!open) return
    setKcal(goals.kcal)
    setProtein(goals.protein)
  }, [open, goals.kcal, goals.protein])

  const proteinShare = Math.round(((protein * 4) / kcal) * 100)
  const dirty = kcal !== goals.kcal || protein !== goals.protein

  const save = () => {
    // Mock persistence — there is no dedicated goals action in the store yet.
    useAppStore.getState().updateGoals({ kcal, protein })
    useAppStore.getState().showToast('Goals updated', 'check')
    onClose()
  }

  return (
    <Sheet open={open} onClose={onClose} title="Edit goals">
      <div className="px-6 pt-1 pb-4">
        <p className="text-[13.5px] text-ink-2">Small, steady changes stick. Adjust in gentle steps.</p>

        <div className="mt-5 divide-y divide-line rounded-[22px] ring-1 ring-line ring-inset">
          <GoalRow label="Daily calories" hint="kcal per day">
            <Stepper value={kcal} onChange={setKcal} min={1200} max={4000} step={50} format={formatInt} />
          </GoalRow>
          <GoalRow label="Protein" hint={`≈ ${proteinShare}% of calories`}>
            <Stepper value={protein} onChange={setProtein} min={40} max={250} step={5} format={(v) => `${v} g`} />
          </GoalRow>
        </div>

        <div className="mt-6 flex flex-col gap-2.5">
          <Button block size="lg" onClick={save} disabled={!dirty}>
            Save goals
          </Button>
          <Button block variant="ghost" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </div>
    </Sheet>
  )
}

function GoalRow({ label, hint, children }: { label: string; hint: string; children: ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-3 px-4 py-3.5">
      <div className="min-w-0">
        <p className="text-[15px] font-semibold">{label}</p>
        <p className="text-[12px] text-ink-3 tabular">{hint}</p>
      </div>
      {children}
    </div>
  )
}
