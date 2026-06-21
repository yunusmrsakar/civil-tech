import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return Response.json({ error: 'Giriş yapmalısınız' }, { status: 401 });
  }

  const body = await request.json();
  const { matchId, homeScore, awayScore } = body;
  const participant = session.user.name!;

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
    update: { homeScore: Number(homeScore), awayScore: Number(awayScore) },
    create: { matchId, participant, homeScore: Number(homeScore), awayScore: Number(awayScore) },
  });

  return Response.json(prediction);
}
