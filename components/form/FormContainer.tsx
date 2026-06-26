'use client'
import { useState, useEffect, useCallback, useRef } from 'react'
import { useForm, FormProvider } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import FormProgress from './FormProgress'
import Step1 from './steps/Step1'
import Step2 from './steps/Step2'
import Step3 from './steps/Step3'
import Step4 from './steps/Step4'
import Step5 from './steps/Step5'
import Step6 from './steps/Step6'
import Step7 from './steps/Step7'
import StepConclusion from './steps/StepConclusion'
import Step8 from './steps/Step8'
import type { FormData } from '@/lib/types'

const LS_KEY = 'honae_form_draft'

function buildSteps(showStep5: boolean) {
  const all = [Step1, Step2, Step3, Step4, Step5, Step6, Step7, StepConclusion, Step8]
  return showStep5 ? all : all.filter((_, i) => i !== 4)
}

export default function FormContainer() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Anti-bot : timestamp de chargement du formulaire
  const startTime = useRef<number>(Date.now())
  const honeypotRef = useRef<string>('')

  const methods = useForm<FormData>({
    mode: 'onBlur',
    defaultValues: {
      step1: { dateFormulaire: new Date().toISOString().split('T')[0], preferenceContact: [] },
      step8: { dateSignature: new Date().toLocaleDateString('fr-BE', { day: '2-digit', month: '2-digit', year: 'numeric' }) },
    },
  })
  const { watch, reset, handleSubmit } = methods

  // Determine whether to show step 5 (masculine fertility)
  const showStep5 = true

  const steps = buildSteps(showStep5)
  const totalSteps = steps.length

  // Load draft from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(LS_KEY)
      if (saved) {
        const parsed = JSON.parse(saved)
        reset(parsed)
      }
    } catch { /* ignore */ }
  }, [reset])

  // Auto-save to localStorage
  useEffect(() => {
    const sub = watch((data) => {
      try { localStorage.setItem(LS_KEY, JSON.stringify(data)) } catch { /* ignore */ }
    })
    return () => sub.unsubscribe()
  }, [watch])

  // Efface le brouillon à la fermeture de l'onglet (données médicales)
  useEffect(() => {
    const clear = () => { try { localStorage.removeItem(LS_KEY) } catch { /* ignore */ } }
    window.addEventListener('beforeunload', clear)
    return () => window.removeEventListener('beforeunload', clear)
  }, [])

  const StepComponent = steps[currentStep - 1]

  const scrollToFirstError = () => {
    setTimeout(() => {
      const el = document.querySelector('.field-error, .text-red-500')
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }, 80)
  }

  // Champs texte obligatoires par étape (ceux enregistrés via register())
  const STEP_TEXT_FIELDS: Record<string, string[]> = {
    step4: ['step4.nombreGrossesses'],
    step1: [
      'step1.dateFormulaire', 'step1.prenom', 'step1.nom',
      'step1.dateNaissance', 'step1.adresse', 'step1.telephone',
      'step1.email', 'step1.profession',
    ],
    step8: ['step8.signature', 'step8.dateSignature'],
  }

  // Clé du formulaire correspondant à l'étape affichée
  const getStepKey = (step: number) => {
    if (!showStep5 && step >= 5) return `step${step + 1}`
    return `step${step}`
  }

  // Valide l'étape donnée (champs texte + champs radio/checkbox obligatoires)
  const validateStep = useCallback(async (step: number): Promise<boolean> => {
    const stepKey = getStepKey(step)

    // Champs texte de base + champs partenaire si "en couple"
    const baseFields = STEP_TEXT_FIELDS[stepKey] ?? []
    const isEnCouple = methods.getValues('step1.situationFamiliale') === 'en couple'
    const textFields = (stepKey === 'step1' && isEnCouple)
      ? [...baseFields, 'step1.partenairePrenom', 'step1.partenaireNom']
      : baseFields

    // 1. Valider les champs texte enregistrés
    const textValid = textFields.length > 0
      ? await methods.trigger(textFields as any)
      : true

    // 2. Valider manuellement les champs radio/checkbox obligatoires de l'étape 1
    let radioValid = true
    if (stepKey === 'step1') {
      const v = methods.getValues()
      if (!v.step1?.completePar) {
        methods.setError('step1.completePar' as any, { type: 'required', message: 'Requis' })
        radioValid = false
      }
      if (!v.step1?.situationFamiliale) {
        methods.setError('step1.situationFamiliale' as any, { type: 'required', message: 'Requis' })
        radioValid = false
      }
      if (!v.step1?.preferenceContact?.length) {
        methods.setError('step1.preferenceContact' as any, { type: 'required', message: 'Requis' })
        radioValid = false
      }
      if (!v.step1?.langue) {
        methods.setError('step1.langue' as any, { type: 'required', message: 'Requis' })
        radioValid = false
      }
      // Sexe du partenaire obligatoire si en couple
      if (isEnCouple && !v.step1?.partenaireSexe) {
        methods.setError('step1.partenaireSexe' as any, { type: 'required', message: 'Requis' })
        radioValid = false
      }
    }

    if (stepKey === 'step3') {
      const v = methods.getValues()
      if (!v.step3?.typeContraception?.length) {
        methods.setError('step3.typeContraception' as any, { type: 'required', message: 'Requis' })
        radioValid = false
      }
    }

    if (stepKey === 'step2') {
      const v = methods.getValues()
      if (!v.step2?.motifPrincipal) {
        methods.setError('step2.motifPrincipal' as any, { type: 'required', message: 'Requis' })
        radioValid = false
      }
      if (!v.step2?.bilanFertilite) {
        methods.setError('step2.bilanFertilite' as any, { type: 'required', message: 'Requis' })
        radioValid = false
      }
      if (v.step2?.motifPrincipal !== 'préservation' && !v.step2?.souhaitPreservation) {
        methods.setError('step2.souhaitPreservation' as any, { type: 'required', message: 'Requis' })
        radioValid = false
      }
      if (!v.step2?.parcoursPMAFait) {
        methods.setError('step2.parcoursPMAFait' as any, { type: 'required', message: 'Requis' })
        radioValid = false
      }
    }

    if (stepKey === 'step4') {
      // Filet de sécurité : si l'étape n'a jamais été affichée, le champ n'est
      // pas enregistré et trigger() passe — on vérifie la valeur directement
      const v = methods.getValues()
      const nb = (v.step4 as any)?.nombreGrossesses
      if (nb === undefined || nb === null || (typeof nb === 'number' && isNaN(nb)) || nb === '') {
        methods.setError('step4.nombreGrossesses' as any, { type: 'required', message: 'Requis' })
        radioValid = false
      }
    }

    return textValid && radioValid
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [methods, showStep5])

  const next = useCallback(async () => {
    if (await validateStep(currentStep)) {
      setCurrentStep((s) => Math.min(s + 1, totalSteps))
      window.scrollTo(0, 0); document.documentElement.scrollTop = 0; document.body.scrollTop = 0
    } else {
      scrollToFirstError()
    }
  }, [validateStep, currentStep, totalSteps])

  const prev = useCallback(() => {
    setCurrentStep((s) => Math.max(s - 1, 1))
    window.scrollTo(0, 0); document.documentElement.scrollTop = 0; document.body.scrollTop = 0
  }, [])

  // Navigation via la timeline : reculer est libre, avancer valide chaque
  // étape intermédiaire et s'arrête à la première étape incomplète
  const goToStep = useCallback(async (target: number) => {
    if (target <= currentStep) {
      setCurrentStep(target)
      window.scrollTo(0, 0); document.documentElement.scrollTop = 0; document.body.scrollTop = 0
      return
    }
    for (let step = currentStep; step < target; step++) {
      if (!(await validateStep(step))) {
        setCurrentStep(step)
        scrollToFirstError()
        return
      }
    }
    setCurrentStep(target)
    window.scrollTo(0, 0); document.documentElement.scrollTop = 0; document.body.scrollTop = 0
  }, [currentStep, validateStep])

  // Étape d'affichage correspondant à un nom de champ (ex : 'step1.email' → 1).
  // Seuls les champs porteurs de règles comptent ici (step1, step4, step8) ;
  // ils sont tous affichés sur l'étape de leur clé. step8 = dernière étape.
  const stepForField = useCallback((field: string): number | null => {
    const m = field.match(/^step(\d)\./)
    if (!m) return null
    const n = parseInt(m[1], 10)
    if (n === 8) return totalSteps
    if (!showStep5 && n > 5) return n - 1
    return n
  }, [totalSteps, showStep5])

  // Appelé par react-hook-form quand la validation échoue au submit
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onValidationError = useCallback((errs: any) => {
    const flatten = (obj: any, prefix = ''): Record<string, string> =>
      Object.entries(obj ?? {}).reduce((acc, [k, v]: [string, any]) => {
        const key = prefix ? `${prefix}.${k}` : k
        // Une erreur de champ a toujours un `type` (required, minLength…) ;
        // le message peut être vide si la règle est `required: true`
        if (v?.type || v?.message) acc[key] = v.message || String(v.type)
        else if (typeof v === 'object' && v !== null && !v.ref) Object.assign(acc, flatten(v, key))
        return acc
      }, {} as Record<string, string>)
    const fields = Object.keys(flatten(errs))
    if (process.env.NODE_ENV === 'development') {
      console.warn('[form] Champs en erreur:', flatten(errs))
    }

    // Si l'erreur est sur une étape précédente, y ramener l'utilisateur —
    // sinon le bandeau s'affiche sans aucun champ rouge visible
    const errorStep = fields.map(stepForField).find((s): s is number => s !== null)
    if (errorStep && errorStep !== currentStep) {
      setCurrentStep(errorStep)
      setError(`Certains champs obligatoires sont manquants à l'étape ${errorStep}. Vérifiez les champs surlignés en rouge.`)
    } else {
      setError('Certains champs obligatoires sont manquants. Vérifiez les champs surlignés en rouge.')
    }
    scrollToFirstError()
  }, [currentStep, stepForField])

  const onSubmit = async (data: FormData) => {
    setSubmitting(true)
    setError(null)
    try {
      const elapsed = Date.now() - startTime.current
      const payload = { ...data, showStep5 }
      const res = await fetch('/api/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Form-Elapsed': String(elapsed),
          'X-Form-Hp': honeypotRef.current,
        },
        body: JSON.stringify(payload),
      })
      if (!res.ok) {
        const msg = await res.text()
        throw new Error(msg || 'Erreur lors de la soumission')
      }
      await res.json()
      // sessionStorage : effacé à la fermeture de l'onglet — les données médicales
      // ne doivent pas persister dans le navigateur (ordinateur partagé)
      try { sessionStorage.setItem('honae_form_draft_final', JSON.stringify(payload)) } catch { /* ignore */ }
      localStorage.removeItem(LS_KEY)
      router.push('/form/confirmation')
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
          <FormProgress
            currentStep={currentStep}
            totalSteps={totalSteps}
            showStep5={showStep5}
            onStepClick={goToStep}
          />

          <FormProvider {...methods}>
            <form
              onSubmit={(e) => {
                // Purge les erreurs manuelles résiduelles (champs corrigés depuis) —
                // handleSubmit re-valide toutes les règles des champs enregistrés
                methods.clearErrors()
                handleSubmit(onSubmit, (errs) => onValidationError(errs))(e)
              }}
              noValidate
            >
              {/* Champ honeypot — invisible pour les humains, les bots le remplissent */}
              <div aria-hidden="true" style={{ position: 'absolute', left: '-9999px', opacity: 0, pointerEvents: 'none' }}>
                <input
                  type="text"
                  name="_hp_website"
                  autoComplete="off"
                  tabIndex={-1}
                  onChange={(e) => {
                    honeypotRef.current = e.target.value
                  }}
                />
              </div>

              <StepComponent />

              {error && (
                <div className="mt-4 p-3 bg-red-50 border border-red-100 rounded-lg text-sm text-red-600">
                  {error}
                </div>
              )}

              <div className="flex justify-between mt-8 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={prev}
                  disabled={currentStep === 1}
                  className="btn-secondary disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  ← Précédent
                </button>

                {currentStep < totalSteps ? (
                  <button type="button" onClick={next} className="btn-primary">
                    Suivant →
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={submitting}
                    className="btn-primary"
                  >
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
