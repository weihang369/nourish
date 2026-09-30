import { motion } from 'motion/react'
import { riseIn, stagger } from '@/lib/motion'
import { CoachMark } from './CoachMark'

const timeFmt = new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: '2-digit' })

/** Quiet preamble at the top of the thread: who you're talking to, and the ground rules. */
export function CoachWelcome() {
  return (
    <motion.div variants={stagger} initial="hidden" animate="show" className="flex flex-col items-center pt-6 pb-2 text-center">
      <motion.div variants={riseIn}>
        <CoachMark size={56} className="shadow-glow" />
      </motion.div>
      <motion.h2 variants={riseIn} className="mt-3 font-display text-[22px] leading-tight font-medium">
        Your food, thought through
      </motion.h2>
      <motion.p variants={riseIn} className="mt-1 max-w-[260px] text-[12.5px] leading-relaxed text-ink-3">
        I can see today’s diary and your goals. Guidance, not medical advice.
      </motion.p>
      <motion.p
        variants={riseIn}
        className="mt-6 text-[11px] font-semibold tracking-[0.14em] text-ink-3 uppercase tabular"
      >
        Today · {timeFmt.format(new Date())}
      </motion.p>
    </motion.div>
  )
}
