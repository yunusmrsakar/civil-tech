import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'

export async function GET() {
  const session = await auth()
  if (!session) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const requests = await prisma.request.findMany({
    orderBy: { createdAt: 'desc' },
  })

  return Response.json(requests)
}

export async function POST(request: Request) {
  const body = await request.json()

  const { name, email, phone, projectType, description } = body

  if (!name || !email || !phone || !projectType || !description) {
    return Response.json(
      { error: 'Missing required fields: name, email, phone, projectType, description' },
      { status: 400 }
    )
  }

  const newRequest = await prisma.request.create({
    data: {
      name,
      email,
      phone,
      company: body.company,
      projectType,
      budget: body.budget,
      timeline: body.timeline,
      description,
      attachments: body.attachments || [],
    },
  })

  return Response.json(newRequest, { status: 201 })
}
