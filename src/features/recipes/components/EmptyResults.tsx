import { Heart, SearchX } from 'lucide-react'
import { motion } from 'motion/react'
import { Button } from '@/components/ui'
import { riseIn, stagger } from '@/lib/motion'

interface EmptyResultsProps {
  kind: 'search' | 'saved'
  query?: string
  onReset: () => void
}

export function EmptyResults({ kind, query, onReset }: EmptyResultsProps) {
  const saved = kind === 'saved'
  const Icon = saved ? Heart : SearchX
  return (
    <motion.div
      variants={stagger}
      initial="hidden"
      animate="show"
      className="flex flex-col items-center px-8 pt-10 pb-6 text-center"
    >
      <motion.div variants={riseIn} className="relative grid size-24 place-items-center">
        <span className="absolute inset-0 rounded-full bg-brand-soft" />
        <span className="absolute inset-3 rounded-full bg-surface shadow-card" />
        <Icon className="relative size-8 text-brand" strokeWidth={1.8} />
      </motion.div>
      <motion.h3 variants={riseIn} className="mt-5 font-display text-[22px] leading-tight font-medium">
        {saved ? 'Nothing saved yet' : query ? `No recipes for “${query}”` : 'No recipes match'}
      </motion.h3>
      <motion.p variants={riseIn} className="mt-2 max-w-[260px] text-[14px] leading-relaxed text-ink-2">
        {saved
          ? 'Tap the heart on any recipe and it will wait for you here.'
          : 'Try a broader word like “salmon” or “bowl”, or loosen your filters.'}
      </motion.p>
      <motion.div variants={riseIn} className="mt-5">
        <Button variant="outline" onClick={onReset}>
          {saved ? 'Browse all recipes' : 'Clear search & filters'}
        </Button>
      </motion.div>
    </motion.div>
  )
}
