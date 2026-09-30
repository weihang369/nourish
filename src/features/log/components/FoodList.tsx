import { motion } from 'motion/react'
import { stagger } from '@/lib/motion'
import type { Food } from '@/types/nutrition'
import { FoodRow, FoodRowSkeleton } from './FoodRow'

interface FoodListProps {
  foods: Food[]
  trayIds: string[]
  onToggle: (id: string) => void
  onOpen: (id: string) => void
  highlight?: string
  label: string
}

const listShell = 'divide-y divide-line overflow-hidden rounded-[28px] bg-surface shadow-card ring-1 ring-line ring-inset'

export function FoodList({ foods, trayIds, onToggle, onOpen, highlight, label }: FoodListProps) {
  return (
    <motion.ul aria-label={label} variants={stagger} initial="hidden" animate="show" className={listShell}>
      {foods.map((food) => (
        <FoodRow
          key={food.id}
          food={food}
          added={trayIds.includes(food.id)}
          onToggle={() => onToggle(food.id)}
          onOpen={() => onOpen(food.id)}
          highlight={highlight}
        />
      ))}
    </motion.ul>
  )
}

export function FoodListSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <ul aria-busy="true" aria-label="Searching" className={listShell}>
      {Array.from({ length: rows }, (_, i) => (
        <FoodRowSkeleton key={i} />
      ))}
    </ul>
  )
}
