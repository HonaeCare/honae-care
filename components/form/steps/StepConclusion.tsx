'use client'
import { useFormContext } from 'react-hook-form'
import { FormField, CheckGroup } from '../FormField'
import type { FormData } from '@/lib/types'

export default function StepConclusion() {
  const { register, watch, setValue } = useFormContext<FormData>()

  return (
    <div>
      <h2 className="text-lg font-semibold text-wine mb-6">Conclusion & documents</h2>

      <FormField label="Besoins d'accompagnement souhaités chez Honae Care">
        <CheckGroup
          options={[
            { value: 'bilan intégratif', label: 'Bilan intégratif' },
            { value: 'sexologue', label: 'Sexologue' },
            { value: 'nutrition', label: 'Accompagnement nutritionnel' },
            { value: 'psychologue', label: 'Psychologue' },
            { value: 'ostéopathie', label: 'Ostéopathie' },
            { value: 'acuponcture', label: 'Acuponcture' },
            { value: 'cercle de parole', label: 'Cercle de parole' },
            { value: 'coordination', label: 'Coordination du parcours' },
            { value: 'autre', label: 'Autre' },
          ]}
          value={watch('step7.besoinsAccompagnement') ?? []}
          onChange={(v) => setValue('step7.besoinsAccompagnement', v)}
          columns={2}
        />
        {(watch('step7.besoinsAccompagnement') ?? []).includes('autre') && (
          <input className="field-input mt-2" placeholder="Préciser…" {...register('step7.besoinsAccompagnementAutre' as any)} />
        )}
      </FormField>

      <FormField label="Documents disponibles que vous pouvez apporter à la consultation">
        <CheckGroup
          options={[
            { value: 'prise de sang', label: 'Prise de sang récente' },
            { value: 'échographie-IRM', label: 'Échographie / IRM' },
            { value: 'HyFoSy-HSG', label: 'HyFoSy / HSG' },
            { value: 'comptes rendus PMA', label: 'Comptes rendus PMA' },
            { value: 'spermogramme', label: 'Spermogramme' },
            { value: 'autres', label: 'Autres documents' },
          ]}
          value={watch('step7.documentsApporter') ?? []}
          onChange={(v) => setValue('step7.documentsApporter', v)}
          columns={2}
        />
        {(watch('step7.documentsApporter') ?? []).includes('autres') && (
          <input className="field-input mt-2" placeholder="Préciser les documents…" {...register('step7.documentsApporterAutre' as any)} />
        )}
      </FormField>

      <div className="mt-6 bg-rose/10 rounded-xl p-5 border border-rose/50 text-sm text-gray-600 leading-relaxed space-y-3">
        <p className="font-semibold text-wine text-xs uppercase tracking-widest">Notes utiles</p>
        <p>
          Essayer, si possible, de prendre rendez-vous pour le <strong>bilan de fertilité en début de cycle en J1 et J6</strong> (pendant les règles), et pour l'<strong>HyFoSy en début de cycle</strong> (après les règles et avant l'ovulation).
        </p>
        <p>
          → Nous envoyer tout résultat antérieur (analyses, imageries, comptes rendus) en amont de votre premier rendez-vous à l'adresse{' '}
          <a href="mailto:secretariat@honae-care.com" className="text-wine underline hover:text-wine-light">
            secretariat@honae-care.com
          </a>.
        </p>
        <p>
          → Prévenir en cas d'allergie à l'<strong>iode / latex</strong> ou de prise d'<strong>anticoagulants</strong>.
        </p>
        <p>
          → Pour un <strong>spermogramme</strong>, respecter les consignes (abstinence 2–5 jours, absence de fièvre récente, etc.).
        </p>
      </div>
    </div>
  )
}
