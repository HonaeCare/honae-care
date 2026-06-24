import { NextRequest, NextResponse } from 'next/server'
import { verifyTokenNode } from '@/lib/auth'
import { deleteSubmission } from '@/lib/storage'

function getAuth(req: NextRequest): boolean {
  const cookie = req.cookies.get('admin_token')?.value
  if (!cookie) return false
  return verifyTokenNode(cookie)
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!getAuth(req)) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

  const { id } = await params
  try {
    deleteSubmission(id)
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Dossier introuvable' }, { status: 404 })
  }
}
