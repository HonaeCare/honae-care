'use client'
import { useFormContext } from 'react-hook-form'
import { FormField, RadioGroup, CheckGroup, SliderField } from '../FormField'
import type { FormData } from '@/lib/types'

const OUI_NON = [{ value: 'oui', label: 'Oui' }, { value: 'non', label: 'Non' }]

export default function Step6() {
  const { register, watch, setValue } = useFormContext<FormData>()
  const tabac = watch('step6.tabac')
  const drogues = watch('step6.drogues')
  const activite = watch('step6.activitePhysique')

  return (
    <div>
      <h2 className="text-lg font-semibold text-wine mb-6">Mode de vie & nutrition</h2>

      <div className="grid sm:grid-cols-3 gap-4">
        <FormField label="Taille (cm)">
          <input type="number" min={100} max={230} className="field-input" {...register('step6.taille', { valueAsNumber: true })} />
        </FormField>
        <FormField label="Poids (kg)">
          <input type="number" min={30} max={250} className="field-input" {...register('step6.poids', { valueAsNumber: true })} />
        </FormField>
        <FormField label="Variation pondérale récente">
          <input className="field-input" placeholder="Ex : +5 kg en 3 mois" {...register('step6.variationPonderale')} />
        </FormField>
      </div>


      <p className="section-title">Activité physique</p>

      <FormField label="Pratiquez-vous une activité physique ?">
        <RadioGroup
          name="step6.activitePhysique"
          options={OUI_NON}
          value={activite}
          onChange={(v) => setValue('step6.activitePhysique', v)}
          horizontal
        />
      </FormField>

      {activite === 'oui' && (
        <div className="grid sm:grid-cols-2 gap-4">
          <FormField label="Fréquence par semaine">
            <input type="number" min={1} max={14} className="field-input" {...register('step6.activiteFrequence' as any, { valueAsNumber: true })} />
          </FormField>
          <FormField label="Type de sport / activité">
            <input className="field-input" placeholder="Ex : natation, yoga, course à pied…" {...register('step6.activiteType' as any)} />
          </FormField>
        </div>
      )}

      <p className="section-title">Sommeil</p>

      <div className="grid sm:grid-cols-2 gap-4">
        <FormField label="Heures de sommeil par nuit">
          <input type="number" min={3} max={14} step={0.5} className="field-input" {...register('step6.sommeilHeures', { valueAsNumber: true })} />
        </FormField>
        <FormField label="Qualité du sommeil">
          <RadioGroup
            name="step6.qualiteSommeil"
            options={[
              { value: 'bonne', label: 'Bonne' },
              { value: 'moyenne', label: 'Moyenne' },
              { value: 'mauvaise', label: 'Mauvaise' },
            ]}
            value={watch('step6.qualiteSommeil')}
            onChange={(v) => setValue('step6.qualiteSommeil', v)}
            horizontal
          />
        </FormField>
      </div>

      <FormField label="Ronflements / SAOS">
        <CheckGroup
          options={[
            { value: 'ronflements', label: 'Ronflements' },
            { value: 'SAOS', label: "Syndrome d'apnées du sommeil (SAOS)" },
          ]}
          value={watch('step6.ronflementsOAS') ?? []}
          onChange={(v) => setValue('step6.ronflementsOAS', v)}
          columns={2}
        />
      </FormField>

      <p className="section-title">Substances</p>

      <FormField label="Tabac">
        <RadioGroup
          name="step6.tabac"
          options={[
            { value: 'non', label: 'Non-fumeur·se' },
            { value: 'ex-fumeur', label: 'Ex-fumeur·se' },
            { value: 'oui', label: 'Fumeur·se actuel·le' },
          ]}
          value={tabac}
          onChange={(v) => setValue('step6.tabac', v)}
          horizontal
        />
        {tabac === 'ex-fumeur' && (
          <input className="field-input mt-2" placeholder="Date d'arrêt" {...register('step6.dateArretTabac')} />
        )}
        {tabac === 'oui' && (
          <input type="number" className="field-input mt-2" placeholder="Nombre de cigarettes par jour" {...register('step6.nbCigarettes', { valueAsNumber: true })} />
        )}
      </FormField>

      <div className="grid sm:grid-cols-2 gap-4">
        <FormField label="Alcool (verres par semaine)">
          <input type="number" min={0} className="field-input" {...register('step6.alcool', { valueAsNumber: true })} />
        </FormField>
        <FormField label="Boissons caféinées/énergisantes (par jour)">
          <input type="number" min={0} className="field-input" {...register('step6.cafeine', { valueAsNumber: true })} />
        </FormField>
      </div>

      <FormField label="Consommation de drogues récréatives ?">
        <RadioGroup
          name="step6.drogues"
          options={OUI_NON}
          value={drogues}
          onChange={(v) => setValue('step6.drogues', v)}
          horizontal
        />
        {drogues === 'oui' && (
          <input className="field-input mt-2" placeholder="Type et fréquence" {...register('step6.droguesDetail' as any)} />
        )}
      </FormField>

      <FormField label="Expositions professionnelles">
        <CheckGroup
          options={[
            { value: 'solvants', label: 'Solvants chimiques' },
            { value: 'pesticides', label: 'Pesticides' },
            { value: 'métaux lourds', label: 'Métaux lourds' },
            { value: 'rayonnements', label: 'Rayonnements ionisants' },
            { value: 'autres', label: 'Autres' },
          ]}
          value={watch('step6.expositionsProfessionnelles') ?? []}
          onChange={(v) => setValue('step6.expositionsProfessionnelles', v)}
          columns={3}
        />
        {(watch('step6.expositionsProfessionnelles') ?? []).includes('autres') && (
          <input className="field-input mt-2" placeholder="Préciser l'exposition…" {...register('step6.expositionsProfessionnellesAutre' as any)} />
        )}
      </FormField>

      <p className="section-title">Nutrition</p>

      <FormField label="Nombre de repas par jour">
        <input type="number" min={1} max={8} className="field-input w-24" {...register('step6.nbRepas', { valueAsNumber: true })} />
      </FormField>

      <div className="grid sm:grid-cols-2 gap-4">
        <FormField label="Repas réguliers ?">
          <RadioGroup
            name="step6.regulariteRepas"
            options={OUI_NON}
            value={watch('step6.regulariteRepas' as any)}
            onChange={(v) => setValue('step6.regulariteRepas' as any, v)}
            horizontal
          />
        </FormField>
        <FormField label="Grignotage ?">
          <RadioGroup
            name="step6.grignotage"
            options={OUI_NON}
            value={watch('step6.grignotage' as any)}
            onChange={(v) => setValue('step6.grignotage' as any, v)}
            horizontal
          />
        </FormField>
      </div>

      <FormField label="Profil alimentaire (consommation régulière)">
        <CheckGroup
          options={[
            { value: 'légumineuses', label: 'Légumineuses' },
            { value: 'produits laitiers', label: 'Produits laitiers' },
            { value: 'poissons gras', label: 'Poissons gras' },
            { value: 'légumes quotidiens', label: 'Légumes quotidiens' },
            { value: 'fruits quotidiens', label: 'Fruits quotidiens' },
            { value: 'ultra-transformés', label: 'Aliments ultra-transformés' },
            { value: 'céréales complètes', label: 'Céréales complètes' },
            { value: 'viande', label: 'Viande' },
            { value: 'sucres ajoutés', label: 'Sucres ajoutés en excès' },
          ]}
          value={watch('step6.profilAlimentaire') ?? []}
          onChange={(v) => setValue('step6.profilAlimentaire', v)}
          columns={3}
        />
      </FormField>

      <div className="grid sm:grid-cols-2 gap-4">
        <FormField label="Hydratation (litres d'eau par jour)">
          <input type="number" min={0} max={6} step={0.25} className="field-input" {...register('step6.hydratation', { valueAsNumber: true })} />
        </FormField>
        <FormField label="Type d'eau consommée">
          <RadioGroup
            name="step6.typeEau"
            options={[
              { value: 'robinet', label: 'Robinet' },
              { value: 'filtrée', label: 'Filtrée' },
              { value: 'bouteille', label: 'Bouteille' },
            ]}
            value={watch('step6.typeEau')}
            onChange={(v) => setValue('step6.typeEau', v)}
            horizontal
          />
        </FormField>
      </div>

      <p className="section-title">Transit intestinal</p>

      <div className="grid sm:grid-cols-2 gap-4">
        <FormField label="Nombre de selles par jour">
          <input type="number" min={0} max={10} className="field-input" {...register('step6.nbSelles', { valueAsNumber: true })} />
        </FormField>
        <FormField label="Ballonnements / acidité / reflux">
          <input className="field-input" {...register('step6.ballonnements')} />
        </FormField>
      </div>

      <FormField label="Régularité du transit ?">
        <RadioGroup
          name="step6.regulariteTransit"
          options={OUI_NON}
          value={watch('step6.regulariteTransit' as any)}
          onChange={(v) => setValue('step6.regulariteTransit' as any, v)}
          horizontal
        />
      </FormField>

      <FormField
        label={
          <span className="flex items-center gap-2 flex-wrap">
            Échelle de Bristol (consistance des selles)
            <a
              href="https://mes-inconforts-digestifs.fr/wp-content/uploads/2023/10/ECHELLE-BRISTOL-BELLOC-1024x1024.png"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-wine underline hover:text-wine-light font-normal"
              onClick={(e) => e.stopPropagation()}
            >
              Voir l'échelle illustrée →
            </a>
          </span>
        }
        hint="1 = très dur · 4 = idéal · 7 = liquide"
      >
        <div className="flex items-center gap-2 mt-2 flex-wrap">
          {[1, 2, 3, 4, 5, 6, 7].map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => setValue('step6.bristolScale', n)}
              className={`w-10 h-10 rounded-full text-sm font-bold border-2 transition-all
                ${watch('step6.bristolScale') === n
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
