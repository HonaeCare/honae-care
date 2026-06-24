/**
 * Rate limiter en mémoire (Map) — suffit pour un usage médical mono-instance.
 * Pas de dépendance externe, réinitialisé au redémarrage du serveur.
 */

interface Entry {
  count: number
  resetAt: number
}

const store = new Map<string, Entry>()

interface Options {
  maxRequests: number   // nombre max de requêtes
  windowMs: number      // fenêtre de temps en ms
}

export function rateLimit(key: string, opts: Options): { allowed: boolean; remaining: number; resetAt: number } {
  const now = Date.now()
  const entry = store.get(key)

  if (!entry || now > entry.resetAt) {
    store.set(key, { count: 1, resetAt: now + opts.windowMs })
    return { allowed: true, remaining: opts.maxRequests - 1, resetAt: now + opts.windowMs }
  }

  if (entry.count >= opts.maxRequests) {
    return { allowed: false, remaining: 0, resetAt: entry.resetAt }
  }

  entry.count++
  return { allowed: true, remaining: opts.maxRequests - entry.count, resetAt: entry.resetAt }
}

// Nettoie les entrées expirées toutes les 10 minutes
setInterval(() => {
  const now = Date.now()
  for (const [key, entry] of store.entries()) {
    if (now > entry.resetAt) store.delete(key)
  }
}, 10 * 60 * 1000)
