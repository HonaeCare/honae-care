'use client'
import { useFormContext } from 'react-hook-form'
import { FormField, RadioGroup, CheckGroup } from '../../form/FormField'
import type { MenopauseFormData } from '@/lib/types-menopause'

const OUI_NON = [{ value: 'oui', label: 'Oui' }, { value: 'non', label: 'Non' }]

export default function MStep5() {
  const { register, watch, setValue } = useFormContext<MenopauseFormData>()
  const tabac = watch('step5.tabac')
  const drogues = watch('step5.drogues')

  return (
    <div>
      <h2 className="text-lg font-semibold text-wine mb-6">Substances, nutrition &amp; digestion</h2>

      <p className="section-title">Substances</p>

      <FormField label="Tabac">
        <RadioGroup
          name="step5.tabac"
          options={[
            { value: 'non', label: 'Non-fumeuse' },
            { value: 'ex-fumeuse', label: 'Ex-fumeuse' },
            { value: 'oui', label: 'Fumeuse actuelle' },
          ]}
          value={tabac}
          onChange={(v) => setValue('step5.tabac', v)}
          horizontal
        />
        {tabac === 'ex-fumeuse' && (
          <input className="field-input mt-2" placeholder="Arrêt depuis…" {...register('step5.dateArretTabac')} />
        )}
        {tabac === 'oui' && (
          <input type="number" min={0} max={100} className="field-input mt-2" placeholder="Nombre de cigarettes par jour" {...register('step5.nbCigarettes', { valueAsNumber: true })} />
        )}
      </FormField>

      <div className="grid sm:grid-cols-3 gap-4">
        <FormField label="Alcool (verres / semaine)"><input type="number" min={0} className="field-input" {...register('step5.alcool', { valueAsNumber: true })} /></FormField>
        <FormField label="Cafés (/ jour)"><input type="number" min={0} className="field-input" {...register('step5.cafes', { valueAsNumber: true })} /></FormField>
        <FormField label="Boissons énergisantes (/ jour)"><input type="number" min={0} className="field-input" {...register('step5.boissonsEnergisantes', { valueAsNumber: true })} /></FormField>
      </div>

      <FormField label="Drogues récréatives ?">
        <RadioGroup name="step5.drogues" options={OUI_NON} value={drogues} onChange={(v) => setValue('step5.drogues', v)} horizontal />
        {drogues === 'oui' && (
          <input className="field-input mt-2" placeholder="Type / fréquence" {...register('step5.droguesDetail')} />
        )}
      </FormField>

      <FormField label="Expositions professionnelles / toxiques">
        <CheckGroup
          options={[
            { value: 'solvants', label: 'Solvants' },
            { value: 'pesticides', label: 'Pesticides' },
            { value: 'métaux lourds', label: 'Métaux lourds' },
            { value: 'rayonnements', label: 'Rayonnements' },
            { value: 'autres', label: 'Autres' },
          ]}
          value={watch('step5.expositions') ?? []}
          onChange={(v) => setValue('step5.expositions', v)}
          columns={3}
        />
        {(watch('step5.expositions') ?? []).includes('autres') && (
          <input className="field-input mt-2" placeholder="Préciser l'exposition…" {...register('step5.expositionsAutre')} />
        )}
      </FormField>

      <p className="section-title">Nutrition</p>

      <div className="grid sm:grid-cols-3 gap-4">
        <FormField label="Nombre de repas / jour"><input type="number" min={1} max={8} className="field-input" {...register('step5.nbRepas', { valueAsNumber: true })} /></FormField>
        <FormField label="Repas réguliers ?">
          <RadioGroup name="step5.regulariteRepas" options={OUI_NON} value={watch('step5.regulariteRepas')} onChange={(v) => setValue('step5.regulariteRepas', v)} horizontal />
        </FormField>
        <FormField label="Petit-déjeuner ?">
          <RadioGroup name="step5.petitDejeuner" options={OUI_NON} value={watch('step5.petitDejeuner')} onChange={(v) => setValue('step5.petitDejeuner', v)} horizontal />
        </FormField>
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        <FormField label="Grignotages ?">
          <RadioGroup name="step5.grignotages" options={OUI_NON} value={watch('step5.grignotages')} onChange={(v) => setValue('step5.grignotages', v)} horizontal />
        </FormField>
        <FormField label="Jeûne intermittent ?">
          <RadioGroup name="step5.jeuneIntermittent" options={OUI_NON} value={watch('step5.jeuneIntermittent')} onChange={(v) => setValue('step5.jeuneIntermittent', v)} horizontal />
        </FormField>
        <FormField label="Plutôt sucré ou salé ?"><input className="field-input" {...register('step5.sucreSale')} /></FormField>
      </div>

      <FormField label="Profil alimentaire — cochez ce que vous consommez fréquemment">
        <CheckGroup
          options={[
            { value: 'légumineuses', label: 'Légumineuses' },
            { value: 'produits laitiers', label: 'Produits laitiers (vache/chèvre/brebis)' },
            { value: 'poissons gras', label: 'Poissons gras' },
            { value: 'légumes quotidiens', label: 'Légumes quotidiens' },
            { value: 'fruits quotidiens', label: 'Fruits quotidiens' },
            { value: 'ultra-transformés', label: 'Produits ultra-transformés fréquents' },
            { value: 'céréales complètes', label: 'Céréales complètes' },
            { value: 'viande', label: 'Viande (blanche / rouge)' },
            { value: 'sucres ajoutés', label: 'Sucres ajoutés élevés' },
          ]}
          value={watch('step5.profilAlimentaire') ?? []}
          onChange={(v) => setValue('step5.profilAlimentaire', v)}
          columns={3}
        />
      </FormField>

      <p className="section-title">Sédentarité &amp; hydratation</p>
      <div className="grid sm:grid-cols-2 gap-4">
        <FormField label="Temps de marche ou nombre de pas / jour"><input className="field-input" {...register('step5.marchePas')} /></FormField>
        <FormField label="Heures en position assise / jour"><input type="number" min={0} max={24} className="field-input" {...register('step5.heuresAssis', { valueAsNumber: true })} /></FormField>
        <FormField label="Hydratation (litres d'eau / jour)"><input type="number" min={0} max={6} step={0.25} className="field-input" {...register('step5.hydratation', { valueAsNumber: true })} /></FormField>
        <FormField label="Type d'eau">
          <RadioGroup
            name="step5.typeEau"
            options={[
              { value: 'robinet', label: 'Robinet' },
              { value: 'filtrée', label: 'Filtrée' },
              { value: 'bouteille', label: 'Bouteille' },
            ]}
            value={watch('step5.typeEau')}
            onChange={(v) => setValue('step5.typeEau', v)}
            horizontal
          />
        </FormField>
      </div>

      <p className="section-title">Digestion</p>
      <div className="grid sm:grid-cols-2 gap-4">
        <FormField label="Nombre de selles / jour"><input type="number" min={0} max={10} className="field-input" {...register('step5.nbSelles', { valueAsNumber: true })} /></FormField>
        <FormField label="Transit régulier ?">
          <RadioGroup name="step5.regulariteSelles" options={OUI_NON} value={watch('step5.regulariteSelles')} onChange={(v) => setValue('step5.regulariteSelles', v)} horizontal />
        </FormField>
        <FormField label="Ballonnements ?">
          <RadioGroup name="step5.ballonnements" options={OUI_NON} value={watch('step5.ballonnements')} onChange={(v) => setValue('step5.ballonnements', v)} horizontal />
        </FormField>
        <FormField label="Acidité ?">
          <RadioGroup name="step5.acidite" options={OUI_NON} value={watch('step5.acidite')} onChange={(v) => setValue('step5.acidite', v)} horizontal />
        </FormField>
      </div>

      <FormField label="Échelle de Bristol (consistance des selles)" hint="1 = très dur · 4 = idéal · 7 = liquide">
        <div className="flex items-center gap-2 mt-2 flex-wrap">
          {[1, 2, 3, 4, 5, 6, 7].map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => setValue('step5.bristolScale', n)}
              className={`w-10 h-10 rounded-full text-sm font-bold border-2 transition-all
                ${watch('step5.bristolScale') === n
                  ? 'bg-wine text-white border-wine shadow-sm'
                  : 'bg-white text-gray-500 border-gray-200 hover:border-wine/50'}`}
            >
              {n}
            </button>
          ))}
        </div>
      </FormField>
    </div>
  )
}
