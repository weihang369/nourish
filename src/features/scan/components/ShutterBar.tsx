import { ScanBarcode, SwitchCamera } from 'lucide-react'
import { motion } from 'motion/react'
import { useState } from 'react'
import { IconButton } from '@/components/ui'
import { photos, photoUrl } from '@/data/photos'
import { cn } from '@/lib/cn'
import { spring } from '@/lib/motion'
import type { ScanMode } from '../types'

interface ShutterBarProps {
  mode: ScanMode
  ready: boolean
  shutterLabel: string
  onShutter: () => void
  onGallery: () => void
}

function Shutter({ mode, ready, label, onClick }: { mode: ScanMode; ready: boolean; label: string; onClick: () => void }) {
  return (
    <motion.button
      type="button"
      aria-label={label}
      onClick={onClick}
      whileTap="press"
      className="relative grid size-[80px] place-items-center rounded-full"
    >
      {ready && mode !== 'barcode' && (
        <span aria-hidden className="absolute inset-0 animate-pulse-ring rounded-full ring-2 ring-lime/80" />
      )}
      <span aria-hidden className="absolute inset-0 rounded-full ring-[4px] ring-white/90 ring-inset" />
      <motion.span
        aria-hidden
        variants={{ press: { scale: 0.84 } }}
        transition={spring.snappy}
        className={cn(
          'grid size-[64px] place-items-center rounded-full transition-colors duration-300',
          mode === 'barcode' ? 'bg-white/15 text-white backdrop-blur-md' : 'bg-white',
        )}
      >
        {mode === 'barcode' && <ScanBarcode className="size-6" strokeWidth={2} />}
      </motion.span>
    </motion.button>
  )
}

/** Library thumbnail · shutter · flip camera. */
export function ShutterBar({ mode, ready, shutterLabel, onShutter, onGallery }: ShutterBarProps) {
  const [flipped, setFlipped] = useState(false)

  return (
    <div className="flex items-center justify-between px-9">
      <motion.button
        type="button"
        aria-label="Choose a photo from your library"
        onClick={onGallery}
        whileTap={{ scale: 0.9 }}
        className="size-12 overflow-hidden rounded-[14px] ring-2 ring-white/80"
      >
        <img src={photoUrl(photos.rainbowBuddhaBowl, 96, 96)} alt="" className="size-full object-cover" draggable={false} />
      </motion.button>

      <Shutter mode={mode} ready={ready} label={shutterLabel} onClick={onShutter} />

      <IconButton label="Flip camera" variant="glass" size="lg" onClick={() => setFlipped((f) => !f)}>
        <motion.span animate={{ rotate: flipped ? 180 : 0 }} transition={spring.smooth} className="grid place-items-center">
          <SwitchCamera strokeWidth={2} />
        </motion.span>
      </IconButton>
    </div>
  )
}
