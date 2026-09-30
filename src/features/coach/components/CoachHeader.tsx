import { ChevronLeft, SquarePen } from 'lucide-react'
import { useBack } from '@/components/layout'
import { IconButton } from '@/components/ui'
import { CoachMark } from './CoachMark'

/** Sticky glass header with a centred identity block instead of a plain title. */
export function CoachHeader({ onNewChat }: { onNewChat: () => void }) {
  const back = useBack('/')
  return (
    <header className="glass sticky top-0 z-30 pt-safe shadow-[0_1px_0_var(--nr-line)]">
      <div className="flex h-14 items-center gap-3 px-4">
        <IconButton label="Back" onClick={back}>
          <ChevronLeft strokeWidth={2.4} />
        </IconButton>
        <div className="flex min-w-0 flex-1 items-center justify-center gap-2.5">
          <CoachMark size={32} />
          <div className="min-w-0">
            <h1 className="truncate text-[15px] leading-tight font-semibold">Nourish Coach</h1>
            <p className="flex items-center gap-1.5 text-[11.5px] font-medium text-ink-3">
              <span className="relative flex size-2">
                <span className="absolute inset-0 animate-pulse-ring rounded-full bg-[#34c267]" />
                <span className="relative size-2 rounded-full bg-[#34c267]" />
              </span>
              AI · Online
            </p>
          </div>
        </div>
        <IconButton label="New conversation" onClick={onNewChat}>
          <SquarePen />
        </IconButton>
      </div>
    </header>
  )
}
