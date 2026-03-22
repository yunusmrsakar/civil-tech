import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { Prisma } from '@/generated/prisma/client'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const featured = searchParams.get('featured')

  const where: Prisma.TestimonialWhereInput = {}

  if (featured === 'true') {
    where.featured = true
  }

  const testimonials = await prisma.testimonial.findMany({
    where,
    orderBy: { createdAt: 'desc' },
  })

  return Response.json(testimonials)
}

export async function POST(request: Request) {
  const session = await auth()
  if (!session) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const testimonial = await prisma.testimonial.create({ data: body })

  return Response.json(testimonial, { status: 201 })
}
