import type { Transition, Variants } from 'motion/react'

/** Shared motion language — every animation in the app draws from these. */
export const spring = {
  snappy: { type: 'spring', stiffness: 520, damping: 38, mass: 0.8 },
  smooth: { type: 'spring', stiffness: 300, damping: 34 },
  gentle: { type: 'spring', stiffness: 180, damping: 26 },
  bouncy: { type: 'spring', stiffness: 420, damping: 18 },
} satisfies Record<string, Transition>

export const easeOutExpo = [0.16, 1, 0.3, 1] as const

export const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.05, delayChildren: 0.04 } },
}

export const riseIn: Variants = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: easeOutExpo } },
}

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.4, ease: easeOutExpo } },
}
