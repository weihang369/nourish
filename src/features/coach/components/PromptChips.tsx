import { Sparkles } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { Chip } from '@/components/ui'
import { cn } from '@/lib/cn'
import { spring } from '@/lib/motion'

interface PromptChipsProps {
  prompts: string[]
  disabled?: boolean
  onPick: (prompt: string) => void
}

/** Suggested prompts that retire once asked. */
export function PromptChips({ prompts, disabled, onPick }: PromptChipsProps) {
  return (
    <div
      aria-label="Suggested questions"
      role="group"
      className={cn(
        'no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 pb-3 transition-opacity duration-300',
        disabled && 'pointer-events-none opacity-50',
      )}
    >
      <AnimatePresence initial={false} mode="popLayout">
        {prompts.map((p) => (
          <motion.div
            key={p}
            layout
            exit={{ opacity: 0, scale: 0.8 }}
            transition={spring.snappy}
            className="shrink-0"
          >
            <Chip onClick={() => onPick(p)} icon={<Sparkles className="size-3.5 text-ink-3" />}>
              {p}
            </Chip>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
