import { prisma } from '@/lib/prisma';
import { calculatePoints } from '@/lib/worldcup';
import { NextRequest } from 'next/server';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();

  if (body.homeScore !== undefined && body.awayScore !== undefined) {
    const homeScore = Number(body.homeScore);
    const awayScore = Number(body.awayScore);

    const match = await prisma.wCMatch.update({
      where: { id },
      data: {
        homeScore,
        awayScore,
        isFinished: true,
      },
      include: { predictions: true },
    });

    for (const prediction of match.predictions) {
      const { total } = calculatePoints(
        prediction.homeScore,
        prediction.awayScore,
        homeScore,
        awayScore
      );
      await prisma.wCPrediction.update({
        where: { id: prediction.id },
        data: { points: total },
      });
    }

    const updated = await prisma.wCMatch.findUnique({
      where: { id },
      include: { predictions: true },
    });
    return Response.json(updated);
  }

  const match = await prisma.wCMatch.update({
    where: { id },
    data: {
      homeTeam: body.homeTeam,
      awayTeam: body.awayTeam,
      homeFlag: body.homeFlag,
      awayFlag: body.awayFlag,
      matchDate: body.matchDate ? new Date(body.matchDate) : undefined,
      groupLabel: body.groupLabel,
      stadium: body.stadium,
    },
  });
  return Response.json(match);
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await prisma.wCMatch.delete({ where: { id } });
  return Response.json({ success: true });
}
