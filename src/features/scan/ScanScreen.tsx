import { X, Zap, ZapOff } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useRef, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router'
import { useBack } from '@/components/layout'
import { IconButton } from '@/components/ui'
import { mealLabel, suggestMealForNow } from '@/data/diary'
import { getFood } from '@/data/foods'
import { cn } from '@/lib/cn'
import { formatInt } from '@/lib/format'
import { easeOutExpo, spring } from '@/lib/motion'
import { analyzeMealPhoto } from '@/services/mockApi'
import { useAppStore } from '@/store/useAppStore'
import { useStatusTone } from '@/store/useChromeStore'
import { logWithUndo } from '@/features/log/logging'
import { AnalyzingOverlay } from './components/AnalyzingOverlay'
import { BarcodeResultCard } from './components/BarcodeResultCard'
import { DetectionPin } from './components/DetectionPin'
import { ModeWheel } from './components/ModeWheel'
import { ResultsPanel, totalsFor } from './components/ResultsPanel'
import { ScanFrame } from './components/ScanFrame'
import { ShutterBar } from './components/ShutterBar'
import { Viewfinder } from './components/Viewfinder'
import { type DetectedItem, parseScanMode, type ScanMode, type ScanPhase } from './types'

const BARCODE_FOOD_ID = 'oat-latte'

const titles: Record<ScanMode, string> = { meal: 'Snap a meal', barcode: 'Scan a barcode', label: 'Read a label' }
const hints: Record<ScanMode, string> = {
  meal: 'Fit the whole plate inside the frame',
  barcode: 'Hold steady over the barcode',
  label: 'Line up the nutrition panel',
}

function useLatch(active: boolean, ms: number, resetKey: unknown) {
  const [on, setOn] = useState(false)
  useEffect(() => {
    setOn(false)
    if (!active) return
    const t = setTimeout(() => setOn(true), ms)
    return () => clearTimeout(t)
  }, [active, ms, resetKey])
  return [on, setOn] as const
}

export function ScanScreen() {
  useStatusTone('light')
  const navigate = useNavigate()
  const close = useBack('/log')
  const [params, setParams] = useSearchParams()
  const mode = parseScanMode(params.get('mode'))

  const [phase, setPhase] = useState<ScanPhase>('live')
  const [torch, setTorch] = useState(false)
  const [shot, setShot] = useState(0)
  const [step, setStep] = useState(0)
  const [items, setItems] = useState<DetectedItem[]>([])
  const [rescan, setRescan] = useState(0)
  const alive = useRef(true)

  const live = phase === 'live'
  const [focused] = useLatch(live, 800, mode)
  const [found, setFound] = useLatch(live && mode === 'barcode', 1600, rescan)

  useEffect(() => {
    alive.current = true
    return () => {
      alive.current = false
    }
  }, [])

  // Advance the analysis checklist while the mock model "thinks".
  useEffect(() => {
    if (phase !== 'analyzing') return
    const timers = [700, 1400].map((ms, i) => setTimeout(() => setStep(i + 1), ms))
    return () => timers.forEach(clearTimeout)
  }, [phase])

  const setMode = (next: ScanMode) => setParams({ mode: next }, { replace: true })

  const analyze = async () => {
    setShot((s) => s + 1)
    setStep(0)
    setPhase('analyzing')
    const detections = await analyzeMealPhoto()
    if (!alive.current) return
    setItems(detections)
    setPhase('results')
  }

  const onShutter = () => {
    if (mode === 'barcode') {
      if (found) setRescan((r) => r + 1)
      else setFound(true)
      return
    }
    if (mode === 'label') {
      useAppStore.getState().showToast('Label reading is coming soon', 'sparkle')
      return
    }
    void analyze()
  }

  const onGallery = () => {
    if (mode !== 'meal') setMode('meal')
    void analyze()
  }

  const retake = () => {
    setItems([])
    setPhase('live')
  }

  const logMeal = () => {
    const meal = suggestMealForNow()
    const entries = items.flatMap((item) => {
      const food = getFood(item.foodId)
      return food ? [{ foodId: item.foodId, servings: Math.round((item.grams / food.serving.grams) * 100) / 100 }] : []
    })
    logWithUndo(meal, entries, `${mealLabel[meal]} logged · ${formatInt(totalsFor(items).kcal)} kcal`, 'sparkle')
    navigate('/')
  }

  const barcodeFood = getFood(BARCODE_FOOD_ID)
  const shutterLabel =
    mode === 'barcode' ? (found ? 'Scan again' : 'Scan barcode now') : mode === 'label' ? 'Capture label' : 'Capture meal'

  return (
    <div data-theme="dark" className="relative h-full overflow-hidden bg-black text-white select-none">
      <Viewfinder focused={focused || !live} shallow={live && mode !== 'meal'} compact={phase === 'results'} torch={torch}>
        <AnimatePresence>
          {phase === 'results' && items.map((item, i) => <DetectionPin key={item.foodId} item={item} index={i} />)}
        </AnimatePresence>
      </Viewfinder>

      <AnimatePresence>
        {phase !== 'results' && (
          <motion.div
            key="frame"
            className="absolute inset-0 z-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.25 } }}
          >
            <ScanFrame mode={mode} focused={focused || !live} found={found} busy={phase === 'analyzing'} />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>{phase === 'analyzing' && <AnalyzingOverlay key="analyzing" step={step} />}</AnimatePresence>

      {/* Top chrome */}
      <header className="absolute inset-x-0 top-0 z-30 flex items-center justify-between px-4 pt-safe">
        <div className="flex h-14 w-full items-center justify-between">
          <IconButton label="Close camera" variant="glass" onClick={close}>
            <X strokeWidth={2.4} />
          </IconButton>
          <AnimatePresence mode="wait" initial={false}>
            <motion.p
              key={phase === 'results' ? 'results' : mode}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.25 }}
              className="rounded-full px-3.5 py-1.5 text-[13px] font-semibold ring-1 ring-white/12 ring-inset glass-dark"
            >
              {phase === 'results' ? 'Here’s what we see' : titles[mode]}
            </motion.p>
          </AnimatePresence>
          <IconButton
            label={torch ? 'Turn flash off' : 'Turn flash on'}
            aria-pressed={torch}
            variant="glass"
            onClick={() => setTorch((t) => !t)}
            className={cn(torch && 'bg-lime text-[#14201a] ring-0', phase !== 'live' && 'pointer-events-none opacity-0')}
          >
            {torch ? <Zap className="fill-current" strokeWidth={2.2} /> : <ZapOff strokeWidth={2.2} />}
          </IconButton>
        </div>
      </header>

      {/* Bottom controls */}
      <AnimatePresence>
        {live && (
          <motion.div
            key="controls"
            className="absolute inset-x-0 bottom-0 z-30 bg-linear-to-t from-black/75 via-black/40 to-transparent pt-16 pb-[calc(var(--sab)+8px)]"
            initial={{ y: 60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0, transition: { duration: 0.25 } }}
            transition={spring.smooth}
          >
            <div className="flex min-h-[76px] items-end justify-center">
              <AnimatePresence mode="popLayout" initial={false}>
                {mode === 'barcode' && found && barcodeFood ? (
                  <BarcodeResultCard
                    key="card"
                    food={barcodeFood}
                    onOpen={() => navigate(`/food/${BARCODE_FOOD_ID}?meal=${suggestMealForNow()}`)}
                  />
                ) : (
                  <motion.p
                    key={mode}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.3, ease: easeOutExpo }}
                    className="mb-2 rounded-full px-4 py-2 text-[13px] font-medium text-white/90 ring-1 ring-white/10 ring-inset glass-dark"
                  >
                    {hints[mode]}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            <div className="mt-4">
              <ModeWheel value={mode} onChange={setMode} />
            </div>
            <div className="mt-3">
              <ShutterBar
                mode={mode}
                ready={focused}
                shutterLabel={shutterLabel}
                onShutter={onShutter}
                onGallery={onGallery}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {phase === 'results' && (
          <ResultsPanel
            key="results"
            items={items}
            onGrams={(foodId, grams) => setItems((list) => list.map((i) => (i.foodId === foodId ? { ...i, grams } : i)))}
            onRemove={(foodId) => setItems((list) => list.filter((i) => i.foodId !== foodId))}
            onRetake={retake}
            onLog={logMeal}
          />
        )}
      </AnimatePresence>

      {/* Capture flash */}
      <AnimatePresence>
        {shot > 0 && (
          <motion.div
            key={shot}
            aria-hidden
            className="pointer-events-none absolute inset-0 z-40 bg-white"
            initial={{ opacity: torch ? 1 : 0.85 }}
            animate={{ opacity: 0 }}
            transition={{ duration: 0.55, ease: easeOutExpo }}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
