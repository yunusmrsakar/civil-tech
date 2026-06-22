import { prisma } from '@/lib/prisma';
import { calculatePoints } from '@/lib/worldcup';
import { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { matchId, homeScore, awayScore } = body;

  if (typeof homeScore !== 'number' || typeof awayScore !== 'number') {
    return Response.json({ error: 'homeScore ve awayScore gerekli' }, { status: 400 });
  }

  const match = await prisma.wCMatch.findUnique({
    where: { id: matchId },
    include: { predictions: true },
  });

  if (!match) {
    return Response.json({ error: 'Maç bulunamadı' }, { status: 404 });
  }

  for (const pred of match.predictions) {
    const { total } = calculatePoints(pred.homeScore, pred.awayScore, homeScore, awayScore);
    await prisma.wCPrediction.update({
      where: { id: pred.id },
      data: { points: total },
    });
  }

  const updated = await prisma.wCMatch.update({
    where: { id: matchId },
    data: { homeScore, awayScore, isFinished: true },
  });

  return Response.json({ success: true, match: updated });
}
