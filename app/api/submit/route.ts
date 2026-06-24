import { NextRequest, NextResponse } from 'next/server'
import { randomUUID } from 'crypto'
import { generatePDF } from '@/lib/pdf'
import { saveSubmission } from '@/lib/storage'
import { sendNewFormNotification } from '@/lib/email'
import { rateLimit } from '@/lib/rate-limit'
import { FormDataSchema } from '@/lib/validation'
import type { FormData } from '@/lib/types'

const MIN_ELAPSED_MS = 30_000

export async function POST(req: NextRequest) {

  // ── 1. Rate limiting par IP ───────────────────────────────────────
  const ip =
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    req.headers.get('x-real-ip') ??
    'unknown'

  const rl = rateLimit(`submit:${ip}`, { maxRequests: 5, windowMs: 60 * 60 * 1000 })
  if (!rl.allowed) {
    return NextResponse.json(
      { error: 'Trop de tentatives. Veuillez réessayer dans une heure.' },
      { status: 429, headers: { 'Retry-After': String(Math.ceil((rl.resetAt - Date.now()) / 1000)) } }
    )
  }

  // ── 2. Anti-bot : honeypot + délai de remplissage ─────────────────
  const honeypot = req.headers.get('x-form-hp') ?? ''
  const elapsed  = parseInt(req.headers.get('x-form-elapsed') ?? '0', 10)
  const isDev    = process.env.NODE_ENV === 'development'

  // Anti-bot désactivé en développement pour faciliter les tests
  if (!isDev && (honeypot.length > 0 || !elapsed || elapsed < MIN_ELAPSED_MS)) {
    await new Promise((r) => setTimeout(r, 1500))
    return NextResponse.json({ id: randomUUID() }, { status: 201 })
  }

  try {
    const rawData = await req.json()

    // ── 3. Validation Zod côté serveur ────────────────────────────
    const parsed = FormDataSchema.safeParse(rawData)
    if (!parsed.success) {
      // Log détaillé en développement uniquement
      if (process.env.NODE_ENV === 'development') {
        console.error('[submit] Zod errors:', parsed.error.issues.map(i => `${i.path.join('.')}: ${i.code}`))
      }
      return NextResponse.json({ error: 'Données invalides. Vérifiez le formulaire.' }, { status: 422 })
    }

    const data = parsed.data as FormData

    // ── 4. Consentements obligatoires ─────────────────────────────
    if (!data.step8?.consentPolitique || !data.step8?.consentContact) {
      return NextResponse.json({ error: 'Consentements obligatoires manquants' }, { status: 400 })
    }

    // ── 5. Génération PDF + stockage chiffré ──────────────────────
    const id      = randomUUID()
    const nom     = data.step1?.nom     ?? 'Inconnu'
    const prenom  = data.step1?.prenom  ?? 'Inconnu'

    const pdfBuffer = await generatePDF(data)
    saveSubmission(id, nom, prenom, pdfBuffer)

    // ── 6. Notification email (sans données médicales) ────────────
    // Non bloquant — une erreur d'email ne doit pas faire échouer la soumission
    sendNewFormNotification(prenom, nom).catch((err) => {
      console.error('[submit] Échec notification email:', err instanceof Error ? err.message : 'unknown')
    })

    return NextResponse.json({ id }, { status: 201 })

  } catch {
    console.error('[submit] Erreur de traitement')
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
