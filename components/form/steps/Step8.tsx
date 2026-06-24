'use client'
import { useFormContext } from 'react-hook-form'
import { FormField } from '../FormField'
import type { FormData } from '@/lib/types'

export default function Step8() {
  const { register, formState: { errors } } = useFormContext<FormData>()
  const today = new Date().toLocaleDateString('fr-BE', { day: '2-digit', month: '2-digit', year: 'numeric' })

  return (
    <div>
      <h2 className="text-lg font-semibold text-wine mb-6">Consentement</h2>

      <div className="space-y-4">

        {/* 1. Confidentialité & RGPD */}
        <div className="bg-rose/10 rounded-xl p-4 border border-rose/50">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              className="mt-1 accent-wine w-4 h-4 shrink-0"
              {...register('step8.consentPolitique', { required: 'Ce consentement est obligatoire' })}
            />
            <span className="text-sm text-gray-700">
              <strong>Confidentialité &amp; RGPD</strong> <span className="text-wine">*</span><br />
              J&apos;ai pris connaissance de la Politique de confidentialité de Honae Care (
              <a
                href="https://www.honaecare.com/politique-de-confidentialite"
                target="_blank"
                rel="noopener noreferrer"
                className="underline text-wine hover:text-wine-light"
              >
                Honae - Politique de confidentialité
              </a>
              ) et <strong>consens</strong> au traitement de mes <strong>données de santé</strong> pour la fourniture des soins.
            </span>
          </label>
          {(errors.step8 as any)?.consentPolitique && (
            <p className="text-xs text-red-500 mt-2 ml-7">{(errors.step8 as any).consentPolitique.message}</p>
          )}
        </div>

        {/* 2. Partage d'informations */}
        <div className="bg-rose/10 rounded-xl p-4 border border-rose/50">
          <p className="text-sm font-semibold text-gray-800 mb-1">Partage d&apos;informations</p>
          <p className="text-sm text-gray-700 mb-3">
            J&apos;autorise Honae Care à <strong>échanger mes résultats</strong> avec les praticien·nes
            Honae impliqué·es dans ma prise en charge et, si nécessaire, avec les
            laboratoires/centres partenaires, dans le strict respect du secret médical.
          </p>
          <div className="flex gap-6 text-sm text-gray-700">
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input type="radio" className="accent-wine" value="oui" {...register('step8.partageHonae')} />
              oui
            </label>
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input type="radio" className="accent-wine" value="non" {...register('step8.partageHonae')} />
              non
            </label>
          </div>
        </div>

        {/* 3. Recherche & qualité */}
        <div className="bg-rose/10 rounded-xl p-4 border border-rose/50">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              className="mt-1 accent-wine w-4 h-4 shrink-0"
              {...register('step8.consentStatistiques')}
            />
            <span className="text-sm text-gray-700">
              <strong>Recherche &amp; qualité</strong><br />
              J&apos;accepte que mes données <strong>pseudonymisées</strong> soient utilisées à des fins
              d&apos;<strong>amélioration des pratiques</strong> et <strong>statistiques internes</strong>.
            </span>
          </label>
        </div>

        {/* 4. Contact */}
        <div className="bg-rose/10 rounded-xl p-4 border border-rose/50">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              className="mt-1 accent-wine w-4 h-4 shrink-0"
              {...register('step8.consentContact', { required: 'Ce consentement est obligatoire' })}
            />
            <span className="text-sm text-gray-700">
              <strong>Contact</strong> <span className="text-wine">*</span><br />
              J&apos;accepte d&apos;être contacté·e pour la <strong>prise de rendez-vous</strong> et
              le <strong>suivi</strong> par le secrétariat Honae (téléphone/e-mail/SMS).
            </span>
          </label>
          {(errors.step8 as any)?.consentContact && (
            <p className="text-xs text-red-500 mt-2 ml-7">{(errors.step8 as any).consentContact.message}</p>
          )}
        </div>

        {/* 5. Partage avec partenaire */}
        <div className="bg-rose/10 rounded-xl p-4 border border-rose/50">
          <p className="text-sm text-gray-700 mb-3">
            <strong>Partage avec partenaire</strong> (si applicable).<br />
            J&apos;autorise le <strong>partage réciproque</strong> d&apos;informations utiles à la prise
            en charge entre Honae et mon/ma partenaire :
          </p>
          <div className="flex gap-6 text-sm text-gray-700">
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input type="radio" className="accent-wine" value="oui" {...register('step8.partagePartenaire')} />
              oui
            </label>
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input type="radio" className="accent-wine" value="non" {...register('step8.partagePartenaire')} />
              non
            </label>
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input type="radio" className="accent-wine" value="N/A" {...register('step8.partagePartenaire')} />
              N/A
            </label>
          </div>
        </div>

      </div>

      {/* Signature */}
      <div className="mt-6 bg-rose/10 rounded-xl p-5 border border-rose/50">
        <FormField
          label="Signature électronique"
          required
          hint="Tapez votre prénom et nom complet pour valider ce formulaire"
          error={(errors.step8 as any)?.signature?.message}
        >
          <input
            className="field-input text-base"
            placeholder="Prénom NOM"
            {...register('step8.signature', {
              required: 'La signature est obligatoire',
              minLength: { value: 3, message: 'Signature trop courte' },
            })}
          />
        </FormField>
        <p className="text-sm text-gray-500 mt-2">
          Date de signature : <strong className="text-wine">{today}</strong>
        </p>
        <input type="hidden" value={today} {...register('step8.dateSignature')} />
      </div>
    </div>
  )
}
