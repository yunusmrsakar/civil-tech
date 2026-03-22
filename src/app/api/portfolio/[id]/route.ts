import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  const item = await prisma.portfolio.findUnique({ where: { id } })

  if (!item) {
    return Response.json({ error: 'Portfolio item not found' }, { status: 404 })
  }

  return Response.json(item)
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

  const item = await prisma.portfolio.update({
    where: { id },
    data: body,
  })

  return Response.json(item)
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

  await prisma.portfolio.delete({ where: { id } })

  return Response.json({ message: 'Portfolio item deleted' })
}
