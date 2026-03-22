import { getStripe } from '@/lib/stripe'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
  const { items, email } = await request.json()

  if (!items || !items.length || !email) {
    return Response.json(
      { error: 'Missing required fields: items, email' },
      { status: 400 }
    )
  }

  const total = items.reduce(
    (sum: number, item: { price: number; quantity: number }) =>
      sum + item.price * item.quantity,
    0
  )

  const stripe = getStripe()
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    mode: 'payment',
    customer_email: email,
    line_items: items.map(
      (item: { id: string; name: string; price: number; quantity: number }) => ({
        price_data: {
          currency: 'usd',
          product_data: { name: item.name },
          unit_amount: Math.round(item.price * 100),
        },
        quantity: item.quantity,
      })
    ),
    success_url: `${process.env.NEXT_PUBLIC_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXT_PUBLIC_URL}/checkout/cancel`,
  })

  await prisma.order.create({
    data: {
      email,
      items,
      total,
      stripeSessionId: session.id,
      status: 'PENDING',
    },
  })

  return Response.json({ url: session.url })
}
