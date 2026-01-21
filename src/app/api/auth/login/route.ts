import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db/client'
import { compare } from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { z } from 'zod'

const loginSchema = z.object({
  email: z.string().email('Email invalide'),
  password: z.string().min(1, 'Mot de passe requis')
})

const JWT_SECRET = process.env.JWT_SECRET!

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validated = loginSchema.parse(body)

    // Trouver l'utilisateur
    const user = await prisma.user.findUnique({
      where: { email: validated.email }
    })

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Email ou mot de passe incorrect' },
        { status: 401 }
      )
    }

    // Vérifier le mot de passe
    const isValid = await compare(validated.password, user.password)

    if (!isValid) {
      return NextResponse.json(
        { success: false, error: 'Email ou mot de passe incorrect' },
        { status: 401 }
      )
    }

    // Générer le token JWT
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    )

    // Retourner sans le mot de passe
    const { password: _, ...userWithoutPassword } = user

    // Définir le cookie
    const response = NextResponse.json({
      success: true,
      user: userWithoutPassword,
      token
    })

    response.cookies.set('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 jours
      path: '/'
    })

    return response

  } catch (error) {
    console.error('Login error:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: error.issues[0].message },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { success: false, error: 'Erreur lors de la connexion' },
      { status: 500 }
    )
  }
}