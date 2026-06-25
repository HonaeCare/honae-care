import React from 'react'
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  renderToBuffer,
} from '@react-pdf/renderer'
import type { FormData } from './types'

// Charte graphique Honae Care
const WINE    = '#5B1820'
const ROSE    = '#F6D6D5'
const ECRU    = '#FAF8F2'
const MUSTARD = '#E2AE00'
const GRAY    = '#444444'

const styles = StyleSheet.create({
  page: {
    fontFamily: 'Helvetica',
    fontSize: 9,
    paddingTop: 36,
    paddingBottom: 48,
    paddingHorizontal: 44,
    color: GRAY,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    borderBottomWidth: 2,
    borderBottomColor: WINE,
    paddingBottom: 10,
    marginBottom: 16,
  },
  headerLeft: { flexDirection: 'column' },
  headerSubtitle: { fontSize: 7, color: MUSTARD, letterSpacing: 1.5, marginBottom: 2 },
  logo: { fontSize: 20, fontFamily: 'Helvetica-Bold', color: WINE },
  headerInfo: { textAlign: 'right', fontSize: 7.5, color: '#888' },
  sectionTitle: {
    fontSize: 7.5,
    fontFamily: 'Helvetica-Bold',
    color: WINE,
    letterSpacing: 1.2,
    borderBottomWidth: 0.5,
    borderBottomColor: ROSE,
    paddingBottom: 3,
    marginTop: 16,
    marginBottom: 7,
    textTransform: 'uppercase',
  },
  row: { flexDirection: 'row', marginBottom: 3.5, flexWrap: 'wrap' },
  label: { fontFamily: 'Helvetica-Bold', color: '#666', minWidth: 150, fontSize: 8.5 },
  value: { flex: 1, color: GRAY, fontSize: 8.5 },
  block: { marginBottom: 5 },
  blockLabel: { fontFamily: 'Helvetica-Bold', color: '#666', marginBottom: 1.5, fontSize: 8.5 },
  blockValue: { color: GRAY, paddingLeft: 10, fontSize: 8.5 },
  footer: {
    position: 'absolute',
    bottom: 20,
    left: 44,
    right: 44,
    textAlign: 'center',
    fontSize: 7,
    color: '#aaa',
    borderTopWidth: 0.5,
    borderTopColor: ROSE,
    paddingTop: 4,
  },
  consentBox: {
    marginTop: 12,
    borderWidth: 1,
    borderColor: ROSE,
    borderRadius: 3,
    padding: 10,
    backgroundColor: ECRU,
  },
  accentBar: {
    width: 24,
    height: 2,
    backgroundColor: MUSTARD,
    marginTop: 2,
    marginBottom: 6,
  },
})

const Field = ({ label, value }: { label: string; value?: string | number | null }) => {
  if (value === undefined || value === null || value === '') return null
  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label} :</Text>
      <Text style={styles.value}>{String(value)}</Text>
    </View>
  )
}

const BlockField = ({ label, value }: { label: string; value?: string | null }) => {
  if (!value) return null
  return (
    <View style={styles.block}>
      <Text style={styles.blockLabel}>{label} :</Text>
      <Text style={styles.blockValue}>{value}</Text>
    </View>
  )
}

const arrToStr = (arr?: string[] | null) => arr?.filter(Boolean).join(', ') || null

const AnamnesePDF = ({ data, date }: { data: FormData; date: string }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.logo}>Honae Care</Text>
          <Text style={styles.headerSubtitle}>MAISON DE FERTILITÉ</Text>
        </View>
        <View style={styles.headerInfo}>
          <Text>Formulaire d&apos;anamnèse fertilité</Text>
          <Text>Date : {date}</Text>
          <Text>Patient·e : {data.step1?.prenom} {data.step1?.nom}</Text>
        </View>
      </View>

      {/* Étape 1 */}
      <Text style={styles.sectionTitle}>1 — Informations personnelles</Text>
      <Field label="Date formulaire" value={data.step1?.dateFormulaire} />
      <Field label="Complété par" value={data.step1?.completePar} />
      {data.step1?.completeParAutre && <Field label="Complété par (précision)" value={data.step1.completeParAutre} />}
      <Field label="Prénom / Nom" value={`${data.step1?.prenom ?? ''} ${data.step1?.nom ?? ''}`} />
      <Field label="Date de naissance" value={data.step1?.dateNaissance} />
      <Field label="Adresse" value={data.step1?.adresse} />
      <Field label="Téléphone" value={data.step1?.telephone} />
      <Field label="Email" value={data.step1?.email} />
      <Field label="NISS" value={data.step1?.niss} />
      <Field label="Profession" value={data.step1?.profession} />
      <Field label="Mutuelle" value={data.step1?.mutuelle} />
      <Field label="Médecin traitant" value={data.step1?.medecinTraitant} />
      <Field label="Situation familiale" value={data.step1?.situationFamiliale} />
      {data.step1?.situationFamilialeAutre && <Field label="Situation (précision)" value={data.step1.situationFamilialeAutre} />}
      {data.step1?.situationFamiliale === 'en couple' && (
        <>
          <Field label="Partenaire — Prénom/Nom" value={`${data.step1?.partenairePrenom ?? ''} ${data.step1?.partenaireNom ?? ''}`} />
          <Field label="Partenaire — Sexe" value={data.step1?.partenaireSexe} />
          {data.step1?.partenaireSexeAutre && <Field label="Partenaire — Sexe (précision)" value={data.step1.partenaireSexeAutre} />}
          <Field label="Partenaire — Âge" value={data.step1?.partenaireAge} />
          <Field label="Partenaire — Profession" value={data.step1?.partenaireProfession} />
        </>
      )}
      <Field label="Préférence contact" value={arrToStr(data.step1?.preferenceContact)} />
      <Field label="Langue" value={data.step1?.langue} />

      {/* Étape 2 */}
      <Text style={styles.sectionTitle}>2 — Parcours & antécédents médicaux</Text>
      <Field label="Motif principal" value={data.step2?.motifPrincipal} />
      <BlockField label="Attentes vis-à-vis de Honae" value={data.step2?.attentes} />
      <Field label="Bilan fertilité réalisé" value={data.step2?.bilanFertilite} />
      <Field label="Souhait préservation" value={data.step2?.souhaitPreservation} />
      <Field label="Conservation ovocytaire" value={data.step2?.conservationOvocytaire} />
      <Field label="Conservation sperme" value={data.step2?.conservationSperme} />
      <Field label="Essais naturels" value={data.step2?.essaisNaturels} />
      <Field label="Durée essais" value={data.step2?.dureeEssais} />
      <Field label="Rapports ciblés période fertile" value={data.step2?.rapportsCibles} />
      <Field label="Outils utilisés" value={arrToStr(data.step2?.outilsUtilises)} />
      <BlockField label="Parcours PMA" value={data.step2?.parcoursPMA} />
      <Field label="Maladies chroniques/auto-immunes" value={data.step2?.maladiesChroniques} />
      <Field label="SOPK" value={data.step2?.sopk} />
      <Field label="Endométriose" value={data.step2?.endometriose} />
      <Field label="Adénomyose" value={data.step2?.adenomyose} />
      <Field label="Fibromes/Polypes" value={data.step2?.fibromes} />
      <Field label="Infections pelviennes" value={data.step2?.infectionsPelviennes} />
      <Field label="Autre pathologie" value={data.step2?.autrePathologie} />
      <Field label="Pathologies endocriniennes" value={data.step2?.pathologiesEndocriniennes} />
      <Field label="Insuffisance ovarienne précoce" value={data.step2?.insuffisanceOvarienne} />
      <Field label="Troubles surrénaliens" value={data.step2?.troublesSurrenaliens} />
      <Field label="Diabète/insulinorésistance" value={data.step2?.diabete} />
      <Field label="Pathologies hypophysaires" value={data.step2?.pathologiesHypophysaires} />
      <Field label="Allergies/intolérances" value={data.step2?.allergies} />
      <BlockField label="Traitements en cours" value={data.step2?.traitementsEnCours} />
      <Field label="Vaccinations" value={arrToStr(data.step2?.vaccinations)} />
      <Field label="Thrombose" value={data.step2?.thrombose} />

      {/* Étape 3 */}
      <Text style={styles.sectionTitle}>3 — Cycles & antécédents gynécologiques</Text>
      <Field label="Âge premières règles" value={data.step3?.agePremieresRegles} />
      <Field label="Régularité" value={data.step3?.regularite} />
      <Field label="Durée règles (jours)" value={data.step3?.dureeRegles} />
      <Field label="Flux" value={data.step3?.flux} />
      <Field label="Douleurs de règles" value={data.step3?.douleursRegles} />
      <Field label="Intensité douleur (0-10)" value={data.step3?.intensiteDouleur} />
      <Field label="Localisation douleur" value={data.step3?.localisationDouleur} />
      <Field label="Phase lutéale (jours)" value={data.step3?.phaseLuteale} />
      <Field label="Spotting" value={data.step3?.spotting} />
      <Field label="Quand spotting" value={data.step3?.quandSpotting} />
      <Field label="Signes ovulation" value={arrToStr(data.step3?.signesOvulation)} />
      <Field label="Douleur pendant rapports" value={data.step3?.douleurRapports} />
      <Field label="Saignements post-coïtaux" value={data.step3?.saignementsPostCoitaux} />
      <Field label="Troubles digestifs/pelviens" value={data.step3?.troublesDigestifs} />
      <Field label="Type contraception" value={arrToStr(data.step3?.typeContraception)} />
      <Field label="Marque contraception" value={data.step3?.marqueContraception} />
      <Field label="Date arrêt contraception hormonale" value={data.step3?.dateArretContraception} />
      <Field label="Effets secondaires contraception" value={data.step3?.effetsSecondairesContraception} />
      <Field label="Acné résistante" value={data.step3?.acne} />
      <Field label="Pilosité excessive" value={data.step3?.pilosite} />
      <Field label="Chute de cheveux" value={data.step3?.chuteCheveux} />
      <BlockField label="Chirurgies/hospitalisations" value={data.step3?.chirurgies} />
      <Field label="Antécédents familiaux" value={arrToStr(data.step3?.antecedentsFamiliaux)} />
      <Field label="Précisions antécédents familiaux" value={data.step3?.antecedentsFamiliauxDetails} />
      <Field label="Sérologies connues" value={arrToStr(data.step3?.serologies)} />

      {/* Étape 4 */}
      <Text style={styles.sectionTitle}>4 — Examens & antécédents obstétricaux</Text>
      <Field label="Examens réalisés" value={arrToStr(data.step4?.examensRealises)} />
      {data.step4?.examensRealisesAutre && <Field label="Examens réalisés (autre)" value={data.step4.examensRealisesAutre} />}
      <Field label="Malformations utérines" value={data.step4?.malformationsUterines} />
      <Field label="Nombre total grossesses" value={data.step4?.nombreGrossesses} />
      <BlockField label="Détail grossesses" value={data.step4?.detailGrossesses} />
      <Field label="Allaitement" value={data.step4?.allaitement} />
      <Field label="Durée allaitement" value={data.step4?.dureeAllaitement} />
      <Field label="Nombre fausses couches" value={data.step4?.nombreFaussesCouches} />
      <Field label="Âge gestationnel FC" value={data.step4?.ageGestFC} />
      <Field label="Analyses FC réalisées" value={data.step4?.analysesFC} />
      <Field label="Complications obstétricales" value={data.step4?.complicationsObstetricales} />

      {/* Étape 5 — conditionnelle */}
      {data.step5 && (
        <>
          <Text style={styles.sectionTitle}>5 — Fertilité masculine</Text>
          <Field label="Antécédents" value={arrToStr(data.step5?.antecedentsMasculins)} />
          <Field label="Chirurgies" value={data.step5?.chirurgiesMasculins} />
          <Field label="Traitements en cours" value={data.step5?.traitementsMasculins} />
          <Field label="Fonction sexuelle" value={arrToStr(data.step5?.fonctionSexuelle)} />
          <Field label="Fréquence rapports/mois" value={data.step5?.frequenceRapports} />
          <Field label="Lubrifiant" value={data.step5?.lubrifiant} />
          <Field label="Quel lubrifiant" value={data.step5?.quelLubrifiant} />
          <Field label="Expositions" value={arrToStr(data.step5?.expositions)} />
          <Field label="Fertilité antérieure" value={data.step5?.fertilitéAnterieure} />
          <Field label="Délais conception" value={data.step5?.delaisConception} />
          <Field label="Spermogramme" value={data.step5?.spermogramme} />
          <Field label="Fragmentation ADN" value={data.step5?.fragmentationADN} />
          <Field label="Échographie génito-urinaire" value={data.step5?.echoGenitourinaire} />
          <Field label="Caryotype" value={data.step5?.caryotype} />
          <Field label="Autres examens" value={data.step5?.autresExamensMasculins} />
          <Field label="Dernier frottis date" value={data.step5?.dernierFrottisDate} />
          <Field label="Dernier frottis résultat" value={data.step5?.dernierFrottisResultat} />
          <Field label="Chute de cheveux" value={data.step5?.chutCheveux} />
        </>
      )}

      {/* Étape 6 */}
      <Text style={styles.sectionTitle}>6 — Mode de vie & nutrition</Text>
      <Field label="Stress perçu (0-10)" value={data.step6?.stress} />
      <Field label="Événements majeurs récents" value={data.step6?.evenementsMajeurs} />
      <Field label="Activité physique" value={data.step6?.activitePhysique} />
      <Field label="Taille (cm)" value={data.step6?.taille} />
      <Field label="Poids (kg)" value={data.step6?.poids} />
      <Field label="Variation pondérale récente" value={data.step6?.variationPonderale} />
      <Field label="Sommeil (h/nuit)" value={data.step6?.sommeilHeures} />
      <Field label="Qualité sommeil" value={data.step6?.qualiteSommeil} />
      <Field label="Ronflements/SAOS" value={arrToStr(data.step6?.ronflementsOAS)} />
      <Field label="Tabac" value={data.step6?.tabac} />
      <Field label="Alcool (verres/semaine)" value={data.step6?.alcool} />
      <Field label="Caféine (nb/jour)" value={data.step6?.cafeine} />
      <Field label="Drogues récréatives" value={data.step6?.drogues} />
      <Field label="Expositions professionnelles" value={arrToStr(data.step6?.expositionsProfessionnelles)} />
      <Field label="Soutien psychologique" value={data.step6?.soutienPsychologique} />
      <Field label="Nb repas/jour" value={data.step6?.nbRepas} />
      <Field label="Profil alimentaire" value={arrToStr(data.step6?.profilAlimentaire)} />
      <Field label="Hydratation (L/jour)" value={data.step6?.hydratation} />
      <Field label="Type eau" value={data.step6?.typeEau} />
      <Field label="Nb selles/jour" value={data.step6?.nbSelles} />
      <Field label="Ballonnements/acidité" value={data.step6?.ballonnements} />
      <Field label="Échelle de Bristol" value={data.step6?.bristolScale} />

      {/* Étape 7 */}
      <Text style={styles.sectionTitle}>7 — Bien-être & émotions</Text>
      <BlockField label="Ressenti dans le parcours" value={data.step7?.ressentiParcours} />
      <Field label="Émotions ressenties" value={arrToStr(data.step7?.emotions)} />
      <Field label="Motivation/Optimisme (0-10)" value={data.step7?.motivation} />
      <Field label="Anxiété (0-10)" value={data.step7?.anxiete} />
      <Field label="Facteurs atténuants/aggravants" value={data.step7?.facteurs} />
      <Field label="Soutien actuel" value={data.step7?.soutienActuel} />
      <Field label="Ressources activées" value={arrToStr(data.step7?.ressources)} />
      <Field label="Impact sur le quotidien" value={arrToStr(data.step7?.impactQuotidien)} />
      <Field label="Signal d'alerte" value={data.step7?.signalAlerte} />
      <Field label="Souhait en parler en consultation" value={data.step7?.souhaitParlerConsultation} />
      <Field label="Besoins accompagnement Honae" value={arrToStr(data.step7?.besoinsAccompagnement)} />
      <Field label="Documents à apporter" value={arrToStr(data.step7?.documentsApporter)} />

      {/* Étape 8 */}
      <Text style={styles.sectionTitle}>8 — Consentements RGPD</Text>
      <View style={styles.consentBox}>
        <Field label="Politique confidentialité acceptée" value={data.step8?.consentPolitique ? 'Oui' : 'Non'} />
        <Field label="Données pseudonymisées" value={data.step8?.consentStatistiques ? 'Oui' : 'Non'} />
        <Field label="Contact secrétariat accepté" value={data.step8?.consentContact ? 'Oui' : 'Non'} />
        <Field label="Partage praticiens Honae" value={data.step8?.partageHonae} />
        <Field label="Partage partenaire" value={data.step8?.partagePartenaire} />
        <Field label="Signature électronique" value={data.step8?.signature} />
        <Field label="Date signature" value={data.step8?.dateSignature} />
      </View>

      {/* Footer */}
      <Text style={styles.footer}>
        Honae Care — Document confidentiel — Données de santé protégées (RGPD) — Généré le {date}
      </Text>
    </Page>
  </Document>
)

export async function generatePDF(data: FormData): Promise<Buffer> {
  const date = new Date().toLocaleDateString('fr-BE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
  // renderToBuffer = API serveur Node.js native de @react-pdf/renderer v4
  // Évite les conflits de réconciliateur React dans Next.js
  const buffer = await renderToBuffer(<AnamnesePDF data={data} date={date} />)
  return Buffer.from(buffer)
}

// Sanitise pour l'usage dans le header Content-Disposition (pas de guillemets, CRLF, etc.)
function safeFilePart(s: string): string {
  return s.replace(/[^a-zA-Z0-9\-_àâéèêëîïôùûüçÀÂÉÈÊËÎÏÔÙÛÜÇ]/g, '_').slice(0, 50)
}

export function buildFileName(data: FormData): string {
  const nom = safeFilePart(data.step1?.nom ?? 'Inconnu')
  const prenom = safeFilePart(data.step1?.prenom ?? 'Inconnu')
  const d = new Date()
  const dateStr = `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}`
  return `Anamnese_${prenom}_${nom}_${dateStr}.pdf`
}
