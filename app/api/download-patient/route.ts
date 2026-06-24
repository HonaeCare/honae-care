import { NextRequest, NextResponse } from 'next/server'
import { generatePDF, buildFileName } from '@/lib/pdf'
import { rateLimit } from '@/lib/rate-limit'
import { FormDataSchema } from '@/lib/validation'
import type { FormData } from '@/lib/types'

// Génère un PDF en mémoire pour la patiente depuis la page de confirmation
// Pas de stockage serveur — données jamais conservées ici
export async function POST(req: NextRequest) {

  // Rate limiting — max 10 téléchargements/heure par IP
  const ip =
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    req.headers.get('x-real-ip') ??
    'unknown'

  const rl = rateLimit(`pdf-download:${ip}`, { maxRequests: 10, windowMs: 60 * 60 * 1000 })
  if (!rl.allowed) {
    return NextResponse.json({ error: 'Trop de tentatives.' }, { status: 429 })
  }

  try {
    const rawData = await req.json()

    // Validation Zod — on n'accepte que des données conformes au schéma
    const parsed = FormDataSchema.safeParse(rawData)
    if (!parsed.success) {
      return NextResponse.json({ error: 'Données invalides.' }, { status: 422 })
    }

    const data = parsed.data as FormData
    const pdfBuffer = await generatePDF(data)
    const filename = buildFileName(data)

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
