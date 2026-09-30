import { RotateCcw } from 'lucide-react'
import { Button, Sheet } from '@/components/ui'

interface ResetDemoSheetProps {
  open: boolean
  onClose: () => void
  onConfirm: () => void
}

export function ResetDemoSheet({ open, onClose, onConfirm }: ResetDemoSheetProps) {
  return (
    <Sheet open={open} onClose={onClose} title="Reset demo data?">
      <div className="px-6 pt-1 pb-4">
        <p className="text-[14px] leading-relaxed text-ink-2">
          This clears today’s diary, your goals and saved recipes, then replays onboarding from the start. Your theme
          stays as it is.
        </p>
        <div className="mt-6 flex flex-col gap-2.5">
          <Button block size="lg" variant="deep" leading={<RotateCcw className="size-4" />} onClick={onConfirm}>
            Reset and start over
          </Button>
          <Button block variant="ghost" onClick={onClose}>
            Keep my data
          </Button>
        </div>
      </div>
    </Sheet>
  )
}
