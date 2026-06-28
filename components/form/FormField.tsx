'use client'
import React, { useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { useT } from '@/lib/i18n'

// Efface l'erreur d'un champ piloté manuellement (setError) dès que
// l'utilisateur y répond — sinon l'erreur fantôme bloque la soumission
function useClearFieldError(name?: string) {
  const ctx = useFormContext()
  return () => {
    if (name && ctx) ctx.clearErrors(name as never)
  }
}

interface Props {
  label: React.ReactNode
  required?: boolean
  error?: string
  children: React.ReactNode
  hint?: string
}

export function FormField({ label, required, error, children, hint }: Props) {
  return (
    <div className="mb-5">
      <label className={`field-label${required ? ' field-required' : ''}`}>{label}</label>
      {React.isValidElement(children)
        ? React.cloneElement(children as React.ReactElement<{ className?: string }>, {
            className: [
              (children.props as { className?: string }).className ?? '',
              error ? 'border-red-300 focus:ring-red-200 focus:border-red-400' : '',
            ].join(' ').trim(),
          })
        : children}
      {hint && !error && <p className="text-xs text-gray-400 mt-1 italic">{hint}</p>}
      {error && <p className="field-error">{error}</p>}
    </div>
  )
}

interface RadioGroupProps {
  name: string
  options: { value: string; label: string }[]
  value?: string
  onChange: (val: string) => void
  horizontal?: boolean
}

export function RadioGroup({ name, options, value, onChange, horizontal }: RadioGroupProps) {
  const clearError = useClearFieldError(name)
  return (
    <div className={`flex ${horizontal ? 'flex-row flex-wrap gap-4' : 'flex-col gap-2'} mt-1.5`}>
      {options.map((opt) => (
        <label key={opt.value} className="radio-option text-sm text-gray-700">
          <input
            type="radio"
            name={name}
            value={opt.value}
            checked={value === opt.value}
            onChange={() => { clearError(); onChange(opt.value) }}
          />
          {opt.label}
        </label>
      ))}
    </div>
  )
}

interface CheckGroupProps {
  name?: string
  options: { value: string; label: string }[]
  value?: string[]
  onChange: (vals: string[]) => void
  columns?: number
}

export function CheckGroup({ name, options, value = [], onChange, columns = 1 }: CheckGroupProps) {
  const clearError = useClearFieldError(name)
  const toggle = (v: string) => {
    clearError()
    onChange(value.includes(v) ? value.filter((x) => x !== v) : [...value, v])
  }
  return (
    <div
      className="grid gap-2 mt-1.5"
      style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
    >
      {options.map((opt) => (
        <label key={opt.value} className="check-option text-sm text-gray-700">
          <input
            type="checkbox"
            checked={value.includes(opt.value)}
            onChange={() => toggle(opt.value)}
          />
          {opt.label}
        </label>
      ))}
    </div>
  )
}

interface SliderProps {
  min?: number
  max?: number
  value?: number
  onChange: (val: number) => void
  showValue?: boolean
}

export function SliderField({ min = 0, max = 10, value = 5, onChange, showValue = true }: SliderProps) {
  return (
    <div className="flex items-center gap-3 mt-2">
      <span className="text-xs text-gray-400 w-4 text-center">{min}</span>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="slider-input flex-1"
      />
      <span className="text-xs text-gray-400 w-4 text-center">{max}</span>
      {showValue && (
        <span className="ml-1 w-9 text-center text-sm font-bold text-wine bg-rose/40 rounded-md px-1 py-0.5">
          {value}
        </span>
      )}
    </div>
  )
}

const MOIS_DICT = [
  { fr: 'Janvier', en: 'January', nl: 'Januari' },
  { fr: 'Février', en: 'February', nl: 'Februari' },
  { fr: 'Mars', en: 'March', nl: 'Maart' },
  { fr: 'Avril', en: 'April', nl: 'April' },
  { fr: 'Mai', en: 'May', nl: 'Mei' },
  { fr: 'Juin', en: 'June', nl: 'Juni' },
  { fr: 'Juillet', en: 'July', nl: 'Juli' },
  { fr: 'Août', en: 'August', nl: 'Augustus' },
  { fr: 'Septembre', en: 'September', nl: 'September' },
  { fr: 'Octobre', en: 'October', nl: 'Oktober' },
  { fr: 'Novembre', en: 'November', nl: 'November' },
  { fr: 'Décembre', en: 'December', nl: 'December' },
]
const CURRENT_YEAR = new Date().getFullYear()

// Sélecteur de date contrôlé : reflète toujours la valeur réelle du formulaire
// (brouillon restauré, retour sur une étape) et n'écrit une date qu'une fois
// les trois champs renseignés — sinon le champ reste vide (erreur « Requis »).
export function DateSelectInput({ value, onChange }: { value?: string; onChange: (val: string) => void }) {
  const t = useT()
  const [yy, mm, dd] = /^\d{4}-\d{2}-\d{2}$/.test(value ?? '')
    ? (value as string).split('-')
    : ['', '', '']
  const [parts, setParts] = useState({ d: dd, m: mm, y: yy })

  const update = (key: 'd' | 'm' | 'y', val: string) => {
    const next = { ...parts, [key]: val }
    setParts(next)
    onChange(next.d && next.m && next.y ? `${next.y}-${next.m}-${next.d}` : '')
  }

  return (
    <div className="flex gap-2 mt-1">
      <select className="field-input flex-1" value={parts.d} onChange={e => update('d', e.target.value)}>
        <option value="" disabled>{t({ fr: 'Jour', en: 'Day', nl: 'Dag' })}</option>
        {Array.from({ length: 31 }, (_, i) => i + 1).map(d => (
          <option key={d} value={String(d).padStart(2, '0')}>{d}</option>
        ))}
      </select>
      <select className="field-input flex-1" value={parts.m} onChange={e => update('m', e.target.value)}>
        <option value="" disabled>{t({ fr: 'Mois', en: 'Month', nl: 'Maand' })}</option>
        {MOIS_DICT.map((m, i) => (
          <option key={i} value={String(i + 1).padStart(2, '0')}>{t(m)}</option>
        ))}
      </select>
      <select className="field-input flex-[1.4]" value={parts.y} onChange={e => update('y', e.target.value)}>
        <option value="" disabled>{t({ fr: 'Année', en: 'Year', nl: 'Jaar' })}</option>
        {Array.from({ length: 100 }, (_, i) => CURRENT_YEAR - 10 - i).map(y => (
          <option key={y} value={String(y)}>{y}</option>
        ))}
      </select>
    </div>
  )
}
