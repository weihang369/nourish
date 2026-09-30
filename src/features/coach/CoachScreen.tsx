import { AnimatePresence } from 'motion/react'
import { useEffect, useRef } from 'react'
import { Screen } from '@/components/layout'
import { suggestedPrompts } from '@/data/coach'
import { CoachHeader } from './components/CoachHeader'
import { CoachWelcome } from './components/CoachWelcome'
import { Composer } from './components/Composer'
import { MessageRow } from './components/MessageRow'
import { PromptChips } from './components/PromptChips'
import { TypingIndicator } from './components/TypingIndicator'
import { useCoachChat } from './useCoachChat'

export function CoachScreen() {
  const { messages, typing, send, reset } = useCoachChat()
  const scrollRef = useRef<HTMLDivElement>(null)

  const asked = new Set(messages.filter((m) => m.role === 'user').map((m) => m.text))
  const prompts = suggestedPrompts.filter((p) => !asked.has(p))

  // Follow the conversation: keep the newest bubble (or typing dots) in view.
  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    const frame = requestAnimationFrame(() => el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' }))
    return () => cancelAnimationFrame(frame)
  }, [messages.length, typing])

  return (
    <div className="relative h-full">
      <Screen ref={scrollRef} className="pb-[calc(var(--sab)+150px)]">
        <CoachHeader onNewChat={reset} />

        <div className="px-5">
          <CoachWelcome />
          <div className="mt-4 flex flex-col gap-3" aria-live="polite">
            {messages.map((m, i) => {
              const next = messages[i + 1]
              const introIndex = m.id.startsWith('intro-') ? i : -1
              return (
                <MessageRow
                  key={m.id}
                  message={m}
                  showAvatar={m.role === 'coach' && next?.role !== 'coach' && !(typing && !next)}
                  delay={introIndex >= 0 ? 0.35 + introIndex * 0.55 : 0}
                />
              )
            })}
            <AnimatePresence>{typing && <TypingIndicator key="typing" />}</AnimatePresence>
          </div>
        </div>
      </Screen>

      <div className="absolute inset-x-0 bottom-0 z-20 bg-linear-to-t from-canvas from-65% to-transparent px-4 pt-8 pb-safe">
        {prompts.length > 0 && <PromptChips prompts={prompts} disabled={typing} onPick={send} />}
        <Composer busy={typing} onSend={send} />
      </div>
    </div>
  )
}
