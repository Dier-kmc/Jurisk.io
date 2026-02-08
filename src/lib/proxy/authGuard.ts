import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
import { authOptions } from '../auth/auth'

export async function authGuard(request: NextRequest) {
  const path = request.nextUrl.pathname
  
  // Routes publiques (pas besoin d'authentification)
  const publicRoutes = [
    '/',
    '/auth/error',
    '/auth/verify',
    '/auth/new-user',
    '/forgot-password',
    '/reset-password',
    '/api/auth/.*',
    '/public/.*',
    '/_next/.*',
    '/favicon.ico',
    '.*\\.(ico|png|jpg|jpeg|svg|css|js)$', // Fichiers statiques
  ]
  
  // Vérifier si la route est publique
  const isPublicRoute = publicRoutes.some(route => {
    const regex = new RegExp(`^${route.replace('*', '.*')}$`)
    return regex.test(path)
  })
  
  if (isPublicRoute) {
    return null // Laisser passer
  }
  
  try {
    // Vérifier l'authentification
    const token = await getToken({ 
      req: request,
      secret: authOptions.secret,
      // Ne pas spécifier cookieName, getToken le gère automatiquement
    })
    
    // Si non authentifié et route protégée, rediriger vers login
    if (!token) {
      const loginUrl = new URL('/', request.url)
      loginUrl.searchParams.set('callbackUrl', encodeURIComponent(path))
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
  } catch (error) {
    console.error('Auth guard error:', error)
    // En cas d'erreur, rediriger vers la page de login
    const loginUrl = new URL('/', request.url)
    loginUrl.searchParams.set('error', 'SessionExpired')
    return NextResponse.redirect(loginUrl)
  }
}