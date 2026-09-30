import { ArrowUpRight, Sparkles } from 'lucide-react'
import { motion } from 'motion/react'
import { useNavigate } from 'react-router'
import { spring } from '@/lib/motion'

/** Closing hand-off: turn the numbers above into a conversation. */
export function AskCoachCard() {
  const navigate = useNavigate()
  return (
    <div className="px-5">
      <motion.button
        type="button"
        onClick={() => navigate('/coach')}
        whileTap={{ scale: 0.98 }}
        transition={spring.snappy}
        className="relative flex w-full items-center gap-4 overflow-hidden rounded-[28px] bg-deep p-5 text-left text-on-deep"
      >
        <span aria-hidden className="pointer-events-none absolute -top-16 -right-10 size-44 rounded-full bg-lime/20 blur-3xl" />
        <span className="relative grid size-12 shrink-0 place-items-center rounded-[16px] bg-lime text-[#14201a]">
          <Sparkles className="size-5" strokeWidth={2.2} />
        </span>
        <span className="relative min-w-0 flex-1">
          <span className="block font-display text-[18px] leading-tight font-medium">Talk through your week</span>
          <span className="mt-0.5 block text-[12.5px] text-on-deep/70">Coach can turn these trends into a plan.</span>
        </span>
        <ArrowUpRight className="relative size-5 shrink-0 text-on-deep/70" />
      </motion.button>
    </div>
  )
}
