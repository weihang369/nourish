import { type MotionValue, motion, useTransform } from 'motion/react'
import { FoodImage } from '@/components/food'
import type { Recipe } from '@/types/nutrition'

export const HERO_H = 440

/**
 * Full-bleed hero. It drifts at ~⅓ scroll speed under the content sheet,
 * dims as it leaves, and stretches on pull-down overscroll.
 */
export function RecipeHero({ recipe, scrollY }: { recipe: Recipe; scrollY: MotionValue<number> }) {
  const y = useTransform(scrollY, [0, HERO_H], [0, HERO_H * 0.38])
  const scale = useTransform(scrollY, [-180, 0], [1.3, 1])
  const dim = useTransform(scrollY, [0, HERO_H], [0, 0.45])

  return (
    <div className="relative overflow-hidden bg-deep" style={{ height: HERO_H }}>
      <motion.div className="absolute inset-0 origin-bottom" style={{ y, scale }}>
        <FoodImage photo={recipe.photo} emoji="🍽️" alt={recipe.title} width={420} height={HERO_H} priority className="size-full" />
      </motion.div>
      {/* Keeps the status bar and glass buttons legible on bright plates */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-linear-to-b from-black/45 to-transparent" />
      <motion.div className="pointer-events-none absolute inset-0 bg-black" style={{ opacity: dim }} />
    </div>
  )
}
