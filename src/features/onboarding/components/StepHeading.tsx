import { motion } from 'motion/react'
import type { ReactNode } from 'react'
import { riseIn } from '@/lib/motion'

interface StepHeadingProps {
  eyebrow: string
  title: ReactNode
  subtitle: string
}

/** Title block shared by steps 1–3. Children of a `stagger` container. */
export function StepHeading({ eyebrow, title, subtitle }: StepHeadingProps) {
  return (
    <>
      <motion.p variants={riseIn} className="text-[11px] font-semibold tracking-[0.14em] text-ink-3 uppercase">
        {eyebrow}
      </motion.p>
      <motion.h1 variants={riseIn} className="mt-2 font-display text-[34px] leading-[1.05] font-medium text-balance">
        {title}
      </motion.h1>
      <motion.p variants={riseIn} className="mt-3 max-w-[320px] text-[15px] leading-relaxed text-ink-2">
        {subtitle}
      </motion.p>
    </>
  )
}
