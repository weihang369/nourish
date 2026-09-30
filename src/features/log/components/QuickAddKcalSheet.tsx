import { useState } from 'react'
import { AnimatedNumber, Button, Chip, Sheet, Stepper } from '@/components/ui'
import { mealLabel } from '@/data/diary'
import { formatInt } from '@/lib/format'
import { useAppStore } from '@/store/useAppStore'
import type { MealType } from '@/types/nutrition'
import { mealWord } from '../logging'

interface QuickAddKcalSheetProps {
  open: boolean
  onClose: () => void
  meal: MealType
}

const presets = [100, 250, 400, 600]

/** Calories-only entry for when the details don't matter. Mock: toast only. */
export function QuickAddKcalSheet({ open, onClose, meal }: QuickAddKcalSheetProps) {
  const [kcal, setKcal] = useState(250)

  const confirm = () => {
    useAppStore.getState().showToast(`${formatInt(kcal)} kcal added to ${mealWord(meal)}`, 'check')
    onClose()
  }

  return (
    <Sheet open={open} onClose={onClose} title="Quick add">
      <div className="px-6 pt-1 pb-6">
        <p className="text-[14px] leading-relaxed text-ink-2">
          No details needed — just the calories. Handy for a coffee on the go or a bite at a friend’s.
        </p>

        <div className="mt-6 flex flex-col items-center rounded-[28px] bg-surface-2 px-5 pt-6 pb-5">
          <p className="text-[11px] font-semibold tracking-[0.14em] text-ink-3 uppercase">{mealLabel[meal]}</p>
          <p className="mt-1 flex items-baseline gap-1.5">
            <AnimatedNumber value={kcal} from={kcal} duration={0.5} className="font-display text-[56px] leading-none font-medium" />
            <span className="text-[15px] font-semibold text-ink-3">kcal</span>
          </p>
          <Stepper
            value={kcal}
            onChange={setKcal}
            min={10}
            max={2500}
            step={25}
            format={formatInt}
            className="mt-5 bg-surface"
          />
        </div>

        <div className="mt-4 flex justify-center gap-2">
          {presets.map((p) => (
            <Chip key={p} size="sm" selected={kcal === p} onClick={() => setKcal(p)}>
              {p}
            </Chip>
          ))}
        </div>

        <Button block size="lg" className="mt-6" onClick={confirm}>
          Add {formatInt(kcal)} kcal to {mealLabel[meal]}
        </Button>
      </div>
    </Sheet>
  )
}
