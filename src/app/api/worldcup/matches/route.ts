import { prisma } from '@/lib/prisma';
import { NextRequest } from 'next/server';

export async function GET() {
  const matches = await prisma.wCMatch.findMany({
    include: { predictions: true },
    orderBy: { matchDate: 'asc' },
  });
  return Response.json(matches);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const match = await prisma.wCMatch.create({
    data: {
      homeTeam: body.homeTeam,
      awayTeam: body.awayTeam,
      homeFlag: body.homeFlag || '',
      awayFlag: body.awayFlag || '',
      matchDate: new Date(body.matchDate),
      groupLabel: body.groupLabel || '',
      stadium: body.stadium || '',
    },
  });
  return Response.json(match);
}
