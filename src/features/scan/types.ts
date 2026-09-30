import type { ScanDetection } from '@/services/mockApi'

export type ScanMode = 'meal' | 'barcode' | 'label'

export type ScanPhase = 'live' | 'analyzing' | 'results'

/** A detection the user can tune before logging. */
export type DetectedItem = ScanDetection

export const scanModes: { value: ScanMode; label: string }[] = [
  { value: 'meal', label: 'Meal' },
  { value: 'barcode', label: 'Barcode' },
  { value: 'label', label: 'Label' },
]

export function parseScanMode(value: string | null): ScanMode {
  return value === 'barcode' || value === 'label' ? value : 'meal'
}

/** Frame geometry per mode — a plate is square, a barcode is a slot, a label is tall. */
export const frameFor: Record<ScanMode, { w: number; h: number; r: number }> = {
  meal: { w: 296, h: 296, r: 40 },
  barcode: { w: 304, h: 150, r: 26 },
  label: { w: 248, h: 332, r: 28 },
}
