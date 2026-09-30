import { ChevronDown, Plus } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { useNavigate } from 'react-router'
import { FoodImage } from '@/components/food'
import { Card, IconButton, ProgressBar } from '@/components/ui'
import type { MealMeta } from '@/data/diary'
import { getFood } from '@/data/foods'
import { formatInt, pluralize } from '@/lib/format'
import { easeOutExpo, riseIn, spring } from '@/lib/motion'
import type { DiaryEntry, Nutrients } from '@/types/nutrition'
import { MealEntryRow } from './MealEntryRow'
import { MealSuggestion } from './MealSuggestion'

interface MealCardProps {
  meal: MealMeta
  entries: DiaryEntry[]
  subtotal: Nutrients
  suggestedKcal: number
  remainingKcal: number
  expanded: boolean
  onToggle: () => void
}

export function MealCard({ meal, entries, subtotal, suggestedKcal, remainingKcal, expanded, onToggle }: MealCardProps) {
  const navigate = useNavigate()
  const empty = entries.length === 0
  const kcal = Math.round(subtotal.kcal)
  const over = kcal > suggestedKcal * 1.1

  const summary = (
    <>
      <span className="flex items-center gap-3 pr-12">
        <span className="grid size-12 shrink-0 place-items-center rounded-[16px] bg-surface-2 text-[22px]" aria-hidden>
          {meal.emoji}
        </span>
        <span className="min-w-0 flex-1">
          <span className="flex items-center gap-1 text-[16px] font-semibold">
            {meal.label}
            {!empty && (
              <motion.span animate={{ rotate: expanded ? 180 : 0 }} transition={spring.snappy} className="text-ink-3">
                <ChevronDown className="size-4" strokeWidth={2.4} />
              </motion.span>
            )}
          </span>
          <span className="mt-0.5 block text-[12.5px] text-ink-3 tabular">
            {empty ? `${meal.window} · Suggested ${formatInt(suggestedKcal)} kcal` : `${meal.window} · ${pluralize(entries.length, 'item')}`}
          </span>
        </span>
        {!empty && (
          <span className="shrink-0 text-right tabular">
            <span className="block text-[16px] leading-tight font-semibold">{formatInt(kcal)}</span>
            <span className="block text-[11px] text-ink-3">/ {formatInt(suggestedKcal)} kcal</span>
          </span>
        )}
      </span>

      {!empty && (
        <span className="mt-3.5 flex items-center gap-3">
          <FoodStack entries={entries} />
          <ProgressBar
            value={suggestedKcal > 0 ? kcal / suggestedKcal : 0}
            color={over ? 'var(--nr-ember)' : 'var(--nr-brand)'}
            className="h-1 flex-1"
            delay={0.3}
            label={`${meal.label} ${formatInt(kcal)} of ${formatInt(suggestedKcal)} suggested kcal`}
          />
        </span>
      )}
    </>
  )

  return (
    <Card variants={riseIn} padded={false} className="p-4">
      <IconButton
        label={`Add food to ${meal.label.toLowerCase()}`}
        variant={empty ? 'brand' : 'soft'}
        className="absolute top-4 right-4 z-10"
        onClick={() => navigate(`/log?meal=${meal.type}`)}
      >
        <Plus strokeWidth={2.5} />
      </IconButton>

      {empty ? (
        <div>{summary}</div>
      ) : (
        <button type="button" onClick={onToggle} aria-expanded={expanded} className="block w-full text-left">
          {summary}
        </button>
      )}

      {empty &&
        (meal.type === 'dinner' ? (
          <MealSuggestion remainingKcal={remainingKcal} />
        ) : (
          <p className="mt-3 text-[13px] text-ink-3">Nothing here yet — tap + when you're ready.</p>
        ))}

      <AnimatePresence initial={false}>
        {expanded && !empty && (
          <motion.div
            key="entries"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.45, ease: easeOutExpo }}
            className="overflow-hidden"
          >
            <ul className="mt-3 border-t border-line pt-2">
              <AnimatePresence initial={false}>
                {entries.map((entry) => (
                  <MealEntryRow key={entry.id} entry={entry} />
                ))}
              </AnimatePresence>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  )
}

/** Overlapping round thumbnails of what's been logged. */
function FoodStack({ entries }: { entries: DiaryEntry[] }) {
  const shown = entries.slice(0, 4)
  const extra = entries.length - shown.length
  return (
    <span className="flex shrink-0 -space-x-2">
      {shown.map((entry) => {
        const food = getFood(entry.foodId)
        if (!food) return null
        return (
          <FoodImage
            key={entry.id}
            photo={food.photo}
            emoji={food.emoji}
            alt={food.name}
            width={30}
            className="size-[30px] rounded-full ring-2 ring-surface"
          />
        )
      })}
      {extra > 0 && (
        <span className="grid size-[30px] place-items-center rounded-full bg-surface-2 text-[11px] font-semibold text-ink-2 ring-2 ring-surface">
          +{extra}
        </span>
      )}
    </span>
  )
}
