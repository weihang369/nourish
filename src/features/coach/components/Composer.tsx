import { ArrowUp, Mic } from 'lucide-react'
import { motion } from 'motion/react'
import { useState } from 'react'
import { IconButton } from '@/components/ui'
import { cn } from '@/lib/cn'
import { spring } from '@/lib/motion'
import { useAppStore } from '@/store/useAppStore'

interface ComposerProps {
  busy: boolean
  onSend: (text: string) => void
}

export function Composer({ busy, onSend }: ComposerProps) {
  const [text, setText] = useState('')
  const canSend = text.trim().length > 0 && !busy

  const submit = () => {
    if (!canSend) return
    onSend(text)
    setText('')
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        submit()
      }}
      className="flex h-14 items-center gap-1 rounded-full bg-surface pr-1.5 pl-5 shadow-float ring-1 ring-line transition-shadow ring-inset focus-within:ring-2 focus-within:ring-brand/50"
    >
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Ask about meals, macros, habits…"
        aria-label="Message Nourish Coach"
        enterKeyHint="send"
        autoComplete="off"
        className="min-w-0 flex-1 bg-transparent text-base text-ink outline-none placeholder:text-ink-3 focus-visible:outline-none"
      />
      <IconButton
        label="Voice input"
        variant="ghost"
        onClick={() => useAppStore.getState().showToast('Voice notes arrive in the full app', 'sparkle')}
      >
        <Mic />
      </IconButton>
      <motion.button
        type="submit"
        aria-label="Send message"
        disabled={!canSend}
        animate={{ scale: canSend ? 1 : 0.86 }}
        whileTap={canSend ? { scale: 0.88 } : undefined}
        transition={spring.bouncy}
        className={cn(
          'grid size-11 shrink-0 place-items-center rounded-full transition-colors duration-300',
          canSend ? 'bg-brand text-brand-ink shadow-glow' : 'bg-surface-2 text-ink-3',
        )}
      >
        <motion.span animate={{ y: canSend ? 0 : 2 }} transition={spring.bouncy}>
          <ArrowUp className="size-5" strokeWidth={2.5} />
        </motion.span>
      </motion.button>
    </form>
  )
}
