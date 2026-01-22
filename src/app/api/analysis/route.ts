import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db/client'
import { AuthService } from '@/lib/auth/auth-service'

export async function GET(request: NextRequest) {
  try {
    console.log('=== GET /api/analysis appelé ===')
    
    // Vérifier l'authentification
    const user = await AuthService.getCurrentUser()
    console.log('Utilisateur trouvé:', user?.email)
    
    if (!user) {
      console.log('Aucun utilisateur connecté')
      return NextResponse.json(
        { success: false, error: 'Non authentifié' },
        { status: 401 }
      )
    }

    // Récupérer les paramètres de requête
    const searchParams = request.nextUrl.searchParams
    const limit = parseInt(searchParams.get('limit') || '10')
    const page = parseInt(searchParams.get('page') || '1')
    const status = searchParams.get('status')
    const search = searchParams.get('search')
    
    const skip = (page - 1) * limit

    console.log('Paramètres de requête:', {
      userId: user.id,
      limit,
      page,
      status,
      search,
      skip
    })

    // Construire la clause WHERE
    const whereClause: any = {
      userId: user.id
    }

    if (status && status !== 'ALL') {
      whereClause.status = status
    }

    // Dans la section de construction de la clause WHERE :
    if (search) {
    whereClause.OR = [
        { fileName: { contains: search } },
        { analysis: { summary: { contains: search } } }
    ];
    }

    console.log('WHERE clause:', JSON.stringify(whereClause, null, 2))

    // Récupérer les contrats avec leur analyse associée
    let contracts, totalCount
    try {
      [contracts, totalCount] = await Promise.all([
        prisma.contract.findMany({
          where: whereClause,
          include: {
            analysis: {
              select: {
                summary: true,
                risks: true,
                obligations: true,
                powers: true,
                modelUsed: true,
                processingTime: true,
                tokenCount: true,
                cost: true
              }
            }
          },
          orderBy: {
            createdAt: 'desc'
          },
          skip,
          take: limit
        }),
        prisma.contract.count({ where: whereClause })
      ])
      
      console.log('Contrats récupérés:', contracts.length)
      console.log('Total count:', totalCount)
      
    } catch (dbError) {
      console.error('Erreur de base de données:', dbError)
      throw dbError
    }

    // Calculer les statistiques
    const stats = {
      total: totalCount,
      completed: await prisma.contract.count({
        where: { userId: user.id, status: 'COMPLETED' }
      }),
      processing: await prisma.contract.count({
        where: { userId: user.id, status: 'PROCESSING' }
      }),
      failed: await prisma.contract.count({
        where: { userId: user.id, status: 'FAILED' }
      })
    }

    console.log('Stats calculées:', stats)

    // Formater la réponse - sélectionner uniquement les champs dont vous avez besoin
    const formattedContracts = contracts.map(contract => {
      let summaryText = 'En cours d\'analyse...'
      let riskScore = null
      
      if (contract.analysis) {
        try {
          const analysisSummary = JSON.parse(contract.analysis.summary || '{}')
          summaryText = analysisSummary.overview || analysisSummary.summary || 'Analyse complétée'
          
          // Calculer un score de risque basé sur les risques détectés
          if (contract.analysis.risks) {
            try {
              const risks = JSON.parse(contract.analysis.risks)
              // Simple logique pour calculer un score de risque
              const riskCount = risks.length || 0
              riskScore = Math.min(100, riskCount * 10) // Exemple: 10% par risque
            } catch (e) {
              console.log('Erreur parsing risks:', e)
            }
          }
        } catch (e) {
          // Si le parsing échoue, utiliser le texte brut
          summaryText = contract.analysis.summary || 'Analyse complétée'
        }
      }

      return {
        id: contract.id,
        fileName: contract.fileName,
        fileSize: contract.fileSize,
        status: contract.status,
        summary: summaryText,
        riskScore: riskScore,
        createdAt: contract.createdAt.toISOString(),
        updatedAt: contract.updatedAt.toISOString(),
        totalPages: 0, // Valeur par défaut
        fileType: contract.mimeType?.split('/')[1]?.toUpperCase() || 'PDF',
        analysisTime: contract.analysis?.processingTime ? `${Math.round(contract.analysis.processingTime / 1000)}s` : null,
        hasAnalysis: !!contract.analysis,
        errorMessage: contract.errorMessage || null,
        fileUrl: contract.fileUrl || null
      }
    })

    return NextResponse.json({
      success: true,
      data: {
        contracts: formattedContracts,
        pagination: {
          total: totalCount,
          page,
          limit,
          totalPages: Math.ceil(totalCount / limit)
        },
        stats
      }
    })

  } catch (error) {
    console.error('=== ERREUR CRITIQUE dans /api/analysis ===')
    console.error('Message:', error instanceof Error ? error.message : error)
    console.error('Stack:', error instanceof Error ? error.stack : 'Pas de stack trace')
    console.error('=== Fin erreur ===')
    
    return NextResponse.json(
      { 
        success: false,
        error: process.env.NODE_ENV === 'development' 
          ? (error instanceof Error ? error.message : 'Erreur serveur inconnue')
          : 'Erreur lors de la récupération des analyses'
      },
      { status: 500 }
    )
  }
}