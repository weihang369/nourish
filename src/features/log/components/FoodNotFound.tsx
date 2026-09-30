import { Search } from 'lucide-react'
import { useNavigate } from 'react-router'
import { Screen, TopBar } from '@/components/layout'
import { Button } from '@/components/ui'
import { useStatusTone } from '@/store/useChromeStore'
import { EmptyState } from './EmptyState'

export function FoodNotFound() {
  useStatusTone('dark')
  const navigate = useNavigate()

  return (
    <Screen>
      <TopBar fallback="/log" />
      <div className="grid min-h-[70%] place-items-center">
        <EmptyState
          emoji="🍽️"
          title="We couldn’t find that food"
          body="It may have been renamed or removed. Search the library and you’ll likely spot it."
        >
          <Button leading={<Search className="size-4" />} onClick={() => navigate('/log', { replace: true })}>
            Search foods
          </Button>
        </EmptyState>
      </div>
    </Screen>
  )
}
