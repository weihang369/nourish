import { AnimatePresence, motion } from 'motion/react'
import { FoodImage } from '@/components/food'
import { cn } from '@/lib/cn'
import { spring } from '@/lib/motion'
import type { Food } from '@/types/nutrition'

interface ThumbStackProps {
  foods: Food[]
  size?: number
  max?: number
  /** Ring colour that separates overlapping thumbs from the background */
  ringClassName?: string
  className?: string
}

/** Overlapping food thumbnails with a "+n" overflow chip. */
export function ThumbStack({ foods, size = 40, max = 3, ringClassName = 'ring-surface', className }: ThumbStackProps) {
  const shown = foods.slice(0, max)
  const extra = foods.length - shown.length
  const overlap = Math.round(size * 0.36)

  return (
    <div aria-hidden className={cn('flex items-center', className)}>
      <AnimatePresence mode="popLayout" initial={false}>
        {shown.map((food, i) => (
          <motion.span
            key={food.id}
            layout
            initial={{ scale: 0.3, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.3, opacity: 0 }}
            transition={spring.bouncy}
            className={cn('relative block shrink-0 rounded-[35%] ring-2', ringClassName)}
            style={{ width: size, height: size, marginLeft: i === 0 ? 0 : -overlap, zIndex: max - i }}
          >
            <FoodImage
              photo={food.photo}
              emoji={food.emoji}
              alt=""
              width={size}
              height={size}
              className="size-full rounded-[35%]"
            />
          </motion.span>
        ))}
        {extra > 0 && (
          <motion.span
            key="extra"
            layout
            initial={{ scale: 0.3, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.3, opacity: 0 }}
            transition={spring.bouncy}
            className={cn(
              'relative grid shrink-0 place-items-center rounded-[35%] bg-lime text-[11px] font-bold text-[#14201a] ring-2 tabular',
              ringClassName,
            )}
            style={{ width: size, height: size, marginLeft: -overlap }}
          >
            +{extra}
          </motion.span>
        )}
      </AnimatePresence>
    </div>
  )
}
