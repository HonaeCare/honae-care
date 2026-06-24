'use client'
import { useFormContext } from 'react-hook-form'
import { FormField, RadioGroup, CheckGroup, SliderField } from '../FormField'
import type { FormData } from '@/lib/types'

const OUI_NON = [{ value: 'oui', label: 'Oui' }, { value: 'non', label: 'Non' }]

export default function Step7() {
  const { register, watch, setValue } = useFormContext<FormData>()
  const alerte = watch('step7.signalAlerte')

  return (
    <div>
      <h2 className="text-lg font-semibold text-wine mb-6">Bien-être & émotions</h2>

      <FormField label="Niveau de stress perçu (0 = aucun, 10 = extrême)">
        <SliderField
          value={watch('step6.stress' as any) ?? 5}
          onChange={(v) => setValue('step6.stress' as any, v)}
        />
      </FormField>

      <FormField label="Événements de vie majeurs récents">
        <input className="field-input" placeholder="Deuil, séparation, déménagement, perte d'emploi…" {...register('step6.evenementsMajeurs' as any)} />
      </FormField>

      <FormField label="Suivi psychologique / accompagnement ?">
        <RadioGroup
          name="step6.soutienPsychologique"
          options={[
            { value: 'non', label: 'Non' },
            { value: 'oui', label: 'Oui' },
          ]}
          value={watch('step6.soutienPsychologique' as any)}
          onChange={(v) => setValue('step6.soutienPsychologique' as any, v)}
          horizontal
        />
        {watch('step6.soutienPsychologique' as any) === 'oui' && (
          <input className="field-input mt-2" placeholder="Précisions" {...register('step6.soutienPsychologiqueDetail' as any)} />
        )}
      </FormField>

      <FormField label="Comment vous sentez-vous dans votre parcours de fertilité en ce moment ?">
        <textarea rows={4} className="field-input" placeholder="Décrivez librement…" {...register('step7.ressentiParcours')} />
      </FormField>

      <FormField label="Émotions ressenties récemment (plusieurs choix possibles)">
        <CheckGroup
          options={[
            { value: 'espoir', label: 'Espoir' },
            { value: 'optimisme', label: 'Optimisme' },
            { value: 'curiosité', label: 'Curiosité' },
            { value: 'fatigue', label: 'Fatigue' },
            { value: 'tristesse', label: 'Tristesse' },
            { value: 'frustration', label: 'Frustration' },
            { value: 'colère', label: 'Colère' },
            { value: 'culpabilité', label: 'Culpabilité' },
            { value: 'solitude', label: 'Solitude' },
            { value: 'confusion', label: 'Confusion' },
            { value: 'autre', label: 'Autre' },
          ]}
          value={watch('step7.emotions') ?? []}
          onChange={(v) => setValue('step7.emotions', v)}
          columns={3}
        />
        {(watch('step7.emotions') ?? []).includes('autre') && (
          <input className="field-input mt-2" placeholder="Préciser l'émotion…" {...register('step7.emotionsAutre' as any)} />
        )}
      </FormField>

      <div className="grid sm:grid-cols-2 gap-6">
        <FormField label="Motivation / Optimisme (0 = absent, 10 = fort)">
          <SliderField
            value={watch('step7.motivation') ?? 5}
            onChange={(v) => setValue('step7.motivation', v)}
          />
        </FormField>
        <FormField label="Anxiété (0 = aucune, 10 = intense)">
          <SliderField
            value={watch('step7.anxiete') ?? 3}
            onChange={(v) => setValue('step7.anxiete', v)}
          />
        </FormField>
      </div>

      <FormField label="Facteurs atténuants ou aggravants votre état émotionnel" hint="Facultatif">
        <input className="field-input" placeholder="Ex : résultats d'examens, événements familiaux…" {...register('step7.facteurs')} />
      </FormField>

      <FormField label="Soutien actuel dans votre parcours">
        <input className="field-input" placeholder="Partenaire, famille, ami·e, professionnel·le…" {...register('step7.soutienActuel')} />
      </FormField>

      <FormField label="Ressources activées">
        <CheckGroup
          options={[
            { value: 'partenaire', label: 'Partenaire' },
            { value: 'famille', label: 'Famille' },
            { value: 'amis', label: 'Ami·e·s' },
            { value: 'groupe de parole', label: 'Groupe de parole' },
            { value: 'psychologue', label: 'Psychologue' },
            { value: 'coach', label: 'Coach de vie' },
            { value: 'médecin généraliste', label: 'Médecin généraliste' },
            { value: 'aucun', label: "Aucun pour l'instant" },
            { value: 'autre', label: 'Autre' },
          ]}
          value={watch('step7.ressources') ?? []}
          onChange={(v) => setValue('step7.ressources', v)}
          columns={3}
        />
        {(watch('step7.ressources') ?? []).includes('autre') && (
          <input className="field-input mt-2" placeholder="Préciser…" {...register('step7.ressourcesAutre' as any)} />
        )}
      </FormField>

      <FormField label="Impact sur le quotidien">
        <CheckGroup
          options={[
            { value: 'sommeil', label: 'Sommeil perturbé' },
            { value: 'appétit', label: 'Appétit altéré' },
            { value: 'concentration', label: 'Difficultés de concentration' },
            { value: 'impact professionnel', label: 'Impact professionnel' },
            { value: 'libido', label: 'Libido diminuée' },
            { value: 'douleurs', label: 'Douleurs physiques' },
            { value: 'autre', label: 'Autre' },
          ]}
          value={watch('step7.impactQuotidien') ?? []}
          onChange={(v) => setValue('step7.impactQuotidien', v)}
          columns={3}
        />
        {(watch('step7.impactQuotidien') ?? []).includes('autre') && (
          <input className="field-input mt-2" placeholder="Préciser…" {...register('step7.impactQuotidienAutre' as any)} />
        )}
      </FormField>

      <div className="bg-rose/20 rounded-xl p-4 mb-4 border border-rose/50">
        <FormField label="Avez-vous connu récemment une détresse aiguë nécessitant une aide immédiate ?">
          <RadioGroup
            name="step7.signalAlerte"
            options={OUI_NON}
            value={alerte}
            onChange={(v) => setValue('step7.signalAlerte', v)}
            horizontal
          />
        </FormField>
        {alerte === 'oui' && (
          <FormField label="Souhaitez-vous en parler lors de la consultation ?">
            <RadioGroup
              name="step7.souhaitParlerConsultation"
              options={OUI_NON}
              value={watch('step7.souhaitParlerConsultation')}
              onChange={(v) => setValue('step7.souhaitParlerConsultation', v)}
              horizontal
            />
          </FormField>
        )}
      </div>

    </div>
  )
}
