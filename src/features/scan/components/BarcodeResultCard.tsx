import { ChevronRight } from 'lucide-react'
import { motion } from 'motion/react'
import { FoodImage, ScoreBadge } from '@/components/food'
import type { Food } from '@/types/nutrition'
import { formatInt } from '@/lib/format'
import { spring } from '@/lib/motion'

/** Compact product match that pops up once the barcode locks. */
export function BarcodeResultCard({ food, onOpen }: { food: Food; onOpen: () => void }) {
  return (
    <motion.button
      type="button"
      onClick={onOpen}
      aria-label={`${food.brand ?? ''} ${food.name}, ${formatInt(food.nutrients.kcal)} kcal. View details`}
      initial={{ y: 30, opacity: 0, scale: 0.94 }}
      animate={{ y: 0, opacity: 1, scale: 1 }}
      exit={{ y: 20, opacity: 0, scale: 0.96, transition: { duration: 0.2 } }}
      whileTap={{ scale: 0.98 }}
      transition={spring.bouncy}
      className="mx-4 flex w-[calc(100%-2rem)] items-center gap-3 rounded-[24px] bg-surface p-2.5 pr-3 text-left text-ink shadow-float ring-1 ring-white/10"
    >
      <FoodImage photo={food.photo} emoji={food.emoji} alt="" width={56} height={56} className="size-14 shrink-0 rounded-[18px]" />
      <span className="min-w-0 flex-1">
        {food.brand && (
          <span className="block text-[10.5px] font-semibold tracking-[0.14em] text-ink-3 uppercase">{food.brand}</span>
        )}
        <span className="block truncate text-[15px] font-semibold">{food.name}</span>
        <span className="mt-0.5 flex items-center gap-2 text-[12px] text-ink-2 tabular">
          {food.serving.label} · {formatInt(food.nutrients.kcal)} kcal
          <ScoreBadge score={food.score} className="h-5 pr-2 pl-1.5 text-[10.5px]" />
        </span>
      </span>
      <span className="grid size-10 shrink-0 place-items-center rounded-full bg-brand text-brand-ink">
        <ChevronRight className="size-5" strokeWidth={2.4} />
      </span>
    </motion.button>
  )
}
