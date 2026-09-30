import { AnimatePresence, motion, useDragControls } from 'motion/react'
import { type ReactNode, useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { cn } from '@/lib/cn'
import { spring } from '@/lib/motion'

export const OVERLAY_ROOT_ID = 'nr-overlay'

interface SheetProps {
  open: boolean
  onClose: () => void
  children: ReactNode
  title?: string
  className?: string
}

/**
 * Bottom sheet rendered into the phone's overlay layer (not document.body),
 * so it stays inside the device frame. Drag the grabber to dismiss.
 */
export function Sheet({ open, onClose, children, title, className }: SheetProps) {
  const [root, setRoot] = useState<HTMLElement | null>(null)
  const controls = useDragControls()

  useEffect(() => setRoot(document.getElementById(OVERLAY_ROOT_ID)), [])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!root) return null

  return createPortal(
    <AnimatePresence>
      {open && (
        <div className="pointer-events-auto absolute inset-0 z-50">
          <motion.div
            className="absolute inset-0 bg-[#0b0f0d]/45 backdrop-blur-[2px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={title}
            className={cn(
              'absolute inset-x-0 bottom-0 flex max-h-[88%] flex-col rounded-t-[34px] bg-surface pb-safe shadow-float',
              className,
            )}
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={spring.smooth}
            drag="y"
            dragControls={controls}
            dragListener={false}
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0.05, bottom: 0.7 }}
            onDragEnd={(_, info) => {
              if (info.offset.y > 110 || info.velocity.y > 600) onClose()
            }}
          >
            <div
              className="flex shrink-0 cursor-grab touch-none justify-center pt-3 pb-2 active:cursor-grabbing"
              onPointerDown={(e) => controls.start(e)}
            >
              <span className="h-1.5 w-10 rounded-full bg-surface-3" />
            </div>
            {title && <h2 className="px-6 pb-2 font-display text-2xl font-medium">{title}</h2>}
            <div className="no-scrollbar min-h-0 flex-1 overflow-y-auto">{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    root,
  )
}
