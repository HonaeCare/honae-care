import { readFileSync, writeFileSync, existsSync, mkdirSync, appendFileSync, unlinkSync } from 'fs'
import path from 'path'
import { encrypt, decrypt } from './crypto'

const BASE_DIR   = process.env.DATA_PATH ?? path.join(process.cwd(), 'data')
const DATA_DIR   = path.join(BASE_DIR, 'submissions')
const INDEX_FILE = path.join(BASE_DIR, 'index.json')
const ACCESS_LOG = path.join(BASE_DIR, 'access.log')

const RETENTION_DAYS = 30 // suppression automatique après 30 jours (RGPD)

// Seuls les UUIDs générés par randomUUID() sont acceptés
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

function assertValidId(id: string) {
  if (!UUID_REGEX.test(id)) throw new Error('ID invalide')
}

function ensureDir() {
  if (!existsSync(DATA_DIR)) mkdirSync(DATA_DIR, { recursive: true })
}

export type FormType = 'fertilite' | 'menopause'

export interface SubmissionMeta {
  id: string
  nom: string
  prenom: string
  date: string
  size: number
  formType?: FormType // absent = ancien dossier fertilité (rétrocompatibilité)
}

function readIndex(): SubmissionMeta[] {
  if (!existsSync(INDEX_FILE)) return []
  try { return JSON.parse(readFileSync(INDEX_FILE, 'utf8')) } catch { return [] }
}

function writeIndex(index: SubmissionMeta[]) {
  ensureDir()
  writeFileSync(INDEX_FILE, JSON.stringify(index, null, 2), 'utf8')
}

export function saveSubmission(id: string, nom: string, prenom: string, pdfBuffer: Buffer, formType: FormType = 'fertilite'): void {
  assertValidId(id)
  ensureDir()
  const encrypted = encrypt(pdfBuffer)
  writeFileSync(path.join(DATA_DIR, `${id}.enc`), encrypted)
  const index = readIndex()
  index.unshift({ id, nom, prenom, date: new Date().toISOString(), size: encrypted.length, formType })
  writeIndex(index)
}

export function getSubmission(id: string): Buffer {
  assertValidId(id)
  const filePath = path.join(DATA_DIR, `${id}.enc`)
  if (!filePath.startsWith(path.resolve(DATA_DIR))) throw new Error('Chemin invalide')
  if (!existsSync(filePath)) throw new Error('Soumission introuvable')
  return decrypt(readFileSync(filePath))
}

export function deleteSubmission(id: string): boolean {
  assertValidId(id)
  const filePath = path.join(DATA_DIR, `${id}.enc`)
  if (existsSync(filePath)) {
    unlinkSync(filePath) // suppression physique du fichier chiffré
  }
  const index = readIndex().filter(s => s.id !== id)
  writeIndex(index)
  logAccess(`DELETE id=${id}`)
  return true
}

/**
 * Supprime automatiquement les dossiers plus vieux que RETENTION_DAYS jours.
 * Appelé à chaque chargement de la liste admin (nettoyage passif).
 */
export function cleanupExpiredSubmissions(): number {
  const cutoff = Date.now() - RETENTION_DAYS * 24 * 60 * 60 * 1000
  const index = readIndex()
  const expired = index.filter(s => new Date(s.date).getTime() < cutoff)

  for (const s of expired) {
    const filePath = path.join(DATA_DIR, `${s.id}.enc`)
    if (existsSync(filePath)) unlinkSync(filePath)
    logAccess(`AUTO_DELETE id=${s.id} (>${RETENTION_DAYS}j)`)
  }

  if (expired.length > 0) {
    writeIndex(index.filter(s => new Date(s.date).getTime() >= cutoff))
  }

  return expired.length
}

export function listSubmissions(): SubmissionMeta[] {
  cleanupExpiredSubmissions() // nettoyage automatique à chaque consultation
  return readIndex()
}

// Logs d'accès — identifiant pseudonymisé uniquement, jamais de données patient (RGPD)
export function logAccess(action: string) {
  const line = `${new Date().toISOString()} | ${action}\n`
  try {
    ensureDir()
    appendFileSync(ACCESS_LOG, line, 'utf8')
  } catch { /* non bloquant */ }
}
