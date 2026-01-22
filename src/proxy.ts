import { NextRequest, NextResponse } from 'next/server'
import { blockUploads } from '@/lib/proxy/blockUploads'
import { allowPublicRoutes } from '@/lib/proxy/publicRoutes'
import { authGuard } from '@/lib/proxy/authGuard'

export async function proxy(request: NextRequest) {
  return (
    blockUploads(request) ??
    allowPublicRoutes(request) ??
    (await authGuard(request)) ??
    NextResponse.next()
  )
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
}