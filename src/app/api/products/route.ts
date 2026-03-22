import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { Prisma } from '@/generated/prisma/client'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const search = searchParams.get('search')
  const category = searchParams.get('category')
  const featured = searchParams.get('featured')

  const where: Prisma.ProductWhereInput = {}

  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } },
    ]
  }

  if (category) {
    where.category = { slug: category }
  }

  if (featured === 'true') {
    where.featured = true
  }

  const products = await prisma.product.findMany({
    where,
    include: { category: true },
    orderBy: { createdAt: 'desc' },
  })

  return Response.json(products)
}

export async function POST(request: Request) {
  const session = await auth()
  if (!session) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const product = await prisma.product.create({
    data: body,
    include: { category: true },
  })

  return Response.json(product, { status: 201 })
}
