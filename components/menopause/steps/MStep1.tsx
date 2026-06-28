'use client'
import { useFormContext } from 'react-hook-form'
import { FormField, RadioGroup, CheckGroup, DateSelectInput } from '../../form/FormField'
import type { MenopauseFormData } from '@/lib/types-menopause'

export default function MStep1() {
  const { register, watch, setValue, formState: { errors } } = useFormContext<MenopauseFormData>()
  const situation = watch('step1.situationFamiliale')
  const preferenceContact = watch('step1.preferenceContact') ?? []

  return (
    <div>
      <h2 className="text-lg font-semibold text-wine mb-6">Informations personnelles</h2>

      <input type="hidden" {...register('step1.dateFormulaire')} />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField label="Prénom" required error={(errors.step1 as any)?.prenom?.message}>
          <input className="field-input" {...register('step1.prenom', { required: 'Requis' })} />
        </FormField>
        <FormField label="Nom" required error={(errors.step1 as any)?.nom?.message}>
          <input className="field-input" {...register('step1.nom', { required: 'Requis' })} />
        </FormField>
      </div>

      <FormField label="Date de naissance" required error={(errors.step1 as any)?.dateNaissance?.message}>
        <DateSelectInput
          value={watch('step1.dateNaissance')}
          onChange={(val) => setValue('step1.dateNaissance', val, { shouldValidate: true })}
        />
        <input type="hidden" {...register('step1.dateNaissance', { required: 'Requis' })} />
      </FormField>

      <FormField label="Adresse postale" required error={(errors.step1 as any)?.adresse?.message}>
        <textarea rows={2} className="field-input" {...register('step1.adresse', { required: 'Requis' })} />
      </FormField>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField label="Téléphone" required error={(errors.step1 as any)?.telephone?.message}>
          <input type="tel" className="field-input" {...register('step1.telephone', { required: 'Requis' })} />
        </FormField>
        <FormField label="Email" required error={(errors.step1 as any)?.email?.message}>
          <input type="email" className="field-input" {...register('step1.email', {
            required: 'Requis',
            pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Email invalide' },
          })} />
        </FormField>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField label="NISS Belgique" hint="Facultatif">
          <input className="field-input" {...register('step1.niss')} />
        </FormField>
        <FormField label="Profession / secteur" required error={(errors.step1 as any)?.profession?.message}>
          <input className="field-input" {...register('step1.profession', { required: 'Requis' })} />
        </FormField>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField label="Couverture de soins / mutuelle" hint="Facultatif">
          <input className="field-input" {...register('step1.mutuelle')} />
        </FormField>
        <FormField label="Médecin traitant" hint="Facultatif">
          <input className="field-input" {...register('step1.medecinTraitant')} />
        </FormField>
      </div>

      <FormField label="Situation familiale" required error={(errors.step1 as any)?.situationFamiliale?.message}>
        <RadioGroup
          name="step1.situationFamiliale"
          options={[
            { value: 'célibataire', label: 'Célibataire' },
            { value: 'en couple', label: 'En couple' },
            { value: 'autre', label: 'Autre' },
          ]}
          value={situation}
          onChange={(v) => setValue('step1.situationFamiliale', v)}
          horizontal
        />
        {situation === 'autre' && (
          <input className="field-input mt-2" placeholder="Préciser…" {...register('step1.situationFamilialeAutre')} />
        )}
      </FormField>

      <FormField label="Préférence de contact" error={(errors.step1 as any)?.preferenceContact?.message}>
        <CheckGroup
          name="step1.preferenceContact"
          options={[
            { value: 'téléphone', label: 'Téléphone' },
            { value: 'e-mail', label: 'E-mail' },
            { value: 'SMS', label: 'SMS' },
          ]}
          value={preferenceContact}
          onChange={(v) => setValue('step1.preferenceContact', v)}
          columns={3}
        />
      </FormField>

      <FormField label="Langue de préférence">
        <RadioGroup
          name="step1.langue"
          options={[
            { value: 'FR', label: 'Français' },
            { value: 'EN', label: 'English' },
            { value: 'NL', label: 'Nederlands' },
          ]}
          value={watch('step1.langue')}
          onChange={(v) => setValue('step1.langue', v)}
          horizontal
        />
      </FormField>

      <p className="section-title mt-8">Parcours &amp; attentes</p>

      <FormField label="Quel est le motif principal de votre bilan ?" required error={(errors.step1 as any)?.motifPrincipal?.message}>
        <RadioGroup
          name="step1.motifPrincipal"
          options={[
            { value: 'périménopause', label: 'Je veux savoir si je suis en périménopause' },
            { value: 'ménopause', label: 'Je veux savoir si je suis en ménopause' },
            { value: 'symptômes', label: 'Je présente des symptômes' },
          ]}
          value={watch('step1.motifPrincipal')}
          onChange={(v) => setValue('step1.motifPrincipal', v)}
        />
      </FormField>

      <FormField
        label="Attentes vis-à-vis de Honae"
        hint="Prévention, bilan d'investigation intégratif, accompagnement global, suivi médical, soutien émotionnel & sexuel, nutritionnel, bien-être, etc."
      >
        <textarea rows={3} className="field-input" {...register('step1.attentes')} />
      </FormField>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField label="Je veux un traitement hormonal substitutif (THS)" hint="Facultatif">
          <input className="field-input" placeholder="Précisez si souhaité…" {...register('step1.souhaitThs')} />
        </FormField>
        <FormField label="Je veux un traitement non hormonal" hint="Facultatif">
          <input className="field-input" placeholder="Précisez si souhaité…" {...register('step1.souhaitNonHormonal')} />
        </FormField>
      </div>
    </div>
  )
}
