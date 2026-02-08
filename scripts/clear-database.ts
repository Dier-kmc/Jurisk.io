// scripts/clear-database.ts
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function clearDatabase() {
  try {
    // Pour SQLite, désactiver les contraintes
    await prisma.$executeRaw`PRAGMA foreign_keys = OFF;`
    
    // Vider les tables dans le bon ordre (selon les relations)
    // SQLite n'a pas besoin d'ordre spécifique avec foreign_keys = OFF
    await prisma.account.deleteMany()
    await prisma.session.deleteMany()
    await prisma.verificationToken.deleteMany()
    await prisma.user.deleteMany()
    
    // Réactiver les contraintes
    await prisma.$executeRaw`PRAGMA foreign_keys = ON;`
    
    console.log('✅ Base de données SQLite vidée avec succès')
  } catch (error) {
    console.error('❌ Erreur:', error)
  } finally {
    await prisma.$disconnect()
  }
}

clearDatabase()