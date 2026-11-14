import { NextRequest, NextResponse } from 'next/server'

const PUBLIC_PATHS = [
  '/',
  '/method',
  '/report',
  '/resources',
  '/pricing',
  '/status',
  '/privacy',
  '/terms',
  '/accessibility',
]

export function allowPublicRoutes(
  request: NextRequest
): NextResponse | null {
  const { pathname } = request.nextUrl

  if (PUBLIC_PATHS.includes(pathname)) {
    return NextResponse.next()
  }

  return null
}
