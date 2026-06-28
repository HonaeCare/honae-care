'use client'
import { useFormContext } from 'react-hook-form'
import { FormField, RadioGroup, CheckGroup } from '../../form/FormField'
import type { MenopauseFormData } from '@/lib/types-menopause'

const OUI_NON = [{ value: 'oui', label: 'Oui' }, { value: 'non', label: 'Non' }]
const OUI_NON_DISCUTER = [
  { value: 'oui', label: 'Oui' },
  { value: 'non', label: 'Non' },
  { value: 'à discuter', label: 'À discuter' },
]

export default function MStep2() {
  const { register, watch, setValue } = useFormContext<MenopauseFormData>()
  const bilanFait = watch('step2.bilanDejaFait')
  const suppl = watch('step2.supplementee')

  return (
    <div>
      <h2 className="text-lg font-semibold text-wine mb-6">Bilan &amp; antécédents médicaux</h2>

      <p className="section-title">Bilan &amp; supplémentation</p>

      <FormField label="Souhaitez-vous faire un bilan intégratif d'investigation complet ?">
        <RadioGroup
          name="step2.bilanIntegratif"
          options={OUI_NON_DISCUTER}
          value={watch('step2.bilanIntegratif')}
          onChange={(v) => setValue('step2.bilanIntegratif', v)}
          horizontal
        />
      </FormField>

      <FormField label="Avez-vous déjà effectué un bilan ?" hint="Si oui, merci de vous munir de vos résultats d'analyse et comptes rendus lors de la consultation">
        <RadioGroup
          name="step2.bilanDejaFait"
          options={OUI_NON}
          value={bilanFait}
          onChange={(v) => setValue('step2.bilanDejaFait', v)}
          horizontal
        />
        {bilanFait === 'oui' && (
          <div className="mt-3 bg-rose/20 rounded-xl p-4 border border-rose/40 grid sm:grid-cols-3 gap-4">
            <FormField label="Avec un gynécologue">
              <RadioGroup name="step2.bilanGynecologue" options={OUI_NON} value={watch('step2.bilanGynecologue')} onChange={(v) => setValue('step2.bilanGynecologue', v)} horizontal />
            </FormField>
            <FormField label="Avec un généraliste">
              <RadioGroup name="step2.bilanGeneraliste" options={OUI_NON} value={watch('step2.bilanGeneraliste')} onChange={(v) => setValue('step2.bilanGeneraliste', v)} horizontal />
            </FormField>
            <FormField label="Avec un·e nutritionniste / naturopathe">
              <RadioGroup name="step2.bilanNutritionniste" options={OUI_NON} value={watch('step2.bilanNutritionniste')} onChange={(v) => setValue('step2.bilanNutritionniste', v)} horizontal />
            </FormField>
          </div>
        )}
      </FormField>

      <FormField label="Êtes-vous déjà supplémentée ?">
        <RadioGroup
          name="step2.supplementee"
          options={OUI_NON}
          value={suppl}
          onChange={(v) => setValue('step2.supplementee', v)}
          horizontal
        />
        {suppl === 'oui' && (
          <div className="mt-3 bg-rose/20 rounded-xl p-4 border border-rose/40 space-y-3">
            <FormField label="Avec des hormones">
              <RadioGroup name="step2.supplHormones" options={OUI_NON} value={watch('step2.supplHormones')} onChange={(v) => setValue('step2.supplHormones', v)} horizontal />
              {watch('step2.supplHormones') === 'oui' && (
                <input className="field-input mt-2" placeholder="Lesquelles ?" {...register('step2.supplHormonesDetail')} />
              )}
            </FormField>
            <FormField label="Avec des plantes">
              <RadioGroup name="step2.supplPlantes" options={OUI_NON} value={watch('step2.supplPlantes')} onChange={(v) => setValue('step2.supplPlantes', v)} horizontal />
              {watch('step2.supplPlantes') === 'oui' && (
                <input className="field-input mt-2" placeholder="Lesquelles ?" {...register('step2.supplPlantesDetail')} />
              )}
            </FormField>
            <FormField label="Avec des compléments alimentaires">
              <RadioGroup name="step2.supplComplements" options={OUI_NON} value={watch('step2.supplComplements')} onChange={(v) => setValue('step2.supplComplements', v)} horizontal />
              {watch('step2.supplComplements') === 'oui' && (
                <input className="field-input mt-2" placeholder="Lesquels ?" {...register('step2.supplComplementsDetail')} />
              )}
            </FormField>
          </div>
        )}
      </FormField>

      <FormField label="Réponse aux éventuels traitements ?">
        <textarea rows={2} className="field-input" {...register('step2.reponseTraitements')} />
      </FormField>

      <p className="section-title">Antécédents familiaux</p>
      <p className="text-xs text-gray-400 -mt-2 mb-3">Parents / fratrie / grands-parents</p>

      <FormField label="Antécédents familiaux connus">
        <CheckGroup
          options={[
            { value: 'cancer', label: 'Cancer(s)' },
            { value: 'ménopause précoce', label: 'Ménopause précoce (< 46 ans)' },
            { value: 'cardio-vasculaire', label: 'Maladies cardio-vasculaires' },
            { value: 'diabète', label: 'Diabète' },
            { value: 'endométriose', label: 'Endométriose' },
            { value: 'thrombose', label: 'Thrombose' },
            { value: 'inflammatoires', label: 'Maladies inflammatoires (digestives, dermato, rhumato)' },
          ]}
          value={watch('step2.famAntecedents') ?? []}
          onChange={(v) => setValue('step2.famAntecedents', v)}
          columns={2}
        />
      </FormField>
      <div className="grid sm:grid-cols-2 gap-4">
        <FormField label="Précision cancer(s) familiaux"><input className="field-input" {...register('step2.famCancerDetail')} /></FormField>
        <FormField label="Précision maladies inflammatoires"><input className="field-input" {...register('step2.famInflammatoiresDetail')} /></FormField>
      </div>
      <FormField label="Autres antécédents familiaux"><input className="field-input" {...register('step2.famAutres')} /></FormField>

      <p className="section-title">Antécédents personnels</p>

      <FormField label="Maladies chroniques / auto-immunes / endocriniennes" hint="Ex : thyroïde…">
        <input className="field-input" {...register('step2.persMaladiesChroniques')} />
      </FormField>

      <FormField label="Antécédents personnels connus">
        <CheckGroup
          options={[
            { value: 'ménopause précoce', label: 'Ménopause précoce (< 46 ans)' },
            { value: 'cancer', label: 'Cancer(s)' },
            { value: 'cardio-vasculaire', label: 'Maladies cardio-vasculaires (hypertension…)' },
            { value: 'diabète', label: 'Diabète' },
            { value: 'endométriose', label: 'Endométriose' },
            { value: 'thrombose', label: 'Thrombose' },
            { value: 'inflammatoires', label: 'Maladies inflammatoires (digestives, dermato, rhumato)' },
          ]}
          value={watch('step2.persAntecedents') ?? []}
          onChange={(v) => setValue('step2.persAntecedents', v)}
          columns={2}
        />
      </FormField>
      <div className="grid sm:grid-cols-2 gap-4">
        <FormField label="Précision cancer(s)"><input className="field-input" {...register('step2.persCancerDetail')} /></FormField>
        <FormField label="Précision cardio-vasculaire"><input className="field-input" {...register('step2.persCardioDetail')} /></FormField>
      </div>
      <FormField label="Précision maladies inflammatoires"><input className="field-input" {...register('step2.persInflammatoiresDetail')} /></FormField>

      <div className="grid sm:grid-cols-2 gap-4">
        <FormField label="Allergies (médicaments, latex, aliments)"><input className="field-input" {...register('step2.allergies')} /></FormField>
        <FormField label="Vaccinations connues"><input className="field-input" {...register('step2.vaccinations')} /></FormField>
      </div>
    </div>
  )
}
