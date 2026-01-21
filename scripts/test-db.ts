// scripts/test-db.ts
import { prisma } from '../src/lib/db/client'

async function testDatabase() {
  try {
    console.log('🔍 Test de la base de données...')
    
    // Créer un utilisateur de test
    const user = await prisma.user.create({
      data: {
        email: 'test@contractscope.com',
        name: 'Test User',
        password: 'hashed_password_123',
        plan: 'FREE',
        credits: 10,
      }
    })
    
    console.log('✅ Utilisateur créé:', user.email)
    
    // Créer un contrat de test
    const contract = await prisma.contract.create({
      data: {
        userId: user.id,
        fileName: 'test-contrat.pdf',
        fileSize: 2048,
        mimeType: 'application/pdf',
        status: 'COMPLETED',
      }
    })
    
    console.log('✅ Contrat créé:', contract.fileName)
    
    // Créer une analyse de test
    const analysisData = {
      risks: [
        {
          type: 'clause_penale',
          description: 'Clause excessive',
          gravite: 'medium',
          clause: 'Article 5: Sanctions',
          recommandation: 'Négocier',
          impact: 'financier'
        }
      ],
      obligations: [],
      powers: [],
      summary: {
        score_risque: 65,
        score_clarte: 80,
        points_cles: ['Clause à revoir'],
        conseils: ['Consulter avocat'],
        duree_contrat: '12 mois',
        renouvellement: 'automatique'
      }
    }
    
    const analysis = await prisma.analysis.create({
      data: {
        contractId: contract.id,
        userId: user.id,
        risks: JSON.stringify(analysisData.risks),
        obligations: JSON.stringify(analysisData.obligations),
        powers: JSON.stringify(analysisData.powers),
        summary: JSON.stringify(analysisData.summary),
        modelUsed: 'llama3.2',
        processingTime: 30,
        tokenCount: 1500,
      }
    })
    
    console.log('✅ Analyse créée:', analysis.id)
    
    // Lire les données
    const userWithRelations = await prisma.user.findUnique({
      where: { id: user.id },
      include: {
        contracts: {
          include: {
            analysis: true
          }
        },
        analyses: true
      }
    })
    
    console.log('📊 Données récupérées:')
    console.log('  - Contrats:', userWithRelations?.contracts.length)
    console.log('  - Analyses:', userWithRelations?.analyses.length)
    
    // Nettoyer
    await prisma.analysis.deleteMany()
    await prisma.contract.deleteMany()
    await prisma.user.deleteMany()
    
    console.log('🧹 Données nettoyées')
    console.log('🎉 Base de données fonctionnelle!')
    
  } catch (error) {
    console.error('❌ Erreur:', error)
  } finally {
    await prisma.$disconnect()
  }
}

testDatabase()