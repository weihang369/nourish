import { type ComponentType, lazy } from 'react'
import { createBrowserRouter, Navigate } from 'react-router'
import { TodayScreen } from '@/features/today/TodayScreen'
import { AppShell } from './AppShell'

/**
 * Screens are code-split, then warmed in the background right after the
 * first paint, so push transitions never slide in an empty page.
 */
type ScreenModule = Promise<{ default: ComponentType }>

const loaders: Record<string, () => ScreenModule> = {
  welcome: () => import('@/features/onboarding/OnboardingScreen').then((m) => ({ default: m.OnboardingScreen })),
  log: () => import('@/features/log/LogFoodScreen').then((m) => ({ default: m.LogFoodScreen })),
  food: () => import('@/features/log/FoodDetailScreen').then((m) => ({ default: m.FoodDetailScreen })),
  scan: () => import('@/features/scan/ScanScreen').then((m) => ({ default: m.ScanScreen })),
  recipes: () => import('@/features/recipes/RecipesScreen').then((m) => ({ default: m.RecipesScreen })),
  recipe: () => import('@/features/recipes/RecipeDetailScreen').then((m) => ({ default: m.RecipeDetailScreen })),
  insights: () => import('@/features/insights/InsightsScreen').then((m) => ({ default: m.InsightsScreen })),
  coach: () => import('@/features/coach/CoachScreen').then((m) => ({ default: m.CoachScreen })),
  profile: () => import('@/features/profile/ProfileScreen').then((m) => ({ default: m.ProfileScreen })),
}

const OnboardingScreen = lazy(loaders.welcome)
const LogFoodScreen = lazy(loaders.log)
const FoodDetailScreen = lazy(loaders.food)
const ScanScreen = lazy(loaders.scan)
const RecipesScreen = lazy(loaders.recipes)
const RecipeDetailScreen = lazy(loaders.recipe)
const InsightsScreen = lazy(loaders.insights)
const CoachScreen = lazy(loaders.coach)
const ProfileScreen = lazy(loaders.profile)

export function prefetchScreens() {
  const run = () => Object.values(loaders).forEach((load) => void load())
  if ('requestIdleCallback' in window) window.requestIdleCallback(run, { timeout: 1500 })
  else setTimeout(run, 600)
}

export const router = createBrowserRouter([
  {
    element: <AppShell />,
    children: [
      { path: '/', element: <TodayScreen /> },
      { path: '/welcome', element: <OnboardingScreen /> },
      { path: '/log', element: <LogFoodScreen /> },
      { path: '/food/:foodId', element: <FoodDetailScreen /> },
      { path: '/scan', element: <ScanScreen /> },
      { path: '/recipes', element: <RecipesScreen /> },
      { path: '/recipes/:recipeId', element: <RecipeDetailScreen /> },
      { path: '/insights', element: <InsightsScreen /> },
      { path: '/coach', element: <CoachScreen /> },
      { path: '/profile', element: <ProfileScreen /> },
      { path: '*', element: <Navigate to="/" replace /> },
    ],
  },
])
