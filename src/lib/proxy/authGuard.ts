import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
import { authConfig } from '../auth/config'

export async function authGuard(request: NextRequest) {
  const path = request.nextUrl.pathname
  
  // Routes publiques (pas besoin d'authentification)
  const publicRoutes = [
    '/',
    '/auth/error',
    '/auth/verify-request',
    '/forgot-password',
    '/reset-password',
    '/api/auth/.*',
    '/public/.*',
    '/_next/.*',
    '/favicon.ico',
  ]
  
  // Vérifier si la route est publique
  const isPublicRoute = publicRoutes.some(route => {
    const regex = new RegExp(`^${route.replace('*', '.*')}$`)
    return regex.test(path)
  })
  
  if (isPublicRoute) {
    return null // Laisser passer
  }
  
  // Vérifier l'authentification
  const token = await getToken({ 
    req: request,
    secret: authConfig.secret,
    cookieName: authConfig.cookieName
  })
  
  // Si non authentifié et route protégée, rediriger vers login
  if (!token) {
    const loginUrl = new URL('/', request.url)
    loginUrl.searchParams.set('callbackUrl', encodeURI(path))
    return NextResponse.redirect(loginUrl)
  }
  
  // Vérifier les accès Premium
  if (path.startsWith('/premium') && token.plan !== 'PREMIUM') {
    return NextResponse.redirect(new URL('/upgrade', request.url))
  }
  
  // Vérifier les crédits pour l'upload
  if (path === '/upload' && token.credits <= 0) {
    return NextResponse.redirect(new URL('/upgrade', request.url))
  }
  
  return null // Laisser passer
}