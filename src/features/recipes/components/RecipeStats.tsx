import { ChefHat, Clock, Dumbbell, Flame } from 'lucide-react'
import { motion } from 'motion/react'
import { formatInt } from '@/lib/format'
import { riseIn } from '@/lib/motion'
import type { Recipe } from '@/types/nutrition'

/** Four at-a-glance facts. Numbers lead, units whisper. */
export function RecipeStats({ recipe }: { recipe: Recipe }) {
  const stats = [
    { icon: Clock, value: String(recipe.minutes), unit: 'min', label: 'Total time' },
    { icon: Flame, value: formatInt(recipe.nutrients.kcal), unit: 'kcal', label: 'Per serving' },
    { icon: Dumbbell, value: formatInt(recipe.nutrients.protein), unit: 'g', label: 'Protein' },
    { icon: ChefHat, value: recipe.difficulty, unit: '', label: 'Difficulty' },
  ]

  return (
    <motion.dl variants={riseIn} className="mt-5 grid grid-cols-4 gap-2">
      {stats.map(({ icon: Icon, value, unit, label }) => (
        <div key={label} className="flex flex-col items-center rounded-[22px] bg-surface px-1 pt-3 pb-3 shadow-card ring-1 ring-line ring-inset">
          <Icon className="size-[18px] text-ink-3" strokeWidth={2} aria-hidden />
          <dt className="order-last mt-1.5 text-[10.5px] font-medium text-ink-3">{label}</dt>
          <dd className="mt-2 text-[17px] leading-none font-semibold tracking-[-0.02em] text-ink tabular">
            {value}
            {unit && <span className="ml-0.5 text-[11px] font-medium tracking-normal text-ink-3">{unit}</span>}
          </dd>
        </div>
      ))}
    </motion.dl>
  )
}
