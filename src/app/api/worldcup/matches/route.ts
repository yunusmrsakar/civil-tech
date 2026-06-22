import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { autoFinishMatches, recalculateAllPoints } from '@/lib/worldcup-scores';
import { NextRequest } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  const session = await auth();
  const currentUserName = session?.user?.name;

  await Promise.all([
    autoFinishMatches().catch(() => {}),
    recalculateAllPoints().catch(() => {}),
  ]);

  const matches = await prisma.wCMatch.findMany({
    include: { predictions: true },
    orderBy: { matchDate: 'asc' },
  });

  const now = new Date();
  const filtered = matches.map((match) => {
    const totalPredictions = match.predictions.length;
    const matchStarted = new Date(match.matchDate) <= now;
    if (match.isFinished || matchStarted) {
      return { ...match, totalPredictions };
    }
    return {
      ...match,
      predictions: match.predictions.filter((p) => p.participant === currentUserName),
      totalPredictions,
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
