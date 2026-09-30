import { motion } from 'motion/react'
import { spring } from '@/lib/motion'
import { CoachMark } from './CoachMark'

export function TypingIndicator() {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.15 } }}
      transition={spring.smooth}
      style={{ originX: 0, originY: 1 }}
      className="flex items-end gap-2"
      role="status"
      aria-label="Coach is typing"
    >
      <CoachMark />
      <div className="flex h-11 items-center gap-1 rounded-[22px] rounded-bl-[8px] bg-surface px-4 shadow-card ring-1 ring-line ring-inset">
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="size-1.5 rounded-full bg-ink-3"
            animate={{ y: [0, -4, 0], opacity: [0.45, 1, 0.45] }}
            transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.15, ease: 'easeInOut' }}
          />
        ))}
      </div>
    </motion.div>
  )
}
