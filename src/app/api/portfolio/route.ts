import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'

export async function GET() {
  const items = await prisma.portfolio.findMany({
    orderBy: { completedAt: 'desc' },
  })

  return Response.json(items)
}

export async function POST(request: Request) {
  const session = await auth()
  if (!session) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const item = await prisma.portfolio.create({ data: body })

  return Response.json(item, { status: 201 })
}
