'use client'
import { useFormContext } from 'react-hook-form'
import { FormField, RadioGroup, CheckGroup, SliderField } from '../../form/FormField'
import type { MenopauseFormData } from '@/lib/types-menopause'

const OUI_NON = [{ value: 'oui', label: 'Oui' }, { value: 'non', label: 'Non' }]

export default function MStep3() {
  const { register, watch, setValue } = useFormContext<MenopauseFormData>()
  const douleursRegles = watch('step3.douleursRegles')
  const modifFreq = watch('step3.modifFrequenceCycles')
  const modifDuree = watch('step3.modifDureeCycles')

  return (
    <div>
      <h2 className="text-lg font-semibold text-wine mb-6">Examens, symptômes &amp; cycles</h2>

      <p className="section-title">Antécédents chirurgicaux</p>
      <FormField label="Chirurgies / hospitalisations (avec dates)">
        <textarea rows={2} className="field-input" placeholder="Ex : cœlioscopie 2020, appendicectomie 2015…" {...register('step3.chirurgies')} />
      </FormField>
      <FormField label="Autres antécédents">
        <input className="field-input" {...register('step3.autresAntecedents')} />
      </FormField>

      <p className="section-title">Examens réalisés</p>
      <div className="grid sm:grid-cols-2 gap-4">
        <FormField label="Mammographie — Date" hint="Si connue"><input type="date" className="field-input" {...register('step3.mammographieDate')} /></FormField>
        <FormField label="Mammographie — Résultat"><input className="field-input" {...register('step3.mammographieResultat')} /></FormField>
        <FormField label="Dernier frottis (PAP test) / HPV — Date" hint="Si connue"><input type="date" className="field-input" {...register('step3.frottisDate')} /></FormField>
        <FormField label="Dernier frottis (PAP test) / HPV — Résultat"><input className="field-input" placeholder="Ex : normal, CIN1, HPV positif…" {...register('step3.frottisResultat')} /></FormField>
      </div>
      <FormField label="Bilan hormonal réalisé il y a moins d'un an"><input className="field-input" {...register('step3.bilanHormonal')} /></FormField>
      <FormField label="Autres examens" hint="Densitométrie osseuse, coloscopie, etc."><input className="field-input" {...register('step3.autresExamens')} /></FormField>

      <p className="section-title">Symptômes ressentis</p>
      <FormField label="Cochez les symptômes que vous ressentez">
        <CheckGroup
          options={[
            { value: 'douleur musculaire/articulaire', label: 'Douleur musculaire / articulaire' },
            { value: 'tendinite fréquente', label: 'Tendinite fréquente' },
            { value: 'jambes lourdes', label: 'Jambes lourdes' },
            { value: 'yeux secs', label: 'Yeux secs' },
            { value: 'chute de cheveux', label: 'Chute de cheveux' },
            { value: 'perte élasticité peau', label: "Perte d'élasticité de la peau" },
            { value: 'sueurs nocturnes', label: 'Sueurs nocturnes' },
            { value: 'malaises inexpliqués', label: 'Malaise(s) inexpliqué(s)' },
            { value: 'bouffées de chaleur', label: 'Bouffées de chaleur' },
            { value: 'hypertension artérielle', label: 'Hypertension artérielle' },
            { value: 'sensation oppression', label: "Sensation d'oppression" },
            { value: 'essoufflement effort', label: "Essoufflement à l'effort" },
            { value: 'vertiges', label: 'Vertiges' },
            { value: 'troubles du sommeil', label: 'Troubles du sommeil' },
            { value: 'dépression', label: 'Dépression' },
            { value: 'palpitations', label: 'Palpitations' },
            { value: 'burn-out', label: 'Burn-out' },
            { value: 'brouillard mental', label: 'Brouillard mental' },
            { value: 'perte de mémoire', label: 'Perte de mémoire' },
          ]}
          value={watch('step3.symptomes') ?? []}
          onChange={(v) => setValue('step3.symptomes', v)}
          columns={2}
        />
      </FormField>
      <FormField label="Autres symptômes"><input className="field-input" {...register('step3.symptomesAutre')} /></FormField>

      <p className="section-title">Antécédents gynécologiques &amp; cycles</p>

      <div className="grid sm:grid-cols-2 gap-4">
        <FormField label="Âge des premières règles" hint="en années">
          <input type="number" min={8} max={20} className="field-input" {...register('step3.agePremieresRegles', { valueAsNumber: true })} />
        </FormField>
        <FormField label="Règles encore présentes ?">
          <RadioGroup name="step3.reglesPresentes" options={OUI_NON} value={watch('step3.reglesPresentes')} onChange={(v) => setValue('step3.reglesPresentes', v)} horizontal />
        </FormField>
      </div>

      <FormField label="Modification de la fréquence des cycles ?">
        <RadioGroup name="step3.modifFrequenceCycles" options={OUI_NON} value={modifFreq} onChange={(v) => setValue('step3.modifFrequenceCycles', v)} horizontal />
        {modifFreq === 'oui' && (
          <input className="field-input mt-2" placeholder="Depuis quand ?" {...register('step3.modifFrequenceDepuis')} />
        )}
      </FormField>

      <FormField label="Modification de la durée des cycles ?">
        <RadioGroup name="step3.modifDureeCycles" options={OUI_NON} value={modifDuree} onChange={(v) => setValue('step3.modifDureeCycles', v)} horizontal />
        {modifDuree === 'oui' && (
          <input className="field-input mt-2" placeholder="Durée (en jours)" {...register('step3.modifDureeJours')} />
        )}
      </FormField>

      <div className="grid sm:grid-cols-2 gap-4">
        <FormField label="Flux menstruel">
          <RadioGroup
            name="step3.flux"
            options={[
              { value: 'faible', label: 'Faible' },
              { value: 'normal', label: 'Normal' },
              { value: 'abondant/caillots', label: 'Abondant / caillots' },
            ]}
            value={watch('step3.flux')}
            onChange={(v) => setValue('step3.flux', v)}
          />
        </FormField>
        <FormField label="Couleur">
          <RadioGroup
            name="step3.couleur"
            options={[
              { value: 'rouge vif', label: 'Rouge vif' },
              { value: 'brun', label: 'Brun' },
              { value: 'grisâtre', label: 'Grisâtre' },
            ]}
            value={watch('step3.couleur')}
            onChange={(v) => setValue('step3.couleur', v)}
          />
        </FormField>
      </div>

      <FormField label="Douleurs de règles (dysménorrhées) ?">
        <RadioGroup name="step3.douleursRegles" options={OUI_NON} value={douleursRegles} onChange={(v) => setValue('step3.douleursRegles', v)} horizontal />
        {douleursRegles === 'oui' && (
          <div className="mt-3 bg-rose/20 rounded-xl p-4 border border-rose/40">
            <FormField label="Intensité de la douleur (0 = aucune, 10 = maximale)">
              <SliderField value={watch('step3.intensiteDouleur') ?? 5} onChange={(v) => setValue('step3.intensiteDouleur', v)} />
            </FormField>
            <FormField label="Localisation de la douleur">
              <input className="field-input" placeholder="Ex : pelvis, lombaires, cuisses…" {...register('step3.localisationDouleur')} />
            </FormField>
          </div>
        )}
      </FormField>

      <FormField label="Type de contraception actuelle / passée" hint="Pilule, implant, SIU hormonal, SIU cuivre, préservatif, etc.">
        <input className="field-input" {...register('step3.contraceptionType')} />
      </FormField>
      <div className="grid sm:grid-cols-2 gap-4">
        <FormField label="Marque / nom du produit"><input className="field-input" {...register('step3.contraceptionMarque')} /></FormField>
        <FormField label="Effets secondaires éventuels"><input className="field-input" {...register('step3.contraceptionEffets')} /></FormField>
      </div>

      <FormField label="Traitement en cours" hint="Ex : Mounjaro, Ozempic, etc.">
        <input className="field-input" {...register('step3.traitementEnCours')} />
      </FormField>

      <FormField label="Autres (gynécologique)">
        <input className="field-input" {...register('step3.autresGyneco')} />
      </FormField>
    </div>
  )
}
