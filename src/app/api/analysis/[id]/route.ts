// src/app/api/analysis/[id]/route.ts - Version corrigée
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db/client'
import { AuthService } from '@/lib/auth/auth'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }  // params est une Promise
) {
  try {
    // ATTENTION: params est une Promise, il faut l'await
    const { id: contractId } = await params;  // Ajoutez await ici
    
    console.log(`=== GET /api/analysis/${contractId} ===`);
    
    // Vérifier l'authentification
    const user = await AuthService.getCurrentUser();
    console.log('User:', user?.email);
    
    if (!user) {
      console.log('Non authentifié');
      return NextResponse.json(
        { success: false, error: 'Non authentifié' },
        { status: 401 }
      );
    }
    
    console.log(`Recherche du contrat ${contractId} pour l'utilisateur ${user.id}`);
    
    // Récupérer le contrat avec l'analyse
    const contract = await prisma.contract.findUnique({
      where: { 
        id: contractId,  // Assurez-vous que contractId n'est pas undefined
        userId: user.id // Sécurité: vérifier que le contrat appartient à l'utilisateur
      },
      include: {
        analysis: true
      }
    });
    
    console.log('Contrat trouvé:', contract ? 'Oui' : 'Non');
    
    if (!contract) {
      console.log('Contrat non trouvé');
      return NextResponse.json(
        { success: false, error: 'Contrat non trouvé' },
        { status: 404 }
      );
    }
    
    console.log('Statut du contrat:', contract.status);
    console.log('Analyse associée:', contract.analysis ? 'Oui' : 'Non');
    
    return NextResponse.json({
      success: true,
      contract: {
        id: contract.id,
        fileName: contract.fileName,
        fileSize: contract.fileSize,
        status: contract.status,
        createdAt: contract.createdAt,
        // errorMessage: contract.errorMessage || null
      },
      analysis: contract.analysis || null
    });
    
  } catch (error) {
    console.error('Get analysis error:', error);
    
    return NextResponse.json(
      { 
        success: false,
        error: error instanceof Error ? error.message : 'Erreur lors de la récupération' 
      },
      { status: 500 }
    );
  }
}