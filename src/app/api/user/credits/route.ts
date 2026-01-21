// src/app/api/user/credits/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { AuthService } from '@/lib/auth/auth'

export async function GET(request: NextRequest) {
  try {
    // Vérifier l'authentification
    const user = await AuthService.getCurrentUser()
    
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Non authentifié' },
        { status: 401 }
      )
    }
    
    return NextResponse.json({
      success: true,
      credits: user.credits,
      plan: user.plan || 'FREE'
    })
    
  } catch (error) {
    console.error('Get user credits error:', error)
    
    return NextResponse.json(
      { 
        success: false,
        error: error instanceof Error ? error.message : 'Erreur lors de la récupération des crédits' 
      },
      { status: 500 }
    )
  }
}