import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'

export async function GET() {
  const session = await auth()
  if (!session) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const bookings = await prisma.booking.findMany({
    orderBy: { createdAt: 'desc' },
  })

  return Response.json(bookings)
}

export async function POST(request: Request) {
  const body = await request.json()

  const { name, email, phone, service, date, timeSlot } = body

  if (!name || !email || !phone || !service || !date || !timeSlot) {
    return Response.json(
      { error: 'Missing required fields: name, email, phone, service, date, timeSlot' },
      { status: 400 }
    )
  }

  const booking = await prisma.booking.create({
    data: {
      name,
      email,
      phone,
      service,
      date: new Date(date),
      timeSlot,
      message: body.message,
    },
  })

  return Response.json(booking, { status: 201 })
}
