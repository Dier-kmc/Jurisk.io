import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db/client'
import { hash } from 'bcryptjs'
import { z } from 'zod'

const registerSchema = z.object({
  email: z.string().email('Email invalide'),
  password: z.string().min(8, 'Le mot de passe doit contenir au moins 8 caractères'),
  name: z.string().min(2, 'Le nom doit contenir au moins 2 caractères').optional()
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validated = registerSchema.parse(body)

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await prisma.user.findUnique({
      where: { email: validated.email }
    })

    if (existingUser) {
      return NextResponse.json(
        { success: false, error: 'Un utilisateur avec cet email existe déjà' },
        { status: 400 }
      )
    }

    // Hasher le mot de passe
    const hashedPassword = await hash(validated.password, 12)

    // Créer l'utilisateur
    const user = await prisma.user.create({
      data: {
        email: validated.email,
        name: validated.name,
        password: hashedPassword,
        plan: 'FREE',
        credits: 10,
        apiKey: `cs_${Buffer.from(Date.now().toString()).toString('base64')}`
      }
    })

    // Retourner sans le mot de passe
    const { password: _, ...userWithoutPassword } = user

    return NextResponse.json({
      success: true,
      user: userWithoutPassword,
      message: 'Inscription réussie'
    })

  } catch (error) {
    console.error('Register error:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: error.issues[0].message },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { success: false, error: 'Erreur lors de l\'inscription' },
      { status: 500 }
    )
  }
}