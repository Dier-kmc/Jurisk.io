// import { NextRequest, NextResponse } from 'next/server'
// import { readFile } from 'fs/promises'
// import { join } from 'path'
// import { prisma } from '@/lib/db/client'
// import { AuthService } from '@/lib/auth/auth'
// import { DocumentExtractor } from '@/lib/pdf/extractText'
// import { OllamaService } from '@/lib/llm/ollama'
// import { PromptBuilder } from '@/lib/llm/promptBuilder'
// import { ResponseParser } from '@/lib/llm/responseParser'

// export async function POST(request: NextRequest) {
//   const startTime = Date.now()
//   let contractId: string | undefined

//   try {
//     // Vérifier l'authentification
//     const user = await AuthService.getCurrentUser()
//     if (!user) {
//       return NextResponse.json(
//         { success: false, error: 'Non authentifié' },
//         { status: 401 }
//       )
//     }

//     // Récupérer le contractId
//     const body = await request.json()
//     contractId = body.contractId

//     if (!contractId) {
//       return NextResponse.json(
//         { success: false, error: 'contractId requis' },
//         { status: 400 }
//       )
//     }

//     // Récupérer le contrat
//     const contract = await prisma.contract.findUnique({
//       where: { id: contractId, userId: user.id },
//       include: { analysis: true }
//     })

//     if (!contract) {
//       return NextResponse.json(
//         { success: false, error: 'Contrat non trouvé' },
//         { status: 404 }
//       )
//     }

//     // Vérifier si déjà analysé
//     if (contract.analysis) {
//       return NextResponse.json({
//         success: true,
//         analysis: contract.analysis,
//         cached: true,
//         processingTime: 0
//       })
//     }

//     // Mettre à jour le statut
//     await prisma.contract.update({
//       where: { id: contractId },
//       data: { status: 'PROCESSING' }
//     })

//     // Vérifier Ollama
//     const ollama = new OllamaService()
//     const isAvailable = await ollama.isAvailable()

//     if (!isAvailable) {
//       throw new Error('Ollama n\'est pas disponible. Assurez-vous que le service est lancé avec "ollama serve"')
//     }

//     // Lire et extraire le texte
//     const filePath = join(process.cwd(), 'public', contract.fileUrl)
//     const fileBuffer = await readFile(filePath)
//     const text = await DocumentExtractor.extractText(fileBuffer, contract.mimeType)

//     // Vérifier à nouveau la validité du texte
//     const textValidation = DocumentExtractor.isTextValidForAnalysis(text)
//     if (!textValidation.valid) {
//       throw new Error(`Texte non valide pour l'analyse: ${textValidation.reason}`)
//     }

//     // Générer le prompt
//     const prompt = PromptBuilder.getContractAnalysisPrompt(text)
    
//     // Appeler Ollama
//     const llmResponse = await ollama.generate(prompt, {
//       maxTokens: 8192,
//       temperature: 0.1
//     })

//     // Parser la réponse
//     const analysisData = ResponseParser.parseAnalysisResponse(llmResponse.response)
    
//     // Calculer le score de risque global
//     const overallRiskScore = ResponseParser.calculateOverallRiskScore(analysisData)
//     analysisData.summary.score_risque = overallRiskScore

//     // Sauvegarder l'analyse
//     const analysis = await prisma.analysis.create({
//       data: {
//         contractId,
//         risks: analysisData.risques,
//         obligations: analysisData.obligations,
//         powers: analysisData.pouvoirs,
//         summary: analysisData.summary,
//         modelUsed: process.env.OLLAMA_MODEL || 'llama3.2',
//         processingTime: Math.round((Date.now() - startTime) / 1000),
//         tokenCount: DocumentExtractor.estimateTokenCount(text + llmResponse.response)
//       }
//     })

//     // Mettre à jour le statut du contrat
//     await prisma.contract.update({
//       where: { id: contractId },
//       data: { status: 'COMPLETED' }
//     })

//     return NextResponse.json({
//       success: true,
//       analysis,
//       processingTime: analysis.processingTime,
//       modelUsed: analysis.modelUsed
//     })

//   } catch (error) {
//     console.error('Analyze API error:', error)

//     // Mettre à jour le statut en cas d'erreur
//     if (contractId) {
//       await prisma.contract.update({
//         where: { id: contractId },
//         data: { status: 'FAILED' }
//       })
//     }

//     return NextResponse.json(
//       { 
//         success: false,
//         error: error instanceof Error ? error.message : 'Erreur lors de l\'analyse' 
//       },
//       { status: 500 }
//     )
//   }
// }