'use client'
import { useFormContext } from 'react-hook-form'
import { FormField, RadioGroup, CheckGroup } from '../FormField'
import type { FormData } from '@/lib/types'

const OUI_NON = [{ value: 'oui', label: 'Oui' }, { value: 'non', label: 'Non' }]

export default function Step5() {
  const { register, watch, setValue } = useFormContext<FormData>()

  return (
    <div>
      <h2 className="text-lg font-semibold text-wine mb-6">Fertilité masculine</h2>
      <p className="text-sm text-gray-500 mb-6 bg-wine/5 rounded-lg p-3 border border-wine/10">
        Cette section concerne le/la partenaire masculin ou le patient lorsque c&apos;est lui qui complète le formulaire.
      </p>

      <FormField label="Antécédents urogénitaux">
        <CheckGroup
          options={[
            { value: 'cryptorchidie', label: 'Cryptorchidie' },
            { value: 'varicocèle', label: 'Varicocèle' },
            { value: 'torsion testiculaire', label: 'Torsion testiculaire' },
            { value: 'hernie', label: 'Hernie inguinale' },
            { value: 'oreillon-orchite', label: 'Oreillons / Orchite' },
            { value: 'infections urogénitales', label: 'Infections urogénitales' },
            { value: 'traumatismes', label: 'Traumatismes' },
            { value: 'pathologie prostatique', label: 'Pathologie prostatique' },
            { value: 'endocrinopathie', label: 'Endocrinopathie' },
          ]}
          value={watch('step5.antecedentsMasculins') ?? []}
          onChange={(v) => setValue('step5.antecedentsMasculins', v)}
          columns={2}
        />
      </FormField>

      <FormField label="Chirurgies">
        <input className="field-input" placeholder="Type, date…" {...register('step5.chirurgiesMasculins')} />
      </FormField>

      <FormField label="Traitements en cours" hint="Ex : finastéride, testostérone / anabolisants, anti-HTA, ISRS, etc.">
        <input className="field-input" {...register('step5.traitementsMasculins')} />
      </FormField>

      <FormField label="Troubles de la fonction sexuelle">
        <CheckGroup
          options={[
            { value: 'troubles érectiles', label: 'Troubles érectiles' },
            { value: 'troubles éjaculatoires', label: 'Troubles éjaculatoires' },
            { value: 'faible libido', label: 'Faible libido' },
          ]}
          value={watch('step5.fonctionSexuelle') ?? []}
          onChange={(v) => setValue('step5.fonctionSexuelle', v)}
          columns={3}
        />
      </FormField>

      <FormField label="Expositions potentiellement délétères">
        <CheckGroup
          options={[
            { value: 'chaleur', label: 'Chaleur excessive (bains chauds, saunas, travail assis prolongé)' },
            { value: 'solvants/pesticides', label: 'Solvants / pesticides' },
            { value: 'fièvre <3 mois', label: 'Fièvre élevée dans les 3 derniers mois' },
          ]}
          value={watch('step5.expositions') ?? []}
          onChange={(v) => setValue('step5.expositions', v)}
          columns={1}
        />
      </FormField>

      <FormField label="Fertilité antérieure (grossesse avec une autre partenaire) ?">
        <RadioGroup
          name="step5.fertilitéAnterieure"
          options={OUI_NON}
          value={watch('step5.fertilitéAnterieure')}
          onChange={(v) => setValue('step5.fertilitéAnterieure', v)}
          horizontal
        />
      </FormField>

      <FormField label="Délais de conception observés">
        <input className="field-input" {...register('step5.delaisConception')} />
      </FormField>

      <p className="section-title">Examens réalisés</p>

      <div className="grid sm:grid-cols-2 gap-4">
        <FormField label="Spermogramme (résultats)">
          <input className="field-input" placeholder="Date + principaux résultats" {...register('step5.spermogramme')} />
        </FormField>
        <FormField label="Fragmentation ADN spermatique">
          <input className="field-input" placeholder="Date + résultat" {...register('step5.fragmentationADN')} />
        </FormField>
        <FormField label="Échographie génito-urinaire">
          <input className="field-input" placeholder="Date + résultat" {...register('step5.echoGenitourinaire')} />
        </FormField>
        <FormField label="Caryotype">
          <input className="field-input" placeholder="Date + résultat" {...register('step5.caryotype')} />
        </FormField>
      </div>

      <FormField label="Autres examens">
        <input className="field-input" {...register('step5.autresExamensMasculins')} />
      </FormField>

    </div>
  )
}
