import { Camera, Droplet, MessageCircle, ScanBarcode, Search } from 'lucide-react'
import { motion } from 'motion/react'
import { useCallback } from 'react'
import { useNavigate } from 'react-router'
import { Sheet } from '@/components/ui'
import { mealLabel, suggestMealForNow } from '@/data/diary'
import { formatLiters } from '@/lib/format'
import { spring, stagger } from '@/lib/motion'
import { useAppStore } from '@/store/useAppStore'
import type { Food } from '@/types/nutrition'
import { LogAgainRow } from './LogAgainRow'
import { QuickActionTile } from './QuickActionTile'

export function QuickAddSheet() {
  const open = useAppStore((s) => s.quickAddOpen)
  const setOpen = useAppStore((s) => s.setQuickAddOpen)
  const close = useCallback(() => setOpen(false), [setOpen])

  return (
    <Sheet open={open} onClose={close} title="Log something">
      <QuickAddContent onDone={close} />
    </Sheet>
  )
}

function QuickAddContent({ onDone }: { onDone: () => void }) {
  const navigate = useNavigate()
  const waterMl = useAppStore((s) => s.waterMl)
  const meal = suggestMealForNow()
  const mealName = mealLabel[meal].toLowerCase()

  const go = (to: string) => {
    onDone()
    navigate(to)
  }

  const logWater = (ml: number) => {
    const { addWater, showToast } = useAppStore.getState()
    addWater(ml)
    showToast(`${ml} ml water logged`, 'water')
  }

  const logAgain = (food: Food) => {
    const { addEntries, removeEntry, showToast } = useAppStore.getState()
    const [id] = addEntries(meal, [{ foodId: food.id, servings: 1 }])
    onDone()
    showToast(`Added to ${mealName}`, 'check', { label: 'Undo', onClick: () => removeEntry(id) })
  }

  return (
    <motion.div variants={stagger} initial="hidden" animate="show" className="pb-4">
      <p className="-mt-1 px-6 text-[13.5px] text-ink-3">
        It's {mealName} time — pick the quickest way in.
      </p>

      <div className="mt-4 grid grid-cols-2 gap-3 px-6">
        <QuickActionTile
          icon={<Search strokeWidth={2.3} />}
          iconClassName="bg-brand text-brand-ink"
          title="Search food"
          sub={`Add to ${mealName}`}
          onClick={() => go(`/log?meal=${meal}`)}
        />
        <QuickActionTile
          featured
          badge="New"
          icon={<Camera strokeWidth={2.3} />}
          iconClassName="bg-lime text-[#14201a]"
          title="Snap a meal"
          sub="AI spots every item"
          onClick={() => go('/scan')}
        />
        <QuickActionTile
          icon={<ScanBarcode strokeWidth={2.3} />}
          iconClassName="bg-surface text-ink shadow-card"
          title="Scan barcode"
          sub="Packaged foods"
          onClick={() => go('/scan?mode=barcode')}
        />
        <QuickActionTile
          icon={<MessageCircle strokeWidth={2.3} />}
          iconClassName="bg-surface text-ink shadow-card"
          title="Ask coach"
          sub="“What fits for dinner?”"
          onClick={() => go('/coach')}
        />
      </div>

      <div className="mx-6 mt-3 flex items-center gap-3 rounded-[24px] bg-water/10 p-2 pl-4">
        <Droplet className="size-5 shrink-0 fill-water text-water" strokeWidth={2} />
        <p className="min-w-0 flex-1 text-[13.5px] font-semibold">
          Water
          <span className="ml-1.5 font-medium text-ink-3 tabular">{formatLiters(waterMl)}</span>
        </p>
        {[250, 500].map((ml) => (
          <motion.button
            key={ml}
            type="button"
            whileTap={{ scale: 0.92 }}
            transition={spring.snappy}
            onClick={() => logWater(ml)}
            aria-label={`Add ${ml} ml of water`}
            className="h-10 rounded-full bg-surface px-4 text-[13px] font-semibold text-ink shadow-card tabular"
          >
            +{ml} ml
          </motion.button>
        ))}
      </div>

      <div className="mt-6 flex items-baseline justify-between px-6">
        <h3 className="font-display text-[19px] font-medium">Log again</h3>
        <span className="text-[12px] font-medium text-ink-3">Adds 1 serving to {mealName}</span>
      </div>
      <div className="mt-3">
        <LogAgainRow onPick={logAgain} />
      </div>
    </motion.div>
  )
}
