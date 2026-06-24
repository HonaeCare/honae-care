'use client'
import { useFormContext } from 'react-hook-form'
import { FormField, RadioGroup, CheckGroup } from '../FormField'
import type { FormData } from '@/lib/types'

const OUI_NON = [{ value: 'oui', label: 'Oui' }, { value: 'non', label: 'Non' }]

export default function Step4() {
  const { register, watch, setValue, formState: { errors } } = useFormContext<FormData>()
  const nbGrossesses = watch('step4.nombreGrossesses')
  const allaitement = watch('step4.allaitement')

  return (
    <div>
      <h2 className="text-lg font-semibold text-wine mb-6">Examens & antécédents obstétricaux</h2>

      <p className="section-title">Antécédents obstétricaux</p>

      <FormField label="Nombre total de grossesses" required hint="Indiquer 0 si aucune" error={(errors.step4 as any)?.nombreGrossesses?.message}>
        <input
          type="number"
          min={0}
          className="field-input w-24"
          {...register('step4.nombreGrossesses', {
            valueAsNumber: true,
            validate: (v) => (v !== null && v !== undefined && !isNaN(v as number)) || 'Requis',
          })}
        />
      </FormField>

      {(nbGrossesses ?? 0) > 0 && (
        <FormField label="Détail de chaque grossesse">
          <textarea
            rows={5}
            className="field-input"
            placeholder="Pour chaque grossesse : année, délai de conception, traitement éventuel, évolution, terme, poids de naissance, complications…"
            {...register('step4.detailGrossesses')}
          />
        </FormField>
      )}

      <FormField label="Allaitement">
        <RadioGroup
          name="step4.allaitement"
          options={OUI_NON}
          value={allaitement}
          onChange={(v) => setValue('step4.allaitement', v)}
          horizontal
        />
        {allaitement === 'oui' && (
          <input className="field-input mt-2" placeholder="Durée (ex : 6 mois, 1 an…)" {...register('step4.dureeAllaitement')} />
        )}
      </FormField>

      <div className="grid sm:grid-cols-2 gap-4">
        <FormField label="Grossesses arrêtées">
          <input type="number" min={0} className="field-input" {...register('step4.nombreFaussesCouches', { valueAsNumber: true })} />
        </FormField>
        <FormField label="Âge gestationnel des grossesses arrêtées" hint="Ex : 6SA, 10SA…">
          <input className="field-input" {...register('step4.ageGestFC')} />
        </FormField>
      </div>

      <FormField label="Analyses réalisées suite aux grossesses arrêtées">
        <input className="field-input" placeholder="Caryotype, anatomopathologie, bilan thrombophilie…" {...register('step4.analysesFC')} />
      </FormField>

      <FormField label="Complications obstétricales">
        <textarea rows={3} className="field-input" placeholder="Pré-éclampsie, RCIU, accouchement prématuré, hémorragie post-partum…" {...register('step4.complicationsObstetricales')} />
      </FormField>
    </div>
  )
}
