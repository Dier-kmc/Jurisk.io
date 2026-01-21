import { NextRequest, NextResponse } from 'next/server'
import { blockUploads } from '@/lib/proxy/blockUploads'
import { allowPublicRoutes } from '@/lib/proxy/publicRoutes'
import { authGuard } from '@/lib/proxy/authGuard'

export async function proxy(request: NextRequest) {
  return (
    blockUploads(request) ??
    allowPublicRoutes(request) ??
    (await authGuard(request)) ??
    NextResponse.next()
  )
}
