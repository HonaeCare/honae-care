// Types du formulaire d'anamnèse (Péri)Ménopause — structure parallèle au
// formulaire fertilité, réutilise le même design system mais contenu propre.

export interface MStep1 {
  dateFormulaire: string
  prenom: string
  nom: string
  dateNaissance: string
  adresse: string
  telephone: string
  email: string
  niss?: string
  profession: string
  mutuelle?: string
  medecinTraitant?: string
  situationFamiliale: string
  situationFamilialeAutre?: string
  preferenceContact: string[]
  langue?: string
  // Parcours & attentes
  motifPrincipal: string
  attentes?: string
  souhaitThs?: string
  souhaitNonHormonal?: string
}

export interface MStep2 {
  // Bilan & supplémentation
  bilanIntegratif?: string
  bilanDejaFait?: string
  bilanGynecologue?: string
  bilanGeneraliste?: string
  bilanNutritionniste?: string
  supplementee?: string
  supplHormones?: string
  supplHormonesDetail?: string
  supplPlantes?: string
  supplPlantesDetail?: string
  supplComplements?: string
  supplComplementsDetail?: string
  reponseTraitements?: string
  // Antécédents familiaux
  famAntecedents?: string[]
  famCancerDetail?: string
  famInflammatoiresDetail?: string
  famAutres?: string
  // Antécédents personnels
  persMaladiesChroniques?: string
  persAntecedents?: string[]
  persCancerDetail?: string
  persCardioDetail?: string
  persInflammatoiresDetail?: string
  allergies?: string
  vaccinations?: string
}

export interface MStep3 {
  chirurgies?: string
  autresAntecedents?: string
  // Examens réalisés
  mammographieDate?: string
  mammographieResultat?: string
  frottisDate?: string
  frottisResultat?: string
  bilanHormonal?: string
  autresExamens?: string
  // Symptômes (ménopause)
  symptomes?: string[]
  symptomesAutre?: string
  // Antécédents gynécologiques & cycles
  agePremieresRegles?: number
  reglesPresentes?: string
  modifFrequenceCycles?: string
  modifFrequenceDepuis?: string
  modifDureeCycles?: string
  modifDureeJours?: string
  flux?: string
  couleur?: string
  douleursRegles?: string
  intensiteDouleur?: number
  localisationDouleur?: string
  contraceptionType?: string
  contraceptionMarque?: string
  contraceptionEffets?: string
  traitementEnCours?: string
  autresGyneco?: string
}

export interface MStep4 {
  // Antécédents obstétricaux
  nombreGrossesses?: number
  detailGrossesses?: string
  allaitement?: string
  complicationsObstetricales?: string
  // Vie intime & sexuelle
  sexuellementActive?: string
  libido?: string
  frequenceRapports?: string
  dyspareunie?: string
  saignementsPostCoitaux?: string
  troublesDigestifsPelviens?: string
  spmMarque?: string
  cystites?: string
  vaginites?: string
  secheresseVaginale?: string
  // Mode de vie & hygiène de vie
  taille?: number
  poids?: number
  variationPonderale?: string
  sommeilHeures?: number
  qualiteSommeil?: string
  ronflementsSAOS?: string
  fuitesUrinaires?: string
  activitePhysiqueType?: string
  activitePhysiqueFrequence?: string
}

export interface MStep5 {
  // Substances
  tabac?: string
  dateArretTabac?: string
  nbCigarettes?: number
  alcool?: number
  cafes?: number
  boissonsEnergisantes?: number
  drogues?: string
  droguesDetail?: string
  expositions?: string[]
  expositionsAutre?: string
  // Nutrition
  nbRepas?: number
  regulariteRepas?: string
  petitDejeuner?: string
  grignotages?: string
  jeuneIntermittent?: string
  sucreSale?: string
  profilAlimentaire?: string[]
  marchePas?: string
  heuresAssis?: number
  hydratation?: number
  typeEau?: string
  // Digestion
  nbSelles?: number
  regulariteSelles?: string
  ballonnements?: string
  acidite?: string
  bristolScale?: number
}

export interface MStep6 {
  ressenti?: string
  emotions?: string[]
  emotionsAutre?: string
  motivation?: number
  anxiete?: number
  facteurs?: string
  soutienActuel?: string
  ressources?: string[]
  ressourcesAutre?: string
  impactQuotidien?: string[]
  impactQuotidienAutre?: string
  // Symptômes métaboliques
  priseDePoidsAbdo?: string
  douleurFoie?: string
  regulationPoidsDifficile?: string
  // Signal d'alerte
  signalAlerte?: string
  souhaitParlerConsultation?: string
}

export interface MStep7 {
  besoinsAccompagnement?: string[]
  besoinsAccompagnementAutre?: string
  documentsApporter?: string[]
  documentsApporterAutre?: string
}

export interface MStep8 {
  consentPolitique: boolean
  consentStatistiques?: boolean
  consentContact: boolean
  partageHonae?: string
  signature: string
  dateSignature: string
}

export interface MenopauseFormData {
  step1?: MStep1
  step2?: MStep2
  step3?: MStep3
  step4?: MStep4
  step5?: MStep5
  step6?: MStep6
  step7?: MStep7
  step8?: MStep8
}
