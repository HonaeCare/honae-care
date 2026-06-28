'use client'
import { useEffect } from 'react'
import { useFormContext } from 'react-hook-form'
import { FormField, RadioGroup, CheckGroup, DateSelectInput } from '../FormField'
import { useT } from '@/lib/i18n'
import type { FormData } from '@/lib/types'

export default function Step1() {
  const { register, watch, setValue, unregister, formState: { errors } } = useFormContext<FormData>()
  const t = useT()
  const req = t({ fr: 'Requis', en: 'Required', nl: 'Verplicht' })
  const preciser = t({ fr: 'Préciser…', en: 'Please specify…', nl: 'Specificeer…' })
  const facultatif = t({ fr: 'Facultatif', en: 'Optional', nl: 'Optioneel' })
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
      <h2 className="text-lg font-semibold text-wine mb-6">
        {t({ fr: 'Informations personnelles', en: 'Personal information', nl: 'Persoonlijke gegevens' })}
      </h2>

      <input type="hidden" {...register('step1.dateFormulaire')} />

      <FormField label={t({ fr: 'Formulaire complété par', en: 'Form completed by', nl: 'Formulier ingevuld door' })} required error={(errors.step1 as any)?.completePar?.message}>
        <RadioGroup
          name="step1.completePar"
          options={[
            { value: 'patiente', label: t({ fr: 'La patiente', en: 'The (female) patient', nl: 'De patiënte' }) },
            { value: 'patient', label: t({ fr: 'Le patient', en: 'The (male) patient', nl: 'De patiënt' }) },
            { value: 'partenaire', label: t({ fr: 'Le/la partenaire', en: 'The partner', nl: 'De partner' }) },
            { value: 'autre', label: t({ fr: 'Autre', en: 'Other', nl: 'Andere' }) },
          ]}
          value={watch('step1.completePar')}
          onChange={(v) => setValue('step1.completePar', v)}
          horizontal
        />
        {watch('step1.completePar') === 'autre' && (
          <input className="field-input mt-2" placeholder={preciser} {...register('step1.completeParAutre' as any)} />
        )}
      </FormField>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField label={t({ fr: 'Prénom', en: 'First name', nl: 'Voornaam' })} required error={(errors.step1 as any)?.prenom?.message}>
          <input className="field-input" {...register('step1.prenom', { required: req })} />
        </FormField>
        <FormField label={t({ fr: 'Nom', en: 'Last name', nl: 'Achternaam' })} required error={(errors.step1 as any)?.nom?.message}>
          <input className="field-input" {...register('step1.nom', { required: req })} />
        </FormField>
      </div>

      <FormField label={t({ fr: 'Date de naissance', en: 'Date of birth', nl: 'Geboortedatum' })} required error={(errors.step1 as any)?.dateNaissance?.message}>
        <DateSelectInput
          value={watch('step1.dateNaissance')}
          onChange={val => setValue('step1.dateNaissance', val, { shouldValidate: true })}
        />
        <input type="hidden" {...register('step1.dateNaissance', { required: req })} />
      </FormField>

      <FormField label={t({ fr: 'Adresse postale', en: 'Postal address', nl: 'Postadres' })} required error={(errors.step1 as any)?.adresse?.message}>
        <textarea rows={2} className="field-input" {...register('step1.adresse', { required: req })} />
      </FormField>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField label={t({ fr: 'Téléphone', en: 'Phone', nl: 'Telefoon' })} required error={(errors.step1 as any)?.telephone?.message}>
          <input type="tel" className="field-input" {...register('step1.telephone', { required: req })} />
        </FormField>
        <FormField label="Email" required error={(errors.step1 as any)?.email?.message}>
          <input type="email" className="field-input" {...register('step1.email', {
            required: req,
            pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: t({ fr: 'Email invalide', en: 'Invalid email', nl: 'Ongeldig e-mailadres' }) },
          })} />
        </FormField>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField label={t({ fr: 'NISS Belgique', en: 'Belgian NISS', nl: 'Belgisch INSZ' })} hint={facultatif}>
          <input className="field-input" {...register('step1.niss')} />
        </FormField>
        <FormField label={t({ fr: 'Profession / secteur', en: 'Profession / sector', nl: 'Beroep / sector' })} required error={(errors.step1 as any)?.profession?.message}>
          <input className="field-input" {...register('step1.profession', { required: req })} />
        </FormField>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField label={t({ fr: 'Couverture de soins / mutuelle', en: 'Health insurance / mutual fund', nl: 'Ziekteverzekering / mutualiteit' })} hint={facultatif}>
          <input className="field-input" {...register('step1.mutuelle')} />
        </FormField>
        <FormField label={t({ fr: 'Médecin traitant', en: 'General practitioner', nl: 'Huisarts' })} hint={facultatif}>
          <input className="field-input" {...register('step1.medecinTraitant')} />
        </FormField>
      </div>

      <FormField label={t({ fr: 'Situation familiale', en: 'Family situation', nl: 'Gezinssituatie' })} required error={(errors.step1 as any)?.situationFamiliale?.message}>
        <RadioGroup
          name="step1.situationFamiliale"
          options={[
            { value: 'célibataire', label: t({ fr: 'Célibataire', en: 'Single', nl: 'Alleenstaand' }) },
            { value: 'en couple', label: t({ fr: 'En couple', en: 'In a relationship', nl: 'In een relatie' }) },
            { value: 'autre', label: t({ fr: 'Autre', en: 'Other', nl: 'Andere' }) },
          ]}
          value={situation}
          onChange={(v) => setValue('step1.situationFamiliale', v)}
          horizontal
        />
        {situation === 'autre' && (
          <input className="field-input mt-2" placeholder={preciser} {...register('step1.situationFamilialeAutre' as any)} />
        )}
      </FormField>

      {situation === 'en couple' && (
        <div className="bg-rose/20 rounded-xl p-4 mb-4 border border-rose/40">
          <p className="text-xs font-bold text-wine uppercase tracking-widest mb-3">
            {t({ fr: 'Informations partenaire', en: 'Partner information', nl: 'Gegevens partner' })}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField label={t({ fr: 'Sexe du/de la partenaire', en: "Partner's sex", nl: 'Geslacht van de partner' })} required error={(errors.step1 as any)?.partenaireSexe?.message}>
              <RadioGroup
                name="step1.partenaireSexe"
                options={[
                  { value: 'homme', label: t({ fr: 'Homme', en: 'Male', nl: 'Man' }) },
                  { value: 'femme', label: t({ fr: 'Femme', en: 'Female', nl: 'Vrouw' }) },
                  { value: 'autre', label: t({ fr: 'Autre', en: 'Other', nl: 'Andere' }) },
                ]}
                value={watch('step1.partenaireSexe')}
                onChange={(v) => setValue('step1.partenaireSexe', v)}
                horizontal
              />
              {watch('step1.partenaireSexe') === 'autre' && (
                <input className="field-input mt-2" placeholder={preciser} {...register('step1.partenaireSexeAutre' as any)} />
              )}
            </FormField>
            <FormField label={t({ fr: 'Âge', en: 'Age', nl: 'Leeftijd' })} hint={facultatif}>
              <input
                type="number"
                min={0}
                max={120}
                onKeyDown={(e) => { if (['-', '+', 'e', 'E'].includes(e.key)) e.preventDefault() }}
                className="field-input"
                {...register('step1.partenaireAge')}
              />
            </FormField>
            <FormField label={t({ fr: 'Prénom', en: 'First name', nl: 'Voornaam' })} required error={(errors.step1 as any)?.partenairePrenom?.message}>
              <input className="field-input" {...register('step1.partenairePrenom', { required: req })} />
            </FormField>
            <FormField label={t({ fr: 'Nom', en: 'Last name', nl: 'Achternaam' })} required error={(errors.step1 as any)?.partenaireNom?.message}>
              <input className="field-input" {...register('step1.partenaireNom', { required: req })} />
            </FormField>
            <FormField label={t({ fr: 'Profession', en: 'Profession', nl: 'Beroep' })} hint={facultatif}>
              <input className="field-input" {...register('step1.partenaireProfession')} />
            </FormField>
          </div>
        </div>
      )}

      <FormField label={t({ fr: 'Préférence de contact', en: 'Contact preference', nl: 'Contactvoorkeur' })} required error={(errors.step1 as any)?.preferenceContact?.message}>
        <CheckGroup
          name="step1.preferenceContact"
          options={[
            { value: 'téléphone', label: t({ fr: 'Téléphone', en: 'Phone', nl: 'Telefoon' }) },
            { value: 'e-mail', label: t({ fr: 'E-mail', en: 'Email', nl: 'E-mail' }) },
            { value: 'SMS', label: t({ fr: 'SMS', en: 'SMS', nl: 'Sms' }) },
          ]}
          value={preferenceContact}
          onChange={(v) => setValue('step1.preferenceContact', v)}
          columns={3}
        />
      </FormField>

      <FormField label={t({ fr: 'Langue de préférence', en: 'Preferred language', nl: 'Voorkeurstaal' })} required error={(errors.step1 as any)?.langue?.message}>
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
