'use client'
import { useFormContext } from 'react-hook-form'
import { FormField, RadioGroup, CheckGroup, SliderField } from '../FormField'
import type { FormData } from '@/lib/types'

const OUI_NON = [{ value: 'oui', label: 'Oui' }, { value: 'non', label: 'Non' }]

export default function Step3() {
  const { register, watch, setValue, formState: { errors } } = useFormContext<FormData>()
  const douleursRegles = watch('step3.douleursRegles')
  const spotting = watch('step3.spotting')

  return (
    <div>
      <h2 className="text-lg font-semibold text-wine mb-6">Cycles et contraception</h2>

      <p className="section-title">Cycles menstruels</p>

      <div className="grid sm:grid-cols-2 gap-4">
        <FormField label="Âge des premières règles" hint="en années">
          <input type="number" min={8} max={20} className="field-input" {...register('step3.agePremieresRegles', { valueAsNumber: true })} />
        </FormField>
        <FormField label="Durée des règles" hint="en jours">
          <input type="number" min={1} max={15} className="field-input" {...register('step3.dureeRegles', { valueAsNumber: true })} />
        </FormField>
      </div>

      <FormField label="Régularité des cycles">
        <RadioGroup
          name="step3.regularite"
          options={[
            { value: 'réguliers 25-35j', label: 'Réguliers (25–35 jours)' },
            { value: 'irréguliers', label: 'Irréguliers' },
            { value: 'aménorrhée', label: 'Aménorrhée (absence de règles)' },
          ]}
          value={watch('step3.regularite')}
          onChange={(v) => setValue('step3.regularite', v)}
        />
      </FormField>

      <FormField label="Flux menstruel">
        <RadioGroup
          name="step3.flux"
          options={[
            { value: 'faible', label: 'Faible' },
            { value: 'normal', label: 'Normal' },
            { value: 'abondant/caillots', label: 'Abondant / avec caillots' },
          ]}
          value={watch('step3.flux')}
          onChange={(v) => setValue('step3.flux', v)}
          horizontal
        />
      </FormField>

      <FormField label="Douleurs de règles (dysménorrhée) ?">
        <RadioGroup
          name="step3.douleursRegles"
          options={OUI_NON}
          value={douleursRegles}
          onChange={(v) => setValue('step3.douleursRegles', v)}
          horizontal
        />
        {douleursRegles === 'oui' && (
          <div className="mt-3 bg-rose/20 rounded-xl p-4 border border-rose/40">
            <FormField label="Intensité de la douleur (0 = aucune, 10 = maximale)">
              <SliderField
                value={watch('step3.intensiteDouleur') ?? 5}
                onChange={(v) => setValue('step3.intensiteDouleur', v)}
              />
            </FormField>
            <FormField label="Localisation de la douleur">
              <input className="field-input" placeholder="Ex : pelvis, lombaires, cuisses…" {...register('step3.localisationDouleur')} />
            </FormField>
          </div>
        )}
      </FormField>

      <FormField label="Phase lutéale (post-ovulation jusqu'au premier jour des règles)" hint="en jours (facultatif)">
        <input type="number" min={7} max={20} className="field-input" {...register('step3.phaseLuteale', { valueAsNumber: true })} />
      </FormField>

      <FormField label="Spotting (saignements en dehors des règles) ?">
        <RadioGroup
          name="step3.spotting"
          options={OUI_NON}
          value={spotting}
          onChange={(v) => setValue('step3.spotting', v)}
          horizontal
        />
        {spotting === 'oui' && (
          <input className="field-input mt-2" placeholder="Quand ? (avant règles, mi-cycle…)" {...register('step3.quandSpotting')} />
        )}
      </FormField>

      <FormField label="Signes d'ovulation ressentis">
        <CheckGroup
          options={[
            { value: 'glaire cervicale', label: 'Glaire cervicale' },
            { value: 'douleur ovarienne', label: 'Douleur ovarienne en milieu de cycle' },
            { value: 'tests ovulation', label: "Tests d'ovulation positifs" },
            { value: 'courbe température', label: 'Courbe de température' },
          ]}
          value={watch('step3.signesOvulation') ?? []}
          onChange={(v) => setValue('step3.signesOvulation', v)}
          columns={2}
        />
      </FormField>

      <p className="section-title">Contraception</p>

      <FormField label="Type(s) de contraception actuelle ou passée" required error={(errors.step3 as any)?.typeContraception?.message}>
        <CheckGroup
          name="step3.typeContraception"
          options={[
            { value: 'pilule', label: 'Pilule' },
            { value: 'implant', label: 'Implant' },
            { value: 'SIU hormonal', label: 'SIU hormonal (Mirena…)' },
            { value: 'SIU cuivre', label: 'SIU cuivre (DIU)' },
            { value: 'anneau', label: 'Anneau vaginal' },
            { value: 'patch', label: 'Patch' },
            { value: 'diaphragme', label: 'Diaphragme' },
            { value: 'préservatifs', label: 'Préservatifs' },
            { value: 'aucune', label: 'Aucune' },
          ]}
          value={watch('step3.typeContraception') ?? []}
          onChange={(v) => setValue('step3.typeContraception', v)}
          columns={3}
        />
      </FormField>

      <div className="grid sm:grid-cols-2 gap-4">
        <FormField label="Marque / nom du produit">
          <input className="field-input" {...register('step3.marqueContraception')} />
        </FormField>
        <FormField label="Date d'arrêt contraception hormonale" hint="Facultatif">
          <input type="date" className="field-input" {...register('step3.dateArretContraception')} />
        </FormField>
      </div>

      <FormField label="Effets secondaires éventuels">
        <input className="field-input" {...register('step3.effetsSecondairesContraception')} />
      </FormField>

    </div>
  )
}
