import { motion } from 'motion/react'
import type { CoachAttachment, CoachMessage } from '@/data/coach'
import { cn } from '@/lib/cn'
import { spring } from '@/lib/motion'
import { CoachMark } from './CoachMark'
import { FoodSuggestions } from './FoodSuggestions'
import { MacroGapCard } from './MacroGapCard'
import { RecipeAttachment } from './RecipeAttachment'

interface MessageRowProps {
  message: CoachMessage
  /** Only the last bubble in a run of coach messages carries the avatar */
  showAvatar: boolean
  delay?: number
}

/** Messages spring up from the composer, anchored at their tail corner. */
export function MessageRow({ message, showAvatar, delay = 0 }: MessageRowProps) {
  const fromCoach = message.role === 'coach'

  return (
    <motion.div
      layout="position"
      initial={{ opacity: 0, y: 18, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ ...spring.smooth, delay }}
      style={{ originX: fromCoach ? 0 : 1, originY: 1 }}
      className="flex flex-col gap-2"
    >
      {fromCoach ? (
        <div className="flex items-end gap-2">
          <span className="w-7 shrink-0">{showAvatar && <CoachMark />}</span>
          <p
            className={cn(
              'max-w-[80%] rounded-[22px] bg-surface px-4 py-2.5 text-[14.5px] leading-relaxed whitespace-pre-line text-ink shadow-card ring-1 ring-line ring-inset',
              showAvatar && 'rounded-bl-[8px]',
            )}
          >
            {message.text}
          </p>
        </div>
      ) : (
        <p className="ml-auto max-w-[78%] rounded-[22px] rounded-br-[8px] bg-ink px-4 py-2.5 text-[14.5px] leading-relaxed whitespace-pre-line text-canvas">
          {message.text}
        </p>
      )}
      {message.attachment && <Attachment attachment={message.attachment} />}
    </motion.div>
  )
}

function Attachment({ attachment }: { attachment: CoachAttachment }) {
  switch (attachment.kind) {
    case 'macro-gap':
      return (
        <div className="pl-9">
          <MacroGapCard />
        </div>
      )
    case 'recipe':
      return (
        <div className="pl-9">
          <RecipeAttachment recipeId={attachment.recipeId} />
        </div>
      )
    case 'foods':
      return <FoodSuggestions foodIds={attachment.foodIds} />
  }
}
