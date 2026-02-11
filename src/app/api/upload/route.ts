// src/app/api/upload/route.ts - Version avec analyse automatique
import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { v4 as uuidv4 } from 'uuid'
import { prisma } from '@/lib/db/client'
import { DocumentExtractor } from '@/lib/pdf/extractText'
import { analyzeContract } from '@/lib/services/analysisService'
import { AuthService } from '@/lib/auth/auth-service'
import { supabase } from '@/lib/supabase/client'


export async function POST(request: NextRequest) {
  try {
    console.log('=== Début de l\'upload ===');
    
    // Vérifier l'authentification
    const user = await AuthService.getCurrentUser();
    console.log('User:', user?.email);
    
    if (!user) {
      console.log('Non authentifié');
      return NextResponse.json(
        { success: false, error: 'Non authentifié' },
        { status: 401 }
      ) 
    }

    // Vérifier les crédits
    console.log('Credits:', user.credits);
    if (user.credits <= 0) {
      return NextResponse.json(
        { success: false, error: 'Crédits insuffisants' },
        { status: 402 }
      )
    }

    // Récupérer le fichier
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      console.log('Aucun fichier fourni');
      return NextResponse.json(
        { success: false, error: 'Aucun fichier fourni' },
        { status: 400 }
      )
    }

    console.log('Fichier reçu:', {
      name: file.name,
      type: file.type,
      size: file.size,
      lastModified: new Date(file.lastModified).toISOString()
    });

    // Valider le type de fichier
    const allowedTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/msword',
      'text/plain'
    ];

    if (!allowedTypes.includes(file.type)) {
      console.log('Type non supporté:', file.type);
      return NextResponse.json(
        { success: false, error: 'Type de fichier non supporté' },
        { status: 400 }
      )
    }

    // Valider la taille (max 10MB)
    const maxSize = 10 * 1024 * 1024 // 10MB
    if (file.size > maxSize) {
      console.log('Fichier trop volumineux:', file.size);
      return NextResponse.json(
        { success: false, error: 'Fichier trop volumineux (max 10MB)' },
        { status: 400 }
      )
    }

    // Lire le fichier
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    console.log('Buffer créé:', {
      length: buffer.length,
      firstBytes: buffer.slice(0, 20).toString('hex')
    });

    // Extraire le texte pour validation rapide
    console.log('Début de l\'extraction du texte...');
    const text = await DocumentExtractor.extractText(buffer, file.type);
    console.log('Texte extrait avec succès:', text.length, 'caractères');
    
    const textValidation = DocumentExtractor.isTextValidForAnalysis(text);
    
    if (!textValidation.valid) {
      console.log('Texte invalide:', textValidation.reason);
      return NextResponse.json(
        { success: false, error: textValidation.reason },
        { status: 400 }
      )
    }

    // // Sauvegarder le fichier
    // const uploadsDir = join(process.cwd(), 'uploads');
    // const fileId = uuidv4();
    // const fileName = `${fileId}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
    // const filePath = join(uploadsDir, fileName);

    // console.log('Sauvegarde du fichier:', {
    //   uploadsDir,
    //   fileId,
    //   fileName,
    //   filePath
    // });

    // // Créer le dossier uploads s'il n'existe pas
    // await mkdir(uploadsDir, { recursive: true });
    // await writeFile(filePath, buffer);
    // console.log('Fichier sauvegardé');

    const fileId = uuidv4();
    const fileName = `${fileId}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;

    const { data, error: uploadError } = await supabase.storage
      .from('jurisk-io')
      .upload(`uploads/${fileName}`, buffer, {
        contentType: file.type
      });

    if (uploadError) {
      console.error('Erreur upload Supabase:', uploadError);
      return NextResponse.json(
        { success: false, error: 'Impossible de sauvegarder le fichier' },
        { status: 500 }
      );
    }

    // Créer l'entrée en base avec l'URL Supabase
    const fileUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/jurisk-io/uploads/${fileName}`;

    // Créer l'entrée en base de données
    const contract = await prisma.contract.create({
      data: {
        userId: user.id,
        fileName: file.name,
        fileSize: file.size,
        fileUrl: `/uploads/${fileName}`,
        extractedText: text,
        mimeType: file.type,
        status: 'PROCESSING', // On démarre directement en PROCESSING
        createdAt: new Date(),
        // updatedAt: new Date()
      }
    });

    console.log('Contrat créé en DB:', contract.id);

    // Décrémenter les crédits
    await AuthService.updateCredits(user.id, -1);
    console.log('Crédits mis à jour');

    // Lancer l'analyse en arrière-plan
    console.log('Lancement de l\'analyse en arrière-plan...');
    analyzeContract(contract.id, buffer, file.type).catch(error => {
      console.error('Erreur lors de l\'analyse en arrière-plan:', error);
    });

    console.log('=== Upload réussi ===');
    
    return NextResponse.json({
      success: true,
      contractId: contract.id,
      fileName: file.name,
      fileSize: file.size,
      estimatedTokenCount: DocumentExtractor.estimateTokenCount(text),
      creditsRemaining: user.credits - 1,
      message: 'Fichier uploadé avec succès. L\'analyse est en cours...'
    });

  } catch (error) {
    console.error('=== Upload API error ===');
    console.error('Error:', error);
    console.error('Stack:', error instanceof Error ? error.stack : 'No stack');
    console.error('=== Fin erreur ===');
    
    return NextResponse.json(
      { 
        success: false,
        error: error instanceof Error ? error.message : 'Erreur lors de l\'upload' 
      },
      { status: 500 }
    )
  }
}