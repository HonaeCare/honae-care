'use client'
import { useT } from '@/lib/i18n'
import type { Dict } from '@/lib/i18n'
import LanguageSwitcher from './LanguageSwitcher'

const STEP_LABELS: Dict[] = [
  { fr: 'Informations', en: 'Information', nl: 'Informatie' },
  { fr: 'Antécédents', en: 'History', nl: 'Voorgeschiedenis' },
  { fr: 'Cycles', en: 'Cycles', nl: 'Cyclus' },
  { fr: 'Obstétrique', en: 'Obstetrics', nl: 'Verloskunde' },
  { fr: 'Masculin', en: 'Male', nl: 'Mannelijk' },
  { fr: 'Mode de vie', en: 'Lifestyle', nl: 'Levensstijl' },
  { fr: 'Bien-être', en: 'Well-being', nl: 'Welzijn' },
  { fr: 'Conclusion', en: 'Conclusion', nl: 'Conclusie' },
  { fr: 'Consentement', en: 'Consent', nl: 'Toestemming' },
]

interface Props {
  currentStep: number
  totalSteps: number
  showStep5: boolean
  onStepClick?: (step: number) => void
}

export default function FormProgress({ currentStep, totalSteps, showStep5, onStepClick }: Props) {
  const t = useT()
  const labelsRaw = showStep5
    ? STEP_LABELS
    : STEP_LABELS.filter((_, i) => i !== 4)
  const labels = labelsRaw.map((l) => t(l))

  const pct = Math.round(((currentStep - 1) / (totalSteps - 1)) * 100)

  return (
    <div className="mb-8 relative">
      {/* Sélecteur de langue : en ligne sur mobile (évite le chevauchement),
          flottant en haut à droite sur desktop (ne décale pas le logo) */}
      <div className="flex justify-end mb-2 sm:mb-0 sm:absolute sm:top-0 sm:right-0 sm:z-10">
        <LanguageSwitcher />
      </div>

      {/* Logo + en-tête */}
      <div className="text-center mb-7">
        <img
          src="/Honae_Lie De Vin.png"
          alt="Honae"
          className="h-10 w-auto mx-auto mb-3"
        />
        <p className="text-sm font-semibold tracking-[0.25em] text-wine uppercase">
          {t({ fr: 'Maison de fertilité', en: 'Fertility House', nl: 'Fertiliteitshuis' })}
        </p>
      </div>

      {/* Étape + label */}
      <div className="flex justify-between items-center mb-2">
        <span className="text-xs font-bold text-wine tracking-wide uppercase">
          {t({ fr: 'Étape', en: 'Step', nl: 'Stap' })} {currentStep} / {totalSteps}
        </span>
        <span className="text-xs text-gray-400 font-medium">
          {labels[currentStep - 1]}
        </span>
      </div>

      {/* Barre de progression */}
      <div className="w-full bg-rose/40 rounded-full h-1.5">
        <div
          className="bg-wine h-1.5 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>

      {/* Points de navigation — desktop seulement */}
      <div className="hidden sm:flex justify-between mt-3">
        {labels.map((label, i) => {
          const stepNum = i + 1
          const done = stepNum < currentStep
          const active = stepNum === currentStep
          const clickable = onStepClick && stepNum !== currentStep
          return (
            <div
              key={i}
              className={`flex flex-col items-center gap-1 ${clickable ? 'cursor-pointer group' : ''}`}
              style={{ width: `${100 / labels.length}%` }}
              onClick={() => clickable && onStepClick(stepNum)}
              title={clickable ? `${t({ fr: 'Aller à', en: 'Go to', nl: 'Ga naar' })} : ${label}` : undefined}
            >
              <div
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  done
                    ? 'bg-wine group-hover:ring-2 group-hover:ring-wine/30 group-hover:ring-offset-1'
                    : active
                    ? 'bg-wine ring-2 ring-wine/20 ring-offset-1'
                    : 'bg-rose-dark/40 group-hover:bg-rose-dark/70'
                }`}
              />
              <span
                className={`text-[9px] text-center leading-tight transition-colors ${
                  active ? 'text-wine font-bold' : done ? 'text-gray-400 group-hover:text-wine' : 'text-gray-300 group-hover:text-gray-400'
                }`}
              >
                {label}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
