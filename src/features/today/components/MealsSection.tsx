import { motion } from 'motion/react'
import { useState } from 'react'
import { AnimatedNumber, SectionHeader } from '@/components/ui'
import { meals } from '@/data/diary'
import { useDiary } from '@/hooks/useDiary'
import { riseIn, stagger } from '@/lib/motion'
import type { MealType } from '@/types/nutrition'
import { MealCard } from './MealCard'

export function MealsSection() {
  const { entries, byMeal, total, goals, remaining } = useDiary()
  const [expanded, setExpanded] = useState<MealType | null>(null)

  return (
    <motion.section variants={stagger} aria-label="Meals" className="mt-8 px-5">
      <motion.div variants={riseIn}>
        <SectionHeader
          title="Meals"
          eyebrow="Today's plate"
          trailing={
            <p className="pb-0.5 text-[13px] font-semibold text-ink-2">
              <AnimatedNumber value={total.kcal} /> kcal
            </p>
          }
        />
      </motion.div>

      <div className="mt-3.5 space-y-3">
        {meals.map((meal) => (
          <MealCard
            key={meal.type}
            meal={meal}
            entries={entries.filter((e) => e.meal === meal.type).sort((a, b) => a.time.localeCompare(b.time))}
            subtotal={byMeal[meal.type]}
            suggestedKcal={Math.round(meal.share * goals.kcal)}
            remainingKcal={Math.max(0, remaining)}
            expanded={expanded === meal.type}
            onToggle={() => setExpanded((cur) => (cur === meal.type ? null : meal.type))}
          />
        ))}
      </div>
    </motion.section>
  )
}
