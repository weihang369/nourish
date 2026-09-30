import { motion } from 'motion/react'
import { easeOutExpo } from '@/lib/motion'

interface StepProgressProps {
  /** 1-based current step */
  step: number
  total: number
}

/** Slim segmented progress — the active segment fills as you arrive. */
export function StepProgress({ step, total }: StepProgressProps) {
  return (
    <div
      role="progressbar"
      aria-label="Setup progress"
      aria-valuemin={1}
      aria-valuemax={total}
      aria-valuenow={step}
      aria-valuetext={`Step ${step} of ${total}`}
      className="flex flex-1 items-center gap-1.5"
    >
      {Array.from({ length: total }, (_, i) => (
        <span key={i} className="relative h-1 flex-1 overflow-hidden rounded-full bg-surface-3">
          <motion.span
            className="absolute inset-0 origin-left rounded-full bg-brand"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: i < step ? 1 : 0 }}
            transition={{ duration: 0.7, ease: easeOutExpo, delay: i === step - 1 ? 0.12 : 0 }}
          />
        </span>
      ))}
    </div>
  )
}
