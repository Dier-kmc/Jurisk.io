'use client'

import { useState, useEffect } from 'react'

interface User {
  id: string
  email: string
  name: string | null
  plan: string
  credits: number
  apiKey: string | null
  createdAt: string
  updatedAt: string
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      // Vous pourriez avoir une route /api/auth/me
      // Pour l'instant, vérifions simplement si le token existe
      const response = await fetch('/api/auth/me', {
        credentials: 'include'
      })
      
      if (response.ok) {
        const data = await response.json()
        setUser(data.user)
      }
    } catch (error) {
      console.error('Auth check failed:', error)
    } finally {
      setLoading(false)
    }
  }

  const login = async (email: string, password: string) => {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
      credentials: 'include'
    })
    
    if (response.ok) {
      const data = await response.json()
      setUser(data.user)
      return { success: true, user: data.user }
    } else {
      const error = await response.json()
      return { success: false, error: error.error }
    }
  }

  const register = async (name: string, email: string, password: string) => {
    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
      credentials: 'include'
    })
    
    if (response.ok) {
      const data = await response.json()
      setUser(data.user)
      return { success: true, user: data.user }
    } else {
      const error = await response.json()
      return { success: false, error: error.error }
    }
  }

  const logout = async () => {
    await fetch('/api/auth/logout', {
      method: 'POST',
      credentials: 'include'
    })
    setUser(null)
    window.location.reload()
  }

  return {
    user,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user
  }
}