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
  'Senegal': '🇸🇳', 'Gana': '🇬🇭', 'Nijerya': '🇳🇬',
  'Türkiye': '🇹🇷', 'İran': '🇮🇷', 'Ekvador': '🇪🇨',
};

const MATCHES = [
  { homeTeam: 'ABD', awayTeam: 'Fas', matchDate: '2026-06-11T21:00:00Z', groupLabel: 'Grup A', stadium: 'SoFi Stadium, Los Angeles' },
  { homeTeam: 'Arjantin', awayTeam: 'Kanada', matchDate: '2026-06-12T00:00:00Z', groupLabel: 'Grup A', stadium: 'MetLife Stadium, New York' },
  { homeTeam: 'Brezilya', awayTeam: 'Kolombiya', matchDate: '2026-06-12T18:00:00Z', groupLabel: 'Grup B', stadium: 'AT&T Stadium, Dallas' },
  { homeTeam: 'Japonya', awayTeam: 'Ekvador', matchDate: '2026-06-12T21:00:00Z', groupLabel: 'Grup B', stadium: 'Hard Rock Stadium, Miami' },
  { homeTeam: 'Fransa', awayTeam: 'Avustralya', matchDate: '2026-06-13T18:00:00Z', groupLabel: 'Grup C', stadium: 'Mercedes-Benz Stadium, Atlanta' },
  { homeTeam: 'Meksika', awayTeam: 'Güney Kore', matchDate: '2026-06-13T21:00:00Z', groupLabel: 'Grup C', stadium: 'Estadio Azteca, Mexico City' },
  { homeTeam: 'İspanya', awayTeam: 'Nijerya', matchDate: '2026-06-14T18:00:00Z', groupLabel: 'Grup D', stadium: 'Lumen Field, Seattle' },
  { homeTeam: 'Almanya', awayTeam: 'Uruguay', matchDate: '2026-06-14T21:00:00Z', groupLabel: 'Grup D', stadium: 'Lincoln Financial Field, Philadelphia' },
  { homeTeam: 'İngiltere', awayTeam: 'Senegal', matchDate: '2026-06-15T18:00:00Z', groupLabel: 'Grup E', stadium: 'NRG Stadium, Houston' },
  { homeTeam: 'Portekiz', awayTeam: 'İran', matchDate: '2026-06-15T21:00:00Z', groupLabel: 'Grup E', stadium: "Levi's Stadium, San Francisco" },
  { homeTeam: 'Hollanda', awayTeam: 'Gana', matchDate: '2026-06-16T18:00:00Z', groupLabel: 'Grup F', stadium: 'Gillette Stadium, Boston' },
  { homeTeam: 'Türkiye', awayTeam: 'Belçika', matchDate: '2026-06-16T21:00:00Z', groupLabel: 'Grup F', stadium: 'BC Place, Vancouver' },
  { homeTeam: 'Fas', awayTeam: 'Arjantin', matchDate: '2026-06-17T21:00:00Z', groupLabel: 'Grup A', stadium: 'SoFi Stadium, Los Angeles' },
  { homeTeam: 'Kanada', awayTeam: 'ABD', matchDate: '2026-06-18T00:00:00Z', groupLabel: 'Grup A', stadium: 'BMO Field, Toronto' },
  { homeTeam: 'Kolombiya', awayTeam: 'Japonya', matchDate: '2026-06-18T18:00:00Z', groupLabel: 'Grup B', stadium: 'AT&T Stadium, Dallas' },
  { homeTeam: 'Ekvador', awayTeam: 'Brezilya', matchDate: '2026-06-18T21:00:00Z', groupLabel: 'Grup B', stadium: 'Hard Rock Stadium, Miami' },
  { homeTeam: 'Güney Kore', awayTeam: 'Fransa', matchDate: '2026-06-19T18:00:00Z', groupLabel: 'Grup C', stadium: 'Mercedes-Benz Stadium, Atlanta' },
  { homeTeam: 'Avustralya', awayTeam: 'Meksika', matchDate: '2026-06-19T21:00:00Z', groupLabel: 'Grup C', stadium: 'Estadio Azteca, Mexico City' },
  { homeTeam: 'Nijerya', awayTeam: 'Almanya', matchDate: '2026-06-20T18:00:00Z', groupLabel: 'Grup D', stadium: 'Lumen Field, Seattle' },
  { homeTeam: 'Uruguay', awayTeam: 'İspanya', matchDate: '2026-06-20T21:00:00Z', groupLabel: 'Grup D', stadium: 'Lincoln Financial Field, Philadelphia' },
  { homeTeam: 'Senegal', awayTeam: 'Portekiz', matchDate: '2026-06-21T18:00:00Z', groupLabel: 'Grup E', stadium: 'NRG Stadium, Houston' },
  { homeTeam: 'İran', awayTeam: 'İngiltere', matchDate: '2026-06-21T21:00:00Z', groupLabel: 'Grup E', stadium: "Levi's Stadium, San Francisco" },
  { homeTeam: 'Gana', awayTeam: 'Türkiye', matchDate: '2026-06-22T18:00:00Z', groupLabel: 'Grup F', stadium: 'Gillette Stadium, Boston' },
  { homeTeam: 'Belçika', awayTeam: 'Hollanda', matchDate: '2026-06-22T21:00:00Z', groupLabel: 'Grup F', stadium: 'BC Place, Vancouver' },
  { homeTeam: 'ABD', awayTeam: 'Arjantin', matchDate: '2026-06-25T21:00:00Z', groupLabel: 'Grup A', stadium: 'MetLife Stadium, New York' },
  { homeTeam: 'Fas', awayTeam: 'Kanada', matchDate: '2026-06-25T21:00:00Z', groupLabel: 'Grup A', stadium: 'SoFi Stadium, Los Angeles' },
  { homeTeam: 'Brezilya', awayTeam: 'Japonya', matchDate: '2026-06-26T18:00:00Z', groupLabel: 'Grup B', stadium: 'AT&T Stadium, Dallas' },
  { homeTeam: 'Kolombiya', awayTeam: 'Ekvador', matchDate: '2026-06-26T18:00:00Z', groupLabel: 'Grup B', stadium: 'Hard Rock Stadium, Miami' },
  { homeTeam: 'Fransa', awayTeam: 'Meksika', matchDate: '2026-06-27T21:00:00Z', groupLabel: 'Grup C', stadium: 'Mercedes-Benz Stadium, Atlanta' },
  { homeTeam: 'Güney Kore', awayTeam: 'Avustralya', matchDate: '2026-06-27T21:00:00Z', groupLabel: 'Grup C', stadium: 'Estadio Azteca, Mexico City' },
  { homeTeam: 'İspanya', awayTeam: 'Almanya', matchDate: '2026-06-28T18:00:00Z', groupLabel: 'Grup D', stadium: 'Lumen Field, Seattle' },
  { homeTeam: 'Nijerya', awayTeam: 'Uruguay', matchDate: '2026-06-28T18:00:00Z', groupLabel: 'Grup D', stadium: 'Lincoln Financial Field, Philadelphia' },
  { homeTeam: 'İngiltere', awayTeam: 'Portekiz', matchDate: '2026-06-29T21:00:00Z', groupLabel: 'Grup E', stadium: 'NRG Stadium, Houston' },
  { homeTeam: 'Senegal', awayTeam: 'İran', matchDate: '2026-06-29T21:00:00Z', groupLabel: 'Grup E', stadium: "Levi's Stadium, San Francisco" },
  { homeTeam: 'Hollanda', awayTeam: 'Türkiye', matchDate: '2026-06-30T18:00:00Z', groupLabel: 'Grup F', stadium: 'Gillette Stadium, Boston' },
  { homeTeam: 'Gana', awayTeam: 'Belçika', matchDate: '2026-06-30T18:00:00Z', groupLabel: 'Grup F', stadium: 'BC Place, Vancouver' },
];

async function createTables() {
  await runCreateSQL(pool);
}

async function runCreateSQL(pool: any) {
  await pool.query(`
    DO $$ BEGIN
      CREATE TYPE "Role" AS ENUM ('ADMIN', 'PLAYER');
    EXCEPTION WHEN duplicate_object THEN null;
    END $$;
  `);

  await pool.query(`
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

  await pool.query(`
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

  await pool.query(`
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

  await pool.query(`
    ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "role" "Role" NOT NULL DEFAULT 'ADMIN';
  `).catch(() => {});
}

export async function GET() {
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
    if (matchCount === 0) {
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
