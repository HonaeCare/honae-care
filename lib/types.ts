export interface Step1Data {
  dateFormulaire: string
  completePar: string
  prenom: string
  nom: string
  dateNaissance: string
  adresse: string
  telephone: string
  email: string
  niss?: string
  profession: string
  mutuelle: string
  medecinTraitant?: string
  situationFamiliale: string
  completeParAutre?: string
  situationFamilialeAutre?: string
  partenaireSexe?: string
  partenaireSexeAutre?: string
  partenairePrenom?: string
  partenaireNom?: string
  partenaireAge?: string
  partenaireProfession?: string
  preferenceContact: string[]
  langue: string
}

export interface Step2Data {
  motifPrincipal: string
  motifAutre?: string
  attentes?: string
  bilanFertilite: string
  souhaitPreservation: string
  conservationOvocytaire?: string
  conservationSperme?: string
  essaisNaturels: string
  dureeEssais?: string
  rapportsCibles?: string
  outilsUtilises?: string[]
  parcoursPMAFait?: string
  parcoursPMA?: string
  maladiesChroniques?: string
  sopk: string
  endometriose: string
  adenomyose: string
  fibromes: string
  infectionsPelviennes: string
  autrePathologie?: string
  pathologiesEndocriniennes?: string
  insuffisanceOvarienne: string
  troublesSurrenaliens: string
  diabete: string
  pathologiesHypophysaires: string
  allergies?: string
  traitementsEnCours?: string
  vaccinations?: string[]
  thrombose: string
}

export interface Step3Data {
  agePremieresRegles?: number
  regularite: string
  dureeRegles?: number
  flux: string
  douleursRegles: string
  intensiteDouleur?: number
  localisationDouleur?: string
  phaseLuteale?: number
  spotting: string
  quandSpotting?: string
  signesOvulation?: string[]
  douleurRapports: string
  saignementsPostCoitaux: string
  troublesDigestifs?: string
  typeContraception?: string[]
  marqueContraception?: string
  dateArretContraception?: string
  effetsSecondairesContraception?: string
  acne: string
  pilosite: string
  chuteCheveux?: string
  chirurgies?: string
  antecedentsFamiliaux?: string[]
  antecedentsFamiliauxDetails?: string
  serologies?: string[]
}

export interface Step4Data {
  examensRealises?: string[]
  examensRealisesAutre?: string
  malformationsUterines?: string
  nombreGrossesses?: number
  detailGrossesses?: string
  allaitement?: string
  dureeAllaitement?: string
  nombreFaussesCouches?: number
  ageGestFC?: string
  analysesFC?: string
  complicationsObstetricales?: string
}

export interface Step5Data {
  antecedentsMasculins?: string[]
  chirurgiesMasculins?: string
  traitementsMasculins?: string
  fonctionSexuelle?: string[]
  frequenceRapports?: number
  lubrifiant?: string
  quelLubrifiant?: string
  expositions?: string[]
  fertilitéAnterieure?: string
  delaisConception?: string
  spermogramme?: string
  fragmentationADN?: string
  echoGenitourinaire?: string
  caryotype?: string
  autresExamensMasculins?: string
  dernierFrottisDate?: string
  dernierFrottisResultat?: string
  chutCheveux?: string
}

export interface Step6Data {
  stress?: number
  evenementsMajeurs?: string
  activitePhysique?: string
  taille?: number
  poids?: number
  variationPonderale?: string
  sommeilHeures?: number
  qualiteSommeil?: string
  ronflementsOAS?: string[]
  tabac?: string
  dateArretTabac?: string
  nbCigarettes?: number
  alcool?: number
  cafeine?: number
  drogues?: string
  expositionsProfessionnelles?: string[]
  soutienPsychologique?: string
  nbRepas?: number
  profilAlimentaire?: string[]
  hydratation?: number
  typeEau?: string
  nbSelles?: number
  ballonnements?: string
  bristolScale?: number
}

export interface Step7Data {
  ressentiParcours?: string
  emotions?: string[]
  motivation?: number
  anxiete?: number
  facteurs?: string
  soutienActuel?: string
  ressources?: string[]
  impactQuotidien?: string[]
  signalAlerte?: string
  souhaitParlerConsultation?: string
  besoinsAccompagnement?: string[]
  documentsApporter?: string[]
}

export interface Step8Data {
  consentPolitique: boolean
  consentStatistiques: boolean
  consentContact: boolean
  partageHonae: string
  partagePartenaire: string
  signature: string
  dateSignature: string
}

export interface FormData {
  step1?: Step1Data
  step2?: Step2Data
  step3?: Step3Data
  step4?: Step4Data
  step5?: Step5Data
  step6?: Step6Data
  step7?: Step7Data
  step8?: Step8Data
  showStep5?: boolean
}
