import { Check, Sparkles } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { cn } from '@/lib/cn'
import { easeOutExpo, spring } from '@/lib/motion'

const steps = ['Spotting ingredients', 'Estimating portions', 'Crunching the nutrition']

/** Where "the model" is looking while it thinks — faint lime points on the plate. */
const probes = [
  { x: 56, y: 36 },
  { x: 32, y: 52 },
  { x: 64, y: 60 },
  { x: 36, y: 30 },
  { x: 48, y: 47 },
]

const shimmerText =
  'bg-[linear-gradient(90deg,rgb(255_255_255/0.45)_0%,#fff_50%,rgb(255_255_255/0.45)_100%)] bg-[length:200%_100%] bg-clip-text text-transparent animate-shimmer'

export function AnalyzingOverlay({ step }: { step: number }) {
  return (
    <motion.div
      className="absolute inset-0 z-20"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.3 } }}
      transition={{ duration: 0.4 }}
    >
      <div aria-hidden className="absolute inset-0 bg-black/30" />

      {/* Light sweep across the frozen frame */}
      <motion.div
        aria-hidden
        className="absolute inset-y-0 w-3/4 -skew-x-12 bg-linear-to-r from-transparent via-white/14 to-transparent"
        initial={{ x: '-140%' }}
        animate={{ x: '240%' }}
        transition={{ duration: 1.7, repeat: Infinity, ease: 'easeInOut', repeatDelay: 0.2 }}
      />

      {probes.map((p, i) => (
        <motion.span
          key={i}
          aria-hidden
          className="absolute size-2 -translate-1/2 rounded-full bg-lime shadow-[0_0_16px_4px_rgb(198_238_107/0.55)]"
          style={{ left: `${p.x}%`, top: `${p.y}%` }}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: [0, 1.2, 1], opacity: [0, 1, 0.8] }}
          transition={{ delay: 0.35 + i * 0.28, duration: 0.6, ease: easeOutExpo }}
        />
      ))}

      <motion.div
        role="status"
        aria-live="polite"
        className="absolute inset-x-5 bottom-[calc(var(--sab)+28px)] rounded-[28px] p-5 text-white ring-1 ring-white/12 ring-inset glass-dark"
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ ...spring.smooth, delay: 0.1 }}
      >
        <div className="flex items-center gap-3.5">
          <span className="grid size-11 shrink-0 place-items-center rounded-full bg-lime text-[#14201a]">
            <motion.span animate={{ rotate: 360 }} transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}>
              <Sparkles className="size-5" strokeWidth={2.2} />
            </motion.span>
          </span>
          <div>
            <p className={cn('font-display text-[21px] leading-tight font-medium', shimmerText)}>Analyzing your plate…</p>
            <p className="mt-0.5 text-[12.5px] text-white/60">Usually a couple of seconds</p>
          </div>
        </div>

        <ol className="mt-4 space-y-2.5">
          {steps.map((label, i) => {
            const done = i < step
            const active = i === step
            return (
              <li key={label} className={cn('flex items-center gap-3 text-[13.5px] transition-colors duration-300', done || active ? 'text-white' : 'text-white/40')}>
                <span className="relative grid size-5 place-items-center">
                  <AnimatePresence mode="popLayout" initial={false}>
                    {done ? (
                      <motion.span
                        key="done"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={spring.bouncy}
                        className="grid size-5 place-items-center rounded-full bg-lime text-[#14201a]"
                      >
                        <Check className="size-3" strokeWidth={3.5} />
                      </motion.span>
                    ) : active ? (
                      <motion.span
                        key="active"
                        className="size-4 rounded-full border-2 border-white/25 border-t-lime"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                      />
                    ) : (
                      <span key="idle" className="size-1.5 rounded-full bg-white/35" />
                    )}
                  </AnimatePresence>
                </span>
                {label}
              </li>
            )
          })}
        </ol>

        <div className="mt-4 h-1 overflow-hidden rounded-full bg-white/12">
          <motion.div
            className="h-full rounded-full bg-lime"
            initial={{ width: '4%' }}
            animate={{ width: '100%' }}
            transition={{ duration: 2.2, ease: [0.3, 0.1, 0.3, 1] }}
          />
        </div>
      </motion.div>
    </motion.div>
  )
}
