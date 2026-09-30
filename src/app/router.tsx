import { createBrowserRouter, Navigate } from 'react-router'
import { CoachScreen } from '@/features/coach/CoachScreen'
import { InsightsScreen } from '@/features/insights/InsightsScreen'
import { FoodDetailScreen } from '@/features/log/FoodDetailScreen'
import { LogFoodScreen } from '@/features/log/LogFoodScreen'
import { OnboardingScreen } from '@/features/onboarding/OnboardingScreen'
import { ProfileScreen } from '@/features/profile/ProfileScreen'
import { RecipeDetailScreen } from '@/features/recipes/RecipeDetailScreen'
import { RecipesScreen } from '@/features/recipes/RecipesScreen'
import { ScanScreen } from '@/features/scan/ScanScreen'
import { TodayScreen } from '@/features/today/TodayScreen'
import { AppShell } from './AppShell'

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
