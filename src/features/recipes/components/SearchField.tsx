import { Search, X } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { useRef } from 'react'
import { spring } from '@/lib/motion'

interface SearchFieldProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export function SearchField({ value, onChange, placeholder = 'Search recipes, ingredients…' }: SearchFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  return (
    <label className="relative flex h-12 min-w-0 flex-1 items-center rounded-full bg-surface pl-4 shadow-card ring-1 ring-line ring-inset transition-shadow focus-within:ring-2 focus-within:ring-brand/60">
      <Search className="size-[18px] shrink-0 text-ink-3" strokeWidth={2.2} />
      <input
        ref={inputRef}
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label="Search recipes"
        enterKeyHint="search"
        className="h-full min-w-0 flex-1 bg-transparent pr-2 pl-2.5 text-[15px] text-ink outline-none placeholder:text-ink-3 [&::-webkit-search-cancel-button]:hidden"
      />
      <AnimatePresence>
        {value && (
          <motion.button
            type="button"
            aria-label="Clear search"
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.6, opacity: 0 }}
            transition={spring.snappy}
            onClick={() => {
              onChange('')
              inputRef.current?.focus()
            }}
            className="mr-1 grid size-10 shrink-0 place-items-center rounded-full"
          >
            <span className="grid size-6 place-items-center rounded-full bg-surface-3 text-ink-2">
              <X className="size-3.5" strokeWidth={2.6} />
            </span>
          </motion.button>
        )}
      </AnimatePresence>
    </label>
  )
}
