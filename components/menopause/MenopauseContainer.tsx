'use client'
import { useState, useEffect, useCallback, useRef } from 'react'
import { useForm, FormProvider } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import MenopauseProgress from './MenopauseProgress'
import MStep1 from './steps/MStep1'
import MStep2 from './steps/MStep2'
import MStep3 from './steps/MStep3'
import MStep4 from './steps/MStep4'
import MStep5 from './steps/MStep5'
import MStep6 from './steps/MStep6'
import MStep7 from './steps/MStep7'
import MStep8 from './steps/MStep8'
import type { MenopauseFormData } from '@/lib/types-menopause'

const LS_KEY = 'honae_menopause_draft'
const STEPS = [MStep1, MStep2, MStep3, MStep4, MStep5, MStep6, MStep7, MStep8]

export default function MenopauseContainer() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const startTime = useRef<number>(Date.now())
  const honeypotRef = useRef<string>('')

  const methods = useForm<MenopauseFormData>({
    mode: 'onBlur',
    defaultValues: {
      step1: { dateFormulaire: new Date().toISOString().split('T')[0], preferenceContact: [] },
      step8: { dateSignature: new Date().toLocaleDateString('fr-BE', { day: '2-digit', month: '2-digit', year: 'numeric' }) },
    },
  })
  const { watch, reset, handleSubmit } = methods
  const totalSteps = STEPS.length

  useEffect(() => {
    try {
      const saved = localStorage.getItem(LS_KEY)
      if (saved) reset(JSON.parse(saved))
    } catch { /* ignore */ }
  }, [reset])

  useEffect(() => {
    const sub = watch((data) => {
      try { localStorage.setItem(LS_KEY, JSON.stringify(data)) } catch { /* ignore */ }
    })
    return () => sub.unsubscribe()
  }, [watch])

  useEffect(() => {
    const clear = () => { try { localStorage.removeItem(LS_KEY) } catch { /* ignore */ } }
    window.addEventListener('beforeunload', clear)
    return () => window.removeEventListener('beforeunload', clear)
  }, [])

  const StepComponent = STEPS[currentStep - 1]

  const scrollTop = () => {
    window.scrollTo(0, 0); document.documentElement.scrollTop = 0; document.body.scrollTop = 0
  }

  const scrollToFirstError = () => {
    setTimeout(() => {
      const el = document.querySelector('.field-error, .text-red-500')
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }, 80)
  }

  // Champs texte obligatoires par étape
  const STEP_TEXT_FIELDS: Record<number, string[]> = {
    1: ['step1.prenom', 'step1.nom', 'step1.dateNaissance', 'step1.adresse', 'step1.telephone', 'step1.email', 'step1.profession'],
    8: ['step8.signature', 'step8.dateSignature'],
  }

  const validateStep = useCallback(async (step: number): Promise<boolean> => {
    const textFields = STEP_TEXT_FIELDS[step] ?? []
    const textValid = textFields.length > 0 ? await methods.trigger(textFields as any) : true

    let radioValid = true
    if (step === 1) {
      const v = methods.getValues()
      if (!v.step1?.situationFamiliale) {
        methods.setError('step1.situationFamiliale' as any, { type: 'required', message: 'Requis' })
        radioValid = false
      }
      if (!v.step1?.motifPrincipal) {
        methods.setError('step1.motifPrincipal' as any, { type: 'required', message: 'Requis' })
        radioValid = false
      }
    }
    return textValid && radioValid
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [methods])

  const next = useCallback(async () => {
    if (await validateStep(currentStep)) {
      setCurrentStep((s) => Math.min(s + 1, totalSteps))
      scrollTop()
    } else {
      scrollToFirstError()
    }
  }, [validateStep, currentStep, totalSteps])

  const prev = useCallback(() => {
    setCurrentStep((s) => Math.max(s - 1, 1)); scrollTop()
  }, [])

  const goToStep = useCallback(async (target: number) => {
    if (target <= currentStep) { setCurrentStep(target); scrollTop(); return }
    for (let step = currentStep; step < target; step++) {
      if (!(await validateStep(step))) { setCurrentStep(step); scrollToFirstError(); return }
    }
    setCurrentStep(target); scrollTop()
  }, [currentStep, validateStep])

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onValidationError = useCallback((errs: any) => {
    if (errs?.step8) setCurrentStep(totalSteps)
    setError('Certains champs obligatoires sont manquants. Vérifiez les champs surlignés en rouge.')
    scrollToFirstError()
  }, [totalSteps])

  const onSubmit = async (data: MenopauseFormData) => {
    setSubmitting(true)
    setError(null)
    try {
      const elapsed = Date.now() - startTime.current
      const res = await fetch('/api/submit-menopause', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Form-Elapsed': String(elapsed),
          'X-Form-Hp': honeypotRef.current,
        },
        body: JSON.stringify(data),
      })
      if (!res.ok) {
        const msg = await res.text()
        throw new Error(msg || 'Erreur lors de la soumission')
      }
      await res.json()
      try { sessionStorage.setItem('honae_menopause_draft_final', JSON.stringify(data)) } catch { /* ignore */ }
      localStorage.removeItem(LS_KEY)
      router.push('/anamnese-menopause/confirmation')
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Une erreur est survenue. Veuillez réessayer.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-ecru flex items-start justify-center py-10 px-4">
      <div className="w-full max-w-2xl">
        <div className="bg-white rounded-2xl shadow-sm border border-rose/40 p-6 sm:p-10">
          <MenopauseProgress currentStep={currentStep} totalSteps={totalSteps} onStepClick={goToStep} />

          <FormProvider {...methods}>
            <form
              onSubmit={(e) => {
                methods.clearErrors()
                handleSubmit(onSubmit, (errs) => onValidationError(errs))(e)
              }}
              noValidate
            >
              <div aria-hidden="true" style={{ position: 'absolute', left: '-9999px', opacity: 0, pointerEvents: 'none' }}>
                <input type="text" name="_hp_website" autoComplete="off" tabIndex={-1}
                  onChange={(e) => { honeypotRef.current = e.target.value }} />
              </div>

              <StepComponent />

              {error && (
                <div className="mt-4 p-3 bg-red-50 border border-red-100 rounded-lg text-sm text-red-600">
                  {error}
                </div>
              )}

              <div className="flex justify-between mt-8 pt-4 border-t border-gray-100">
                <button type="button" onClick={prev} disabled={currentStep === 1}
                  className="btn-secondary disabled:opacity-30 disabled:cursor-not-allowed">
                  ← Précédent
                </button>
                {currentStep < totalSteps ? (
                  <button type="button" onClick={next} className="btn-primary">Suivant →</button>
                ) : (
                  <button type="submit" disabled={submitting} className="btn-primary">
                    {submitting ? 'Envoi en cours…' : 'Soumettre le formulaire'}
                  </button>
                )}
              </div>
            </form>
          </FormProvider>
        </div>

        <p className="text-center text-xs text-gray-400 mt-5 tracking-wide">
          Honae Care · Données de santé protégées (RGPD) · Chiffrement AES-256
        </p>
      </div>
    </div>
  )
}
