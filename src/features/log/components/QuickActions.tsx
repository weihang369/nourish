import { Camera, Flame, type LucideIcon, ScanBarcode, Sparkles } from 'lucide-react'
import { motion } from 'motion/react'
import { cn } from '@/lib/cn'
import { riseIn, spring, stagger } from '@/lib/motion'

interface QuickActionsProps {
  onSnap: () => void
  onBarcode: () => void
  onQuickAdd: () => void
}

interface TileProps {
  icon: LucideIcon
  title: string
  hint: string
  onClick: () => void
  featured?: boolean
}

function ActionTile({ icon: Icon, title, hint, onClick, featured }: TileProps) {
  return (
    <motion.button
      type="button"
      variants={riseIn}
      whileTap={{ scale: 0.96 }}
      transition={spring.snappy}
      onClick={onClick}
      className={cn(
        'relative flex h-[112px] flex-col justify-between overflow-hidden rounded-[22px] p-3.5 text-left',
        featured ? 'bg-deep text-on-deep' : 'bg-surface text-ink shadow-card ring-1 ring-line ring-inset',
      )}
    >
      {featured && (
        <>
          <span aria-hidden className="absolute -top-8 -right-8 size-24 rounded-full bg-lime/30 blur-2xl" />
          <span className="absolute top-3 right-3 inline-flex h-5 items-center gap-1 rounded-full bg-lime px-1.5 text-[10px] font-bold tracking-wide text-[#14201a]">
            <Sparkles className="size-3" strokeWidth={2.5} />
            AI
          </span>
        </>
      )}
      <span
        className={cn(
          'relative grid size-10 place-items-center rounded-full',
          featured ? 'bg-on-deep/10 text-lime' : 'bg-surface-2 text-ink',
        )}
      >
        <Icon className="size-[19px]" strokeWidth={2.1} />
      </span>
      <span className="relative">
        <span className="block text-[14px] leading-tight font-semibold tracking-[-0.01em]">{title}</span>
        <span className={cn('mt-0.5 block text-[11.5px]', featured ? 'text-on-deep/60' : 'text-ink-3')}>{hint}</span>
      </span>
    </motion.button>
  )
}

export function QuickActions({ onSnap, onBarcode, onQuickAdd }: QuickActionsProps) {
  return (
    <motion.div variants={stagger} initial="hidden" animate="show" className="grid grid-cols-3 gap-2.5">
      <ActionTile icon={Camera} title="Snap a meal" hint="AI estimate" onClick={onSnap} featured />
      <ActionTile icon={ScanBarcode} title="Barcode" hint="Packaged" onClick={onBarcode} />
      <ActionTile icon={Flame} title="Quick add" hint="Just kcal" onClick={onQuickAdd} />
    </motion.div>
  )
}
