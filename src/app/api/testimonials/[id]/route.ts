import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  const testimonial = await prisma.testimonial.findUnique({ where: { id } })

  if (!testimonial) {
    return Response.json({ error: 'Testimonial not found' }, { status: 404 })
  }

  return Response.json(testimonial)
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params
  const body = await request.json()

  const testimonial = await prisma.testimonial.update({
    where: { id },
    data: body,
  })

  return Response.json(testimonial)
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params

  await prisma.testimonial.delete({ where: { id } })

  return Response.json({ message: 'Testimonial deleted' })
}
