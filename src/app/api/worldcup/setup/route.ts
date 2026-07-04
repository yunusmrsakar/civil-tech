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

interface MatchData {
  homeTeam: string;
  awayTeam: string;
  matchDate: string;
  groupLabel: string;
  stadium: string;
  homeScore?: number;
  awayScore?: number;
  isFinished?: boolean;
}

const MATCHES: MatchData[] = [
  // ===================== MATCHDAY 1 =====================

  // 11 Haziran (Perşembe)
  { homeTeam: 'Meksika', awayTeam: 'Güney Afrika', matchDate: '2026-06-11T19:00:00Z', groupLabel: 'Grup A', stadium: 'Estadio Azteca, Mexico City', homeScore: 2, awayScore: 0, isFinished: true },
  { homeTeam: 'Güney Kore', awayTeam: 'Çekya', matchDate: '2026-06-12T02:00:00Z', groupLabel: 'Grup A', stadium: 'Estadio Akron, Guadalajara', homeScore: 2, awayScore: 1, isFinished: true },

  // 12 Haziran (Cuma)
  { homeTeam: 'Kanada', awayTeam: 'Bosna Hersek', matchDate: '2026-06-12T17:00:00Z', groupLabel: 'Grup B', stadium: 'BMO Field, Toronto', homeScore: 1, awayScore: 1, isFinished: true },
  { homeTeam: 'ABD', awayTeam: 'Paraguay', matchDate: '2026-06-13T01:00:00Z', groupLabel: 'Grup D', stadium: 'SoFi Stadium, Los Angeles', homeScore: 4, awayScore: 1, isFinished: true },

  // 13 Haziran (Cumartesi)
  { homeTeam: 'Brezilya', awayTeam: 'Fas', matchDate: '2026-06-13T17:00:00Z', groupLabel: 'Grup C', stadium: 'Hard Rock Stadium, Miami', homeScore: 1, awayScore: 1, isFinished: true },
  { homeTeam: 'İsviçre', awayTeam: 'Katar', matchDate: '2026-06-13T20:00:00Z', groupLabel: 'Grup B', stadium: 'Lumen Field, Seattle', homeScore: 1, awayScore: 1, isFinished: true },
  { homeTeam: 'İskoçya', awayTeam: 'Haiti', matchDate: '2026-06-13T23:00:00Z', groupLabel: 'Grup C', stadium: 'Mercedes-Benz Stadium, Atlanta', homeScore: 1, awayScore: 0, isFinished: true },

  // 14 Haziran (Pazar)
  { homeTeam: 'Avustralya', awayTeam: 'Türkiye', matchDate: '2026-06-14T04:00:00Z', groupLabel: 'Grup D', stadium: 'BC Place, Vancouver', homeScore: 2, awayScore: 0, isFinished: true },
  { homeTeam: 'Almanya', awayTeam: 'Curaçao', matchDate: '2026-06-14T17:00:00Z', groupLabel: 'Grup E', stadium: 'NRG Stadium, Houston', homeScore: 7, awayScore: 1, isFinished: true },
  { homeTeam: 'Fildişi Sahili', awayTeam: 'Ekvador', matchDate: '2026-06-14T20:00:00Z', groupLabel: 'Grup E', stadium: 'Lincoln Financial Field, Philadelphia', homeScore: 1, awayScore: 0, isFinished: true },
  { homeTeam: 'Hollanda', awayTeam: 'Japonya', matchDate: '2026-06-14T23:00:00Z', groupLabel: 'Grup F', stadium: 'AT&T Stadium, Dallas', homeScore: 2, awayScore: 2, isFinished: true },
  { homeTeam: 'İsveç', awayTeam: 'Tunus', matchDate: '2026-06-15T02:00:00Z', groupLabel: 'Grup F', stadium: 'Estadio BBVA, Monterrey', homeScore: 5, awayScore: 1, isFinished: true },

  // 15 Haziran (Pazartesi)
  { homeTeam: 'Belçika', awayTeam: 'Mısır', matchDate: '2026-06-15T17:00:00Z', groupLabel: 'Grup G', stadium: 'SoFi Stadium, Los Angeles', homeScore: 1, awayScore: 1, isFinished: true },
  { homeTeam: 'İran', awayTeam: 'Yeni Zelanda', matchDate: '2026-06-15T20:00:00Z', groupLabel: 'Grup G', stadium: 'BC Place, Vancouver', homeScore: 2, awayScore: 2, isFinished: true },
  { homeTeam: 'İspanya', awayTeam: 'Cabo Verde', matchDate: '2026-06-15T23:00:00Z', groupLabel: 'Grup H', stadium: 'Mercedes-Benz Stadium, Atlanta', homeScore: 0, awayScore: 0, isFinished: true },
  { homeTeam: 'Suudi Arabistan', awayTeam: 'Uruguay', matchDate: '2026-06-16T02:00:00Z', groupLabel: 'Grup H', stadium: 'Hard Rock Stadium, Miami', homeScore: 1, awayScore: 1, isFinished: true },

  // 16 Haziran (Salı)
  { homeTeam: 'Fransa', awayTeam: 'Senegal', matchDate: '2026-06-16T17:00:00Z', groupLabel: 'Grup I', stadium: 'Gillette Stadium, Boston', homeScore: 3, awayScore: 1, isFinished: true },
  { homeTeam: 'Norveç', awayTeam: 'Irak', matchDate: '2026-06-16T20:00:00Z', groupLabel: 'Grup I', stadium: 'MetLife Stadium, New York', homeScore: 4, awayScore: 1, isFinished: true },
  { homeTeam: 'Arjantin', awayTeam: 'Cezayir', matchDate: '2026-06-17T02:00:00Z', groupLabel: 'Grup J', stadium: 'AT&T Stadium, Dallas', homeScore: 3, awayScore: 0, isFinished: true },

  // 17 Haziran (Çarşamba)
  { homeTeam: 'Avusturya', awayTeam: 'Ürdün', matchDate: '2026-06-17T17:00:00Z', groupLabel: 'Grup J', stadium: 'Arrowhead Stadium, Kansas City', homeScore: 3, awayScore: 1, isFinished: true },
  { homeTeam: 'Portekiz', awayTeam: 'DR Kongo', matchDate: '2026-06-17T20:00:00Z', groupLabel: 'Grup K', stadium: 'NRG Stadium, Houston', homeScore: 1, awayScore: 1, isFinished: true },
  { homeTeam: 'Kolombiya', awayTeam: 'Özbekistan', matchDate: '2026-06-17T23:00:00Z', groupLabel: 'Grup K', stadium: 'Estadio Akron, Guadalajara', homeScore: 3, awayScore: 1, isFinished: true },
  { homeTeam: 'İngiltere', awayTeam: 'Hırvatistan', matchDate: '2026-06-18T00:00:00Z', groupLabel: 'Grup L', stadium: 'MetLife Stadium, New York', homeScore: 4, awayScore: 2, isFinished: true },
  { homeTeam: 'Gana', awayTeam: 'Panama', matchDate: '2026-06-18T02:00:00Z', groupLabel: 'Grup L', stadium: 'Lincoln Financial Field, Philadelphia', homeScore: 1, awayScore: 0, isFinished: true },

  // ===================== MATCHDAY 2 =====================

  // 18 Haziran (Çarşamba)
  { homeTeam: 'Çekya', awayTeam: 'Güney Afrika', matchDate: '2026-06-18T16:00:00Z', groupLabel: 'Grup A', stadium: 'Mercedes-Benz Stadium, Atlanta', homeScore: 1, awayScore: 1, isFinished: true },
  { homeTeam: 'İsviçre', awayTeam: 'Bosna Hersek', matchDate: '2026-06-18T20:00:00Z', groupLabel: 'Grup B', stadium: 'Gillette Stadium, Boston', homeScore: 4, awayScore: 1, isFinished: true },
  { homeTeam: 'Kanada', awayTeam: 'Katar', matchDate: '2026-06-18T23:00:00Z', groupLabel: 'Grup B', stadium: 'BMO Field, Toronto', homeScore: 6, awayScore: 0, isFinished: true },
  { homeTeam: 'Meksika', awayTeam: 'Güney Kore', matchDate: '2026-06-19T01:00:00Z', groupLabel: 'Grup A', stadium: 'Estadio Akron, Guadalajara', homeScore: 1, awayScore: 0, isFinished: true },

  // 19 Haziran (Perşembe)
  { homeTeam: 'ABD', awayTeam: 'Avustralya', matchDate: '2026-06-19T19:00:00Z', groupLabel: 'Grup D', stadium: 'Lumen Field, Seattle', homeScore: 2, awayScore: 0, isFinished: true },
  { homeTeam: 'İskoçya', awayTeam: 'Fas', matchDate: '2026-06-19T20:00:00Z', groupLabel: 'Grup C', stadium: 'MetLife Stadium, New York', homeScore: 0, awayScore: 1, isFinished: true },
  { homeTeam: 'Brezilya', awayTeam: 'Haiti', matchDate: '2026-06-19T23:00:00Z', groupLabel: 'Grup C', stadium: 'Hard Rock Stadium, Miami', homeScore: 3, awayScore: 0, isFinished: true },
  { homeTeam: 'Paraguay', awayTeam: 'Türkiye', matchDate: '2026-06-20T04:00:00Z', groupLabel: 'Grup D', stadium: "Levi's Stadium, Santa Clara", homeScore: 1, awayScore: 0, isFinished: true },

  // 20 Haziran (Cuma)
  { homeTeam: 'Almanya', awayTeam: 'Fildişi Sahili', matchDate: '2026-06-20T17:00:00Z', groupLabel: 'Grup E', stadium: 'BMO Field, Toronto', homeScore: 2, awayScore: 1, isFinished: true },
  { homeTeam: 'Ekvador', awayTeam: 'Curaçao', matchDate: '2026-06-20T20:00:00Z', groupLabel: 'Grup E', stadium: 'Arrowhead Stadium, Kansas City', homeScore: 0, awayScore: 0, isFinished: true },
  { homeTeam: 'Hollanda', awayTeam: 'İsveç', matchDate: '2026-06-20T23:00:00Z', groupLabel: 'Grup F', stadium: 'NRG Stadium, Houston', homeScore: 5, awayScore: 1, isFinished: true },
  { homeTeam: 'Japonya', awayTeam: 'Tunus', matchDate: '2026-06-21T02:00:00Z', groupLabel: 'Grup F', stadium: 'Estadio BBVA, Monterrey', homeScore: 4, awayScore: 0, isFinished: true },

  // 21 Haziran (Cumartesi)
  { homeTeam: 'İspanya', awayTeam: 'Suudi Arabistan', matchDate: '2026-06-21T16:00:00Z', groupLabel: 'Grup H', stadium: 'Mercedes-Benz Stadium, Atlanta', homeScore: 4, awayScore: 0, isFinished: true },
  { homeTeam: 'Belçika', awayTeam: 'İran', matchDate: '2026-06-21T19:00:00Z', groupLabel: 'Grup G', stadium: 'SoFi Stadium, Los Angeles', homeScore: 0, awayScore: 0, isFinished: true },
  { homeTeam: 'Uruguay', awayTeam: 'Cabo Verde', matchDate: '2026-06-21T22:00:00Z', groupLabel: 'Grup H', stadium: 'Hard Rock Stadium, Miami', homeScore: 2, awayScore: 2, isFinished: true },
  { homeTeam: 'Yeni Zelanda', awayTeam: 'Mısır', matchDate: '2026-06-22T01:00:00Z', groupLabel: 'Grup G', stadium: 'BC Place, Vancouver', homeScore: 1, awayScore: 3, isFinished: true },

  // ===================== MATCHDAY 2 (devam) - YAKINLAŞAN =====================

  // 22 Haziran (Pazar) - BUGÜN
  { homeTeam: 'Arjantin', awayTeam: 'Avusturya', matchDate: '2026-06-22T17:00:00Z', groupLabel: 'Grup J', stadium: 'AT&T Stadium, Dallas' },
  { homeTeam: 'Fransa', awayTeam: 'Irak', matchDate: '2026-06-22T21:00:00Z', groupLabel: 'Grup I', stadium: 'Lincoln Financial Field, Philadelphia' },
  { homeTeam: 'Norveç', awayTeam: 'Senegal', matchDate: '2026-06-23T00:00:00Z', groupLabel: 'Grup I', stadium: 'MetLife Stadium, New York' },
  { homeTeam: 'Ürdün', awayTeam: 'Cezayir', matchDate: '2026-06-23T03:00:00Z', groupLabel: 'Grup J', stadium: "Levi's Stadium, Santa Clara" },

  // 23 Haziran (Pazartesi)
  { homeTeam: 'Portekiz', awayTeam: 'Özbekistan', matchDate: '2026-06-23T17:00:00Z', groupLabel: 'Grup K', stadium: 'NRG Stadium, Houston' },
  { homeTeam: 'İngiltere', awayTeam: 'Gana', matchDate: '2026-06-23T20:00:00Z', groupLabel: 'Grup L', stadium: 'Gillette Stadium, Boston' },
  { homeTeam: 'Panama', awayTeam: 'Hırvatistan', matchDate: '2026-06-23T23:00:00Z', groupLabel: 'Grup L', stadium: 'BMO Field, Toronto' },
  { homeTeam: 'Kolombiya', awayTeam: 'DR Kongo', matchDate: '2026-06-24T02:00:00Z', groupLabel: 'Grup K', stadium: 'Estadio Akron, Guadalajara' },

  // ===================== MATCHDAY 3 =====================

  // 24 Haziran (Salı)
  { homeTeam: 'İsviçre', awayTeam: 'Kanada', matchDate: '2026-06-24T19:00:00Z', groupLabel: 'Grup B', stadium: 'BC Place, Vancouver' },
  { homeTeam: 'Bosna Hersek', awayTeam: 'Katar', matchDate: '2026-06-24T19:00:00Z', groupLabel: 'Grup B', stadium: 'Lumen Field, Seattle' },
  { homeTeam: 'İskoçya', awayTeam: 'Brezilya', matchDate: '2026-06-24T22:00:00Z', groupLabel: 'Grup C', stadium: 'Hard Rock Stadium, Miami' },
  { homeTeam: 'Fas', awayTeam: 'Haiti', matchDate: '2026-06-24T22:00:00Z', groupLabel: 'Grup C', stadium: 'Mercedes-Benz Stadium, Atlanta' },
  { homeTeam: 'Çekya', awayTeam: 'Meksika', matchDate: '2026-06-25T01:00:00Z', groupLabel: 'Grup A', stadium: 'Estadio Azteca, Mexico City' },
  { homeTeam: 'Güney Afrika', awayTeam: 'Güney Kore', matchDate: '2026-06-25T01:00:00Z', groupLabel: 'Grup A', stadium: 'Estadio BBVA, Monterrey' },

  // 25 Haziran (Çarşamba)
  { homeTeam: 'Ekvador', awayTeam: 'Almanya', matchDate: '2026-06-25T20:00:00Z', groupLabel: 'Grup E', stadium: 'Lincoln Financial Field, Philadelphia' },
  { homeTeam: 'Curaçao', awayTeam: 'Fildişi Sahili', matchDate: '2026-06-25T20:00:00Z', groupLabel: 'Grup E', stadium: 'NRG Stadium, Houston' },
  { homeTeam: 'Japonya', awayTeam: 'İsveç', matchDate: '2026-06-25T23:00:00Z', groupLabel: 'Grup F', stadium: 'AT&T Stadium, Dallas' },
  { homeTeam: 'Tunus', awayTeam: 'Hollanda', matchDate: '2026-06-25T23:00:00Z', groupLabel: 'Grup F', stadium: 'Estadio BBVA, Monterrey' },
  { homeTeam: 'Türkiye', awayTeam: 'ABD', matchDate: '2026-06-26T02:00:00Z', groupLabel: 'Grup D', stadium: 'SoFi Stadium, Los Angeles' },
  { homeTeam: 'Paraguay', awayTeam: 'Avustralya', matchDate: '2026-06-26T02:00:00Z', groupLabel: 'Grup D', stadium: "Levi's Stadium, Santa Clara" },

  // 26 Haziran (Perşembe)
  { homeTeam: 'Norveç', awayTeam: 'Fransa', matchDate: '2026-06-26T19:00:00Z', groupLabel: 'Grup I', stadium: 'Gillette Stadium, Boston' },
  { homeTeam: 'Senegal', awayTeam: 'Irak', matchDate: '2026-06-26T19:00:00Z', groupLabel: 'Grup I', stadium: 'BMO Field, Toronto' },
  { homeTeam: 'Cabo Verde', awayTeam: 'Suudi Arabistan', matchDate: '2026-06-27T00:00:00Z', groupLabel: 'Grup H', stadium: 'NRG Stadium, Houston' },
  { homeTeam: 'Uruguay', awayTeam: 'İspanya', matchDate: '2026-06-27T00:00:00Z', groupLabel: 'Grup H', stadium: 'Estadio Akron, Guadalajara' },
  { homeTeam: 'Mısır', awayTeam: 'İran', matchDate: '2026-06-27T03:00:00Z', groupLabel: 'Grup G', stadium: 'Lumen Field, Seattle' },
  { homeTeam: 'Yeni Zelanda', awayTeam: 'Belçika', matchDate: '2026-06-27T03:00:00Z', groupLabel: 'Grup G', stadium: 'BC Place, Vancouver' },

  // 27 Haziran (Cuma)
  { homeTeam: 'Panama', awayTeam: 'İngiltere', matchDate: '2026-06-27T21:00:00Z', groupLabel: 'Grup L', stadium: 'MetLife Stadium, New York' },
  { homeTeam: 'Hırvatistan', awayTeam: 'Gana', matchDate: '2026-06-27T21:00:00Z', groupLabel: 'Grup L', stadium: 'Lincoln Financial Field, Philadelphia' },
  { homeTeam: 'Kolombiya', awayTeam: 'Portekiz', matchDate: '2026-06-27T23:30:00Z', groupLabel: 'Grup K', stadium: 'Hard Rock Stadium, Miami' },
  { homeTeam: 'DR Kongo', awayTeam: 'Özbekistan', matchDate: '2026-06-27T23:30:00Z', groupLabel: 'Grup K', stadium: 'Mercedes-Benz Stadium, Atlanta' },
  { homeTeam: 'Cezayir', awayTeam: 'Avusturya', matchDate: '2026-06-28T02:00:00Z', groupLabel: 'Grup J', stadium: 'Arrowhead Stadium, Kansas City' },
  { homeTeam: 'Ürdün', awayTeam: 'Arjantin', matchDate: '2026-06-28T02:00:00Z', groupLabel: 'Grup J', stadium: 'AT&T Stadium, Dallas' },

  // ===================== SON 32 TURU =====================

  // 28 Haziran (Cumartesi)
  { homeTeam: 'Güney Afrika', awayTeam: 'Kanada', matchDate: '2026-06-28T19:00:00Z', groupLabel: 'Son 32', stadium: 'SoFi Stadium, Los Angeles' },

  // 29 Haziran (Pazar)
  { homeTeam: 'Brezilya', awayTeam: 'Japonya', matchDate: '2026-06-29T17:00:00Z', groupLabel: 'Son 32', stadium: 'NRG Stadium, Houston' },
  { homeTeam: 'Almanya', awayTeam: 'Paraguay', matchDate: '2026-06-29T20:30:00Z', groupLabel: 'Son 32', stadium: 'Gillette Stadium, Boston' },
  { homeTeam: 'Hollanda', awayTeam: 'Fas', matchDate: '2026-06-30T01:00:00Z', groupLabel: 'Son 32', stadium: 'Estadio BBVA, Monterrey' },

  // 30 Haziran (Pazartesi)
  { homeTeam: 'Fildişi Sahili', awayTeam: 'Norveç', matchDate: '2026-06-30T17:00:00Z', groupLabel: 'Son 32', stadium: 'AT&T Stadium, Dallas' },
  { homeTeam: 'Fransa', awayTeam: 'İsveç', matchDate: '2026-06-30T21:00:00Z', groupLabel: 'Son 32', stadium: 'MetLife Stadium, New Jersey' },
  { homeTeam: 'Meksika', awayTeam: 'Ekvador', matchDate: '2026-07-01T01:00:00Z', groupLabel: 'Son 32', stadium: 'Estadio Azteca, Mexico City' },

  // 1 Temmuz (Salı)
  { homeTeam: 'İngiltere', awayTeam: 'DR Kongo', matchDate: '2026-07-01T16:00:00Z', groupLabel: 'Son 32', stadium: 'Mercedes-Benz Stadium, Atlanta' },
  { homeTeam: 'Belçika', awayTeam: 'Senegal', matchDate: '2026-07-01T20:00:00Z', groupLabel: 'Son 32', stadium: 'Lumen Field, Seattle' },
  { homeTeam: 'ABD', awayTeam: 'Bosna Hersek', matchDate: '2026-07-02T00:00:00Z', groupLabel: 'Son 32', stadium: "Levi's Stadium, Santa Clara" },

  // 2 Temmuz (Çarşamba)
  { homeTeam: 'İspanya', awayTeam: 'Avusturya', matchDate: '2026-07-02T19:00:00Z', groupLabel: 'Son 32', stadium: 'SoFi Stadium, Los Angeles' },
  { homeTeam: 'Portekiz', awayTeam: 'Hırvatistan', matchDate: '2026-07-02T23:00:00Z', groupLabel: 'Son 32', stadium: 'BMO Field, Toronto' },
  { homeTeam: 'İsviçre', awayTeam: 'Cezayir', matchDate: '2026-07-03T03:00:00Z', groupLabel: 'Son 32', stadium: 'BC Place, Vancouver' },

  // 3 Temmuz (Perşembe)
  { homeTeam: 'Avustralya', awayTeam: 'Mısır', matchDate: '2026-07-03T18:00:00Z', groupLabel: 'Son 32', stadium: 'AT&T Stadium, Dallas' },
  { homeTeam: 'Arjantin', awayTeam: 'Cabo Verde', matchDate: '2026-07-03T22:00:00Z', groupLabel: 'Son 32', stadium: 'Hard Rock Stadium, Miami' },
  { homeTeam: 'Kolombiya', awayTeam: 'Gana', matchDate: '2026-07-04T01:30:00Z', groupLabel: 'Son 32', stadium: 'Arrowhead Stadium, Kansas City' },

  // ===================== SON 16 TURU =====================

  // 4 Temmuz (Cumartesi)
  { homeTeam: 'Kanada', awayTeam: 'Fas', matchDate: '2026-07-04T17:00:00Z', groupLabel: 'Son 16', stadium: 'NRG Stadium, Houston' },
  { homeTeam: 'Paraguay', awayTeam: 'Fransa', matchDate: '2026-07-04T21:00:00Z', groupLabel: 'Son 16', stadium: 'Lincoln Financial Field, Philadelphia' },

  // 5 Temmuz (Pazar)
  { homeTeam: 'Brezilya', awayTeam: 'Norveç', matchDate: '2026-07-05T20:00:00Z', groupLabel: 'Son 16', stadium: 'MetLife Stadium, New Jersey' },
  { homeTeam: 'Meksika', awayTeam: 'İngiltere', matchDate: '2026-07-06T00:00:00Z', groupLabel: 'Son 16', stadium: 'Estadio Azteca, Mexico City' },

  // 6 Temmuz (Pazartesi)
  { homeTeam: 'Portekiz', awayTeam: 'İspanya', matchDate: '2026-07-06T19:00:00Z', groupLabel: 'Son 16', stadium: 'AT&T Stadium, Dallas' },
  { homeTeam: 'ABD', awayTeam: 'Belçika', matchDate: '2026-07-07T00:00:00Z', groupLabel: 'Son 16', stadium: 'Lumen Field, Seattle' },

  // 7 Temmuz (Salı)
  { homeTeam: 'Arjantin', awayTeam: 'Mısır', matchDate: '2026-07-07T16:00:00Z', groupLabel: 'Son 16', stadium: 'Mercedes-Benz Stadium, Atlanta' },
  { homeTeam: 'İsviçre', awayTeam: 'Kolombiya', matchDate: '2026-07-07T20:00:00Z', groupLabel: 'Son 16', stadium: 'BC Place, Vancouver' },
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
      } catch { /* skip */ }
    }

    const sync = url.searchParams.get('sync');
    const matchCount = await prisma.wCMatch.count();
    if (matchCount === 0 || reset === 'matches') {
      if (matchCount > 0) {
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
            homeScore: match.homeScore ?? null,
            awayScore: match.awayScore ?? null,
            isFinished: match.isFinished ?? false,
          },
        });
      }
    } else if (sync === 'true') {
      let added = 0;
      for (const match of MATCHES) {
        const exists = await prisma.wCMatch.findFirst({
          where: {
            homeTeam: match.homeTeam,
            awayTeam: match.awayTeam,
            matchDate: new Date(match.matchDate),
          },
        });
        if (!exists) {
          await prisma.wCMatch.create({
            data: {
              homeTeam: match.homeTeam,
              awayTeam: match.awayTeam,
              homeFlag: FLAGS[match.homeTeam] || '',
              awayFlag: FLAGS[match.awayTeam] || '',
              matchDate: new Date(match.matchDate),
              groupLabel: match.groupLabel,
              stadium: match.stadium,
              homeScore: match.homeScore ?? null,
              awayScore: match.awayScore ?? null,
              isFinished: match.isFinished ?? false,
            },
          });
          added++;
        }
      }
    }

    const users = await prisma.user.count({ where: { role: 'PLAYER' } });
    const totalMatches = await prisma.wCMatch.count();
    const finished = await prisma.wCMatch.count({ where: { isFinished: true } });

    return Response.json({
      success: true,
      message: `Setup tamamlandı! ${users} kullanıcı, ${totalMatches} maç (${finished} oynanmış).`,
    });
  } catch (error: any) {
    return Response.json({ success: false, error: error.message, stack: error.stack }, { status: 500 });
  }
}
