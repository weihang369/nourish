import { Check } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import type { CSSProperties } from 'react'
import { cn } from '@/lib/cn'
import { easeOutExpo, spring } from '@/lib/motion'
import { frameFor, type ScanMode } from '../types'
import { BarcodeArt } from './BarcodeArt'

interface ScanFrameProps {
  mode: ScanMode
  focused: boolean
  /** Barcode locked on */
  found: boolean
  /** Photo captured and being analysed */
  busy: boolean
}

const corners = [
  'top-0 left-0 border-t-[3px] border-l-[3px]',
  'top-0 right-0 border-t-[3px] border-r-[3px]',
  'bottom-0 left-0 border-b-[3px] border-l-[3px]',
  'bottom-0 right-0 border-b-[3px] border-r-[3px]',
]

const radiusFor = (i: number, r: number): CSSProperties =>
  [
    { borderTopLeftRadius: r },
    { borderTopRightRadius: r },
    { borderBottomLeftRadius: r },
    { borderBottomRightRadius: r },
  ][i]

/** Focus frame: dims the world outside, corner brackets, and a sweeping scan line. */
export function ScanFrame({ mode, focused, found, busy }: ScanFrameProps) {
  const { w, h, r } = frameFor[mode]
  const bracket = Math.min(44, r + 8)
  const lineDistance = mode === 'barcode' ? h - 60 : h - 4

  return (
    <motion.div
      aria-hidden
      className="absolute top-[42%] left-1/2 -translate-x-1/2 -translate-y-1/2"
      initial={false}
      animate={{ width: w, height: h, borderRadius: r, scale: focused ? 1 : 1.06 }}
      transition={spring.smooth}
      style={{ boxShadow: '0 0 0 200vmax rgb(0 0 0 / 0.42)' }}
    >
      {/* Corner brackets */}
      {corners.map((pos, i) => (
        <motion.span
          key={pos}
          className={cn(
            'absolute transition-colors duration-300',
            pos,
            found ? 'border-lime' : 'border-white',
          )}
          initial={false}
          animate={{ width: bracket, height: bracket, opacity: busy ? [1, 0.45, 1] : 1 }}
          transition={busy ? { duration: 1.1, repeat: Infinity } : spring.smooth}
          style={radiusFor(i, r)}
        />
      ))}

      {/* Faux product in barcode mode */}
      <AnimatePresence>
        {mode === 'barcode' && (
          <motion.div
            key="barcode"
            className="absolute inset-0 grid place-items-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.4, ease: easeOutExpo }}
          >
            <BarcodeArt focused={focused} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Scan line */}
      {!found && !busy && focused && (
        <div className="absolute inset-0 overflow-hidden" style={{ borderRadius: r }}>
          <div
            className={cn('absolute inset-x-5 animate-scan', mode === 'barcode' ? 'top-[30px]' : 'top-0.5')}
            style={{ '--scan-distance': `${lineDistance}px` } as CSSProperties}
          >
            <div className="h-10 -translate-y-1/2 bg-linear-to-b from-transparent via-lime/15 to-transparent" />
            <div
              className={cn(
                'absolute inset-x-0 top-0 h-[2px] -translate-y-1/2 rounded-full',
                mode === 'barcode' ? 'bg-[#ff5a4f] shadow-[0_0_14px_3px_rgb(255_90_79/0.65)]' : 'bg-lime shadow-[0_0_18px_4px_rgb(198_238_107/0.6)]',
              )}
            />
          </div>
        </div>
      )}

      {/* Lock-on confirmation */}
      <AnimatePresence>
        {found && (
          <motion.span
            key="found"
            className="absolute -top-4 left-1/2 grid size-8 -translate-x-1/2 place-items-center rounded-full bg-lime text-[#14201a] shadow-[0_0_24px_rgb(198_238_107/0.6)]"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            transition={spring.bouncy}
          >
            <Check className="size-4" strokeWidth={3.2} />
          </motion.span>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
