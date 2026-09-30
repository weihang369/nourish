import { Check, Droplet, Heart, Sparkles, Trash2 } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { useEffect } from 'react'
import { spring } from '@/lib/motion'
import { type ToastIcon, useAppStore } from '@/store/useAppStore'

const icons: Record<ToastIcon, typeof Check> = {
  check: Check,
  water: Droplet,
  heart: Heart,
  sparkle: Sparkles,
  trash: Trash2,
}

/** Dynamic-island-style toast that drops from the top of the device. */
export function ToastHost() {
  const toast = useAppStore((s) => s.toast)
  const dismiss = useAppStore((s) => s.dismissToast)

  useEffect(() => {
    if (!toast) return
    const t = setTimeout(dismiss, toast.action ? 4000 : 2400)
    return () => clearTimeout(t)
  }, [toast, dismiss])

  const Icon = toast ? icons[toast.icon] : Check

  return (
    <div className="pointer-events-none absolute inset-x-0 top-0 z-[60] flex justify-center pt-[max(10px,calc(var(--sat)-42px))]">
      <AnimatePresence>
        {toast && (
          <motion.div
            key={toast.id}
            role="status"
            initial={{ y: -40, scale: 0.7, opacity: 0 }}
            animate={{ y: 0, scale: 1, opacity: 1 }}
            exit={{ y: -30, scale: 0.8, opacity: 0 }}
            transition={spring.bouncy}
            className="pointer-events-auto flex items-center gap-3 rounded-full bg-[#0b0e0c] py-2 pr-2 pl-2 text-white shadow-float"
          >
            <span className="grid size-8 place-items-center rounded-full bg-lime text-[#14201a]">
              <Icon className="size-4" strokeWidth={2.75} />
            </span>
            <span className="text-[13px] font-semibold">{toast.message}</span>
            {toast.action ? (
              <button
                type="button"
                onClick={() => {
                  toast.action?.onClick()
                  dismiss()
                }}
                className="h-8 rounded-full bg-white/12 px-3.5 text-[12px] font-semibold text-lime"
              >
                {toast.action.label}
              </button>
            ) : (
              <span className="w-2" />
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
