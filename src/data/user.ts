import type { Goals } from '@/types/nutrition'
import { photos } from './photos'

export const user = {
  firstName: 'Ava',
  lastName: 'Morgan',
  handle: '@avaeats',
  photo: photos.ava,
  memberSince: 'March 2025',
  plan: 'Nourish Plus',
  streakDays: 23,
  daysLogged: 214,
  location: 'Portland, OR',
}

export const defaultGoals: Goals = {
  kcal: 2150,
  protein: 140,
  carbs: 220,
  fat: 70,
  fiber: 32,
  waterMl: 2500,
  startWeightKg: 72.0,
  currentWeightKg: 68.4,
  targetWeightKg: 64.0,
}

export const activity = {
  steps: 6842,
  stepGoal: 10000,
  activeKcal: 320,
  workout: { name: 'Morning run', minutes: 32, kcal: 286 },
}

export type AchievementTone = 'ember' | 'protein' | 'water' | 'fiber' | 'carbs' | 'fat'

export interface Achievement {
  id: string
  title: string
  detail: string
  emoji: string
  tone: AchievementTone
  /** 0–1. 1 = unlocked */
  progress: number
}

export const achievements: Achievement[] = [
  { id: 'streak-21', title: '21-day streak', detail: 'Logged 3 weeks straight', emoji: '🔥', tone: 'ember', progress: 1 },
  { id: 'rainbow', title: 'Eat the rainbow', detail: '30 plants in a week', emoji: '🌈', tone: 'fiber', progress: 1 },
  { id: 'protein', title: 'Protein pro', detail: 'Hit protein 7 days', emoji: '💪', tone: 'protein', progress: 1 },
  { id: 'hydration', title: 'Hydration hero', detail: '2.5 L for 14 days', emoji: '💧', tone: 'water', progress: 0.72 },
  { id: 'first-5', title: 'First 5 kg', detail: '3.6 of 5 kg', emoji: '🏔️', tone: 'fat', progress: 0.72 },
  { id: 'early', title: 'Early bird', detail: 'Breakfast before 8am ×10', emoji: '🌅', tone: 'carbs', progress: 0.4 },
]

export const connectedApps = [
  { id: 'health', name: 'Apple Health', detail: 'Steps, workouts, weight', connected: true },
  { id: 'strava', name: 'Strava', detail: 'Runs & rides', connected: true },
  { id: 'oura', name: 'Oura', detail: 'Sleep & readiness', connected: false },
]
