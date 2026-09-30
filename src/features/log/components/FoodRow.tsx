import { BadgeCheck } from 'lucide-react'
import { motion } from 'motion/react'
import type { ReactNode } from 'react'
import { FoodImage, MacroLine, ScoreBadge } from '@/components/food'
import { formatInt } from '@/lib/format'
import { riseIn } from '@/lib/motion'
import type { Food } from '@/types/nutrition'
import { AddToggle } from './AddToggle'

interface FoodRowProps {
  food: Food
  added: boolean
  onToggle: () => void
  onOpen: () => void
  /** Search term to highlight inside the name */
  highlight?: string
}

function Highlighted({ text, term }: { text: string; term?: string }): ReactNode {
  const q = term?.trim()
  if (!q) return text
  const i = text.toLowerCase().indexOf(q.toLowerCase())
  if (i < 0) return text
  return (
    <>
      {text.slice(0, i)}
      <mark className="rounded-[4px] bg-lime/55 px-px text-inherit dark:bg-lime/25">{text.slice(i, i + q.length)}</mark>
      {text.slice(i + q.length)}
    </>
  )
}

export function FoodRow({ food, added, onToggle, onOpen, highlight }: FoodRowProps) {
  return (
    <motion.li variants={riseIn} className="flex items-center gap-3 px-4 py-3">
      <button
        type="button"
        onClick={onOpen}
        aria-label={`${food.name}, ${formatInt(food.nutrients.kcal)} kcal per ${food.serving.label}. View details`}
        className="group flex min-w-0 flex-1 items-center gap-3.5 text-left"
      >
        <FoodImage
          photo={food.photo}
          emoji={food.emoji}
          alt=""
          width={56}
          height={56}
          className="size-14 shrink-0 rounded-2xl transition-transform duration-300 group-active:scale-95"
        />
        <span className="min-w-0 flex-1">
          <span className="flex items-center gap-1">
            <span className="truncate text-[15px] font-semibold tracking-[-0.01em]">
              <Highlighted text={food.name} term={highlight} />
            </span>
            {food.verified && (
              <BadgeCheck aria-label="Verified" className="size-4 shrink-0 fill-brand text-canvas" strokeWidth={2.2} />
            )}
          </span>
          <span className="mt-0.5 flex items-center gap-2 text-[12.5px] text-ink-2">
            <span className="truncate tabular">
              {food.serving.label} · {formatInt(food.nutrients.kcal)} kcal
            </span>
            <ScoreBadge score={food.score} className="h-5 shrink-0 pr-2 pl-1.5 text-[10.5px]" />
          </span>
          <MacroLine nutrients={food.nutrients} className="mt-1" />
        </span>
      </button>
      <AddToggle added={added} onToggle={onToggle} name={food.name} />
    </motion.li>
  )
}

export function FoodRowSkeleton() {
  return (
    <li className="flex items-center gap-3.5 px-4 py-3" aria-hidden>
      <span className="skeleton size-14 shrink-0 rounded-2xl" />
      <span className="flex-1 space-y-2">
        <span className="skeleton block h-3.5 w-3/5 rounded-full" />
        <span className="skeleton block h-3 w-2/5 rounded-full" />
        <span className="skeleton block h-2.5 w-4/5 rounded-full" />
      </span>
      <span className="skeleton size-10 shrink-0 rounded-full" />
    </li>
  )
}
