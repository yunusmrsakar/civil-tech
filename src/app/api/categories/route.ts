import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'

export async function GET() {
  const categories = await prisma.category.findMany({
    orderBy: { name: 'asc' },
  })

  return Response.json(categories)
}

export async function POST(request: Request) {
  const session = await auth()
  if (!session) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const category = await prisma.category.create({ data: body })

  return Response.json(category, { status: 201 })
}
