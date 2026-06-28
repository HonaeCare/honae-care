'use client'
import { useFormContext } from 'react-hook-form'
import { FormField, RadioGroup, CheckGroup, SliderField } from '../../form/FormField'
import type { MenopauseFormData } from '@/lib/types-menopause'

const OUI_NON = [{ value: 'oui', label: 'Oui' }, { value: 'non', label: 'Non' }]

export default function MStep6() {
  const { register, watch, setValue } = useFormContext<MenopauseFormData>()
  const alerte = watch('step6.signalAlerte')

  return (
    <div>
      <h2 className="text-lg font-semibold text-wine mb-6">Bien-être global &amp; émotions</h2>

      <FormField label="Comment vous sentez-vous actuellement ?">
        <textarea rows={4} className="field-input" placeholder="Décrivez librement…" {...register('step6.ressenti')} />
      </FormField>

      <FormField label="Émotions ressenties (cochez tout ce qui s'applique)">
        <CheckGroup
          options={[
            { value: 'espoir', label: 'Espoir' },
            { value: 'optimisme', label: 'Optimisme' },
            { value: 'curiosité', label: 'Curiosité' },
            { value: 'fatigue', label: 'Fatigue' },
            { value: 'tristesse', label: 'Tristesse' },
            { value: 'frustration', label: 'Frustration' },
            { value: 'colère', label: 'Colère' },
            { value: 'angoisse', label: 'Angoisse' },
            { value: 'solitude', label: 'Solitude' },
            { value: 'confusion', label: 'Confusion' },
          ]}
          value={watch('step6.emotions') ?? []}
          onChange={(v) => setValue('step6.emotions', v)}
          columns={3}
        />
        <input className="field-input mt-2" placeholder="Autres émotions…" {...register('step6.emotionsAutre')} />
      </FormField>

      <div className="grid sm:grid-cols-2 gap-6">
        <FormField label="Motivation / Optimisme (0 = absent, 10 = fort)">
          <SliderField value={watch('step6.motivation') ?? 5} onChange={(v) => setValue('step6.motivation', v)} />
        </FormField>
        <FormField label="Anxiété (0 = aucune, 10 = intense)">
          <SliderField value={watch('step6.anxiete') ?? 3} onChange={(v) => setValue('step6.anxiete', v)} />
        </FormField>
      </div>

      <FormField label="Facteurs atténuants / aggravants" hint="Facultatif">
        <input className="field-input" {...register('step6.facteurs')} />
      </FormField>

      <FormField label="Soutien actuel : familial, social, psychologique">
        <textarea rows={2} className="field-input" {...register('step6.soutienActuel')} />
      </FormField>

      <FormField label="Ressources activées">
        <CheckGroup
          options={[
            { value: 'partenaire', label: 'Partenaire' },
            { value: 'famille', label: 'Famille' },
            { value: 'amis', label: 'Amis' },
            { value: 'groupe de parole', label: 'Groupe de parole / communauté' },
            { value: 'psychologue', label: 'Psychologue' },
            { value: 'coach', label: 'Coach' },
            { value: 'médecin généraliste', label: 'Médecin généraliste' },
            { value: 'aucun', label: "Aucun pour l'instant" },
          ]}
          value={watch('step6.ressources') ?? []}
          onChange={(v) => setValue('step6.ressources', v)}
          columns={3}
        />
        <input className="field-input mt-2" placeholder="Autre ressource…" {...register('step6.ressourcesAutre')} />
      </FormField>

      <FormField label="Impact sur le quotidien" hint="Facultatif">
        <CheckGroup
          options={[
            { value: 'sommeil', label: 'Sommeil perturbé' },
            { value: 'appétit', label: "Baisse d'appétit / grignotages" },
            { value: 'concentration', label: 'Difficultés de concentration' },
            { value: 'professionnel', label: 'Impact professionnel' },
            { value: 'libido', label: 'Baisse de la libido' },
            { value: 'douleurs', label: 'Douleurs accrues' },
          ]}
          value={watch('step6.impactQuotidien') ?? []}
          onChange={(v) => setValue('step6.impactQuotidien', v)}
          columns={3}
        />
        <input className="field-input mt-2" placeholder="Autre impact…" {...register('step6.impactQuotidienAutre')} />
      </FormField>

      <p className="section-title">Symptômes métaboliques</p>
      <div className="grid sm:grid-cols-3 gap-4">
        <FormField label="Prise de poids abdominale ?">
          <RadioGroup name="step6.priseDePoidsAbdo" options={OUI_NON} value={watch('step6.priseDePoidsAbdo')} onChange={(v) => setValue('step6.priseDePoidsAbdo', v)} horizontal />
        </FormField>
        <FormField label="Douleur / lourdeur au foie ?">
          <RadioGroup name="step6.douleurFoie" options={OUI_NON} value={watch('step6.douleurFoie')} onChange={(v) => setValue('step6.douleurFoie', v)} horizontal />
        </FormField>
        <FormField label="Régulation du poids difficile ?">
          <RadioGroup name="step6.regulationPoidsDifficile" options={OUI_NON} value={watch('step6.regulationPoidsDifficile')} onChange={(v) => setValue('step6.regulationPoidsDifficile', v)} horizontal />
        </FormField>
      </div>

      <div className="bg-rose/20 rounded-xl p-4 mb-4 border border-rose/50">
        <p className="text-xs font-bold text-wine uppercase tracking-widest mb-3">Signal d'alerte (pour votre sécurité)</p>
        <FormField label="Avez-vous connu récemment une détresse aiguë nécessitant une aide immédiate (ex. idées noires) ?">
          <RadioGroup name="step6.signalAlerte" options={OUI_NON} value={alerte} onChange={(v) => setValue('step6.signalAlerte', v)} horizontal />
        </FormField>
        {alerte === 'oui' && (
          <FormField label="Souhaitez-vous en parler lors de la consultation ?">
            <RadioGroup name="step6.souhaitParlerConsultation" options={OUI_NON} value={watch('step6.souhaitParlerConsultation')} onChange={(v) => setValue('step6.souhaitParlerConsultation', v)} horizontal />
          </FormField>
        )}
      </div>
    </div>
  )
}
