import { prisma } from '@/lib/prisma';
import { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { matchId, participant, homeScore, awayScore } = body;

  const match = await prisma.wCMatch.findUnique({ where: { id: matchId } });
  if (!match) {
    return Response.json({ error: 'Maç bulunamadı' }, { status: 404 });
  }
  if (match.isFinished) {
    return Response.json({ error: 'Maç bitmiş, tahmin yapılamaz' }, { status: 400 });
  }
  if (new Date() >= match.matchDate) {
    return Response.json({ error: 'Maç başlamış, tahmin yapılamaz' }, { status: 400 });
  }

  const prediction = await prisma.wCPrediction.upsert({
    where: { matchId_participant: { matchId, participant } },
    update: { homeScore, awayScore },
    create: { matchId, participant, homeScore, awayScore },
  });

  return Response.json(prediction);
}
