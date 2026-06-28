'use client'
import { useFormContext } from 'react-hook-form'
import { FormField, RadioGroup } from '../../form/FormField'
import type { MenopauseFormData } from '@/lib/types-menopause'

const OUI_NON = [{ value: 'oui', label: 'Oui' }, { value: 'non', label: 'Non' }]

export default function MStep4() {
  const { register, watch, setValue } = useFormContext<MenopauseFormData>()
  const nbGrossesses = watch('step4.nombreGrossesses')

  return (
    <div>
      <h2 className="text-lg font-semibold text-wine mb-6">Obstétrique, vie intime &amp; mode de vie</h2>

      <p className="section-title">Antécédents obstétricaux</p>

      <FormField label="Nombre total de grossesses" hint="Incluant grossesse arrêtée, IVG, grossesse extra-utérine — indiquer 0 si aucune">
        <input type="number" min={0} className="field-input w-24" {...register('step4.nombreGrossesses', { valueAsNumber: true })} />
      </FormField>

      {(nbGrossesses ?? 0) > 0 && (
        <FormField label="Détail de chaque grossesse">
          <textarea
            rows={4}
            className="field-input"
            placeholder="Pour chaque grossesse : année, délai de conception, traitement éventuel, évolution (grossesse arrêtée / IVG / GEU / accouchement), terme, poids de naissance…"
            {...register('step4.detailGrossesses')}
          />
        </FormField>
      )}

      <FormField label="Allaitement" hint="Oui / non, durée">
        <input className="field-input" {...register('step4.allaitement')} />
      </FormField>

      <FormField label="Complications obstétricales" hint="Pré-éclampsie, RCIU, diabète gestationnel, hémorragie de la délivrance…">
        <textarea rows={2} className="field-input" {...register('step4.complicationsObstetricales')} />
      </FormField>

      <p className="section-title">Vie intime &amp; sexuelle</p>

      <div className="grid sm:grid-cols-2 gap-4">
        <FormField label="Êtes-vous sexuellement active ?">
          <RadioGroup name="step4.sexuellementActive" options={OUI_NON} value={watch('step4.sexuellementActive')} onChange={(v) => setValue('step4.sexuellementActive', v)} horizontal />
        </FormField>
        <FormField label="Votre libido actuellement est :">
          <RadioGroup
            name="step4.libido"
            options={[
              { value: 'en hausse', label: 'En hausse' },
              { value: 'identique', label: 'Identique' },
              { value: 'en baisse', label: 'En baisse' },
            ]}
            value={watch('step4.libido')}
            onChange={(v) => setValue('step4.libido', v)}
          />
        </FormField>
      </div>

      <FormField label="Fréquence des rapports">
        <input className="field-input" {...register('step4.frequenceRapports')} />
      </FormField>

      <FormField label="Douleur pendant les rapports (dyspareunie) ?">
        <RadioGroup
          name="step4.dyspareunie"
          options={[
            { value: 'non', label: 'Non' },
            { value: 'superficielle', label: 'Oui, superficielle' },
            { value: 'profonde', label: 'Oui, profonde' },
          ]}
          value={watch('step4.dyspareunie')}
          onChange={(v) => setValue('step4.dyspareunie', v)}
          horizontal
        />
      </FormField>

      <div className="grid sm:grid-cols-2 gap-4">
        <FormField label="Saignements post-coïtaux ?">
          <RadioGroup name="step4.saignementsPostCoitaux" options={OUI_NON} value={watch('step4.saignementsPostCoitaux')} onChange={(v) => setValue('step4.saignementsPostCoitaux', v)} horizontal />
        </FormField>
        <FormField label="Sécheresse vaginale ?">
          <RadioGroup name="step4.secheresseVaginale" options={OUI_NON} value={watch('step4.secheresseVaginale')} onChange={(v) => setValue('step4.secheresseVaginale', v)} horizontal />
        </FormField>
        <FormField label="Cystites fréquentes ?">
          <RadioGroup name="step4.cystites" options={OUI_NON} value={watch('step4.cystites')} onChange={(v) => setValue('step4.cystites', v)} horizontal />
        </FormField>
        <FormField label="Vaginites répétitives ?">
          <RadioGroup name="step4.vaginites" options={OUI_NON} value={watch('step4.vaginites')} onChange={(v) => setValue('step4.vaginites', v)} horizontal />
        </FormField>
        <FormField label="SPM plus marqué qu'avant ?">
          <RadioGroup name="step4.spmMarque" options={OUI_NON} value={watch('step4.spmMarque')} onChange={(v) => setValue('step4.spmMarque', v)} horizontal />
        </FormField>
      </div>

      <FormField label="Troubles digestifs cycliques / douleurs pelviennes">
        <input className="field-input" {...register('step4.troublesDigestifsPelviens')} />
      </FormField>

      <p className="section-title">Mode de vie &amp; hygiène de vie</p>

      <div className="grid sm:grid-cols-3 gap-4">
        <FormField label="Taille (cm)"><input type="number" min={100} max={230} className="field-input" {...register('step4.taille', { valueAsNumber: true })} /></FormField>
        <FormField label="Poids (kg)"><input type="number" min={30} max={250} className="field-input" {...register('step4.poids', { valueAsNumber: true })} /></FormField>
        <FormField label="Variation pondérale récente"><input className="field-input" placeholder="Ex : +5 kg en 3 mois" {...register('step4.variationPonderale')} /></FormField>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <FormField label="Heures de sommeil par nuit">
          <input type="number" min={3} max={14} step={0.5} className="field-input" {...register('step4.sommeilHeures', { valueAsNumber: true })} />
        </FormField>
        <FormField label="Qualité du sommeil">
          <RadioGroup
            name="step4.qualiteSommeil"
            options={[
              { value: 'bonne', label: 'Bonne' },
              { value: 'moyenne', label: 'Moyenne' },
              { value: 'mauvaise', label: 'Mauvaise' },
            ]}
            value={watch('step4.qualiteSommeil')}
            onChange={(v) => setValue('step4.qualiteSommeil', v)}
            horizontal
          />
        </FormField>
        <FormField label="Ronflements / SAOS suspecté ?">
          <RadioGroup name="step4.ronflementsSAOS" options={OUI_NON} value={watch('step4.ronflementsSAOS')} onChange={(v) => setValue('step4.ronflementsSAOS', v)} horizontal />
        </FormField>
        <FormField label="Fuites urinaires / incontinence ?">
          <RadioGroup name="step4.fuitesUrinaires" options={OUI_NON} value={watch('step4.fuitesUrinaires')} onChange={(v) => setValue('step4.fuitesUrinaires', v)} horizontal />
        </FormField>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <FormField label="Activité physique — type"><input className="field-input" placeholder="Ex : natation, yoga, marche…" {...register('step4.activitePhysiqueType')} /></FormField>
        <FormField label="Activité physique — fréquence"><input className="field-input" placeholder="Ex : 3×/semaine" {...register('step4.activitePhysiqueFrequence')} /></FormField>
      </div>
    </div>
  )
}
