import { motion } from 'motion/react'
import type { ReactNode } from 'react'
import { photos, photoUrl } from '@/data/photos'
import { easeOutExpo } from '@/lib/motion'

interface ViewfinderProps {
  /** Lens has locked focus */
  focused: boolean
  /** Background is intentionally out of focus (barcode/label depth of field) */
  shallow: boolean
  /** Shrinks to the top half so results can sit below */
  compact: boolean
  torch: boolean
  children?: ReactNode
}

const ease = { duration: 0.7, ease: easeOutExpo }

/** The "camera feed": a still photo that racks focus and nudges its zoom. */
export function Viewfinder({ focused, shallow, compact, torch, children }: ViewfinderProps) {
  const blur = shallow ? 12 : focused ? 0 : 9
  const brightness = (shallow ? 0.6 : focused ? 1 : 0.82) * (torch ? 1.12 : 1)

  return (
    <motion.div
      className="absolute inset-x-0 top-0 overflow-hidden bg-black"
      initial={false}
      animate={{
        height: compact ? '52%' : '100%',
        borderBottomLeftRadius: compact ? 32 : 0,
        borderBottomRightRadius: compact ? 32 : 0,
      }}
      transition={{ duration: 0.75, ease: easeOutExpo }}
    >
      <motion.img
        src={photoUrl(photos.salmonPokeBowl, 800, 1720)}
        alt="Camera view of a salmon poke bowl"
        draggable={false}
        className="absolute inset-0 size-full object-cover select-none"
        initial={{ scale: 1.2, filter: 'blur(14px) brightness(0.7)' }}
        animate={{
          scale: compact ? 1.02 : focused && !shallow ? 1.06 : 1.16,
          filter: `blur(${blur}px) brightness(${brightness})`,
        }}
        transition={ease}
      />
      {/* Lens vignette */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_80%_at_50%_45%,transparent_55%,rgb(0_0_0/0.55)_100%)]"
      />
      {children}
    </motion.div>
  )
}
