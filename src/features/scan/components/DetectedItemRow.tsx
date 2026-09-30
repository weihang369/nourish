import { Minus, Plus, X } from 'lucide-react'
import { motion } from 'motion/react'
import { FoodImage } from '@/components/food'
import { IconButton } from '@/components/ui'
import { getFood } from '@/data/foods'
import { formatInt } from '@/lib/format'
import { spring } from '@/lib/motion'
import type { DetectedItem } from '../types'

export const GRAM_STEP = 10

interface GramStepperProps {
  grams: number
  name: string
  onChange: (grams: number) => void
}

/** Compact stepper for panel rows — same behaviour as the shared Stepper, tighter footprint. */
function GramStepper({ grams, name, onChange }: GramStepperProps) {
  const set = (g: number) => onChange(Math.min(900, Math.max(GRAM_STEP, g)))
  return (
    <div className="flex h-10 shrink-0 items-center rounded-full bg-surface-2">
      <motion.button
        type="button"
        aria-label={`Less ${name}`}
        whileTap={{ scale: 0.82 }}
        disabled={grams <= GRAM_STEP}
        onClick={() => set(grams - GRAM_STEP)}
        className="grid size-10 place-items-center rounded-full text-ink disabled:opacity-35"
      >
        <Minus className="size-3.5" strokeWidth={2.6} />
      </motion.button>
      <span className="w-11 text-center text-[13px] font-semibold tabular" aria-live="polite">
        {formatInt(grams)}g
      </span>
      <motion.button
        type="button"
        aria-label={`More ${name}`}
        whileTap={{ scale: 0.82 }}
        onClick={() => set(grams + GRAM_STEP)}
        className="grid size-10 place-items-center rounded-full text-ink"
      >
        <Plus className="size-3.5" strokeWidth={2.6} />
      </motion.button>
    </div>
  )
}

interface DetectedItemRowProps {
  item: DetectedItem
  onGrams: (grams: number) => void
  onRemove: () => void
}

export function DetectedItemRow({ item, onGrams, onRemove }: DetectedItemRowProps) {
  const food = getFood(item.foodId)
  if (!food) return null
  const kcal = (food.nutrients.kcal * item.grams) / food.serving.grams
  const unsure = item.confidence < 0.9

  return (
    <motion.li
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -40, transition: { duration: 0.22 } }}
      transition={spring.smooth}
      className="flex items-center gap-2.5 py-2.5"
    >
      <FoodImage photo={food.photo} emoji={food.emoji} alt="" width={44} height={44} className="size-11 shrink-0 rounded-[14px]" />
      <div className="min-w-0 flex-1">
        <p className="truncate text-[14.5px] font-semibold">{item.label}</p>
        <p className="truncate text-[12px] text-ink-3 tabular">
          {formatInt(kcal)} kcal ·{' '}
          {unsure ? <span className="font-semibold text-ember">check portion</span> : `${Math.round(item.confidence * 100)}% sure`}
        </p>
      </div>
      <GramStepper grams={item.grams} name={item.label} onChange={onGrams} />
      <IconButton label={`Remove ${item.label}`} variant="ghost" onClick={onRemove} className="-mr-2 text-ink-3">
        <X strokeWidth={2.4} />
      </IconButton>
    </motion.li>
  )
}
