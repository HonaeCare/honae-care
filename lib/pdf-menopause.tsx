import React from 'react'
import { Document, Page, Text, View, StyleSheet, renderToBuffer } from '@react-pdf/renderer'
import type { MenopauseFormData } from './types-menopause'

// Charte graphique Honae Care
const WINE = '#5B1820'
const ROSE = '#F6D6D5'
const ECRU = '#FAF8F2'
const GRAY = '#444444'

const styles = StyleSheet.create({
  page: { fontFamily: 'Helvetica', fontSize: 9, paddingTop: 36, paddingBottom: 48, paddingHorizontal: 44, color: GRAY, backgroundColor: '#FFFFFF' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', borderBottomWidth: 2, borderBottomColor: WINE, paddingBottom: 10, marginBottom: 16 },
  headerLeft: { flexDirection: 'column' },
  logo: { fontSize: 20, fontFamily: 'Helvetica-Bold', color: WINE },
  headerSubtitle: { fontSize: 7, color: WINE, letterSpacing: 1.5, marginBottom: 2, marginTop: 4 },
  headerInfo: { textAlign: 'right', fontSize: 7.5, color: '#888' },
  sectionTitle: { fontSize: 7.5, fontFamily: 'Helvetica-Bold', color: WINE, letterSpacing: 1.2, borderBottomWidth: 0.5, borderBottomColor: ROSE, paddingBottom: 3, marginTop: 16, marginBottom: 7, textTransform: 'uppercase' },
  row: { flexDirection: 'row', marginBottom: 3.5, flexWrap: 'wrap' },
  label: { fontFamily: 'Helvetica-Bold', color: '#666', minWidth: 165, fontSize: 8.5 },
  value: { flex: 1, color: GRAY, fontSize: 8.5 },
  block: { marginBottom: 5 },
  blockLabel: { fontFamily: 'Helvetica-Bold', color: '#666', marginBottom: 1.5, fontSize: 8.5 },
  blockValue: { color: GRAY, paddingLeft: 10, fontSize: 8.5 },
  footer: { position: 'absolute', bottom: 20, left: 44, right: 44, textAlign: 'center', fontSize: 7, color: '#aaa', borderTopWidth: 0.5, borderTopColor: ROSE, paddingTop: 4 },
  consentBox: { marginTop: 12, borderWidth: 1, borderColor: ROSE, borderRadius: 3, padding: 10, backgroundColor: ECRU },
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

const arr = (a?: string[] | null) => a?.filter(Boolean).join(', ') || null
const fmtDate = (d?: string | null): string | null => {
  if (!d) return null
  if (/^\d{4}-\d{2}-\d{2}$/.test(d)) return d.split('-').reverse().join('/')
  return d
}

const MenopausePDF = ({ data, date }: { data: MenopauseFormData; date: string }) => {
  const s1 = data.step1, s2 = data.step2, s3 = data.step3, s4 = data.step4, s5 = data.step5, s6 = data.step6, s7 = data.step7, s8 = data.step8
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.logo}>Honae Care</Text>
            <Text style={styles.headerSubtitle}>ANAMNÈSE (PÉRI)MÉNOPAUSE</Text>
          </View>
          <View style={styles.headerInfo}>
            <Text>Anamnèse (Péri)Ménopause</Text>
            <Text>Date : {date}</Text>
            <Text>Patiente : {s1?.prenom} {s1?.nom}</Text>
          </View>
        </View>

        {/* 1 */}
        <Text style={styles.sectionTitle}>1 — Informations personnelles &amp; parcours</Text>
        <Field label="Prénom / Nom" value={`${s1?.prenom ?? ''} ${s1?.nom ?? ''}`} />
        <Field label="Date de naissance" value={fmtDate(s1?.dateNaissance)} />
        <Field label="Adresse" value={s1?.adresse} />
        <Field label="Téléphone" value={s1?.telephone} />
        <Field label="Email" value={s1?.email} />
        <Field label="NISS" value={s1?.niss} />
        <Field label="Profession" value={s1?.profession} />
        <Field label="Mutuelle" value={s1?.mutuelle} />
        <Field label="Médecin traitant" value={s1?.medecinTraitant} />
        <Field label="Situation familiale" value={s1?.situationFamiliale === 'autre' ? s1?.situationFamilialeAutre : s1?.situationFamiliale} />
        <Field label="Préférence de contact" value={arr(s1?.preferenceContact)} />
        <Field label="Langue" value={s1?.langue} />
        <Field label="Motif principal" value={s1?.motifPrincipal} />
        <BlockField label="Attentes vis-à-vis de Honae" value={s1?.attentes} />
        <Field label="Souhait THS" value={s1?.souhaitThs} />
        <Field label="Souhait traitement non hormonal" value={s1?.souhaitNonHormonal} />

        {/* 2 */}
        <Text style={styles.sectionTitle}>2 — Bilan &amp; antécédents médicaux</Text>
        <Field label="Bilan intégratif souhaité" value={s2?.bilanIntegratif} />
        <Field label="Bilan déjà effectué" value={s2?.bilanDejaFait} />
        <Field label="— avec gynécologue" value={s2?.bilanGynecologue} />
        <Field label="— avec généraliste" value={s2?.bilanGeneraliste} />
        <Field label="— avec nutritionniste/naturopathe" value={s2?.bilanNutritionniste} />
        <Field label="Déjà supplémentée" value={s2?.supplementee} />
        <Field label="— hormones" value={s2?.supplHormones === 'oui' ? (s2?.supplHormonesDetail || 'Oui') : s2?.supplHormones} />
        <Field label="— plantes" value={s2?.supplPlantes === 'oui' ? (s2?.supplPlantesDetail || 'Oui') : s2?.supplPlantes} />
        <Field label="— compléments alimentaires" value={s2?.supplComplements === 'oui' ? (s2?.supplComplementsDetail || 'Oui') : s2?.supplComplements} />
        <BlockField label="Réponse aux éventuels traitements" value={s2?.reponseTraitements} />
        <Field label="Antécédents familiaux" value={arr(s2?.famAntecedents)} />
        <Field label="— cancer (précision)" value={s2?.famCancerDetail} />
        <Field label="— inflammatoires (précision)" value={s2?.famInflammatoiresDetail} />
        <Field label="— autres familiaux" value={s2?.famAutres} />
        <Field label="Maladies chroniques/auto-immunes/endo." value={s2?.persMaladiesChroniques} />
        <Field label="Antécédents personnels" value={arr(s2?.persAntecedents)} />
        <Field label="— cancer (précision)" value={s2?.persCancerDetail} />
        <Field label="— cardio-vasculaire (précision)" value={s2?.persCardioDetail} />
        <Field label="— inflammatoires (précision)" value={s2?.persInflammatoiresDetail} />
        <Field label="Allergies" value={s2?.allergies} />
        <Field label="Vaccinations connues" value={s2?.vaccinations} />

        {/* 3 */}
        <Text style={styles.sectionTitle}>3 — Examens, symptômes &amp; cycles</Text>
        <BlockField label="Chirurgies / hospitalisations" value={s3?.chirurgies} />
        <Field label="Autres antécédents" value={s3?.autresAntecedents} />
        <Field label="Mammographie" value={[fmtDate(s3?.mammographieDate), s3?.mammographieResultat].filter(Boolean).join(' — ') || null} />
        <Field label="Frottis (PAP) / HPV" value={[fmtDate(s3?.frottisDate), s3?.frottisResultat].filter(Boolean).join(' — ') || null} />
        <Field label="Bilan hormonal (<1 an)" value={s3?.bilanHormonal} />
        <Field label="Autres examens" value={s3?.autresExamens} />
        <BlockField label="Symptômes ressentis" value={arr(s3?.symptomes)} />
        <Field label="Autres symptômes" value={s3?.symptomesAutre} />
        <Field label="Âge premières règles" value={s3?.agePremieresRegles} />
        <Field label="Règles encore présentes" value={s3?.reglesPresentes} />
        <Field label="Modif. fréquence des cycles" value={s3?.modifFrequenceCycles === 'oui' ? `Oui (depuis ${s3?.modifFrequenceDepuis || '—'})` : s3?.modifFrequenceCycles} />
        <Field label="Modif. durée des cycles" value={s3?.modifDureeCycles === 'oui' ? `Oui (${s3?.modifDureeJours || '—'} j)` : s3?.modifDureeCycles} />
        <Field label="Flux" value={s3?.flux} />
        <Field label="Couleur" value={s3?.couleur} />
        <Field label="Douleurs de règles" value={s3?.douleursRegles === 'oui' ? `Oui (intensité ${s3?.intensiteDouleur ?? '—'}/10)` : s3?.douleursRegles} />
        <Field label="Localisation douleur" value={s3?.localisationDouleur} />
        <Field label="Contraception (type)" value={s3?.contraceptionType} />
        <Field label="Contraception (marque)" value={s3?.contraceptionMarque} />
        <Field label="Effets secondaires" value={s3?.contraceptionEffets} />
        <Field label="Traitement en cours" value={s3?.traitementEnCours} />
        <Field label="Autres (gynéco)" value={s3?.autresGyneco} />

        {/* 4 */}
        <Text style={styles.sectionTitle}>4 — Obstétrique, vie intime &amp; mode de vie</Text>
        <Field label="Nombre total de grossesses" value={s4?.nombreGrossesses} />
        <BlockField label="Détail des grossesses" value={s4?.detailGrossesses} />
        <Field label="Allaitement" value={s4?.allaitement} />
        <BlockField label="Complications obstétricales" value={s4?.complicationsObstetricales} />
        <Field label="Sexuellement active" value={s4?.sexuellementActive} />
        <Field label="Libido" value={s4?.libido} />
        <Field label="Fréquence des rapports" value={s4?.frequenceRapports} />
        <Field label="Dyspareunie" value={s4?.dyspareunie} />
        <Field label="Saignements post-coïtaux" value={s4?.saignementsPostCoitaux} />
        <Field label="Sécheresse vaginale" value={s4?.secheresseVaginale} />
        <Field label="Cystites fréquentes" value={s4?.cystites} />
        <Field label="Vaginites répétitives" value={s4?.vaginites} />
        <Field label="SPM plus marqué qu'avant" value={s4?.spmMarque} />
        <Field label="Troubles digestifs / douleurs pelviennes" value={s4?.troublesDigestifsPelviens} />
        <Field label="Taille (cm)" value={s4?.taille} />
        <Field label="Poids (kg)" value={s4?.poids} />
        <Field label="Variation pondérale" value={s4?.variationPonderale} />
        <Field label="Sommeil (h/nuit)" value={s4?.sommeilHeures} />
        <Field label="Qualité du sommeil" value={s4?.qualiteSommeil} />
        <Field label="Ronflements / SAOS" value={s4?.ronflementsSAOS} />
        <Field label="Fuites urinaires / incontinence" value={s4?.fuitesUrinaires} />
        <Field label="Activité physique" value={[s4?.activitePhysiqueType, s4?.activitePhysiqueFrequence].filter(Boolean).join(' — ') || null} />

        {/* 5 */}
        <Text style={styles.sectionTitle}>5 — Substances, nutrition &amp; digestion</Text>
        <Field label="Tabac" value={s5?.tabac === 'oui' ? `Fumeuse (${s5?.nbCigarettes ?? '—'} cig/j)` : s5?.tabac === 'ex-fumeuse' ? `Ex-fumeuse (arrêt ${s5?.dateArretTabac || '—'})` : s5?.tabac} />
        <Field label="Alcool (verres/sem)" value={s5?.alcool} />
        <Field label="Cafés (/j)" value={s5?.cafes} />
        <Field label="Boissons énergisantes (/j)" value={s5?.boissonsEnergisantes} />
        <Field label="Drogues récréatives" value={s5?.drogues === 'oui' ? (s5?.droguesDetail || 'Oui') : s5?.drogues} />
        <Field label="Expositions toxiques" value={[arr(s5?.expositions), s5?.expositionsAutre].filter(Boolean).join(', ') || null} />
        <Field label="Repas / jour" value={s5?.nbRepas} />
        <Field label="Repas réguliers" value={s5?.regulariteRepas} />
        <Field label="Petit-déjeuner" value={s5?.petitDejeuner} />
        <Field label="Grignotages" value={s5?.grignotages} />
        <Field label="Jeûne intermittent" value={s5?.jeuneIntermittent} />
        <Field label="Sucré / salé" value={s5?.sucreSale} />
        <BlockField label="Profil alimentaire" value={arr(s5?.profilAlimentaire)} />
        <Field label="Marche / pas par jour" value={s5?.marchePas} />
        <Field label="Heures assises / jour" value={s5?.heuresAssis} />
        <Field label="Hydratation (L/j)" value={s5?.hydratation} />
        <Field label="Type d'eau" value={s5?.typeEau} />
        <Field label="Selles / jour" value={s5?.nbSelles} />
        <Field label="Transit régulier" value={s5?.regulariteSelles} />
        <Field label="Ballonnements" value={s5?.ballonnements} />
        <Field label="Acidité" value={s5?.acidite} />
        <Field label="Échelle de Bristol" value={s5?.bristolScale ? `${s5.bristolScale}/7` : null} />

        {/* 6 */}
        <Text style={styles.sectionTitle}>6 — Bien-être &amp; émotions</Text>
        <BlockField label="Comment vous sentez-vous" value={s6?.ressenti} />
        <Field label="Émotions ressenties" value={[arr(s6?.emotions), s6?.emotionsAutre].filter(Boolean).join(', ') || null} />
        <Field label="Motivation / Optimisme" value={s6?.motivation !== undefined && s6?.motivation !== null ? `${s6.motivation}/10` : null} />
        <Field label="Anxiété" value={s6?.anxiete !== undefined && s6?.anxiete !== null ? `${s6.anxiete}/10` : null} />
        <Field label="Facteurs atténuants/aggravants" value={s6?.facteurs} />
        <BlockField label="Soutien actuel" value={s6?.soutienActuel} />
        <Field label="Ressources activées" value={[arr(s6?.ressources), s6?.ressourcesAutre].filter(Boolean).join(', ') || null} />
        <Field label="Impact sur le quotidien" value={[arr(s6?.impactQuotidien), s6?.impactQuotidienAutre].filter(Boolean).join(', ') || null} />
        <Field label="Prise de poids abdominale" value={s6?.priseDePoidsAbdo} />
        <Field label="Douleur / lourdeur au foie" value={s6?.douleurFoie} />
        <Field label="Régulation du poids difficile" value={s6?.regulationPoidsDifficile} />
        <Field label="Détresse aiguë récente" value={s6?.signalAlerte} />
        <Field label="Souhaite en parler en consultation" value={s6?.souhaitParlerConsultation} />

        {/* 7 */}
        <Text style={styles.sectionTitle}>7 — Accompagnement &amp; documents</Text>
        <Field label="Besoins d'accompagnement" value={[arr(s7?.besoinsAccompagnement), s7?.besoinsAccompagnementAutre].filter(Boolean).join(', ') || null} />
        <Field label="Documents disponibles" value={[arr(s7?.documentsApporter), s7?.documentsApporterAutre].filter(Boolean).join(', ') || null} />

        {/* 8 */}
        <Text style={styles.sectionTitle}>8 — Consentements RGPD</Text>
        <View style={styles.consentBox}>
          <Field label="Politique confidentialité acceptée" value={s8?.consentPolitique ? 'Oui' : 'Non'} />
          <Field label="Données pseudonymisées" value={s8?.consentStatistiques ? 'Oui' : 'Non'} />
          <Field label="Contact secrétariat accepté" value={s8?.consentContact ? 'Oui' : 'Non'} />
          <Field label="Partage praticiens Honae" value={s8?.partageHonae} />
          <Field label="Signature électronique" value={s8?.signature} />
          <Field label="Date signature" value={fmtDate(s8?.dateSignature)} />
        </View>

        <Text style={styles.footer}>
          Honae Care — Document confidentiel — Données de santé protégées (RGPD) — Généré le {date}
        </Text>
      </Page>
    </Document>
  )
}

export async function generateMenopausePDF(data: MenopauseFormData): Promise<Buffer> {
  const date = new Date().toLocaleDateString('fr-BE', { day: '2-digit', month: '2-digit', year: 'numeric' })
  const buffer = await renderToBuffer(<MenopausePDF data={data} date={date} />)
  return Buffer.from(buffer)
}

function safeFilePart(s: string): string {
  return s.replace(/[^a-zA-Z0-9\-_àâéèêëîïôùûüçÀÂÉÈÊËÎÏÔÙÛÜÇ]/g, '_').slice(0, 50)
}

export function buildMenopauseFileName(data: MenopauseFormData): string {
  const nom = safeFilePart(data.step1?.nom ?? 'Inconnu')
  const prenom = safeFilePart(data.step1?.prenom ?? 'Inconnu')
  const d = new Date()
  const dateStr = `${String(d.getDate()).padStart(2, '0')}.${String(d.getMonth() + 1).padStart(2, '0')}.${d.getFullYear()}`
  return `HC Anamnèse Ménopause ${nom} ${prenom} ${dateStr}.pdf`
}
