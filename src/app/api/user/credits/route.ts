import { NextRequest, NextResponse } from 'next/server'
import { AuthService } from '@/lib/auth/auth-service'

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
      plan: user.plan,
      email: user.email,
      name: user.name
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

export async function POST(request: NextRequest) {
  try {
    // Vérifier l'authentification
    const user = await AuthService.getCurrentUser()
    
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Non authentifié' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { action, amount = 1 } = body

    if (!action || !['decrement', 'add'].includes(action)) {
      return NextResponse.json(
        { success: false, error: 'Action invalide' },
        { status: 400 }
      )
    }

    let newCredits: number | null = null

    if (action === 'decrement') {
      // Vérifier si l'utilisateur a assez de crédits
      const hasEnough = await AuthService.hasEnoughCredits(user.id, amount)
      
      if (!hasEnough) {
        return NextResponse.json(
          { success: false, error: 'Crédits insuffisants' },
          { status: 400 }
        )
      }

      newCredits = await AuthService.decrementCredits(user.id, amount)
    } else if (action === 'add') {
      newCredits = await AuthService.addCredits(user.id, amount)
    }

    if (newCredits === null) {
      return NextResponse.json(
        { success: false, error: 'Erreur lors de la mise à jour des crédits' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      credits: newCredits,
      message: `Crédits ${action === 'decrement' ? 'décrémentés' : 'ajoutés'} avec succès`
    })
    
  } catch (error) {
    console.error('Update user credits error:', error)
    
    return NextResponse.json(
      { 
        success: false,
        error: error instanceof Error ? error.message : 'Erreur lors de la mise à jour des crédits' 
      },
      { status: 500 }
    )
  }
}