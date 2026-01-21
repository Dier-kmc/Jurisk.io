import { NextRequest, NextResponse } from 'next/server'

export function blockUploads(request: NextRequest): NextResponse | null {
  const { pathname } = request.nextUrl

  if (pathname.startsWith('/uploads/')) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  return null
}
