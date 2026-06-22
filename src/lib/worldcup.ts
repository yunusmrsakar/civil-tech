export const PARTICIPANTS = [
  { name: 'Kubi', initial: 'K', color: '#4CAF50', basePoints: 103 },
  { name: 'Furkan', initial: 'F', color: '#2196F3', basePoints: 108 },
  { name: 'Yunus', initial: 'Y', color: '#FF9800', basePoints: 72 },
  { name: 'Karabudak', initial: 'K', color: '#9C27B0', basePoints: 62 },
  { name: 'Güneş', initial: 'G', color: '#E91E63', basePoints: 127 },
  { name: 'Atahan', initial: 'A', color: '#00BCD4', basePoints: 117 },
  { name: 'Doğancan', initial: 'D', color: '#FF5722', basePoints: 111 },
  { name: 'Serhat', initial: 'S', color: '#607D8B', basePoints: 138 },
] as const;

export type ParticipantName = (typeof PARTICIPANTS)[number]['name'];

export function calculatePoints(
  predictedHome: number,
  predictedAway: number,
  actualHome: number,
  actualAway: number
): { total: number; breakdown: string[] } {
  const breakdown: string[] = [];

  const exactScore = predictedHome === actualHome && predictedAway === actualAway;
  if (exactScore) {
    breakdown.push('Tam skor: +10');
    return { total: 10, breakdown };
  }

  let total = 0;

  const predictedOutcome = Math.sign(predictedHome - predictedAway);
  const actualOutcome = Math.sign(actualHome - actualAway);
  if (predictedOutcome === actualOutcome) {
    total += 3;
    breakdown.push('Kazanan/Beraberlik: +3');
  }

  if (predictedHome - predictedAway === actualHome - actualAway) {
    total += 2;
    breakdown.push('Gol farkı: +2');
  }

  if (predictedHome === actualHome) {
    total += 1;
    breakdown.push('Ev sahibi golü: +1');
  }

  if (predictedAway === actualAway) {
    total += 1;
    breakdown.push('Deplasman golü: +1');
  }

  return { total, breakdown };
}

export const TEAM_FLAGS: Record<string, string> = {
  'ABD': '🇺🇸', 'Meksika': '🇲🇽', 'Kanada': '🇨🇦',
  'Brezilya': '🇧🇷', 'Arjantin': '🇦🇷', 'Almanya': '🇩🇪',
  'Fransa': '🇫🇷', 'İspanya': '🇪🇸', 'İngiltere': '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
  'Portekiz': '🇵🇹', 'Hollanda': '🇳🇱', 'İtalya': '🇮🇹',
  'Belçika': '🇧🇪', 'Hırvatistan': '🇭🇷', 'Uruguay': '🇺🇾',
  'Kolombiya': '🇨🇴', 'Japonya': '🇯🇵', 'Güney Kore': '🇰🇷',
  'Avustralya': '🇦🇺', 'Fas': '🇲🇦', 'Senegal': '🇸🇳',
  'Gana': '🇬🇭', 'Kamerun': '🇨🇲', 'Nijerya': '🇳🇬',
  'Türkiye': '🇹🇷', 'İsviçre': '🇨🇭', 'Danimarka': '🇩🇰',
  'Polonya': '🇵🇱', 'Sırbistan': '🇷🇸', 'İran': '🇮🇷',
  'Suudi Arabistan': '🇸🇦', 'Katar': '🇶🇦', 'Ekvador': '🇪🇨',
  'Paraguay': '🇵🇾', 'Şili': '🇨🇱', 'Peru': '🇵🇪',
  'Avusturya': '🇦🇹', 'Çekya': '🇨🇿', 'Ukrayna': '🇺🇦',
  'Galler': '🏴󠁧󠁢󠁷󠁬󠁳󠁿', 'İskoçya': '🏴󠁧󠁢󠁳󠁣󠁴󠁿', 'Norveç': '🇳🇴',
  'İsveç': '🇸🇪', 'Mısır': '🇪🇬', 'Tunus': '🇹🇳',
  'Cezayir': '🇩🇿', 'Kosta Rika': '🇨🇷', 'Jamaika': '🇯🇲',
  'Honduras': '🇭🇳', 'Panama': '🇵🇦', 'Bolivya': '🇧🇴',
  'Venezuela': '🇻🇪',
};
