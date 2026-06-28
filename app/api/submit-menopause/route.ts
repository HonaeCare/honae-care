import { NextRequest, NextResponse } from 'next/server'
import { randomUUID } from 'crypto'
import { generateMenopausePDF } from '@/lib/pdf-menopause'
import { saveSubmission } from '@/lib/storage'
import { sendNewFormNotification } from '@/lib/email'
import { rateLimit } from '@/lib/rate-limit'
import { MenopauseFormSchema } from '@/lib/validation-menopause'
import type { MenopauseFormData } from '@/lib/types-menopause'

const MIN_ELAPSED_MS = 30_000

export async function POST(req: NextRequest) {
  // 1. Rate limiting par IP
  const ip =
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    req.headers.get('x-real-ip') ??
    'unknown'

  const rl = rateLimit(`submit-meno:${ip}`, { maxRequests: 5, windowMs: 60 * 60 * 1000 })
  if (!rl.allowed) {
    return NextResponse.json(
      { error: 'Trop de tentatives. Veuillez réessayer dans une heure.' },
      { status: 429, headers: { 'Retry-After': String(Math.ceil((rl.resetAt - Date.now()) / 1000)) } }
    )
  }

  // 2. Anti-bot : honeypot + délai de remplissage
  const honeypot = req.headers.get('x-form-hp') ?? ''
  const elapsed = parseInt(req.headers.get('x-form-elapsed') ?? '0', 10)
  const isDev = process.env.NODE_ENV === 'development'

  if (!isDev && (honeypot.length > 0 || !elapsed || elapsed < MIN_ELAPSED_MS)) {
    await new Promise((r) => setTimeout(r, 1500))
    return NextResponse.json({ id: randomUUID() }, { status: 201 })
  }

  try {
    const rawData = await req.json()

    // 3. Validation Zod côté serveur
    const parsed = MenopauseFormSchema.safeParse(rawData)
    if (!parsed.success) {
      if (process.env.NODE_ENV === 'development') {
        console.error('[submit-meno] Zod errors:', parsed.error.issues.map((i) => `${i.path.join('.')}: ${i.code}`))
      }
      return NextResponse.json({ error: 'Données invalides. Vérifiez le formulaire.' }, { status: 422 })
    }

    const data = parsed.data as MenopauseFormData

    // 4. Consentements obligatoires
    if (!data.step8?.consentPolitique || !data.step8?.consentContact) {
      return NextResponse.json({ error: 'Consentements obligatoires manquants' }, { status: 400 })
    }

    // 5. Génération PDF + stockage chiffré (type ménopause)
    const id = randomUUID()
    const nom = data.step1?.nom ?? 'Inconnu'
    const prenom = data.step1?.prenom ?? 'Inconnu'

    const pdfBuffer = await generateMenopausePDF(data)
    saveSubmission(id, nom, prenom, pdfBuffer, 'menopause')

    // 6. Notification email (sans données médicales) — non bloquant
    sendNewFormNotification(prenom, nom, 'Ménopause').catch((err) => {
      console.error('[submit-meno] Échec notification email:', err instanceof Error ? err.message : 'unknown')
    })

    return NextResponse.json({ id }, { status: 201 })
  } catch {
    console.error('[submit-meno] Erreur de traitement')
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
