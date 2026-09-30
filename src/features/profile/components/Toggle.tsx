import { motion } from 'motion/react'
import { cn } from '@/lib/cn'
import { spring } from '@/lib/motion'

interface ToggleProps {
  checked: boolean
  onChange: (checked: boolean) => void
  label: string
}

/** iOS-style switch. The knob springs across and squashes slightly on press. */
export function Toggle({ checked, onChange, label }: ToggleProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={cn(
        'relative flex h-[31px] w-[51px] shrink-0 items-center rounded-full p-[2px] transition-colors duration-300',
        checked ? 'justify-end bg-brand' : 'justify-start bg-surface-3',
      )}
    >
      <motion.span
        layout
        transition={spring.snappy}
        whileTap={{ width: 32 }}
        className="block h-[27px] w-[27px] rounded-full bg-white shadow-[0_2px_6px_rgb(0_0_0/0.18),0_0_0_0.5px_rgb(0_0_0/0.04)]"
      />
    </button>
  )
}
