import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db/client'
import { AuthService } from '@/lib/auth/auth-service';
import { parseAnalysisData, createRawAnalysisData, type AnalysisResponse, type RawAnalysisData } from '@/types/contract';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: contractId } = await params;
    
    console.log(`=== GET /api/analysis/${contractId} ===`);
    
    // Vérifier l'authentification
    const user = await AuthService.getCurrentUser();
    
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Non authentifié' },
        { status: 401 }
      );
    }
    
    // Validation basique de l'ID
    if (!contractId || contractId.length < 5) {
      return NextResponse.json(
        { success: false, error: 'ID de contrat invalide' },
        { status: 400 }
      );
    }
    
    // Récupérer le contrat avec l'analyse
    const contract = await prisma.contract.findUnique({
      where: { 
        id: contractId,
        userId: user.id
      },
      include: {
        analysis: true // Inclut automatiquement tous les champs
      }
    });
    
    if (!contract) {
      return NextResponse.json(
        { success: false, error: 'Contrat non trouvé' },
        { status: 404 }
      );
    }
    
    console.log('Statut du contrat:', contract.status);
    console.log('Analyse associée:', contract.analysis ? 'Oui' : 'Non');
    
    // Formater les dates pour le JSON
    const formattedContract = {
      id: contract.id,
      fileName: contract.fileName,
      fileSize: contract.fileSize,
      status: contract.status as 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED',
      createdAt: contract.createdAt.toISOString(),
      updatedAt: contract.updatedAt.toISOString(),
      errorMessage: contract.errorMessage || undefined,
      fileUrl: contract.fileUrl || undefined,
      mimeType: contract.mimeType,
      extractedText: contract.extractedText || undefined
    };
    
    let formattedAnalysis = null;
    
    if (contract.analysis) {
      // Utiliser la fonction utilitaire qui sait gérer les champs
      const rawAnalysisData: RawAnalysisData = createRawAnalysisData(contract.analysis);
      
      // Parser les données
      formattedAnalysis = parseAnalysisData(rawAnalysisData);
      
      // Ajouter les propriétés du contrat pour le dashboard
      formattedAnalysis.fileName = contract.fileName;
      formattedAnalysis.fileSize = contract.fileSize;
      formattedAnalysis.status = contract.status as 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
      formattedAnalysis.contract = formattedContract;
    }
    
    const response: AnalysisResponse = {
      success: true,
      contract: formattedContract,
      analysis: formattedAnalysis
    };
    
    return NextResponse.json(response);
    
  } catch (error) {
    console.error('=== ERREUR dans /api/analysis/[id] ===');
    console.error('Error:', error);
    console.error('Stack:', error instanceof Error ? error.stack : 'No stack');
    
    return NextResponse.json(
      { 
        success: false,
        error: process.env.NODE_ENV === 'development' 
          ? (error instanceof Error ? error.message : 'Erreur serveur inconnue')
          : 'Erreur lors de la récupération de l\'analyse'
      },
      { status: 500 }
    );
  }
}

// Fonction DELETE (inchangée)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: contractId } = await params;
    
    console.log(`=== DELETE /api/analysis/${contractId} ===`);
    
    const user = await AuthService.getCurrentUser();
    
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Non authentifié' },
        { status: 401 }
      );
    }
    
    // Validation de l'ID
    if (!contractId || contractId.length < 5) {
      return NextResponse.json(
        { success: false, error: 'ID de contrat invalide' },
        { status: 400 }
      );
    }
    
    // Vérifier que le contrat appartient à l'utilisateur
    const contract = await prisma.contract.findUnique({
      where: { 
        id: contractId,
        userId: user.id 
      }
    });
    
    if (!contract) {
      return NextResponse.json(
        { success: false, error: 'Contrat non trouvé' },
        { status: 404 }
      );
    }
    
    // Utiliser une transaction pour supprimer en cascade
    await prisma.$transaction(async (tx) => {
      // Supprimer l'analyse si elle existe
      await tx.analysis.deleteMany({
        where: { contractId }
      });
      
      // Supprimer le contrat
      await tx.contract.delete({
        where: { id: contractId }
      });
    });
    
    return NextResponse.json({
      success: true,
      message: 'Analyse supprimée avec succès'
    });
    
  } catch (error) {
    console.error('Delete error:', error);
    
    return NextResponse.json(
      { 
        success: false,
        error: error instanceof Error ? error.message : 'Erreur lors de la suppression' 
      },
      { status: 500 }
    );
  }
}