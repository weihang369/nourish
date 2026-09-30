import { useCallback, useEffect, useRef, useState } from 'react'
import { type CoachMessage, coachIntro } from '@/data/coach'
import { askCoach } from '@/services/mockApi'

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

let seq = 0
const nextId = (prefix: string) => `${prefix}-${++seq}`

/**
 * Chat state for the coach thread. Multi-part replies arrive one bubble at a
 * time with a short typing beat between them. Resetting or leaving the screen
 * invalidates any reply still in flight.
 */
export function useCoachChat() {
  const [messages, setMessages] = useState<CoachMessage[]>(coachIntro)
  const [typing, setTyping] = useState(false)
  const session = useRef(0)

  useEffect(() => {
    const current = session
    return () => {
      current.current++
    }
  }, [])

  const send = useCallback(
    async (raw: string) => {
      const text = raw.trim()
      if (!text || typing) return
      const id = session.current
      const stale = () => session.current !== id

      setMessages((m) => [...m, { id: nextId('user'), role: 'user', text }])
      setTyping(true)
      const replies = await askCoach(text)

      for (const [i, reply] of replies.entries()) {
        if (i > 0) {
          setTyping(true)
          await wait(900)
        }
        if (stale()) return
        setTyping(false)
        setMessages((m) => [...m, { id: nextId('coach'), role: 'coach', ...reply }])
        if (i < replies.length - 1) await wait(450)
      }
    },
    [typing],
  )

  const reset = useCallback(() => {
    session.current++
    setTyping(false)
    setMessages(coachIntro)
  }, [])

  return { messages, typing, send, reset }
}
