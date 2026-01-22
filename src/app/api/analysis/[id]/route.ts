// src/app/api/analysis/[id]/route.ts - Version corrigée et optimisée
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db/client'
import { AuthService } from '@/lib/auth/auth-service';

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
    
    // Validation basique de l'ID
    if (!contractId || contractId.length < 5) {
      console.log('ID de contrat invalide:', contractId);
      return NextResponse.json(
        { success: false, error: 'ID de contrat invalide' },
        { status: 400 }
      );
    }
    
    // Récupérer le contrat avec l'analyse
    const contract = await prisma.contract.findUnique({
      where: { 
        id: contractId,
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
    
    // Formater les dates pour le JSON
    const formattedContract = {
      id: contract.id,
      fileName: contract.fileName,
      fileSize: contract.fileSize,
      status: contract.status,
      createdAt: contract.createdAt.toISOString(),
      updatedAt: contract.updatedAt.toISOString(),
      errorMessage: contract.errorMessage || null,
      fileUrl: contract.fileUrl || null,
      mimeType: contract.mimeType,
      extractedText: contract.extractedText || null
    };
    
    const formattedAnalysis = contract.analysis ? {
      id: contract.analysis.id,
      risks: contract.analysis.risks,
      obligations: contract.analysis.obligations,
      powers: contract.analysis.powers,
      summary: contract.analysis.summary,
      modelUsed: contract.analysis.modelUsed,
      processingTime: contract.analysis.processingTime,
      tokenCount: contract.analysis.tokenCount,
      cost: contract.analysis.cost,
      createdAt: contract.analysis.createdAt.toISOString(),
      errorMessage: contract.analysis.errorMessage || null
    } : null;
    
    return NextResponse.json({
      success: true,
      contract: formattedContract,
      analysis: formattedAnalysis
    });
    
  } catch (error) {
    console.error('=== ERREUR dans /api/analysis/[id] ===');
    console.error('Error:', error);
    console.error('Stack:', error instanceof Error ? error.stack : 'No stack');
    console.error('=== Fin erreur ===');
    
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

// Fonction DELETE pour supprimer une analyse
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
    
    // Optionnel: Supprimer le fichier physique du stockage
    // await deleteFileFromStorage(contract.fileUrl);
    
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