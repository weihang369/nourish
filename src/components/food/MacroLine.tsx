import { cn } from '@/lib/cn'
import { formatGrams } from '@/lib/format'
import { macroKeys, macroMeta } from '@/lib/nutrition'
import type { Nutrients } from '@/types/nutrition'

/** "● 20g P  ● 36g C  ● 7g F" — dense macro summary for list rows. */
export function MacroLine({ nutrients, className }: { nutrients: Nutrients; className?: string }) {
  return (
    <span className={cn('inline-flex items-center gap-2.5 text-[11px] font-medium text-ink-3 tabular', className)}>
      {macroKeys.map((key) => (
        <span key={key} className="inline-flex items-center gap-1">
          <span className={cn('size-1.5 rounded-full', macroMeta[key].bg)} />
          {formatGrams(nutrients[key])}g {macroMeta[key].short}
        </span>
      ))}
    </span>
  )
}
