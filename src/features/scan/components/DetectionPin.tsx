import { motion } from 'motion/react'
import { cn } from '@/lib/cn'
import { formatInt } from '@/lib/format'
import { spring } from '@/lib/motion'
import type { DetectedItem } from '../types'

/** Dot + glass label pinned over the photo at the detection's position. */
export function DetectionPin({ item, index }: { item: DetectedItem; index: number }) {
  const flip = item.x > 55

  return (
    <motion.div
      className="absolute size-0"
      style={{ left: `${item.x}%`, top: `${item.y}%` }}
      initial={{ opacity: 0, scale: 0.3 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.4, transition: { duration: 0.2 } }}
      transition={{ ...spring.bouncy, delay: 0.35 + index * 0.12 }}
    >
      <span aria-hidden className="absolute -top-2.5 -left-2.5 size-5 animate-pulse-ring rounded-full bg-lime/60" />
      <span aria-hidden className="absolute -top-1.5 -left-1.5 size-3 rounded-full bg-lime ring-[3px] ring-white/50" />
      <span
        className={cn(
          'absolute top-0 flex h-8 -translate-y-1/2 items-center gap-1.5 rounded-full pr-3 pl-2.5 text-[12.5px] font-semibold whitespace-nowrap text-white shadow-[0_8px_24px_-8px_rgb(0_0_0/0.6)] ring-1 ring-white/20 ring-inset glass-dark',
          flip ? 'right-3.5' : 'left-3.5',
        )}
      >
        {item.label}
        <span className="font-medium text-white/65 tabular">· {formatInt(item.grams)} g</span>
      </span>
    </motion.div>
  )
}
