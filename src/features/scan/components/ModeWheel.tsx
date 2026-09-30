import { motion } from 'motion/react'
import { cn } from '@/lib/cn'
import { spring } from '@/lib/motion'
import { type ScanMode, scanModes } from '../types'

const ITEM_W = 82

interface ModeWheelProps {
  value: ScanMode
  onChange: (mode: ScanMode) => void
}

/** iOS-camera-style mode strip: the active mode always sits dead centre. Swipe or tap. */
export function ModeWheel({ value, onChange }: ModeWheelProps) {
  const index = scanModes.findIndex((m) => m.value === value)

  const shift = (dir: 1 | -1) => {
    const next = scanModes[index + dir]
    if (next) onChange(next.value)
  }

  return (
    <motion.div
      role="radiogroup"
      aria-label="Scan mode"
      className="relative h-11 w-full overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_16%,#000_84%,transparent)]"
      style={{ touchAction: 'pan-y' }}
      onPanEnd={(_, info) => {
        if (info.offset.x < -28) shift(1)
        else if (info.offset.x > 28) shift(-1)
      }}
    >
      <motion.div
        className="absolute top-0 left-1/2 flex h-full"
        initial={false}
        animate={{ x: -(index + 0.5) * ITEM_W }}
        transition={spring.snappy}
      >
        {scanModes.map((m) => {
          const active = m.value === value
          return (
            <button
              key={m.value}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => onChange(m.value)}
              className={cn(
                'h-full text-[12px] font-bold tracking-[0.16em] uppercase transition-colors duration-300',
                active ? 'text-lime' : 'text-white/55 hover:text-white/80',
              )}
              style={{ width: ITEM_W }}
            >
              {m.label}
            </button>
          )
        })}
      </motion.div>
      <span aria-hidden className="absolute bottom-0.5 left-1/2 size-1 -translate-x-1/2 rounded-full bg-lime" />
    </motion.div>
  )
}
