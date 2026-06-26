import { NextRequest, NextResponse } from 'next/server'
import { verifyTokenNode } from '@/lib/auth'
import { getSubmission, listSubmissions, logAccess } from '@/lib/storage'

function getAuth(req: NextRequest): boolean {
  const cookie = req.cookies.get('admin_token')?.value
  if (!cookie) return false
  return verifyTokenNode(cookie)
}

// Sanitise les noms pour éviter l'injection dans Content-Disposition
function safeFilePart(s: string): string {
  return s.replace(/[^a-zA-Z0-9\-_àâéèêëîïôùûüçÀÂÉÈÊËÎÏÔÙÛÜÇ]/g, '_').slice(0, 50)
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!getAuth(req)) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

  const { id } = await params
  const index = listSubmissions()
  const meta = index.find((s) => s.id === id)
  if (!meta) {
    return NextResponse.json({ error: 'Introuvable' }, { status: 404 })
  }

  try {
    const pdfBuffer = getSubmission(id) // valide l'UUID en interne
    const dateFormatted = meta.date.slice(0, 10).split('-').reverse().join('.')
    const filename = `HC Anamnèse Fertilité ${safeFilePart(meta.nom)} ${safeFilePart(meta.prenom)} ${dateFormatted}.pdf`

    // Log sans données patient (RGPD — pseudonymisation par ID)
    logAccess(`DOWNLOAD id=${id}`)

    return new NextResponse(new Uint8Array(pdfBuffer), {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename*=UTF-8''${encodeURIComponent(filename)}`,
        'Content-Length': pdfBuffer.length.toString(),
      },
    })
  } catch {
    // Pas de stack trace exposée — erreur générique uniquement
    return NextResponse.json({ error: 'Erreur lors du déchiffrement' }, { status: 500 })
  }
}
