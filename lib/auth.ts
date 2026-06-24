import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs'
import path from 'path'

const DATA_DIR = path.join(process.cwd(), 'data')
const RATE_LIMIT_FILE = path.join(DATA_DIR, 'rate-limit.json')

function ensureDataDir() {
  if (!existsSync(DATA_DIR)) mkdirSync(DATA_DIR, { recursive: true })
}
const MAX_ATTEMPTS = 5
const BLOCK_MS = 15 * 60 * 1000

interface RateLimitState {
  attempts: number
  blockedUntil: number | null
}

function readState(): RateLimitState {
  if (!existsSync(RATE_LIMIT_FILE)) return { attempts: 0, blockedUntil: null }
  try { return JSON.parse(readFileSync(RATE_LIMIT_FILE, 'utf8')) } catch { return { attempts: 0, blockedUntil: null } }
}

function saveState(s: RateLimitState) {
  ensureDataDir()
  writeFileSync(RATE_LIMIT_FILE, JSON.stringify(s), 'utf8')
}

export function checkRateLimit(): { allowed: boolean; remainingMs?: number } {
  const s = readState()
  if (s.blockedUntil && Date.now() < s.blockedUntil) {
    return { allowed: false, remainingMs: s.blockedUntil - Date.now() }
  }
  if (s.blockedUntil && Date.now() >= s.blockedUntil) {
    saveState({ attempts: 0, blockedUntil: null })
  }
  return { allowed: true }
}

export function recordFailedAttempt() {
  const s = readState()
  const attempts = (s.attempts || 0) + 1
  if (attempts >= MAX_ATTEMPTS) {
    saveState({ attempts, blockedUntil: Date.now() + BLOCK_MS })
  } else {
    saveState({ attempts, blockedUntil: null })
  }
}

export function resetAttempts() {
  saveState({ attempts: 0, blockedUntil: null })
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
