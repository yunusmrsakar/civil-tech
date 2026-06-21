import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { NextRequest } from 'next/server';

export async function GET() {
  const session = await auth();
  const currentUserName = session?.user?.name;

  const matches = await prisma.wCMatch.findMany({
    include: { predictions: true },
    orderBy: { matchDate: 'asc' },
  });

  const now = new Date();
  const filtered = matches.map((match) => {
    if (match.isFinished) {
      return match;
    }
    // For upcoming/live matches, only show the current user's prediction
    return {
      ...match,
      predictions: match.predictions.filter((p) => p.participant === currentUserName),
    };
  });

  return Response.json(filtered);
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
