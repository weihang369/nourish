import { Minus, Plus } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { useRef } from 'react'
import { cn } from '@/lib/cn'
import { spring } from '@/lib/motion'

interface StepperProps {
  value: number
  onChange: (value: number) => void
  min?: number
  max?: number
  step?: number
  format?: (value: number) => string
  className?: string
}

export function Stepper({ value, onChange, min = 0, max = 99, step = 1, format = String, className }: StepperProps) {
  const prev = useRef(value)
  const direction = value >= prev.current ? 1 : -1
  prev.current = value

  const set = (next: number) => onChange(Math.min(max, Math.max(min, Math.round(next * 100) / 100)))

  return (
    <div className={cn('inline-flex h-12 items-center rounded-full bg-surface-2 p-1', className)}>
      <motion.button
        type="button"
        aria-label="Decrease"
        whileTap={{ scale: 0.85 }}
        disabled={value <= min}
        onClick={() => set(value - step)}
        className="grid size-10 place-items-center rounded-full bg-surface text-ink shadow-card disabled:opacity-40"
      >
        <Minus className="size-4" strokeWidth={2.5} />
      </motion.button>
      <div className="relative w-16 overflow-hidden text-center">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span
            key={value}
            initial={{ y: direction * 18, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: direction * -18, opacity: 0 }}
            transition={spring.snappy}
            className="block text-lg font-semibold tabular"
          >
            {format(value)}
          </motion.span>
        </AnimatePresence>
      </div>
      <motion.button
        type="button"
        aria-label="Increase"
        whileTap={{ scale: 0.85 }}
        disabled={value >= max}
        onClick={() => set(value + step)}
        className="grid size-10 place-items-center rounded-full bg-ink text-canvas disabled:opacity-40"
      >
        <Plus className="size-4" strokeWidth={2.5} />
      </motion.button>
    </div>
  )
}
