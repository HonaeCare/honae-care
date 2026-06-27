'use client'
import { useEffect } from 'react'
import { useFormContext } from 'react-hook-form'
import { FormField, RadioGroup, CheckGroup, DateSelectInput } from '../FormField'
import type { FormData } from '@/lib/types'

export default function Step1() {
  const { register, watch, setValue, unregister, formState: { errors } } = useFormContext<FormData>()
  const situation = watch('step1.situationFamiliale')
  const preferenceContact = watch('step1.preferenceContact') ?? []

  // Si l'utilisateur quitte "en couple", les champs partenaire restent
  // enregistrés avec leur règle `required` et bloqueraient la soumission —
  // on les désenregistre (règles + valeurs) quand ils ne s'affichent plus
  useEffect(() => {
    if (situation && situation !== 'en couple') {
      unregister([
        'step1.partenairePrenom', 'step1.partenaireNom', 'step1.partenaireSexe',
        'step1.partenaireSexeAutre', 'step1.partenaireAge', 'step1.partenaireProfession',
      ] as any)
    }
  }, [situation, unregister])

  return (
    <div>
      <h2 className="text-lg font-semibold text-wine mb-6">Informations personnelles</h2>

      <input type="hidden" {...register('step1.dateFormulaire')} />

      <FormField label="Formulaire complété par" required error={(errors.step1 as any)?.completePar?.message}>
        <RadioGroup
          name="step1.completePar"
          options={[
            { value: 'patiente', label: 'La patiente' },
            { value: 'patient', label: 'Le patient' },
            { value: 'partenaire', label: 'Le/la partenaire' },
            { value: 'autre', label: 'Autre' },
          ]}
          value={watch('step1.completePar')}
          onChange={(v) => setValue('step1.completePar', v)}
          horizontal
        />
        {watch('step1.completePar') === 'autre' && (
          <input className="field-input mt-2" placeholder="Préciser…" {...register('step1.completeParAutre' as any)} />
        )}
      </FormField>

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
          onChange={val => setValue('step1.dateNaissance', val, { shouldValidate: true })}
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
          <input className="field-input mt-2" placeholder="Préciser…" {...register('step1.situationFamilialeAutre' as any)} />
        )}
      </FormField>

      {situation === 'en couple' && (
        <div className="bg-rose/20 rounded-xl p-4 mb-4 border border-rose/40">
          <p className="text-xs font-bold text-wine uppercase tracking-widest mb-3">Informations partenaire</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField label="Sexe du/de la partenaire" required error={(errors.step1 as any)?.partenaireSexe?.message}>
              <RadioGroup
                name="step1.partenaireSexe"
                options={[
                  { value: 'homme', label: 'Homme' },
                  { value: 'femme', label: 'Femme' },
                  { value: 'autre', label: 'Autre' },
                ]}
                value={watch('step1.partenaireSexe')}
                onChange={(v) => setValue('step1.partenaireSexe', v)}
                horizontal
              />
              {watch('step1.partenaireSexe') === 'autre' && (
                <input className="field-input mt-2" placeholder="Préciser…" {...register('step1.partenaireSexeAutre' as any)} />
              )}
            </FormField>
            <FormField label="Âge" hint="Facultatif">
              <input type="number" className="field-input" {...register('step1.partenaireAge')} />
            </FormField>
            <FormField label="Prénom" required error={(errors.step1 as any)?.partenairePrenom?.message}>
              <input className="field-input" {...register('step1.partenairePrenom', { required: 'Requis' })} />
            </FormField>
            <FormField label="Nom" required error={(errors.step1 as any)?.partenaireNom?.message}>
              <input className="field-input" {...register('step1.partenaireNom', { required: 'Requis' })} />
            </FormField>
            <FormField label="Profession" hint="Facultatif">
              <input className="field-input" {...register('step1.partenaireProfession')} />
            </FormField>
          </div>
        </div>
      )}

      <FormField label="Préférence de contact" required error={(errors.step1 as any)?.preferenceContact?.message}>
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

      <FormField label="Langue de préférence" required error={(errors.step1 as any)?.langue?.message}>
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
    </div>
  )
}
