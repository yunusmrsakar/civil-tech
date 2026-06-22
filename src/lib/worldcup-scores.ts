import { prisma } from '@/lib/prisma';
import { calculatePoints } from '@/lib/worldcup';

const TEAM_NAME_EN: Record<string, string[]> = {
  'ABD': ['United States', 'USA', 'US'],
  'Meksika': ['Mexico'],
  'Kanada': ['Canada'],
  'Brezilya': ['Brazil'],
  'Arjantin': ['Argentina'],
  'Almanya': ['Germany'],
  'Fransa': ['France'],
  'İspanya': ['Spain'],
  'İngiltere': ['England'],
  'Portekiz': ['Portugal'],
  'Hollanda': ['Netherlands', 'Holland'],
  'Belçika': ['Belgium'],
  'Uruguay': ['Uruguay'],
  'Kolombiya': ['Colombia'],
  'Japonya': ['Japan'],
  'Güney Kore': ['South Korea', 'Korea Republic', 'Korea'],
  'Avustralya': ['Australia'],
  'Fas': ['Morocco'],
  'Senegal': ['Senegal'],
  'Gana': ['Ghana'],
  'Türkiye': ['Turkey', 'Türkiye', 'Turkiye'],
  'İran': ['Iran', 'IR Iran'],
  'Ekvador': ['Ecuador'],
  'Paraguay': ['Paraguay'],
  'Güney Afrika': ['South Africa'],
  'Çekya': ['Czech Republic', 'Czechia'],
  'Bosna Hersek': ['Bosnia and Herzegovina', 'Bosnia Herzegovina', 'Bosnia'],
  'Katar': ['Qatar'],
  'İsviçre': ['Switzerland'],
  'Haiti': ['Haiti'],
  'İskoçya': ['Scotland'],
  'Curaçao': ['Curaçao', 'Curacao'],
  'Fildişi Sahili': ["Côte d'Ivoire", 'Ivory Coast', 'Cote dIvoire'],
  'İsveç': ['Sweden'],
  'Tunus': ['Tunisia'],
  'Mısır': ['Egypt'],
  'Yeni Zelanda': ['New Zealand'],
  'Cabo Verde': ['Cape Verde', 'Cabo Verde'],
  'Suudi Arabistan': ['Saudi Arabia'],
  'Irak': ['Iraq'],
  'Norveç': ['Norway'],
  'Cezayir': ['Algeria'],
  'Avusturya': ['Austria'],
  'Ürdün': ['Jordan'],
  'DR Kongo': ['DR Congo', 'Congo DR', 'Democratic Republic of Congo'],
  'Özbekistan': ['Uzbekistan'],
  'Hırvatistan': ['Croatia'],
  'Panama': ['Panama'],
};

function matchTeamName(trName: string, apiName: string): boolean {
  const aliases = TEAM_NAME_EN[trName];
  if (!aliases) return false;
  const lower = apiName.toLowerCase();
  return aliases.some((a) => lower.includes(a.toLowerCase()));
}

interface ESPNEvent {
  competitions: Array<{
    status: { type: { completed: boolean } };
    competitors: Array<{
      homeAway: string;
      team: { displayName: string; shortDisplayName: string; name: string };
      score: string;
    }>;
  }>;
}

export async function recalculateAllPoints() {
  const finished = await prisma.wCMatch.findMany({
    where: { isFinished: true },
    include: { predictions: true },
  });

  for (const match of finished) {
    if (match.homeScore === null || match.awayScore === null) continue;
    for (const pred of match.predictions) {
      const { total } = calculatePoints(pred.homeScore, pred.awayScore, match.homeScore, match.awayScore);
      if (pred.points !== total) {
        await prisma.wCPrediction.update({
          where: { id: pred.id },
          data: { points: total },
        });
      }
    }
  }
}

export async function autoFinishMatches() {
  const now = new Date();
  const cutoff = new Date(now.getTime() - 120 * 60 * 1000);

  const unfinished = await prisma.wCMatch.findMany({
    where: {
      isFinished: false,
      matchDate: { lt: cutoff },
    },
    include: { predictions: true },
  });

  if (unfinished.length === 0) return;

  const dates = new Set(
    unfinished.map((m) => {
      const d = new Date(m.matchDate);
      return `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}`;
    })
  );

  const allEvents: ESPNEvent[] = [];
  for (const date of dates) {
    try {
      const res = await fetch(
        `https://site.api.espn.com/apis/site/v2/sports/soccer/fifa.world/scoreboard?dates=${date}`,
        { cache: 'no-store' }
      );
      if (res.ok) {
        const data = await res.json();
        if (data.events) allEvents.push(...data.events);
      }
    } catch {
      // ESPN API unavailable, skip
    }
  }

  if (allEvents.length === 0) return;

  for (const match of unfinished) {
    for (const event of allEvents) {
      const comp = event.competitions?.[0];
      if (!comp?.status?.type?.completed) continue;

      const homeComp = comp.competitors.find((c) => c.homeAway === 'home');
      const awayComp = comp.competitors.find((c) => c.homeAway === 'away');
      if (!homeComp || !awayComp) continue;

      const homeMatch =
        matchTeamName(match.homeTeam, homeComp.team.displayName) ||
        matchTeamName(match.homeTeam, homeComp.team.shortDisplayName) ||
        matchTeamName(match.homeTeam, homeComp.team.name);
      const awayMatch =
        matchTeamName(match.awayTeam, awayComp.team.displayName) ||
        matchTeamName(match.awayTeam, awayComp.team.shortDisplayName) ||
        matchTeamName(match.awayTeam, awayComp.team.name);

      if (homeMatch && awayMatch) {
        const homeScore = parseInt(homeComp.score, 10);
        const awayScore = parseInt(awayComp.score, 10);
        if (isNaN(homeScore) || isNaN(awayScore)) continue;

        for (const pred of match.predictions) {
          const { total } = calculatePoints(pred.homeScore, pred.awayScore, homeScore, awayScore);
          await prisma.wCPrediction.update({
            where: { id: pred.id },
            data: { points: total },
          });
        }

        await prisma.wCMatch.update({
          where: { id: match.id },
          data: { homeScore, awayScore, isFinished: true },
        });

        break;
      }
    }
  }
}
