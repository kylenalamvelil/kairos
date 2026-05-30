import Stripe from 'stripe'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? 'sk_test_placeholder', {
    apiVersion: '2026-05-27.dahlia',
  })
  const { plan } = await req.json()

  const prices: Record<string, { amount: number; name: string }> = {
    pro: { amount: 1900, name: 'Kairos Pro — £19/month' },
    team: { amount: 4900, name: 'Kairos Team — £49/month' },
  }

  const selected = prices[plan] ?? prices.pro

  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    payment_method_types: ['card'],
    line_items: [
      {
        price_data: {
          currency: 'gbp',
          product_data: { name: selected.name },
          unit_amount: selected.amount,
          recurring: { interval: 'month' },
        },
        quantity: 1,
      },
    ],
    success_url: `${process.env.NEXT_PUBLIC_URL}/app?upgraded=true`,
    cancel_url: `${process.env.NEXT_PUBLIC_URL}/#pricing`,
  })

  return NextResponse.json({ url: session.url })
}
