import { NextRequest, NextResponse } from 'next/server'
import { verifyPassword, signToken, globalLoginDelayMs, recordFailedLogin, resetLoginGuard } from '@/lib/auth'
import { rateLimit } from '@/lib/rate-limit'
import { logAccess } from '@/lib/storage'

export async function POST(req: NextRequest) {

  // ── 1. Rate limit par IP (in-memory) ─────────────────────────────
  // Max 10 tentatives par IP sur 15 minutes
  const ip =
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    req.headers.get('x-real-ip') ??
    'unknown'

  const ipRl = rateLimit(`login:${ip}`, { maxRequests: 10, windowMs: 15 * 60 * 1000 })
  if (!ipRl.allowed) {
    const mins = Math.ceil((ipRl.resetAt - Date.now()) / 60_000)
    logAccess(`LOGIN_BLOCKED_IP:${ip}`)
    return NextResponse.json(
      { error: `Trop de tentatives depuis cette adresse. Réessayez dans ${mins} minute(s).` },
      {
        status: 429,
        headers: { 'Retry-After': String(Math.ceil((ipRl.resetAt - Date.now()) / 1000)) },
      }
    )
  }

  try {
    const body = await req.json()
    const { password } = body

    if (!password || typeof password !== 'string') {
      return NextResponse.json({ error: 'Mot de passe requis' }, { status: 400 })
    }

    // ── 2. Garde-fou GLOBAL anti-brute-force (toutes IP confondues) ──
    // Plus il y a eu d'échecs récents, plus chaque tentative est ralentie —
    // neutralise les attaques distribuées par IP tournantes.
    const globalDelay = globalLoginDelayMs()
    if (globalDelay > 0) await new Promise((r) => setTimeout(r, globalDelay))

    const ok = await verifyPassword(password)

    if (!ok) {
      recordFailedLogin()
      // Délai artificiel pour ralentir les attaques automatisées
      await new Promise((r) => setTimeout(r, 1000 + Math.random() * 500))
      logAccess(`LOGIN_FAILED:${ip}`)
      return NextResponse.json({ error: 'Mot de passe incorrect' }, { status: 401 })
    }
    resetLoginGuard()
    const token = signToken()
    logAccess(`LOGIN_SUCCESS:${ip}`)

    const res = NextResponse.json({ ok: true })
    res.cookies.set('admin_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 12 * 3600,
      path: '/',
    })
    return res
  } catch (err) {
    // On ne logue jamais err directement — un échec de parsing JSON inclurait
    // un extrait du corps de la requête, donc le mot de passe tenté
    console.error('[admin/login] Erreur:', err instanceof Error ? err.constructor.name : 'unknown')
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
