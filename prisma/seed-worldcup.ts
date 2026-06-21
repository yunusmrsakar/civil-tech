import { PrismaClient } from '../src/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';

async function main() {
  const connectionString = process.env.DATABASE_URL?.trim()
    .replace('?sslmode=require', '')
    .replace('?channel_binding=require&sslmode=require', '')
    .replace('&sslmode=require', '')
    .replace('&channel_binding=require', '');
  const pool = new pg.Pool({ connectionString, ssl: true });
  const adapter = new PrismaPg(pool as any);
  const prisma = new PrismaClient({ adapter });

  const matches = [
    // Grup A - 11 Haziran
    { homeTeam: 'ABD', awayTeam: 'Fas', matchDate: '2026-06-11T21:00:00Z', groupLabel: 'Grup A', stadium: 'SoFi Stadium, Los Angeles' },
    { homeTeam: 'Arjantin', awayTeam: 'Kanada', matchDate: '2026-06-12T00:00:00Z', groupLabel: 'Grup A', stadium: 'MetLife Stadium, New York' },
    // Grup B - 12 Haziran
    { homeTeam: 'Brezilya', awayTeam: 'Kolombiya', matchDate: '2026-06-12T18:00:00Z', groupLabel: 'Grup B', stadium: 'AT&T Stadium, Dallas' },
    { homeTeam: 'Japonya', awayTeam: 'Ekvador', matchDate: '2026-06-12T21:00:00Z', groupLabel: 'Grup B', stadium: 'Hard Rock Stadium, Miami' },
    // Grup C - 13 Haziran
    { homeTeam: 'Fransa', awayTeam: 'Avustralya', matchDate: '2026-06-13T18:00:00Z', groupLabel: 'Grup C', stadium: 'Mercedes-Benz Stadium, Atlanta' },
    { homeTeam: 'Meksika', awayTeam: 'Güney Kore', matchDate: '2026-06-13T21:00:00Z', groupLabel: 'Grup C', stadium: 'Estadio Azteca, Mexico City' },
    // Grup D - 14 Haziran
    { homeTeam: 'İspanya', awayTeam: 'Nijerya', matchDate: '2026-06-14T18:00:00Z', groupLabel: 'Grup D', stadium: 'Lumen Field, Seattle' },
    { homeTeam: 'Almanya', awayTeam: 'Uruguay', matchDate: '2026-06-14T21:00:00Z', groupLabel: 'Grup D', stadium: 'Lincoln Financial Field, Philadelphia' },
    // Grup E - 15 Haziran
    { homeTeam: 'İngiltere', awayTeam: 'Senegal', matchDate: '2026-06-15T18:00:00Z', groupLabel: 'Grup E', stadium: 'NRG Stadium, Houston' },
    { homeTeam: 'Portekiz', awayTeam: 'İran', matchDate: '2026-06-15T21:00:00Z', groupLabel: 'Grup E', stadium: 'Levi\'s Stadium, San Francisco' },
    // Grup F - 16 Haziran
    { homeTeam: 'Hollanda', awayTeam: 'Gana', matchDate: '2026-06-16T18:00:00Z', groupLabel: 'Grup F', stadium: 'Gillette Stadium, Boston' },
    { homeTeam: 'Türkiye', awayTeam: 'Belçika', matchDate: '2026-06-16T21:00:00Z', groupLabel: 'Grup F', stadium: 'BC Place, Vancouver' },
    // 2. Hafta - 17-22 Haziran
    { homeTeam: 'Fas', awayTeam: 'Arjantin', matchDate: '2026-06-17T21:00:00Z', groupLabel: 'Grup A', stadium: 'SoFi Stadium, Los Angeles' },
    { homeTeam: 'Kanada', awayTeam: 'ABD', matchDate: '2026-06-18T00:00:00Z', groupLabel: 'Grup A', stadium: 'BMO Field, Toronto' },
    { homeTeam: 'Kolombiya', awayTeam: 'Japonya', matchDate: '2026-06-18T18:00:00Z', groupLabel: 'Grup B', stadium: 'AT&T Stadium, Dallas' },
    { homeTeam: 'Ekvador', awayTeam: 'Brezilya', matchDate: '2026-06-18T21:00:00Z', groupLabel: 'Grup B', stadium: 'Hard Rock Stadium, Miami' },
    { homeTeam: 'Güney Kore', awayTeam: 'Fransa', matchDate: '2026-06-19T18:00:00Z', groupLabel: 'Grup C', stadium: 'Mercedes-Benz Stadium, Atlanta' },
    { homeTeam: 'Avustralya', awayTeam: 'Meksika', matchDate: '2026-06-19T21:00:00Z', groupLabel: 'Grup C', stadium: 'Estadio Azteca, Mexico City' },
    { homeTeam: 'Nijerya', awayTeam: 'Almanya', matchDate: '2026-06-20T18:00:00Z', groupLabel: 'Grup D', stadium: 'Lumen Field, Seattle' },
    { homeTeam: 'Uruguay', awayTeam: 'İspanya', matchDate: '2026-06-20T21:00:00Z', groupLabel: 'Grup D', stadium: 'Lincoln Financial Field, Philadelphia' },
    { homeTeam: 'Senegal', awayTeam: 'Portekiz', matchDate: '2026-06-21T18:00:00Z', groupLabel: 'Grup E', stadium: 'NRG Stadium, Houston' },
    { homeTeam: 'İran', awayTeam: 'İngiltere', matchDate: '2026-06-21T21:00:00Z', groupLabel: 'Grup E', stadium: 'Levi\'s Stadium, San Francisco' },
    { homeTeam: 'Gana', awayTeam: 'Türkiye', matchDate: '2026-06-22T18:00:00Z', groupLabel: 'Grup F', stadium: 'Gillette Stadium, Boston' },
    { homeTeam: 'Belçika', awayTeam: 'Hollanda', matchDate: '2026-06-22T21:00:00Z', groupLabel: 'Grup F', stadium: 'BC Place, Vancouver' },
    // 3. Hafta - 23-28 Haziran
    { homeTeam: 'ABD', awayTeam: 'Arjantin', matchDate: '2026-06-25T21:00:00Z', groupLabel: 'Grup A', stadium: 'MetLife Stadium, New York' },
    { homeTeam: 'Fas', awayTeam: 'Kanada', matchDate: '2026-06-25T21:00:00Z', groupLabel: 'Grup A', stadium: 'SoFi Stadium, Los Angeles' },
    { homeTeam: 'Brezilya', awayTeam: 'Japonya', matchDate: '2026-06-26T18:00:00Z', groupLabel: 'Grup B', stadium: 'AT&T Stadium, Dallas' },
    { homeTeam: 'Kolombiya', awayTeam: 'Ekvador', matchDate: '2026-06-26T18:00:00Z', groupLabel: 'Grup B', stadium: 'Hard Rock Stadium, Miami' },
    { homeTeam: 'Fransa', awayTeam: 'Meksika', matchDate: '2026-06-27T21:00:00Z', groupLabel: 'Grup C', stadium: 'Mercedes-Benz Stadium, Atlanta' },
    { homeTeam: 'Güney Kore', awayTeam: 'Avustralya', matchDate: '2026-06-27T21:00:00Z', groupLabel: 'Grup C', stadium: 'Estadio Azteca, Mexico City' },
    { homeTeam: 'İspanya', awayTeam: 'Almanya', matchDate: '2026-06-28T18:00:00Z', groupLabel: 'Grup D', stadium: 'Lumen Field, Seattle' },
    { homeTeam: 'Nijerya', awayTeam: 'Uruguay', matchDate: '2026-06-28T18:00:00Z', groupLabel: 'Grup D', stadium: 'Lincoln Financial Field, Philadelphia' },
    { homeTeam: 'İngiltere', awayTeam: 'Portekiz', matchDate: '2026-06-29T21:00:00Z', groupLabel: 'Grup E', stadium: 'NRG Stadium, Houston' },
    { homeTeam: 'Senegal', awayTeam: 'İran', matchDate: '2026-06-29T21:00:00Z', groupLabel: 'Grup E', stadium: 'Levi\'s Stadium, San Francisco' },
    { homeTeam: 'Hollanda', awayTeam: 'Türkiye', matchDate: '2026-06-30T18:00:00Z', groupLabel: 'Grup F', stadium: 'Gillette Stadium, Boston' },
    { homeTeam: 'Gana', awayTeam: 'Belçika', matchDate: '2026-06-30T18:00:00Z', groupLabel: 'Grup F', stadium: 'BC Place, Vancouver' },
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

  console.log('Seeding World Cup 2026 matches...');

  for (const match of matches) {
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
    console.log(`  ✓ ${match.homeTeam} vs ${match.awayTeam}`);
  }

  console.log(`\nDone! ${matches.length} matches seeded.`);
  await prisma.$disconnect();
  process.exit(0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
