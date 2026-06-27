import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs'
import path from 'path'

// État stocké sur le volume persistant (survit aux redéploiements Railway)
const DATA_DIR = process.env.DATA_PATH ?? path.join(process.cwd(), 'data')
const GUARD_FILE = path.join(DATA_DIR, 'login-guard.json')

function ensureDataDir() {
  if (!existsSync(DATA_DIR)) mkdirSync(DATA_DIR, { recursive: true })
}

// ── Garde-fou GLOBAL anti-brute-force ──────────────────────────────────────
// Indépendant de l'IP : compte tous les échecs de connexion sur une fenêtre
// glissante. Plus il y a d'échecs récents, plus chaque tentative (même
// distribuée via un botnet) est ralentie. Aucun verrouillage dur — le bon mot
// de passe finit toujours par passer, donc pas de déni de service possible
// contre le secrétariat.
const WINDOW_MS = 15 * 60 * 1000   // fenêtre glissante de 15 min
const FREE_ATTEMPTS = 5            // échecs tolérés sans pénalité
const STEP_MS = 750               // pénalité ajoutée par échec au-delà du seuil
const MAX_DELAY_MS = 10_000        // plafond du délai imposé

interface GuardState {
  failures: number
  windowStart: number
}

function readGuard(): GuardState {
  if (!existsSync(GUARD_FILE)) return { failures: 0, windowStart: Date.now() }
  try {
    const s = JSON.parse(readFileSync(GUARD_FILE, 'utf8')) as GuardState
    if (Date.now() - s.windowStart > WINDOW_MS) return { failures: 0, windowStart: Date.now() }
    return s
  } catch {
    return { failures: 0, windowStart: Date.now() }
  }
}

function writeGuard(s: GuardState) {
  try {
    ensureDataDir()
    writeFileSync(GUARD_FILE, JSON.stringify(s), 'utf8')
  } catch { /* non bloquant */ }
}

/** Délai (ms) à imposer AVANT de vérifier le mot de passe, selon les échecs récents. */
export function globalLoginDelayMs(): number {
  const { failures } = readGuard()
  const over = Math.max(0, failures - FREE_ATTEMPTS)
  return Math.min(over * STEP_MS, MAX_DELAY_MS)
}

/** À appeler après un échec de connexion. */
export function recordFailedLogin() {
  const s = readGuard()
  writeGuard({ failures: s.failures + 1, windowStart: s.windowStart })
}

/** À appeler après une connexion réussie — remet le compteur à zéro. */
export function resetLoginGuard() {
  writeGuard({ failures: 0, windowStart: Date.now() })
}

export async function verifyPassword(password: string): Promise<boolean> {
  const b64 = process.env.ADMIN_PASSWORD_HASH
  if (!b64) throw new Error('ADMIN_PASSWORD_HASH not configured')
  const hash = Buffer.from(b64, 'base64').toString('utf8')
  return bcrypt.compare(password, hash)
}

export function signToken(): string {
  const secret = process.env.JWT_SECRET
  if (!secret) throw new Error('JWT_SECRET not configured')
  return jwt.sign({ role: 'admin' }, secret, { expiresIn: '12h' })
}

// Note: token verification for Edge (proxy.ts) is in lib/verify-jwt-edge.ts
// This function is kept for Node.js API routes if needed
export function verifyTokenNode(token: string): boolean {
  const secret = process.env.JWT_SECRET
  if (!secret) return false
  try {
    jwt.verify(token, secret, { algorithms: ['HS256'] })
    return true
  } catch {
    return false
  }
}
