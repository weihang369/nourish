import { X } from 'lucide-react'
import { motion } from 'motion/react'
import { useNavigate } from 'react-router'
import { FoodImage, MacroLine } from '@/components/food'
import { IconButton } from '@/components/ui'
import { getFood } from '@/data/foods'
import { formatInt, formatServings } from '@/lib/format'
import { easeOutExpo } from '@/lib/motion'
import { entryNutrients } from '@/lib/nutrition'
import { useAppStore } from '@/store/useAppStore'
import type { DiaryEntry } from '@/types/nutrition'

/** A logged food inside an expanded meal card. Removal is undoable. */
export function MealEntryRow({ entry }: { entry: DiaryEntry }) {
  const navigate = useNavigate()
  const food = getFood(entry.foodId)
  if (!food) return null
  const nutrients = entryNutrients(entry)

  const remove = () => {
    const { removeEntry, restoreEntry, showToast } = useAppStore.getState()
    removeEntry(entry.id)
    showToast(`Removed ${food.name.toLowerCase()}`, 'trash', { label: 'Undo', onClick: () => restoreEntry(entry) })
  }

  return (
    <motion.li
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0, transition: { duration: 0.28, ease: easeOutExpo } }}
      transition={{ duration: 0.4, ease: easeOutExpo }}
      className="overflow-hidden"
    >
      <div className="flex items-center gap-1 py-1.5">
        <button
          type="button"
          onClick={() => navigate(`/food/${food.id}?meal=${entry.meal}`)}
          className="-ml-1.5 flex min-w-0 flex-1 items-center gap-3 rounded-[18px] p-1.5 text-left transition-colors hover:bg-surface-2/60"
        >
          <FoodImage
            photo={food.photo}
            emoji={food.emoji}
            alt={food.name}
            width={44}
            className="size-11 shrink-0 rounded-[14px]"
          />
          <span className="min-w-0 flex-1">
            <span className="flex items-baseline justify-between gap-2">
              <span className="truncate text-[14px] font-semibold">{food.name}</span>
              <span className="shrink-0 text-[13px] font-semibold tabular">
                {formatInt(nutrients.kcal)}
                <span className="ml-0.5 text-[11px] font-medium text-ink-3">kcal</span>
              </span>
            </span>
            <span className="mt-0.5 block truncate text-[12px] text-ink-3">
              {formatServings(entry.servings)} × {food.serving.label}
            </span>
            <MacroLine nutrients={nutrients} className="mt-1" />
          </span>
        </button>
        <IconButton label={`Remove ${food.name}`} variant="ghost" className="text-ink-3" onClick={remove}>
          <X strokeWidth={2.2} />
        </IconButton>
      </div>
    </motion.li>
  )
}
