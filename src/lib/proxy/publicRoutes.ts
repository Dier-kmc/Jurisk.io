import { NextRequest, NextResponse } from 'next/server'

const PUBLIC_PATHS = ['/', '/pricing', '/features', '/docs', '/blog', '/guides', '/privacy', '/terms', '/legal', '/cookie-policy', '/accessibility']

export function allowPublicRoutes(
  request: NextRequest
): NextResponse | null {
  const { pathname } = request.nextUrl

  if (PUBLIC_PATHS.includes(pathname)) {
    return NextResponse.next()
  }

  return null
}
