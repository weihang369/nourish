import { Info, RotateCcw, Sparkles } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { AnimatedNumber, Button } from '@/components/ui'
import { getFood } from '@/data/foods'
import { cn } from '@/lib/cn'
import { formatGrams, pluralize } from '@/lib/format'
import { easeOutExpo, spring } from '@/lib/motion'
import { addNutrients, emptyNutrients, macroEnergySplit, macroKeys, macroMeta, scaleNutrients } from '@/lib/nutrition'
import type { Nutrients } from '@/types/nutrition'
import type { DetectedItem } from '../types'
import { DetectedItemRow } from './DetectedItemRow'

interface ResultsPanelProps {
  items: DetectedItem[]
  onGrams: (foodId: string, grams: number) => void
  onRemove: (foodId: string) => void
  onRetake: () => void
  onLog: () => void
}

export function totalsFor(items: DetectedItem[]): Nutrients {
  return items.reduce((acc, item) => {
    const food = getFood(item.foodId)
    return food ? addNutrients(acc, scaleNutrients(food.nutrients, item.grams / food.serving.grams)) : acc
  }, emptyNutrients)
}

function MacroMiniBars({ totals }: { totals: Nutrients }) {
  const split = macroEnergySplit(totals)
  return (
    <div className="grid grid-cols-3 gap-3">
      {macroKeys.map((key, i) => (
        <div key={key}>
          <p className="text-[11px] font-medium text-ink-3">{macroMeta[key].label}</p>
          <p className="text-[15px] font-semibold">
            <AnimatedNumber value={totals[key]} format={formatGrams} duration={0.6} />
            <span className="text-[11px] font-medium text-ink-3"> g</span>
          </p>
          <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-surface-2">
            <motion.div
              className={cn('h-full rounded-full', macroMeta[key].bg)}
              initial={{ width: 0 }}
              animate={{ width: `${split[key]}%` }}
              transition={{ duration: 0.8, delay: 0.3 + i * 0.08, ease: easeOutExpo }}
            />
          </div>
        </div>
      ))}
    </div>
  )
}

/** Bottom sheet of detected foods — tune grams, drop mistakes, log. */
export function ResultsPanel({ items, onGrams, onRemove, onRetake, onLog }: ResultsPanelProps) {
  const totals = totalsFor(items)
  const confidence = items.length ? items.reduce((s, i) => s + i.confidence, 0) / items.length : 0

  return (
    <motion.section
      aria-label="Detected foods"
      className="absolute inset-x-0 bottom-0 z-30 flex h-[53%] flex-col rounded-t-[32px] bg-surface text-ink shadow-float ring-1 ring-white/6"
      initial={{ y: '100%' }}
      animate={{ y: 0 }}
      exit={{ y: '100%' }}
      transition={{ ...spring.smooth, delay: 0.1 }}
    >
      <div className="flex shrink-0 justify-center pt-3 pb-1">
        <span className="h-1.5 w-10 rounded-full bg-surface-3" />
      </div>

      <div className="no-scrollbar min-h-0 flex-1 overflow-y-auto px-5 pb-3">
        <div className="flex items-end justify-between gap-3 pt-1">
          <div>
            <p className="text-[11px] font-semibold tracking-[0.14em] text-ink-3 uppercase">
              {items.length ? `We found ${pluralize(items.length, 'item')}` : 'Nothing left'}
            </p>
            <p className="mt-1 flex items-baseline gap-1.5">
              <AnimatedNumber value={totals.kcal} duration={0.9} className="font-display text-[42px] leading-none font-medium" />
              <span className="text-[14px] font-semibold text-ink-3">kcal</span>
            </p>
          </div>
          {items.length > 0 && (
            <span className="mb-1 inline-flex h-7 items-center gap-1.5 rounded-full bg-lime/15 px-2.5 text-[12px] font-semibold text-lime">
              <Sparkles className="size-3.5" strokeWidth={2.4} />
              {Math.round(confidence * 100)}% match
            </span>
          )}
        </div>

        <div className="mt-4">
          <MacroMiniBars totals={totals} />
        </div>

        <p className="mt-4 flex gap-2 rounded-[18px] bg-surface-2 px-3.5 py-2.5 text-[12.5px] leading-snug text-ink-2">
          <Info className="mt-px size-4 shrink-0 text-ink-3" strokeWidth={2.2} />
          Portions are estimated from the photo. Nudge the grams if something looks off.
        </p>

        <ul className="mt-2 divide-y divide-line">
          <AnimatePresence initial={false}>
            {items.map((item) => (
              <DetectedItemRow
                key={item.foodId}
                item={item}
                onGrams={(g) => onGrams(item.foodId, g)}
                onRemove={() => onRemove(item.foodId)}
              />
            ))}
          </AnimatePresence>
        </ul>
      </div>

      <div className="flex shrink-0 gap-3 border-t border-line px-5 pt-3 pb-safe">
        <Button variant="secondary" size="lg" onClick={onRetake} leading={<RotateCcw className="size-4" strokeWidth={2.4} />}>
          Retake
        </Button>
        <Button size="lg" block onClick={onLog} disabled={items.length === 0} className="flex-1">
          Log meal
        </Button>
      </div>
    </motion.section>
  )
}
