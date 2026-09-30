export type CoachAttachment =
  | { kind: 'recipe'; recipeId: string }
  | { kind: 'foods'; foodIds: string[] }
  | { kind: 'macro-gap' }

export interface CoachMessage {
  id: string
  role: 'user' | 'coach'
  text: string
  attachment?: CoachAttachment
}

export const coachIntro: CoachMessage[] = [
  {
    id: 'intro-1',
    role: 'coach',
    text: 'Hi Ava 👋 I’ve looked over today. You’re doing beautifully on fiber and hydration is on pace.',
  },
  {
    id: 'intro-2',
    role: 'coach',
    text: 'One thing stands out — you’re close to 80 g short on protein with dinner still to go.',
    attachment: { kind: 'macro-gap' },
  },
]

export const suggestedPrompts = [
  'What should I eat for dinner?',
  'High-protein snack ideas',
  'Why am I hungry at 4pm?',
  'Plan tomorrow for me',
]

interface ScriptedReply {
  match: RegExp
  replies: Omit<CoachMessage, 'id' | 'role'>[]
}

const scripts: ScriptedReply[] = [
  {
    match: /dinner|tonight|eat/i,
    replies: [
      {
        text: 'Try my lemon herb salmon — 42 g protein and 520 kcal, which lands you almost exactly on your goals for the day.',
        attachment: { kind: 'recipe', recipeId: 'lemon-herb-salmon' },
      },
      { text: 'Short on time? Pair a grilled chicken breast with quinoa and half an avocado. Ready in 15 minutes.' },
    ],
  },
  {
    match: /snack|protein/i,
    replies: [
      {
        text: 'Here are three snacks that each add 13 g+ of protein for under 300 kcal:',
        attachment: { kind: 'foods', foodIds: ['greek-yogurt-parfait', 'boiled-eggs', 'grilled-chicken'] },
      },
    ],
  },
  {
    match: /hungry|4 ?pm|craving/i,
    replies: [
      {
        text: 'Your lunch was carb-forward (62 g) with modest fat, so energy likely dips around 3–4pm. Adding 15 g of protein or healthy fat at lunch — an egg or some avocado — should smooth that out.',
      },
    ],
  },
  {
    match: /plan|tomorrow/i,
    replies: [
      {
        text: 'Here’s a balanced day at 2,150 kcal:\n\n🌅 Berry overnight oats · 380\n☀️ Rainbow buddha bowl · 480\n🍎 Yogurt parfait · 290\n🌙 Lemon herb salmon · 520\n\nThat leaves ~480 kcal flexible. Want me to add it to your planner?',
      },
    ],
  },
]

const fallback: Omit<CoachMessage, 'id' | 'role'>[] = [
  {
    text: 'Great question. Based on your last two weeks, keeping dinner around 550 kcal with 35 g+ protein is the single biggest lever for your goal.',
  },
]

export function coachReplyFor(prompt: string) {
  return scripts.find((s) => s.match.test(prompt))?.replies ?? fallback
}
