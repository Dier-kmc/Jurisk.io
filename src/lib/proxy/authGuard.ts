import { NextRequest, NextResponse } from 'next/server'
import { jwtVerify } from 'jose'

const secret = new TextEncoder().encode(process.env.JWT_SECRET!)

const PROTECTED_PREFIXES = [
  '/upload',
  '/analyze',
  '/results',
  '/history',
]

export async function authGuard(
  request: NextRequest
): Promise<NextResponse | null> {
  const { pathname } = request.nextUrl

  const isProtected = PROTECTED_PREFIXES.some(prefix =>
    pathname.startsWith(prefix)
  )

  if (!isProtected) {
    return null
  }

  const token = request.cookies.get('auth_token')?.value

  if (!token) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  try {
    const { payload } = await jwtVerify(token, secret)

    const headers = new Headers(request.headers)
    headers.set('x-user-id', String(payload.userId))
    headers.set('x-user-email', String(payload.email))

    return NextResponse.next({
      request: { headers },
    })
  } catch {
    const response = NextResponse.redirect(new URL('/', request.url))
    response.cookies.delete('auth_token')
    return response
  }
}
