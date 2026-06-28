'use client'
import type { MenopauseFormData } from '@/lib/types-menopause'
import { useFormContext } from 'react-hook-form'

export default function MStep6() {
  useFormContext<MenopauseFormData>()
  return (
    <div>
      <h2 className="text-lg font-semibold text-wine mb-6">Étape 6</h2>
      <p className="text-sm text-gray-400">Section en cours de construction…</p>
    </div>
  )
}
