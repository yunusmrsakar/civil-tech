import { prisma, pool } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

const USERS = [
  { name: 'Kubi', username: 'kubi', password: 'I0tZAOBGaB' },
  { name: 'Furkan', username: 'furkan', password: 'Yq3bx4j20I' },
  { name: 'Yunus', username: 'yunus', password: 'LMJnaYTT4o' },
  { name: 'Karabudak', username: 'karabudak', password: 'di0g96dEZn' },
  { name: 'Güneş', username: 'gunes', password: 'GmM9gSwklC' },
  { name: 'Atahan', username: 'atahan', password: '0pc1BSWQrB' },
  { name: 'Doğancan', username: 'dogancan', password: '4rxhiX9HZB' },
  { name: 'Serhat', username: 'serhat', password: 'rMeLxkYaCC' },
];

const FLAGS: Record<string, string> = {
  'ABD': '🇺🇸', 'Meksika': '🇲🇽', 'Kanada': '🇨🇦',
  'Brezilya': '🇧🇷', 'Arjantin': '🇦🇷', 'Almanya': '🇩🇪',
  'Fransa': '🇫🇷', 'İspanya': '🇪🇸', 'İngiltere': '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
  'Portekiz': '🇵🇹', 'Hollanda': '🇳🇱', 'Belçika': '🇧🇪',
  'Uruguay': '🇺🇾', 'Kolombiya': '🇨🇴', 'Japonya': '🇯🇵',
  'Güney Kore': '🇰🇷', 'Avustralya': '🇦🇺', 'Fas': '🇲🇦',
  'Senegal': '🇸🇳', 'Gana': '🇬🇭', 'Türkiye': '🇹🇷',
  'İran': '🇮🇷', 'Ekvador': '🇪🇨', 'Paraguay': '🇵🇾',
  'Güney Afrika': '🇿🇦', 'Çekya': '🇨🇿', 'Bosna Hersek': '🇧🇦',
  'Katar': '🇶🇦', 'İsviçre': '🇨🇭', 'Haiti': '🇭🇹',
  'İskoçya': '🏴󠁧󠁢󠁳󠁣󠁴󠁿', 'Curaçao': '🇨🇼', 'Fildişi Sahili': '🇨🇮',
  'İsveç': '🇸🇪', 'Tunus': '🇹🇳', 'Mısır': '🇪🇬',
  'Yeni Zelanda': '🇳🇿', 'Cabo Verde': '🇨🇻', 'Suudi Arabistan': '🇸🇦',
  'Irak': '🇮🇶', 'Norveç': '🇳🇴', 'Cezayir': '🇩🇿',
  'Avusturya': '🇦🇹', 'Ürdün': '🇯🇴', 'DR Kongo': '🇨🇩',
  'Özbekistan': '🇺🇿', 'Hırvatistan': '🇭🇷', 'Panama': '🇵🇦',
};

const MATCHES = [
  // === GRUP A: Meksika, Güney Afrika, Güney Kore, Çekya ===
  // Matchday 1
  { homeTeam: 'Meksika', awayTeam: 'Güney Afrika', matchDate: '2026-06-11T19:00:00Z', groupLabel: 'Grup A', stadium: 'Estadio Azteca, Mexico City' },
  { homeTeam: 'Güney Kore', awayTeam: 'Çekya', matchDate: '2026-06-12T02:00:00Z', groupLabel: 'Grup A', stadium: 'Estadio Akron, Guadalajara' },
  // Matchday 2
  { homeTeam: 'Çekya', awayTeam: 'Güney Afrika', matchDate: '2026-06-18T16:00:00Z', groupLabel: 'Grup A', stadium: 'Mercedes-Benz Stadium, Atlanta' },
  { homeTeam: 'Meksika', awayTeam: 'Güney Kore', matchDate: '2026-06-19T01:00:00Z', groupLabel: 'Grup A', stadium: 'Estadio Akron, Guadalajara' },
  // Matchday 3
  { homeTeam: 'Çekya', awayTeam: 'Meksika', matchDate: '2026-06-25T01:00:00Z', groupLabel: 'Grup A', stadium: 'Estadio Azteca, Mexico City' },
  { homeTeam: 'Güney Afrika', awayTeam: 'Güney Kore', matchDate: '2026-06-25T01:00:00Z', groupLabel: 'Grup A', stadium: 'Estadio BBVA, Monterrey' },

  // === GRUP B: Kanada, Bosna Hersek, Katar, İsviçre ===
  // Matchday 1
  { homeTeam: 'Kanada', awayTeam: 'Bosna Hersek', matchDate: '2026-06-12T17:00:00Z', groupLabel: 'Grup B', stadium: 'BMO Field, Toronto' },
  { homeTeam: 'İsviçre', awayTeam: 'Katar', matchDate: '2026-06-13T20:00:00Z', groupLabel: 'Grup B', stadium: 'Lumen Field, Seattle' },
  // Matchday 2
  { homeTeam: 'İsviçre', awayTeam: 'Bosna Hersek', matchDate: '2026-06-18T20:00:00Z', groupLabel: 'Grup B', stadium: 'Gillette Stadium, Boston' },
  { homeTeam: 'Kanada', awayTeam: 'Katar', matchDate: '2026-06-18T23:00:00Z', groupLabel: 'Grup B', stadium: 'BMO Field, Toronto' },
  // Matchday 3
  { homeTeam: 'İsviçre', awayTeam: 'Kanada', matchDate: '2026-06-24T19:00:00Z', groupLabel: 'Grup B', stadium: 'BC Place, Vancouver' },
  { homeTeam: 'Bosna Hersek', awayTeam: 'Katar', matchDate: '2026-06-24T19:00:00Z', groupLabel: 'Grup B', stadium: 'Lumen Field, Seattle' },

  // === GRUP C: Brezilya, Fas, Haiti, İskoçya ===
  // Matchday 1
  { homeTeam: 'Brezilya', awayTeam: 'Fas', matchDate: '2026-06-13T17:00:00Z', groupLabel: 'Grup C', stadium: 'Hard Rock Stadium, Miami' },
  { homeTeam: 'İskoçya', awayTeam: 'Haiti', matchDate: '2026-06-13T23:00:00Z', groupLabel: 'Grup C', stadium: 'Mercedes-Benz Stadium, Atlanta' },
  // Matchday 2
  { homeTeam: 'İskoçya', awayTeam: 'Fas', matchDate: '2026-06-19T20:00:00Z', groupLabel: 'Grup C', stadium: 'MetLife Stadium, New York' },
  { homeTeam: 'Brezilya', awayTeam: 'Haiti', matchDate: '2026-06-19T23:00:00Z', groupLabel: 'Grup C', stadium: 'Hard Rock Stadium, Miami' },
  // Matchday 3
  { homeTeam: 'İskoçya', awayTeam: 'Brezilya', matchDate: '2026-06-24T22:00:00Z', groupLabel: 'Grup C', stadium: 'Hard Rock Stadium, Miami' },
  { homeTeam: 'Fas', awayTeam: 'Haiti', matchDate: '2026-06-24T22:00:00Z', groupLabel: 'Grup C', stadium: 'Mercedes-Benz Stadium, Atlanta' },

  // === GRUP D: ABD, Paraguay, Avustralya, Türkiye ===
  // Matchday 1
  { homeTeam: 'ABD', awayTeam: 'Paraguay', matchDate: '2026-06-13T01:00:00Z', groupLabel: 'Grup D', stadium: 'SoFi Stadium, Los Angeles' },
  { homeTeam: 'Avustralya', awayTeam: 'Türkiye', matchDate: '2026-06-14T04:00:00Z', groupLabel: 'Grup D', stadium: 'BC Place, Vancouver' },
  // Matchday 2
  { homeTeam: 'ABD', awayTeam: 'Avustralya', matchDate: '2026-06-19T19:00:00Z', groupLabel: 'Grup D', stadium: 'Lumen Field, Seattle' },
  { homeTeam: 'Paraguay', awayTeam: 'Türkiye', matchDate: '2026-06-20T04:00:00Z', groupLabel: 'Grup D', stadium: "Levi's Stadium, Santa Clara" },
  // Matchday 3
  { homeTeam: 'Türkiye', awayTeam: 'ABD', matchDate: '2026-06-26T02:00:00Z', groupLabel: 'Grup D', stadium: 'SoFi Stadium, Los Angeles' },
  { homeTeam: 'Paraguay', awayTeam: 'Avustralya', matchDate: '2026-06-26T02:00:00Z', groupLabel: 'Grup D', stadium: "Levi's Stadium, Santa Clara" },

  // === GRUP E: Almanya, Curaçao, Fildişi Sahili, Ekvador ===
  // Matchday 1
  { homeTeam: 'Almanya', awayTeam: 'Curaçao', matchDate: '2026-06-14T17:00:00Z', groupLabel: 'Grup E', stadium: 'NRG Stadium, Houston' },
  { homeTeam: 'Fildişi Sahili', awayTeam: 'Ekvador', matchDate: '2026-06-14T20:00:00Z', groupLabel: 'Grup E', stadium: 'Lincoln Financial Field, Philadelphia' },
  // Matchday 2
  { homeTeam: 'Almanya', awayTeam: 'Fildişi Sahili', matchDate: '2026-06-20T17:00:00Z', groupLabel: 'Grup E', stadium: 'BMO Field, Toronto' },
  { homeTeam: 'Ekvador', awayTeam: 'Curaçao', matchDate: '2026-06-20T20:00:00Z', groupLabel: 'Grup E', stadium: 'Arrowhead Stadium, Kansas City' },
  // Matchday 3
  { homeTeam: 'Ekvador', awayTeam: 'Almanya', matchDate: '2026-06-25T20:00:00Z', groupLabel: 'Grup E', stadium: 'Lincoln Financial Field, Philadelphia' },
  { homeTeam: 'Curaçao', awayTeam: 'Fildişi Sahili', matchDate: '2026-06-25T20:00:00Z', groupLabel: 'Grup E', stadium: 'NRG Stadium, Houston' },

  // === GRUP F: Hollanda, Japonya, İsveç, Tunus ===
  // Matchday 1
  { homeTeam: 'Hollanda', awayTeam: 'İsveç', matchDate: '2026-06-14T23:00:00Z', groupLabel: 'Grup F', stadium: 'NRG Stadium, Houston' },
  { homeTeam: 'Japonya', awayTeam: 'Tunus', matchDate: '2026-06-15T02:00:00Z', groupLabel: 'Grup F', stadium: 'Estadio BBVA, Monterrey' },
  // Matchday 2
  { homeTeam: 'Hollanda', awayTeam: 'Japonya', matchDate: '2026-06-20T23:00:00Z', groupLabel: 'Grup F', stadium: 'AT&T Stadium, Dallas' },
  { homeTeam: 'İsveç', awayTeam: 'Tunus', matchDate: '2026-06-21T02:00:00Z', groupLabel: 'Grup F', stadium: 'Estadio BBVA, Monterrey' },
  // Matchday 3
  { homeTeam: 'Japonya', awayTeam: 'İsveç', matchDate: '2026-06-25T23:00:00Z', groupLabel: 'Grup F', stadium: 'AT&T Stadium, Dallas' },
  { homeTeam: 'Tunus', awayTeam: 'Hollanda', matchDate: '2026-06-25T23:00:00Z', groupLabel: 'Grup F', stadium: 'Estadio BBVA, Monterrey' },

  // === GRUP G: Belçika, Mısır, İran, Yeni Zelanda ===
  // Matchday 1
  { homeTeam: 'Belçika', awayTeam: 'Mısır', matchDate: '2026-06-15T17:00:00Z', groupLabel: 'Grup G', stadium: 'SoFi Stadium, Los Angeles' },
  { homeTeam: 'İran', awayTeam: 'Yeni Zelanda', matchDate: '2026-06-15T20:00:00Z', groupLabel: 'Grup G', stadium: 'BC Place, Vancouver' },
  // Matchday 2
  { homeTeam: 'Belçika', awayTeam: 'İran', matchDate: '2026-06-21T19:00:00Z', groupLabel: 'Grup G', stadium: 'SoFi Stadium, Los Angeles' },
  { homeTeam: 'Yeni Zelanda', awayTeam: 'Mısır', matchDate: '2026-06-22T01:00:00Z', groupLabel: 'Grup G', stadium: 'BC Place, Vancouver' },
  // Matchday 3
  { homeTeam: 'Mısır', awayTeam: 'İran', matchDate: '2026-06-27T03:00:00Z', groupLabel: 'Grup G', stadium: 'Lumen Field, Seattle' },
  { homeTeam: 'Yeni Zelanda', awayTeam: 'Belçika', matchDate: '2026-06-27T03:00:00Z', groupLabel: 'Grup G', stadium: 'BC Place, Vancouver' },

  // === GRUP H: İspanya, Cabo Verde, Suudi Arabistan, Uruguay ===
  // Matchday 1
  { homeTeam: 'İspanya', awayTeam: 'Cabo Verde', matchDate: '2026-06-15T23:00:00Z', groupLabel: 'Grup H', stadium: 'Mercedes-Benz Stadium, Atlanta' },
  { homeTeam: 'Suudi Arabistan', awayTeam: 'Uruguay', matchDate: '2026-06-16T02:00:00Z', groupLabel: 'Grup H', stadium: 'Hard Rock Stadium, Miami' },
  // Matchday 2
  { homeTeam: 'İspanya', awayTeam: 'Suudi Arabistan', matchDate: '2026-06-21T16:00:00Z', groupLabel: 'Grup H', stadium: 'Mercedes-Benz Stadium, Atlanta' },
  { homeTeam: 'Uruguay', awayTeam: 'Cabo Verde', matchDate: '2026-06-21T22:00:00Z', groupLabel: 'Grup H', stadium: 'Hard Rock Stadium, Miami' },
  // Matchday 3
  { homeTeam: 'Cabo Verde', awayTeam: 'Suudi Arabistan', matchDate: '2026-06-27T00:00:00Z', groupLabel: 'Grup H', stadium: 'NRG Stadium, Houston' },
  { homeTeam: 'Uruguay', awayTeam: 'İspanya', matchDate: '2026-06-27T00:00:00Z', groupLabel: 'Grup H', stadium: 'Estadio Akron, Guadalajara' },

  // === GRUP I: Fransa, Senegal, Irak, Norveç ===
  // Matchday 1
  { homeTeam: 'Fransa', awayTeam: 'Senegal', matchDate: '2026-06-16T17:00:00Z', groupLabel: 'Grup I', stadium: 'Gillette Stadium, Boston' },
  { homeTeam: 'Norveç', awayTeam: 'Irak', matchDate: '2026-06-16T20:00:00Z', groupLabel: 'Grup I', stadium: 'MetLife Stadium, New York' },
  // Matchday 2
  { homeTeam: 'Fransa', awayTeam: 'Irak', matchDate: '2026-06-22T21:00:00Z', groupLabel: 'Grup I', stadium: 'Lincoln Financial Field, Philadelphia' },
  { homeTeam: 'Norveç', awayTeam: 'Senegal', matchDate: '2026-06-23T00:00:00Z', groupLabel: 'Grup I', stadium: 'MetLife Stadium, New York' },
  // Matchday 3
  { homeTeam: 'Norveç', awayTeam: 'Fransa', matchDate: '2026-06-26T19:00:00Z', groupLabel: 'Grup I', stadium: 'Gillette Stadium, Boston' },
  { homeTeam: 'Senegal', awayTeam: 'Irak', matchDate: '2026-06-26T19:00:00Z', groupLabel: 'Grup I', stadium: 'BMO Field, Toronto' },

  // === GRUP J: Arjantin, Cezayir, Avusturya, Ürdün ===
  // Matchday 1
  { homeTeam: 'Arjantin', awayTeam: 'Cezayir', matchDate: '2026-06-17T02:00:00Z', groupLabel: 'Grup J', stadium: 'AT&T Stadium, Dallas' },
  { homeTeam: 'Avusturya', awayTeam: 'Ürdün', matchDate: '2026-06-17T17:00:00Z', groupLabel: 'Grup J', stadium: 'Arrowhead Stadium, Kansas City' },
  // Matchday 2
  { homeTeam: 'Arjantin', awayTeam: 'Avusturya', matchDate: '2026-06-22T17:00:00Z', groupLabel: 'Grup J', stadium: 'AT&T Stadium, Dallas' },
  { homeTeam: 'Ürdün', awayTeam: 'Cezayir', matchDate: '2026-06-23T03:00:00Z', groupLabel: 'Grup J', stadium: 'Arrowhead Stadium, Kansas City' },
  // Matchday 3
  { homeTeam: 'Cezayir', awayTeam: 'Avusturya', matchDate: '2026-06-28T02:00:00Z', groupLabel: 'Grup J', stadium: 'Arrowhead Stadium, Kansas City' },
  { homeTeam: 'Ürdün', awayTeam: 'Arjantin', matchDate: '2026-06-28T02:00:00Z', groupLabel: 'Grup J', stadium: 'AT&T Stadium, Dallas' },

  // === GRUP K: Portekiz, DR Kongo, Özbekistan, Kolombiya ===
  // Matchday 1
  { homeTeam: 'Portekiz', awayTeam: 'DR Kongo', matchDate: '2026-06-17T20:00:00Z', groupLabel: 'Grup K', stadium: 'NRG Stadium, Houston' },
  { homeTeam: 'Kolombiya', awayTeam: 'Özbekistan', matchDate: '2026-06-17T23:00:00Z', groupLabel: 'Grup K', stadium: 'Estadio Akron, Guadalajara' },
  // Matchday 2
  { homeTeam: 'Portekiz', awayTeam: 'Özbekistan', matchDate: '2026-06-23T17:00:00Z', groupLabel: 'Grup K', stadium: 'NRG Stadium, Houston' },
  { homeTeam: 'Kolombiya', awayTeam: 'DR Kongo', matchDate: '2026-06-24T02:00:00Z', groupLabel: 'Grup K', stadium: 'Estadio Akron, Guadalajara' },
  // Matchday 3
  { homeTeam: 'Kolombiya', awayTeam: 'Portekiz', matchDate: '2026-06-27T23:30:00Z', groupLabel: 'Grup K', stadium: 'Hard Rock Stadium, Miami' },
  { homeTeam: 'DR Kongo', awayTeam: 'Özbekistan', matchDate: '2026-06-27T23:30:00Z', groupLabel: 'Grup K', stadium: 'Mercedes-Benz Stadium, Atlanta' },

  // === GRUP L: İngiltere, Hırvatistan, Gana, Panama ===
  // Matchday 1
  { homeTeam: 'İngiltere', awayTeam: 'Hırvatistan', matchDate: '2026-06-18T00:00:00Z', groupLabel: 'Grup L', stadium: 'MetLife Stadium, New York' },
  { homeTeam: 'Gana', awayTeam: 'Panama', matchDate: '2026-06-18T02:00:00Z', groupLabel: 'Grup L', stadium: 'Lincoln Financial Field, Philadelphia' },
  // Matchday 2
  { homeTeam: 'İngiltere', awayTeam: 'Gana', matchDate: '2026-06-23T20:00:00Z', groupLabel: 'Grup L', stadium: 'Gillette Stadium, Boston' },
  { homeTeam: 'Panama', awayTeam: 'Hırvatistan', matchDate: '2026-06-23T23:00:00Z', groupLabel: 'Grup L', stadium: 'BMO Field, Toronto' },
  // Matchday 3
  { homeTeam: 'Panama', awayTeam: 'İngiltere', matchDate: '2026-06-27T21:00:00Z', groupLabel: 'Grup L', stadium: 'MetLife Stadium, New York' },
  { homeTeam: 'Hırvatistan', awayTeam: 'Gana', matchDate: '2026-06-27T21:00:00Z', groupLabel: 'Grup L', stadium: 'Lincoln Financial Field, Philadelphia' },
];

async function createTables() {
  await runCreateSQL(pool);
}

async function runCreateSQL(p: any) {
  await p.query(`
    DO $$ BEGIN
      CREATE TYPE "Role" AS ENUM ('ADMIN', 'PLAYER');
    EXCEPTION WHEN duplicate_object THEN null;
    END $$;
  `);

  await p.query(`
    CREATE TABLE IF NOT EXISTS "User" (
      "id" TEXT NOT NULL DEFAULT gen_random_uuid()::text,
      "email" TEXT NOT NULL,
      "password" TEXT NOT NULL,
      "name" TEXT NOT NULL,
      "role" "Role" NOT NULL DEFAULT 'ADMIN',
      CONSTRAINT "User_pkey" PRIMARY KEY ("id"),
      CONSTRAINT "User_email_key" UNIQUE ("email")
    );
  `);

  await p.query(`
    CREATE TABLE IF NOT EXISTS "WCMatch" (
      "id" TEXT NOT NULL DEFAULT gen_random_uuid()::text,
      "homeTeam" TEXT NOT NULL,
      "awayTeam" TEXT NOT NULL,
      "homeFlag" TEXT NOT NULL DEFAULT '',
      "awayFlag" TEXT NOT NULL DEFAULT '',
      "homeScore" INTEGER,
      "awayScore" INTEGER,
      "matchDate" TIMESTAMP(3) NOT NULL,
      "groupLabel" TEXT NOT NULL DEFAULT '',
      "stadium" TEXT NOT NULL DEFAULT '',
      "isFinished" BOOLEAN NOT NULL DEFAULT false,
      "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT "WCMatch_pkey" PRIMARY KEY ("id")
    );
  `);

  await p.query(`
    CREATE TABLE IF NOT EXISTS "WCPrediction" (
      "id" TEXT NOT NULL DEFAULT gen_random_uuid()::text,
      "matchId" TEXT NOT NULL,
      "participant" TEXT NOT NULL,
      "homeScore" INTEGER NOT NULL,
      "awayScore" INTEGER NOT NULL,
      "points" INTEGER NOT NULL DEFAULT 0,
      "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT "WCPrediction_pkey" PRIMARY KEY ("id"),
      CONSTRAINT "WCPrediction_matchId_participant_key" UNIQUE ("matchId", "participant"),
      CONSTRAINT "WCPrediction_matchId_fkey" FOREIGN KEY ("matchId") REFERENCES "WCMatch"("id") ON DELETE CASCADE ON UPDATE CASCADE
    );
  `);

  await p.query(`
    ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "role" "Role" NOT NULL DEFAULT 'ADMIN';
  `).catch(() => {});
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const reset = url.searchParams.get('reset');

  try {
    await createTables();

    for (const user of USERS) {
      const hashedPassword = await bcrypt.hash(user.password, 10);
      try {
        await prisma.user.upsert({
          where: { email: user.username },
          update: { password: hashedPassword, name: user.name },
          create: { email: user.username, password: hashedPassword, name: user.name, role: 'PLAYER' },
        });
      } catch { /* skip if fails */ }
    }

    const matchCount = await prisma.wCMatch.count();
    if (matchCount === 0 || reset === 'matches') {
      if (reset === 'matches') {
        await prisma.wCPrediction.deleteMany();
        await prisma.wCMatch.deleteMany();
      }
      for (const match of MATCHES) {
        await prisma.wCMatch.create({
          data: {
            homeTeam: match.homeTeam,
            awayTeam: match.awayTeam,
            homeFlag: FLAGS[match.homeTeam] || '',
            awayFlag: FLAGS[match.awayTeam] || '',
            matchDate: new Date(match.matchDate),
            groupLabel: match.groupLabel,
            stadium: match.stadium,
          },
        });
      }
    }

    const users = await prisma.user.count({ where: { role: 'PLAYER' } });
    const matches = await prisma.wCMatch.count();

    return Response.json({
      success: true,
      message: `Setup tamamlandı! ${users} kullanıcı, ${matches} maç.`,
    });
  } catch (error: any) {
    return Response.json({ success: false, error: error.message, stack: error.stack }, { status: 500 });
  }
}
