import { Check, Plus } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { useState } from 'react'
import { cn } from '@/lib/cn'
import { easeOutExpo, spring } from '@/lib/motion'

interface AddToggleProps {
  added: boolean
  onToggle: () => void
  /** Food name, for the accessible label */
  name: string
}

/** Round "+" that springs into a lime check, with a soft burst on add. */
export function AddToggle({ added, onToggle, name }: AddToggleProps) {
  const [burst, setBurst] = useState(0)

  return (
    <motion.button
      type="button"
      aria-pressed={added}
      aria-label={added ? `Remove ${name} from plate` : `Add ${name} to plate`}
      onClick={() => {
        if (!added) setBurst((b) => b + 1)
        onToggle()
      }}
      whileTap={{ scale: 0.84 }}
      transition={spring.bouncy}
      className={cn(
        'relative grid size-10 shrink-0 place-items-center rounded-full transition-[background-color,color,box-shadow] duration-300',
        added
          ? 'bg-lime text-[#14201a] shadow-[0_8px_18px_-8px_rgb(120_170_40/0.9)]'
          : 'bg-surface-2 text-ink hover:bg-surface-3',
      )}
    >
      {burst > 0 && (
        <motion.span
          key={burst}
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-full ring-2 ring-lime"
          initial={{ scale: 0.9, opacity: 0.9 }}
          animate={{ scale: 1.9, opacity: 0 }}
          transition={{ duration: 0.6, ease: easeOutExpo }}
        />
      )}
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={added ? 'check' : 'plus'}
          initial={{ scale: 0.3, rotate: added ? -60 : 60, opacity: 0 }}
          animate={{ scale: 1, rotate: 0, opacity: 1 }}
          exit={{ scale: 0.3, rotate: added ? 60 : -60, opacity: 0 }}
          transition={spring.bouncy}
          className="grid place-items-center"
        >
          {added ? <Check className="size-[18px]" strokeWidth={3} /> : <Plus className="size-[18px]" strokeWidth={2.5} />}
        </motion.span>
      </AnimatePresence>
    </motion.button>
  )
}
