import { NextRequest, NextResponse } from 'next/server'
import { generateMenopausePDF, buildMenopauseFileName } from '@/lib/pdf-menopause'
import { rateLimit } from '@/lib/rate-limit'
import { MenopauseFormSchema } from '@/lib/validation-menopause'
import type { MenopauseFormData } from '@/lib/types-menopause'

// Génère un PDF en mémoire pour la patiente depuis la page de confirmation.
// Pas de stockage serveur — données jamais conservées ici.
export async function POST(req: NextRequest) {
  const ip =
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    req.headers.get('x-real-ip') ??
    'unknown'

  const rl = rateLimit(`pdf-download-meno:${ip}`, { maxRequests: 10, windowMs: 60 * 60 * 1000 })
  if (!rl.allowed) {
    return NextResponse.json({ error: 'Trop de tentatives.' }, { status: 429 })
  }

  try {
    const rawData = await req.json()
    const parsed = MenopauseFormSchema.safeParse(rawData)
    if (!parsed.success) {
      return NextResponse.json({ error: 'Données invalides.' }, { status: 422 })
    }

    const data = parsed.data as MenopauseFormData
    const pdfBuffer = await generateMenopausePDF(data)
    const filename = buildMenopauseFileName(data)

    return new NextResponse(new Uint8Array(pdfBuffer), {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Content-Length': pdfBuffer.length.toString(),
      },
    })
  } catch {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
