import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db/client'

export async function POST(request: NextRequest) {
  try {
    const payload = await request.text()
    const sig = request.headers.get('stripe-signature')

    // TODO: Implémenter la vérification Stripe
    // const event = stripe.webhooks.constructEvent(payload, sig!, process.env.STRIPE_WEBHOOK_SECRET!)

    // if (event.type === 'checkout.session.completed') {
    //   const session = event.data.object
    //   const userId = session.metadata?.userId
      
    //   if (userId) {
    //     await prisma.user.update({
    //       where: { id: userId },
    //       data: { 
    //         credits: { increment: 50 },
    //         plan: 'PRO' 
    //       }
    //     })
    //   }
    // }

    return NextResponse.json({ success: true, received: true })

  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json(
      { success: false, error: 'Webhook error' },
      { status: 400 }
    )
  }
}