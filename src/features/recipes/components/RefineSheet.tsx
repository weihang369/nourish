import { Check } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { Button, SegmentedControl, Sheet } from '@/components/ui'
import { cn } from '@/lib/cn'
import { pluralize } from '@/lib/format'
import { spring } from '@/lib/motion'
import { defaultRefinement, isRefined, type Refinement, sortOptions, timeOptions } from '../lib/refine'

interface RefineSheetProps {
  open: boolean
  onClose: () => void
  value: Refinement
  onChange: (value: Refinement) => void
  resultCount: number
}

/** Sort & time filter. Changes apply live so the count on the button is always honest. */
export function RefineSheet({ open, onClose, value, onChange, resultCount }: RefineSheetProps) {
  return (
    <Sheet open={open} onClose={onClose} title="Refine">
      <div className="px-6 pb-4">
        <p className="text-[11px] font-semibold tracking-[0.14em] text-ink-3 uppercase">Sort by</p>
        <div role="radiogroup" aria-label="Sort by" className="mt-2 divide-y divide-line">
          {sortOptions.map((opt) => {
            const selected = value.sort === opt.value
            return (
              <button
                key={opt.value}
                type="button"
                role="radio"
                aria-checked={selected}
                onClick={() => onChange({ ...value, sort: opt.value })}
                className="flex min-h-14 w-full items-center gap-3 py-2.5 text-left"
              >
                <span className="flex-1">
                  <span className="block text-[15px] font-semibold text-ink">{opt.label}</span>
                  <span className="block text-[12.5px] text-ink-3">{opt.hint}</span>
                </span>
                <span
                  className={cn(
                    'grid size-6 place-items-center rounded-full transition-colors',
                    selected ? 'bg-brand text-brand-ink' : 'ring-[1.5px] ring-line ring-inset',
                  )}
                >
                  <AnimatePresence>
                    {selected && (
                      <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} transition={spring.bouncy}>
                        <Check className="size-3.5" strokeWidth={3} />
                      </motion.span>
                    )}
                  </AnimatePresence>
                </span>
              </button>
            )
          })}
        </div>

        <p className="mt-6 text-[11px] font-semibold tracking-[0.14em] text-ink-3 uppercase">Ready in</p>
        <SegmentedControl
          className="mt-2.5"
          options={timeOptions}
          value={value.time}
          onChange={(time) => onChange({ ...value, time })}
        />

        <div className="mt-7 flex gap-3">
          <Button variant="secondary" size="lg" disabled={!isRefined(value)} onClick={() => onChange(defaultRefinement)}>
            Reset
          </Button>
          <Button size="lg" block className="flex-1" onClick={onClose}>
            Show {pluralize(resultCount, 'recipe')}
          </Button>
        </div>
      </div>
    </Sheet>
  )
}
