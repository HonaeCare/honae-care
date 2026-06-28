'use client'
import { useFormContext } from 'react-hook-form'
import { FormField, CheckGroup } from '../../form/FormField'
import type { MenopauseFormData } from '@/lib/types-menopause'

export default function MStep7() {
  const { register, watch, setValue } = useFormContext<MenopauseFormData>()

  return (
    <div>
      <h2 className="text-lg font-semibold text-wine mb-6">Accompagnement &amp; documents</h2>

      <FormField label="Besoin(s) d'accompagnement chez Honae" hint="Facultatif">
        <CheckGroup
          options={[
            { value: 'sexologue', label: 'Sexologue' },
            { value: 'psychologue clinicien', label: 'Psychologue clinicien' },
            { value: 'yoga hormonal', label: 'Yoga hormonal / relaxation / massothérapie' },
            { value: 'cercle de parole', label: 'Cercle de parole' },
            { value: 'nutrition', label: 'Nutrition & hygiène de vie' },
            { value: 'médecine fonctionnelle', label: 'Médecine fonctionnelle' },
          ]}
          value={watch('step7.besoinsAccompagnement') ?? []}
          onChange={(v) => setValue('step7.besoinsAccompagnement', v)}
          columns={2}
        />
        <input className="field-input mt-2" placeholder="Autre besoin…" {...register('step7.besoinsAccompagnementAutre')} />
      </FormField>

      <FormField label="Documents & examens déjà disponibles" hint="À apporter si possible">
        <CheckGroup
          options={[
            { value: 'bilan hormonal', label: 'Bilan hormonal de base (FSH, LH, Estradiol, Progestérone…)' },
            { value: 'fonction thyroïdienne', label: 'Fonction thyroïdienne (TSH, T3 libre, T4 libre…)' },
            { value: 'irm pelvienne', label: 'IRM pelvienne / comptes rendus' },
            { value: 'bilan métabolique', label: 'Bilan métabolique et cardiovasculaire' },
            { value: 'ostéodensitométrie', label: 'Ostéodensitométrie (DEXA scan)' },
            { value: 'bilan gynécologique', label: 'Bilan gynécologique (frottis, échographie pelvienne…)' },
          ]}
          value={watch('step7.documentsApporter') ?? []}
          onChange={(v) => setValue('step7.documentsApporter', v)}
          columns={2}
        />
        <input className="field-input mt-2" placeholder="Autres documents…" {...register('step7.documentsApporterAutre')} />
      </FormField>

      <div className="mt-6 bg-rose/10 rounded-xl p-5 border border-rose/50 text-sm text-gray-600 leading-relaxed space-y-3">
        <p className="font-semibold text-wine text-xs uppercase tracking-widest">Notes utiles</p>
        <p>
          Essayez, si possible, de prendre rendez-vous pour le <strong>bilan intégratif complet en début de cycle, entre J2 et J5</strong> (pendant les règles si elles sont encore présentes).
        </p>
        <p>
          → Apporter tout <strong>résultat antérieur</strong> (analyses, imageries, comptes rendus) et nous l'envoyer en amont à l'adresse{' '}
          <a href="mailto:secretariat@honae-care.com" className="text-wine underline hover:text-wine-light">secretariat@honae-care.com</a>.
        </p>
        <p>
          → Prévenir en cas d'allergie à l'<strong>iode / latex</strong> ou de prise d'<strong>anticoagulants</strong>.
        </p>
      </div>
    </div>
  )
}
