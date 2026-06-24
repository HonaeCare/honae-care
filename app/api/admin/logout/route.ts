import { NextRequest, NextResponse } from 'next/server'
import { verifyTokenNode } from '@/lib/auth'
import { logAccess } from '@/lib/storage'

export async function POST(req: NextRequest) {
  // Vérification optionnelle — un logout forcé n'est pas une élévation de privilège,
  // mais on logue uniquement les déconnexions légitimes
  const cookie = req.cookies.get('admin_token')?.value
  if (cookie && verifyTokenNode(cookie)) {
    logAccess('LOGOUT')
  }

  const res = NextResponse.json({ ok: true })
  res.cookies.set('admin_token', '', {
    maxAge: 0,
    path: '/',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
  })
  return res
}
