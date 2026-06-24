import { NextRequest, NextResponse } from 'next/server'
import { verifyTokenEdge } from '@/lib/verify-jwt-edge'

const LOGIN_PAGE = '/admin/login'
const LOGIN_API  = '/api/admin/login'

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl

  // Toutes les routes /admin/* et /api/admin/* sont protégées,
  // sauf la page de login et l'API de login elle-même.
  const isAdminRoute =
    pathname.startsWith('/admin') || pathname.startsWith('/api/admin')

  const isPublic =
    pathname === LOGIN_PAGE || pathname === LOGIN_API

  if (!isAdminRoute || isPublic) return NextResponse.next()

  const token = req.cookies.get('admin_token')?.value
  const valid = token ? await verifyTokenEdge(token) : false

  if (!valid) {
    if (pathname.startsWith('/api/')) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }
    const url = req.nextUrl.clone()
    url.pathname = LOGIN_PAGE
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
}
