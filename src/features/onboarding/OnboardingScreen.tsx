import { ArrowRight, ChevronLeft, Sparkles } from 'lucide-react'
import { AnimatePresence, motion, type Variants } from 'motion/react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router'
import { Screen } from '@/components/layout'
import { Button, IconButton } from '@/components/ui'
import { easeOutExpo } from '@/lib/motion'
import { type GoalType, useAppStore } from '@/store/useAppStore'
import { useStatusTone } from '@/store/useChromeStore'
import { type BodyDraft, BodyStep } from './components/BodyStep'
import { GoalStep } from './components/GoalStep'
import { HeroStep } from './components/HeroStep'
import { PlanStep } from './components/PlanStep'
import { StepProgress } from './components/StepProgress'
import { computePlan, suggestedTarget } from './plan'

type Step = 0 | 1 | 2 | 3

const TOTAL = 3
const BUILD_MS = 1600

const slide = { duration: 0.6, ease: easeOutExpo }

/** Direction-aware slide + fade: forward enters from the right, back from the left. */
const stepVariants: Variants = {
  enter: (dir: number) => ({ x: dir > 0 ? '32%' : '-32%', opacity: 0 }),
  center: { x: 0, opacity: 1, transition: slide },
  exit: (dir: number) => ({ x: dir > 0 ? '-22%' : '22%', opacity: 0, transition: { ...slide, duration: 0.45 } }),
}

const ctaLabels: Record<Exclude<Step, 0>, string> = {
  1: 'Continue',
  2: 'Build my plan',
  3: 'Start nourishing',
}

export function OnboardingScreen() {
  const navigate = useNavigate()
  const [step, setStep] = useState<Step>(0)
  const [dir, setDir] = useState(1)
  const [goal, setGoal] = useState<GoalType | null>(null)
  const [targetTouched, setTargetTouched] = useState(false)
  const [planReady, setPlanReady] = useState(false)
  const [body, setBody] = useState<BodyDraft>({
    sex: 'female',
    age: 32,
    heightCm: 168,
    weightKg: 68.4,
    targetKg: 64,
    activity: null,
  })

  useStatusTone(step === 0 ? 'light' : 'dark')

  const plan = useMemo(
    () => (goal && body.activity ? computePlan(goal, { ...body, activity: body.activity }) : null),
    [goal, body],
  )

  // The plan "builds" for a beat each time we land on the reveal.
  const buildTimer = useRef<number | undefined>(undefined)
  useEffect(() => () => window.clearTimeout(buildTimer.current), [])

  const go = (next: Step) => {
    setDir(next > step ? 1 : -1)
    setStep(next)
    window.clearTimeout(buildTimer.current)
    if (next === 3) {
      setPlanReady(false)
      buildTimer.current = window.setTimeout(() => setPlanReady(true), BUILD_MS)
    }
  }

  const chooseGoal = (g: GoalType) => {
    setGoal(g)
    if (!targetTouched) setBody((b) => ({ ...b, targetKg: suggestedTarget(g, b.weightKg) }))
  }

  const patchBody = (patch: Partial<BodyDraft>) => {
    if ('targetKg' in patch) setTargetTouched(true)
    setBody((b) => ({ ...b, ...patch }))
  }

  const finish = () => {
    if (!goal || !plan) return
    useAppStore.getState().completeOnboarding(goal, {
      kcal: plan.kcal,
      protein: plan.protein,
      carbs: plan.carbs,
      fat: plan.fat,
      fiber: plan.fiber,
      currentWeightKg: body.weightKg,
      startWeightKg: body.weightKg,
      targetWeightKg: plan.targetKg,
    })
    navigate('/', { replace: true })
    useAppStore.getState().showToast('Your plan is set', 'sparkle')
  }

  const signIn = () => {
    const { completeOnboarding, goalType } = useAppStore.getState()
    completeOnboarding(goalType, {})
    navigate('/', { replace: true })
    useAppStore.getState().showToast('Welcome back', 'heart')
  }

  const canContinue = step === 1 ? goal !== null : step === 2 ? body.activity !== null : planReady && plan !== null

  const onPrimary = () => {
    if (step === 1 || step === 2) go((step + 1) as Step)
    else if (step === 3) finish()
  }

  return (
    <div className="relative h-full overflow-hidden bg-canvas">
      <AnimatePresence initial={false} custom={dir}>
        <motion.div
          key={step}
          custom={dir}
          variants={stepVariants}
          initial="enter"
          animate="center"
          exit="exit"
          className="absolute inset-0"
        >
          {step === 0 ? (
            <HeroStep onStart={() => go(1)} onSignIn={signIn} />
          ) : (
            <Screen className="pt-[calc(var(--sat)+68px)] pb-44">
              {step === 1 && <GoalStep value={goal} onChange={chooseGoal} />}
              {step === 2 && <BodyStep body={body} onChange={patchBody} />}
              {step === 3 && goal && plan && (
                <PlanStep goal={goal} weightKg={body.weightKg} plan={plan} ready={planReady} />
              )}
            </Screen>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Persistent chrome for steps 1–3 */}
      <AnimatePresence>
        {step > 0 && (
          <motion.header
            key="chrome-top"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.4, ease: easeOutExpo }}
            className="absolute inset-x-0 top-0 z-20 bg-canvas/85 pt-safe backdrop-blur-xl"
          >
            <div className="flex h-14 items-center gap-4 px-4">
              <IconButton label="Back" onClick={() => go((step - 1) as Step)}>
                <ChevronLeft strokeWidth={2.4} />
              </IconButton>
              <StepProgress step={step} total={TOTAL} />
              <span className="w-10 text-right text-[12px] font-semibold text-ink-3 tabular">
                {step}/{TOTAL}
              </span>
            </div>
          </motion.header>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {step > 0 && (
          <motion.div
            key="chrome-bottom"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 24 }}
            transition={{ duration: 0.45, ease: easeOutExpo }}
            className="absolute inset-x-0 bottom-0 z-20 bg-linear-to-t from-canvas via-canvas to-transparent px-5 pt-10 pb-safe"
          >
            <Button
              size="lg"
              block
              disabled={!canContinue}
              onClick={onPrimary}
              className="overflow-hidden"
              trailing={
                step === 3 ? (
                  <Sparkles className="size-5" strokeWidth={2.2} />
                ) : (
                  <ArrowRight className="size-5" strokeWidth={2.4} />
                )
              }
            >
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.span
                  key={step}
                  initial={{ y: 14, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -14, opacity: 0 }}
                  transition={{ duration: 0.3, ease: easeOutExpo }}
                >
                  {ctaLabels[step as Exclude<Step, 0>]}
                </motion.span>
              </AnimatePresence>
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
