import { NextRequest, NextResponse } from 'next/server'
import { verifyTokenNode } from '@/lib/auth'
import { listSubmissions } from '@/lib/storage'

function getAuth(req: NextRequest): boolean {
  const cookie = req.cookies.get('admin_token')?.value
  if (!cookie) return false
  return verifyTokenNode(cookie)
}

export async function GET(req: NextRequest) {
  if (!getAuth(req)) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
  const submissions = listSubmissions()
  return NextResponse.json(submissions)
}
