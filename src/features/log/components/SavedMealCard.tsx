import { Check, Plus } from 'lucide-react'
import { motion } from 'motion/react'
import { MacroLine } from '@/components/food'
import { Button } from '@/components/ui'
import { getFood } from '@/data/foods'
import { formatInt, pluralize } from '@/lib/format'
import { riseIn, spring } from '@/lib/motion'
import { sumEntries } from '@/lib/nutrition'
import type { Food } from '@/types/nutrition'
import { ThumbStack } from './ThumbStack'

interface SavedMealCardProps {
  name: string
  foodIds: string[]
  inTray: boolean
  onToggleAll: () => void
}

export function SavedMealCard({ name, foodIds, inTray, onToggleAll }: SavedMealCardProps) {
  const foods = foodIds.map(getFood).filter((f): f is Food => !!f)
  const totals = sumEntries(foodIds.map((foodId) => ({ foodId, servings: 1 })))

  return (
    <motion.li
      variants={riseIn}
      className="rounded-[28px] bg-surface p-4 shadow-card ring-1 ring-line ring-inset"
    >
      <div className="flex items-center gap-3.5">
        <ThumbStack foods={foods} size={46} />
        <div className="min-w-0 flex-1">
          <h3 className="truncate font-display text-[19px] leading-tight font-medium">{name}</h3>
          <p className="mt-0.5 text-[12.5px] text-ink-2 tabular">
            {pluralize(foods.length, 'item')} · {formatInt(totals.kcal)} kcal
          </p>
        </div>
      </div>
      <p className="mt-3 truncate text-[12.5px] text-ink-3">{foods.map((f) => f.name).join(' · ')}</p>
      <div className="mt-3 flex items-center justify-between gap-3">
        <MacroLine nutrients={totals} />
        <Button
          size="sm"
          variant={inTray ? 'lime' : 'secondary'}
          onClick={onToggleAll}
          aria-pressed={inTray}
          aria-label={inTray ? `Remove ${name} from plate` : `Add all of ${name} to plate`}
          leading={
            <motion.span key={String(inTray)} initial={{ scale: 0.4, rotate: -45 }} animate={{ scale: 1, rotate: 0 }} transition={spring.bouncy}>
              {inTray ? <Check className="size-4" strokeWidth={3} /> : <Plus className="size-4" strokeWidth={2.5} />}
            </motion.span>
          }
        >
          {inTray ? 'Added' : 'Add all'}
        </Button>
      </div>
    </motion.li>
  )
}
