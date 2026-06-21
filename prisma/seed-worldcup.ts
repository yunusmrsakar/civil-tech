import 'dotenv/config';
import { PrismaClient } from '../src/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';
import bcrypt from 'bcryptjs';

async function main() {
  const connectionString = process.env.DATABASE_URL?.trim()
    .replace('?sslmode=require', '')
    .replace('?channel_binding=require&sslmode=require', '')
    .replace('&sslmode=require', '')
    .replace('&channel_binding=require', '');
  const isLocal = connectionString?.includes('localhost') || connectionString?.includes('127.0.0.1');
  const pool = new pg.Pool({ connectionString, ssl: isLocal ? false : true });
  const adapter = new PrismaPg(pool as any);
  const prisma = new PrismaClient({ adapter });

  // ===== KULLANICILAR =====
  const users = [
    { name: 'Kubi', username: 'kubi', password: 'I0tZAOBGaB' },
    { name: 'Furkan', username: 'furkan', password: 'Yq3bx4j20I' },
    { name: 'Yunus', username: 'yunus', password: 'LMJnaYTT4o' },
    { name: 'Karabudak', username: 'karabudak', password: 'di0g96dEZn' },
    { name: 'Güneş', username: 'gunes', password: 'GmM9gSwklC' },
    { name: 'Atahan', username: 'atahan', password: '0pc1BSWQrB' },
    { name: 'Doğancan', username: 'dogancan', password: '4rxhiX9HZB' },
    { name: 'Serhat', username: 'serhat', password: 'rMeLxkYaCC' },
  ];

  console.log('\n🔐 Kullanıcılar oluşturuluyor...\n');
  for (const user of users) {
    const hashedPassword = await bcrypt.hash(user.password, 10);
    await prisma.user.upsert({
      where: { email: user.username },
      update: { password: hashedPassword, name: user.name },
      create: {
        email: user.username,
        password: hashedPassword,
        name: user.name,
        role: 'PLAYER',
      },
    });
    console.log(`  ✓ ${user.name} → kullanıcı adı: ${user.username} / şifre: ${user.password}`);
  }

  // ===== MAÇLAR =====
  const existingMatches = await prisma.wCMatch.count();
  if (existingMatches > 0) {
    console.log(`\n⚽ Zaten ${existingMatches} maç mevcut, maç ekleme atlanıyor.\n`);
  } else {
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

    const matches = [
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

    console.log('\n⚽ Maçlar ekleniyor...\n');
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
    console.log(`\n  Toplam ${matches.length} maç eklendi.`);
  }

  console.log('\n✅ Seed tamamlandı!\n');
  await prisma.$disconnect();
  process.exit(0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
