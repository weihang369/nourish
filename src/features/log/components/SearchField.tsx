import { Mic, Search, X } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/cn'
import { spring } from '@/lib/motion'

interface SearchFieldProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

/** Mock dictation: listens briefly, then "hears" a phrase. */
const HEARD = 'salmon'

export function SearchField({ value, onChange, placeholder = 'Search foods, brands, dishes' }: SearchFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [focused, setFocused] = useState(false)
  const [listening, setListening] = useState(false)

  // Focus once the push transition has settled, only where there is a real keyboard.
  useEffect(() => {
    if (!window.matchMedia('(pointer: fine)').matches) return
    const t = setTimeout(() => inputRef.current?.focus({ preventScroll: true }), 560)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    if (!listening) return
    const t = setTimeout(() => {
      setListening(false)
      onChange(HEARD)
    }, 1500)
    return () => clearTimeout(t)
  }, [listening, onChange])

  return (
    <motion.div
      animate={{ scale: focused ? 1.01 : 1 }}
      transition={spring.smooth}
      className={cn(
        'flex h-14 items-center gap-1 rounded-[20px] bg-surface pr-1.5 pl-4 shadow-card ring-1 ring-inset transition-shadow duration-300',
        focused ? 'ring-brand/40 shadow-[0_0_0_4px_color-mix(in_oklab,var(--nr-brand)_14%,transparent)]' : 'ring-line',
      )}
    >
      <Search className={cn('size-5 shrink-0 transition-colors', focused ? 'text-ink' : 'text-ink-3')} strokeWidth={2.2} />
      <label className="sr-only" htmlFor="food-search">
        Search foods
      </label>
      <input
        id="food-search"
        ref={inputRef}
        type="search"
        inputMode="search"
        autoComplete="off"
        enterKeyHint="search"
        value={listening ? '' : value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder={listening ? 'Listening…' : placeholder}
        className="h-full min-w-0 flex-1 bg-transparent pl-2 text-[16px] font-medium text-ink outline-none placeholder:font-normal placeholder:text-ink-3 [&::-webkit-search-cancel-button]:hidden"
      />
      <AnimatePresence initial={false}>
        {value && !listening && (
          <motion.button
            type="button"
            aria-label="Clear search"
            onClick={() => {
              onChange('')
              inputRef.current?.focus({ preventScroll: true })
            }}
            initial={{ scale: 0.4, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.4, opacity: 0 }}
            transition={spring.snappy}
            className="grid size-10 shrink-0 place-items-center rounded-full text-ink-3 hover:text-ink"
          >
            <span className="grid size-5 place-items-center rounded-full bg-ink-3/25">
              <X className="size-3" strokeWidth={3} />
            </span>
          </motion.button>
        )}
      </AnimatePresence>
      <span aria-hidden className="h-6 w-px bg-line" />
      <motion.button
        type="button"
        aria-label={listening ? 'Stop listening' : 'Search by voice'}
        aria-pressed={listening}
        onClick={() => setListening((l) => !l)}
        whileTap={{ scale: 0.88 }}
        className={cn(
          'relative grid size-10 shrink-0 place-items-center rounded-full transition-colors',
          listening ? 'bg-brand text-brand-ink' : 'text-ink-2 hover:text-ink',
        )}
      >
        {listening && <span className="absolute inset-0 animate-pulse-ring rounded-full bg-brand/50" />}
        <Mic className="relative size-[19px]" strokeWidth={2.2} />
      </motion.button>
    </motion.div>
  )
}
