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

function teamMatches(trName: string, apiName: string): boolean {
  const aliases = TEAM_NAME_EN[trName];
  if (!aliases) return trName.toLowerCase() === apiName.toLowerCase();
  const lower = apiName.toLowerCase();
  return aliases.some((a) => lower.includes(a.toLowerCase()));
}

interface CompletedMatch {
  homeTeam: string;
  awayTeam: string;
  homeScore: number;
  awayScore: number;
}

const ESPN_SLUGS = ['fifa.world', 'fifa.worldcup'];

async function fetchESPNScores(dates: string[]): Promise<CompletedMatch[]> {
  const results: CompletedMatch[] = [];

  for (const slug of ESPN_SLUGS) {
    for (const date of dates) {
      try {
        const res = await fetch(
          `https://site.api.espn.com/apis/site/v2/sports/soccer/${slug}/scoreboard?dates=${date}`,
          { cache: 'no-store' }
        );
        if (!res.ok) continue;
        const data = await res.json();
        if (!data.events) continue;

        for (const event of data.events) {
          const comp = event.competitions?.[0];
          if (!comp?.status?.type?.completed) continue;
          const competitors = comp.competitors;
          if (!competitors || competitors.length < 2) continue;

          const home = competitors.find((c: any) => c.homeAway === 'home');
          const away = competitors.find((c: any) => c.homeAway === 'away');
          if (!home || !away) continue;

          const hs = parseInt(home.score, 10);
          const as_ = parseInt(away.score, 10);
          if (isNaN(hs) || isNaN(as_)) continue;

          const homeNames = [home.team?.displayName, home.team?.shortDisplayName, home.team?.name].filter(Boolean);
          const awayNames = [away.team?.displayName, away.team?.shortDisplayName, away.team?.name].filter(Boolean);

          results.push({
            homeTeam: homeNames[0] || '',
            awayTeam: awayNames[0] || '',
            homeScore: hs,
            awayScore: as_,
          });
        }
      } catch {
        // skip
      }
    }
    if (results.length > 0) break;
  }

  return results;
}

function getDatesAround(matchDate: Date): string[] {
  const fmt = (d: Date) =>
    `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}`;

  const day = new Date(matchDate);
  const prev = new Date(matchDate.getTime() - 24 * 60 * 60 * 1000);
  const next = new Date(matchDate.getTime() + 24 * 60 * 60 * 1000);

  return [...new Set([fmt(day), fmt(prev), fmt(next)])];
}

function findMatchScore(
  dbHome: string,
  dbAway: string,
  apiResults: CompletedMatch[]
): { homeScore: number; awayScore: number } | null {
  for (const r of apiResults) {
    if (teamMatches(dbHome, r.homeTeam) && teamMatches(dbAway, r.awayTeam)) {
      return { homeScore: r.homeScore, awayScore: r.awayScore };
    }
    if (teamMatches(dbHome, r.awayTeam) && teamMatches(dbAway, r.homeTeam)) {
      return { homeScore: r.awayScore, awayScore: r.homeScore };
    }
  }
  return null;
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

export async function autoFinishMatches(force = false) {
  const now = new Date();
  const cutoff = force ? now : new Date(now.getTime() - 120 * 60 * 1000);

  const unfinished = await prisma.wCMatch.findMany({
    where: {
      isFinished: false,
      matchDate: { lt: cutoff },
    },
    include: { predictions: true },
  });

  if (unfinished.length === 0) return;

  const allDates = new Set<string>();
  for (const m of unfinished) {
    for (const d of getDatesAround(new Date(m.matchDate))) {
      allDates.add(d);
    }
  }

  const apiResults = await fetchESPNScores([...allDates]);
  if (apiResults.length === 0) return;

  for (const match of unfinished) {
    const score = findMatchScore(match.homeTeam, match.awayTeam, apiResults);
    if (!score) continue;

    for (const pred of match.predictions) {
      const { total } = calculatePoints(pred.homeScore, pred.awayScore, score.homeScore, score.awayScore);
      await prisma.wCPrediction.update({
        where: { id: pred.id },
        data: { points: total },
      });
    }

    await prisma.wCMatch.update({
      where: { id: match.id },
      data: { homeScore: score.homeScore, awayScore: score.awayScore, isFinished: true },
    });
  }
}
