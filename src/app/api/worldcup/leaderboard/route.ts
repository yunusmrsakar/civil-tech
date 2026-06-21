import { prisma } from '@/lib/prisma';
import { PARTICIPANTS } from '@/lib/worldcup';

export async function GET() {
  const predictions = await prisma.wCPrediction.findMany({
    where: { match: { isFinished: true } },
  });

  const scores: Record<string, number> = {};
  for (const p of PARTICIPANTS) {
    scores[p.name] = 0;
  }
  for (const pred of predictions) {
    scores[pred.participant] = (scores[pred.participant] || 0) + pred.points;
  }

  const leaderboard = PARTICIPANTS.map((p) => ({
    name: p.name,
    initial: p.initial,
    color: p.color,
    points: scores[p.name] || 0,
  })).sort((a, b) => b.points - a.points);

  return Response.json(leaderboard);
}
