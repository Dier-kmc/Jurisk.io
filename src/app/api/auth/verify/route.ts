// app/api/auth/verify/route.ts
import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET!

export async function GET(request: NextRequest) {
  const token = request.cookies.get('auth_token')?.value

  if (!token) {
    return NextResponse.json({ authenticated: false }, { status: 200 })
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET)
    return NextResponse.json({ 
      authenticated: true,
      user: decoded 
    })
  } catch (error) {
    return NextResponse.json({ authenticated: false }, { status: 200 })
  }
}