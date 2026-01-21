import { compare, hash } from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { prisma } from '@/lib/db/client'
import { cookies } from 'next/headers'

export interface User {
  id: string
  email: string
  name: string | null
  plan: string
  credits: number
  createdAt: Date
  updatedAt: Date
}

export interface AuthResult {
  user: Omit<User, 'createdAt' | 'updatedAt'>
  token: string
}

export class AuthService {
  private static readonly JWT_SECRET = process.env.JWT_SECRET!
  private static readonly TOKEN_EXPIRY = '7d'

  static async register(
    email: string,
    password: string,
    name?: string
  ): Promise<AuthResult> {
    try {
      // Validation basique
      if (!email || !password) {
        throw new Error('Email et mot de passe requis')
      }

      // Vérifier si l'utilisateur existe déjà
      const existingUser = await prisma.user.findUnique({
        where: { email }
      })

      if (existingUser) {
        throw new Error('Un utilisateur avec cet email existe déjà')
      }

      // Hasher le mot de passe
      const hashedPassword = await hash(password, 12)

      // Créer l'utilisateur
      const user = await prisma.user.create({
        data: {
          email,
          name,
          password: hashedPassword,
          apiKey: this.generateApiKey(),
          credits: 10 // Crédits initiaux
        }
      })

      // Générer le token JWT
      const token = jwt.sign(
        { userId: user.id, email: user.email },
        this.JWT_SECRET,
        { expiresIn: this.TOKEN_EXPIRY }
      )

      return {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          plan: user.plan,
          credits: user.credits
        },
        token
      }
    } catch (error) {
      console.error('Registration error:', error)
      throw error
    }
  }

  static async login(email: string, password: string): Promise<AuthResult> {
    try {
      // Trouver l'utilisateur
      const user = await prisma.user.findUnique({
        where: { email }
      })

      if (!user) {
        throw new Error('Email ou mot de passe incorrect')
      }

      // Vérifier le mot de passe
      const isValid = await compare(password, user.password)

      if (!isValid) {
        throw new Error('Email ou mot de passe incorrect')
      }

      // Générer le token JWT
      const token = jwt.sign(
        { userId: user.id, email: user.email },
        this.JWT_SECRET,
        { expiresIn: this.TOKEN_EXPIRY }
      )

      return {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          plan: user.plan,
          credits: user.credits
        },
        token
      }
    } catch (error) {
      console.error('Login error:', error)
      throw error
    }
  }

  static async verifyToken(token: string): Promise<{ userId: string; email: string } | null> {
    try {
      const decoded = jwt.verify(token, this.JWT_SECRET) as { userId: string; email: string }
      return decoded
    } catch (error) {
      console.error('Token verification error:', error)
      return null
    }
  }

  static async getCurrentUser(): Promise<User | null> {
    try {
      const cookieStore = await cookies()
      const token = cookieStore.get('auth_token')?.value

      if (!token) {
        return null
      }

      const decoded = await this.verifyToken(token)
      if (!decoded) {
        return null
      }

      const user = await prisma.user.findUnique({
        where: { id: decoded.userId }
      })

      return user
    } catch (error) {
      console.error('Get current user error:', error)
      return null
    }
  }

  static async updateCredits(userId: string, amount: number): Promise<void> {
    await prisma.user.update({
      where: { id: userId },
      data: { credits: { increment: amount } }
    })
  }

  static async getUserCredits(userId: string): Promise<number> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { credits: true }
    })
    return user?.credits || 0
  }

  private static generateApiKey(): string {
    return `cs_${require('crypto').randomBytes(24).toString('hex')}`
  }
}