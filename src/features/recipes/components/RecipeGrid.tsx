import { AnimatePresence, motion } from 'motion/react'
import { useMemo } from 'react'
import { useElementWidth } from '@/hooks/useElementWidth'
import { spring } from '@/lib/motion'
import type { Recipe } from '@/types/nutrition'
import { RECIPE_CARD_CAPTION_H, RecipeCard } from './RecipeCard'

const COL_GAP = 12
const ROW_GAP = 14
/** Image height / width. Each recipe keeps its own shape so it reads as the same card when it moves. */
const ASPECTS = [1.04, 1.2, 1.34]

function aspectFor(id: string) {
  let h = 0
  for (const ch of id) h = (h * 31 + ch.charCodeAt(0)) >>> 0
  return ASPECTS[h % ASPECTS.length]
}

/**
 * Two-column masonry. Positions are computed (shortest column first) so cards can glide
 * between columns when the filter changes — CSS columns can't animate that.
 */
export function RecipeGrid({ recipes }: { recipes: Recipe[] }) {
  const [ref, width] = useElementWidth<HTMLDivElement>(350)
  const colW = (width - COL_GAP) / 2

  const { items, height } = useMemo(() => {
    const cols = [0, 0]
    const placed = recipes.map((recipe) => {
      const col = cols[0] <= cols[1] ? 0 : 1
      const imageHeight = Math.round(colW * aspectFor(recipe.id))
      const item = { recipe, x: col * (colW + COL_GAP), y: cols[col], imageHeight }
      cols[col] += imageHeight + RECIPE_CARD_CAPTION_H + ROW_GAP
      return item
    })
    return { items: placed, height: Math.max(0, Math.max(...cols) - ROW_GAP) }
  }, [recipes, colW])

  return (
    <motion.div
      ref={ref}
      className="relative"
      initial={false}
      animate={{ height }}
      transition={spring.smooth}
    >
      <AnimatePresence initial={false}>
        {items.map(({ recipe, x, y, imageHeight }) => (
          <motion.div
            key={recipe.id}
            className="absolute top-0 left-0"
            initial={{ opacity: 0, scale: 0.9, x, y }}
            animate={{ opacity: 1, scale: 1, x, y }}
            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
            transition={spring.smooth}
          >
            <RecipeCard recipe={recipe} width={colW} imageHeight={imageHeight} />
          </motion.div>
        ))}
      </AnimatePresence>
    </motion.div>
  )
}
