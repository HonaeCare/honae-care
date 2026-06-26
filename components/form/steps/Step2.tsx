'use client'
import { useFormContext } from 'react-hook-form'
import { FormField, RadioGroup, CheckGroup } from '../FormField'
import type { FormData } from '@/lib/types'

const OUI_NON = [{ value: 'oui', label: 'Oui' }, { value: 'non', label: 'Non' }]
const OUI_NON_DISCUTER = [
  { value: 'oui', label: 'Oui' },
  { value: 'non', label: 'Non' },
  { value: 'à discuter', label: 'À discuter' },
]
const OUI_NON_NSP = [
  { value: 'oui', label: 'Oui' },
  { value: 'non', label: 'Non' },
  { value: 'je ne sais pas', label: 'Je ne sais pas' },
]

export default function Step2() {
  const { register, watch, setValue, formState: { errors } } = useFormContext<FormData>()
  const motif = watch('step2.motifPrincipal')
  const preservation = watch('step2.souhaitPreservation')
  const essais = watch('step2.essaisNaturels')
  const pmaFait = watch('step2.parcoursPMAFait')

  return (
    <div>
      <h2 className="text-lg font-semibold text-wine mb-6">Parcours & antécédents médicaux</h2>

      <p className="section-title">Parcours de fertilité</p>

      <FormField label="Motif principal de consultation" required error={(errors.step2 as any)?.motifPrincipal?.message}>
        <RadioGroup
          name="step2.motifPrincipal"
          options={[
            { value: 'essai actif', label: 'Essai actif de conception' },
            { value: 'bilan fertilité', label: 'Bilan de fertilité' },
            { value: 'préservation', label: 'Préservation de la fertilité' },
            { value: 'symptômes', label: 'Symptômes (préciser)' },
          ]}
          value={motif}
          onChange={(v) => setValue('step2.motifPrincipal', v)}
        />
        {motif === 'symptômes' && (
          <input className="field-input mt-2" placeholder="Préciser les symptômes…" {...register('step2.motifAutre')} />
        )}
      </FormField>

      <FormField label="Attentes vis-à-vis de Honae Care">
        <textarea rows={3} className="field-input" {...register('step2.attentes')} />
      </FormField>

      <FormField label="Bilan de fertilité déjà réalisé ?" required error={(errors.step2 as any)?.bilanFertilite?.message}>
        <RadioGroup
          name="step2.bilanFertilite"
          options={OUI_NON_NSP}
          value={watch('step2.bilanFertilite')}
          onChange={(v) => setValue('step2.bilanFertilite', v)}
          horizontal
        />
      </FormField>

      {motif !== 'préservation' && (
        <FormField label="Souhait de préservation de la fertilité ?" required error={(errors.step2 as any)?.souhaitPreservation?.message}>
          <RadioGroup
            name="step2.souhaitPreservation"
            options={OUI_NON_DISCUTER}
            value={preservation}
            onChange={(v) => setValue('step2.souhaitPreservation', v)}
            horizontal
          />
        </FormField>
      )}

      {(motif === 'préservation' || preservation === 'oui') && (
        <div className="bg-rose/20 rounded-xl p-4 mb-4 border border-rose/40 grid sm:grid-cols-2 gap-4">
          <FormField label="Conservation ovocytaire">
            <RadioGroup
              name="step2.conservationOvocytaire"
              options={OUI_NON_DISCUTER}
              value={watch('step2.conservationOvocytaire')}
              onChange={(v) => setValue('step2.conservationOvocytaire', v)}
            />
          </FormField>
          <FormField label="Conservation spermatique">
            <RadioGroup
              name="step2.conservationSperme"
              options={OUI_NON_DISCUTER}
              value={watch('step2.conservationSperme')}
              onChange={(v) => setValue('step2.conservationSperme', v)}
            />
          </FormField>
        </div>
      )}

      <FormField label="Essais naturels de conception en cours ou passés ?">
        <RadioGroup
          name="step2.essaisNaturels"
          options={OUI_NON}
          value={essais}
          onChange={(v) => setValue('step2.essaisNaturels', v)}
          horizontal
        />
        {essais === 'oui' && (
          <input className="field-input mt-2" placeholder="Durée (ex : 6 mois, 1 an…)" {...register('step2.dureeEssais')} />
        )}
      </FormField>

      <FormField label="Rapports sexuels ciblés sur la période fertile ?">
        <RadioGroup
          name="step2.rapportsCibles"
          options={[
            { value: 'oui', label: 'Oui' },
            { value: 'non', label: 'Non' },
            { value: 'incertain', label: 'Incertain' },
          ]}
          value={watch('step2.rapportsCibles')}
          onChange={(v) => setValue('step2.rapportsCibles', v)}
          horizontal
        />
      </FormField>

      <FormField label="Outils de suivi de l'ovulation utilisés">
        <CheckGroup
          options={[
            { value: 'test ovulation', label: "Tests d'ovulation" },
            { value: 'symptômes physiques', label: 'Symptômes physiques' },
            { value: 'application', label: 'Application mobile' },
            { value: 'symptothermie', label: 'Symptothermie' },
          ]}
          value={watch('step2.outilsUtilises') ?? []}
          onChange={(v) => setValue('step2.outilsUtilises', v)}
          columns={2}
        />
      </FormField>

      <FormField label="Parcours PMA (procréation médicalement assistée) déjà réalisé ?" required error={(errors.step2 as any)?.parcoursPMAFait?.message}>
        <RadioGroup
          name="step2.parcoursPMAFait"
          options={OUI_NON}
          value={pmaFait}
          onChange={(v) => setValue('step2.parcoursPMAFait', v)}
          horizontal
        />
        {pmaFait === 'oui' && (
          <textarea
            rows={4}
            className="field-input mt-2"
            placeholder="Centre, médecin, date, type de traitement, résultats…"
            {...register('step2.parcoursPMA')}
          />
        )}
      </FormField>

      <p className="section-title">Antécédents médicaux</p>

      <FormField label="Maladies chroniques ou auto-immunes">
        <input className="field-input" placeholder="Ex : lupus, thyroïdite de Hashimoto…" {...register('step2.maladiesChroniques')} />
      </FormField>

      <FormField label="Cancer ?">
        <RadioGroup
          name="step2.cancer"
          options={OUI_NON}
          value={watch('step2.cancer' as any)}
          onChange={(v) => setValue('step2.cancer' as any, v)}
          horizontal
        />
        {watch('step2.cancer' as any) === 'oui' && (
          <input className="field-input mt-2" placeholder="Type, date, traitement…" {...register('step2.cancerDetails' as any)} />
        )}
      </FormField>

      <div className="grid sm:grid-cols-2 gap-4">
        {([
          ['sopk', 'SOPK (syndrome des ovaires polykystiques)'],
          ['endometriose', 'Endométriose'],
          ['adenomyose', 'Adénomyose'],
          ['fibromes', 'Fibromes / Polypes'],
          ['infectionsPelviennes', 'Infections pelviennes antérieures'],
          ['insuffisanceOvarienne', 'Insuffisance ovarienne précoce'],
          ['troublesSurrenaliens', 'Troubles surrénaliens'],
          ['diabete', 'Diabète ou insulinorésistance'],
          ['pathologiesHypophysaires', 'Pathologies hypophysaires'],
          ['thrombose', 'Thrombose'],
        ] as [string, string][]).map(([key, label]) => (
          <FormField key={key} label={label}>
            <RadioGroup
              name={`step2.${key}`}
              options={OUI_NON}
              value={watch(`step2.${key}` as any)}
              onChange={(v) => setValue(`step2.${key}` as any, v)}
              horizontal
            />
          </FormField>
        ))}
      </div>

      <FormField label="Autre pathologie gynécologique">
        <input className="field-input" {...register('step2.autrePathologie')} />
      </FormField>

      <FormField label="Pathologies endocriniennes">
        <input className="field-input" placeholder="Ex : hypothyroïdie, hyperprolactinémie…" {...register('step2.pathologiesEndocriniennes')} />
      </FormField>

      <FormField label="Allergies / intolérances">
        <input className="field-input" {...register('step2.allergies')} />
      </FormField>

      <FormField label="Traitements en cours">
        <textarea rows={3} className="field-input" placeholder="Médicaments, suppléments, phytothérapie…" {...register('step2.traitementsEnCours')} />
      </FormField>

      <FormField label="Vaccinations à jour">
        <CheckGroup
          options={[
            { value: 'rubéole', label: 'Rubéole' },
            { value: 'varicelle', label: 'Varicelle' },
            { value: 'HPV', label: 'HPV' },
            { value: 'hépatite B', label: 'Hépatite B' },
            { value: 'COVID-19', label: 'COVID-19' },
          ]}
          value={watch('step2.vaccinations') ?? []}
          onChange={(v) => setValue('step2.vaccinations', v)}
          columns={3}
        />
      </FormField>

      <FormField label="Sérologies connues si antérieures">
        <CheckGroup
          options={[
            { value: 'VIH', label: 'VIH' },
            { value: 'VHB', label: 'Hépatite B (VHB)' },
            { value: 'VHC', label: 'Hépatite C (VHC)' },
            { value: 'syphilis', label: 'Syphilis' },
            { value: 'toxo', label: 'Toxoplasmose' },
            { value: 'CMV', label: 'CMV' },
          ]}
          value={watch('step3.serologies' as any) ?? []}
          onChange={(v) => setValue('step3.serologies' as any, v)}
          columns={3}
        />
      </FormField>

      <FormField label="Troubles digestifs cycliques / douleurs pelviennes chroniques">
        <input className="field-input" {...register('step3.troublesDigestifs' as any)} />
      </FormField>

      <FormField label="Chirurgies / hospitalisations gynécologiques ou autres (avec dates)">
        <textarea rows={3} className="field-input" placeholder="Ex : cœlioscopie 2020, appendicectomie 2015…" {...register('step3.chirurgies' as any)} />
      </FormField>

      <p className="section-title">Examens gynécologiques</p>

      <div className="grid sm:grid-cols-2 gap-4">
        <FormField label="Dernier frottis (PAP test) / HPV — Date" hint="Facultatif">
          <input type="date" className="field-input" {...register('step5.dernierFrottisDate' as any)} />
        </FormField>
        <FormField label="Dernier frottis (PAP test) / HPV — Résultat" hint="Facultatif">
          <input className="field-input" placeholder="Ex : normal, CIN1, HPV positif…" {...register('step5.dernierFrottisResultat' as any)} />
        </FormField>
      </div>

      <FormField label="Examens gynécologiques déjà réalisés">
        <CheckGroup
          options={[
            { value: 'échographie pelvienne', label: 'Échographie pelvienne' },
            { value: 'hystéroscopie', label: 'Hystéroscopie' },
            { value: 'HyFoSy', label: 'HyFoSy / HSG' },
            { value: 'bilan hormonal', label: 'Bilan hormonal' },
            { value: 'microbiote vaginal', label: 'Microbiote vaginal' },
            { value: 'test immunologique endomètre', label: 'Test immunologique endomètre' },
            { value: 'autre', label: 'Autre' },
          ]}
          value={watch('step4.examensRealises' as any) ?? []}
          onChange={(v) => setValue('step4.examensRealises' as any, v)}
          columns={2}
        />
        {((watch('step4.examensRealises' as any) ?? []) as string[]).includes('autre') && (
          <input className="field-input mt-2" placeholder="Préciser…" {...register('step4.examensRealisesAutre' as any)} />
        )}
      </FormField>

      <FormField label="Malformations utérines connues">
        <input className="field-input" placeholder="Ex : utérus bicorne, cloison utérine…" {...register('step4.malformationsUterines' as any)} />
      </FormField>

      <p className="section-title">Signes cliniques</p>

      <div className="grid sm:grid-cols-2 gap-4">
        <FormField label="Acné résistante aux traitements ?">
          <RadioGroup
            name="step3.acne"
            options={OUI_NON}
            value={watch('step3.acne' as any)}
            onChange={(v) => setValue('step3.acne' as any, v)}
            horizontal
          />
        </FormField>
        <FormField label="Pilosité excessive (hirsutisme) ?">
          <RadioGroup
            name="step3.pilosite"
            options={OUI_NON}
            value={watch('step3.pilosite' as any)}
            onChange={(v) => setValue('step3.pilosite' as any, v)}
            horizontal
          />
        </FormField>
        <FormField label="Chute de cheveux importante ?">
          <RadioGroup
            name="step3.chuteCheveux"
            options={OUI_NON}
            value={watch('step3.chuteCheveux' as any)}
            onChange={(v) => setValue('step3.chuteCheveux' as any, v)}
            horizontal
          />
        </FormField>
      </div>

      <p className="section-title">Intimité</p>

      <div className="grid sm:grid-cols-2 gap-4">
        <FormField label="Fréquence des rapports" hint="nombre par mois">
          <input type="number" min={0} className="field-input" {...register('step5.frequenceRapports' as any, { valueAsNumber: true })} />
        </FormField>
        <FormField label="Utilisation d'un lubrifiant ?">
          <RadioGroup
            name="step5.lubrifiant"
            options={OUI_NON}
            value={watch('step5.lubrifiant' as any)}
            onChange={(v) => setValue('step5.lubrifiant' as any, v)}
            horizontal
          />
          {watch('step5.lubrifiant' as any) === 'oui' && (
            <input className="field-input mt-2" placeholder="Lequel ?" {...register('step5.quelLubrifiant' as any)} />
          )}
        </FormField>
      </div>

      <FormField label="Douleur pendant les rapports sexuels ?">
        <RadioGroup
          name="step3.douleurRapports"
          options={[
            { value: 'non', label: 'Non' },
            { value: 'superficielle', label: 'Oui, superficielle' },
            { value: 'profonde', label: 'Oui, profonde' },
          ]}
          value={watch('step3.douleurRapports' as any)}
          onChange={(v) => setValue('step3.douleurRapports' as any, v)}
          horizontal
        />
      </FormField>

      <FormField label="Saignements post-coïtaux (après les rapports) ?">
        <RadioGroup
          name="step3.saignementsPostCoitaux"
          options={OUI_NON}
          value={watch('step3.saignementsPostCoitaux' as any)}
          onChange={(v) => setValue('step3.saignementsPostCoitaux' as any, v)}
          horizontal
        />
      </FormField>

      <p className="section-title">Antécédents familiaux</p>

      <FormField label="Antécédents familiaux connus">
        <CheckGroup
          options={[
            { value: 'cancer', label: 'Cancer' },
            { value: 'ménopause précoce', label: 'Ménopause précoce (avant 46 ans)' },
            { value: 'cardio-vasculaire', label: 'Cardio-vasculaire' },
            { value: 'diabète', label: 'Diabète' },
            { value: 'endométriose', label: 'Endométriose' },
            { value: 'infertilité', label: 'Infertilité' },
            { value: 'fausses couches répétées', label: 'Grossesses arrêtées à répétition' },
            { value: 'pathologies génétiques', label: 'Pathologies génétiques' },
          ]}
          value={watch('step3.antecedentsFamiliaux' as any) ?? []}
          onChange={(v) => setValue('step3.antecedentsFamiliaux' as any, v)}
          columns={2}
        />
      </FormField>

      <FormField label="Précisions sur les antécédents familiaux">
        <textarea rows={2} className="field-input" {...register('step3.antecedentsFamiliauxDetails' as any)} />
      </FormField>

    </div>
  )
}
