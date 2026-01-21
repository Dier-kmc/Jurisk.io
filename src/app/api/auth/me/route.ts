import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db/client'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || '7625e7efb77627ec930778a47682aa2f230b1bf54c3f06051bd179094d404f3520c4490bca59e5f1255705a2db5a09687cd73b46a98c595560333805c367256e'

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('auth_token')?.value

    if (!token) {
      return NextResponse.json({ user: null })
    }

    // Vérifier le token
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; email: string }

    // Récupérer l'utilisateur
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        email: true,
        name: true,
        plan: true,
        credits: true,
        apiKey: true,
        createdAt: true,
        updatedAt: true
      }
    })

    if (!user) {
      const response = NextResponse.json({ user: null })
      response.cookies.delete('auth_token')
      return response
    }

    return NextResponse.json({ user })

  } catch (error) {
    console.error('Auth check error:', error)
    
    const response = NextResponse.json({ user: null })
    response.cookies.delete('auth_token')
    return response
  }
}