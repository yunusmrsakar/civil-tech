'use client';

import { useState, useEffect, useCallback } from 'react';
import { PARTICIPANTS, TEAM_FLAGS } from '@/lib/worldcup';

interface Prediction {
  id: string;
  matchId: string;
  participant: string;
  homeScore: number;
  awayScore: number;
  points: number;
}

interface Match {
  id: string;
  homeTeam: string;
  awayTeam: string;
  homeFlag: string;
  awayFlag: string;
  homeScore: number | null;
  awayScore: number | null;
  matchDate: string;
  groupLabel: string;
  stadium: string;
  isFinished: boolean;
  predictions: Prediction[];
}

interface LeaderboardEntry {
  name: string;
  initial: string;
  color: string;
  points: number;
}

export default function WorldCupClient() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [selectedUser, setSelectedUser] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');
  const [predictions, setPredictions] = useState<Record<string, { home: string; away: string }>>({});
  const [submitting, setSubmitting] = useState<Record<string, boolean>>({});
  const [showUserSelect, setShowUserSelect] = useState(false);
  const [expandedMatch, setExpandedMatch] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      const [matchRes, lbRes] = await Promise.all([
        fetch('/api/worldcup/matches'),
        fetch('/api/worldcup/leaderboard'),
      ]);
      const matchData = await matchRes.json();
      const lbData = await lbRes.json();
      setMatches(matchData);
      setLeaderboard(lbData);
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem('wc2026_user');
    if (saved) setSelectedUser(saved);
    else setShowUserSelect(true);
    fetchData();
  }, [fetchData]);

  const selectUser = (name: string) => {
    setSelectedUser(name);
    localStorage.setItem('wc2026_user', name);
    setShowUserSelect(false);
  };

  const now = new Date();
  const upcomingMatches = matches.filter((m) => !m.isFinished && new Date(m.matchDate) > now);
  const liveMatches = matches.filter((m) => !m.isFinished && new Date(m.matchDate) <= now);
  const pastMatches = matches.filter((m) => m.isFinished);

  upcomingMatches.sort((a, b) => new Date(a.matchDate).getTime() - new Date(b.matchDate).getTime());
  pastMatches.sort((a, b) => new Date(b.matchDate).getTime() - new Date(a.matchDate).getTime());

  const getFlag = (team: string, flagField: string) => {
    return flagField || TEAM_FLAGS[team] || '🏳️';
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const days = ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi'];
    const months = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'];
    return `${date.getDate()} ${months[date.getMonth()]} ${days[date.getDay()]} - ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
  };

  const getMyPrediction = (match: Match) => {
    return match.predictions.find((p) => p.participant === selectedUser);
  };

  const submitPrediction = async (matchId: string) => {
    const pred = predictions[matchId];
    if (!pred || pred.home === '' || pred.away === '') return;

    setSubmitting((s) => ({ ...s, [matchId]: true }));
    try {
      const res = await fetch('/api/worldcup/predictions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          matchId,
          participant: selectedUser,
          homeScore: Number(pred.home),
          awayScore: Number(pred.away),
        }),
      });
      if (res.ok) {
        await fetchData();
        setPredictions((p) => {
          const next = { ...p };
          delete next[matchId];
          return next;
        });
      }
    } finally {
      setSubmitting((s) => ({ ...s, [matchId]: false }));
    }
  };

  const getMedalEmoji = (index: number) => {
    if (index === 0) return '🥇';
    if (index === 1) return '🥈';
    if (index === 2) return '🥉';
    return '';
  };

  const getParticipant = (name: string) => {
    return PARTICIPANTS.find((p) => p.name === name);
  };

  const predictionCount = (match: Match) => {
    return match.predictions.length;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-4xl mb-4">⚽</div>
          <p className="text-gray-600">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto pb-8">
      {/* User Select Modal */}
      {showUserSelect && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm">
            <h2 className="text-xl font-bold text-center mb-1">⚽ Hoş Geldin!</h2>
            <p className="text-gray-500 text-center text-sm mb-4">Kimsin sen?</p>
            <div className="grid grid-cols-2 gap-2">
              {PARTICIPANTS.map((p) => (
                <button
                  key={p.name}
                  onClick={() => selectUser(p.name)}
                  className="flex items-center gap-2 p-3 rounded-xl border-2 border-gray-200 hover:border-green-500 hover:bg-green-50 transition-all"
                >
                  <span
                    className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold"
                    style={{ backgroundColor: p.color }}
                  >
                    {p.initial}
                  </span>
                  <span className="font-medium text-sm">{p.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="bg-gradient-to-r from-green-700 to-green-600 text-white p-4 pb-5 rounded-b-3xl shadow-lg">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🏆</span>
            <h1 className="text-lg font-bold">DÜNYA KUPASI 2026</h1>
          </div>
          <button
            onClick={() => setShowUserSelect(true)}
            className="bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-full text-xs font-medium transition-all"
          >
            {selectedUser || 'Seç'}
          </button>
        </div>
        <div className="flex flex-wrap gap-1.5 text-xs opacity-90">
          {PARTICIPANTS.map((p, i) => (
            <span key={p.name}>
              {p.name}{i < PARTICIPANTS.length - 1 ? ' · ' : ''}
            </span>
          ))}
        </div>
        <p className="text-xs opacity-70 mt-1">— Tahmin Oyunu</p>
      </div>

      {/* Leaderboard */}
      <div className="mx-4 mt-4 bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-100">
          <h2 className="font-bold text-green-800 flex items-center gap-2">
            <span>🏅</span> GENEL SIRALAMA
          </h2>
        </div>
        <div className="divide-y divide-gray-50">
          {leaderboard.map((entry, index) => {
            const medal = getMedalEmoji(index);
            return (
              <div
                key={entry.name}
                className={`flex items-center justify-between px-4 py-3 ${
                  entry.name === selectedUser ? 'bg-green-50' : ''
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg w-6 text-center">
                    {medal || <span className="text-xs text-gray-400">#{index + 1}</span>}
                  </span>
                  <span
                    className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold"
                    style={{ backgroundColor: entry.color }}
                  >
                    {entry.initial}
                  </span>
                  <span className="font-medium text-sm">{entry.name}</span>
                </div>
                <div className="text-right">
                  <span className="font-bold text-lg">{entry.points}</span>
                  <span className="text-xs text-gray-400 ml-1">puan</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Scoring Info */}
      <div className="mx-4 mt-4 bg-white rounded-2xl shadow-sm overflow-hidden">
        <details>
          <summary className="px-4 py-3 cursor-pointer font-bold text-green-800 flex items-center gap-2">
            <span>📋</span> PUAN SİSTEMİ
          </summary>
          <div className="px-4 pb-3 text-sm space-y-1.5 border-t border-gray-100 pt-3">
            <div className="flex justify-between"><span>Tam skor</span><span className="font-semibold">10 puan</span></div>
            <div className="flex justify-between"><span>Kazanan / beraberlik</span><span className="font-semibold">3 puan</span></div>
            <div className="flex justify-between"><span>Gol farkı doğru</span><span className="font-semibold">2 puan</span></div>
            <div className="flex justify-between"><span>Ev sahibi golü</span><span className="font-semibold">1 puan</span></div>
            <div className="flex justify-between"><span>Deplasman golü</span><span className="font-semibold">1 puan</span></div>
          </div>
        </details>
      </div>

      {/* Tabs */}
      <div className="mx-4 mt-4 flex rounded-xl bg-white shadow-sm overflow-hidden">
        <button
          onClick={() => setActiveTab('upcoming')}
          className={`flex-1 py-3 text-sm font-semibold transition-all ${
            activeTab === 'upcoming'
              ? 'bg-green-700 text-white'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          ⚽ Yaklaşan Maçlar ({upcomingMatches.length + liveMatches.length})
        </button>
        <button
          onClick={() => setActiveTab('past')}
          className={`flex-1 py-3 text-sm font-semibold transition-all ${
            activeTab === 'past'
              ? 'bg-green-700 text-white'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          📊 Geçmiş Maçlar ({pastMatches.length})
        </button>
      </div>

      {/* Match List */}
      <div className="mx-4 mt-3 space-y-3">
        {activeTab === 'upcoming' && (
          <>
            {liveMatches.length > 0 && (
              <>
                <div className="text-xs font-semibold text-red-600 uppercase tracking-wide px-1">
                  🔴 Devam Eden Maçlar
                </div>
                {liveMatches.map((match) => (
                  <MatchCard
                    key={match.id}
                    match={match}
                    selectedUser={selectedUser}
                    predictions={predictions}
                    setPredictions={setPredictions}
                    submitting={submitting}
                    submitPrediction={submitPrediction}
                    getFlag={getFlag}
                    formatDate={formatDate}
                    getMyPrediction={getMyPrediction}
                    getParticipant={getParticipant}
                    predictionCount={predictionCount}
                    expandedMatch={expandedMatch}
                    setExpandedMatch={setExpandedMatch}
                    isLive
                  />
                ))}
              </>
            )}
            {upcomingMatches.length === 0 && liveMatches.length === 0 ? (
              <div className="text-center py-12 text-gray-400">
                <div className="text-4xl mb-2">📅</div>
                <p>Yaklaşan maç yok</p>
              </div>
            ) : (
              upcomingMatches.map((match) => (
                <MatchCard
                  key={match.id}
                  match={match}
                  selectedUser={selectedUser}
                  predictions={predictions}
                  setPredictions={setPredictions}
                  submitting={submitting}
                  submitPrediction={submitPrediction}
                  getFlag={getFlag}
                  formatDate={formatDate}
                  getMyPrediction={getMyPrediction}
                  getParticipant={getParticipant}
                  predictionCount={predictionCount}
                  expandedMatch={expandedMatch}
                  setExpandedMatch={setExpandedMatch}
                />
              ))
            )}
          </>
        )}

        {activeTab === 'past' && (
          <>
            {pastMatches.length === 0 ? (
              <div className="text-center py-12 text-gray-400">
                <div className="text-4xl mb-2">⏳</div>
                <p>Henüz tamamlanmış maç yok</p>
              </div>
            ) : (
              pastMatches.map((match) => (
                <MatchCard
                  key={match.id}
                  match={match}
                  selectedUser={selectedUser}
                  predictions={predictions}
                  setPredictions={setPredictions}
                  submitting={submitting}
                  submitPrediction={submitPrediction}
                  getFlag={getFlag}
                  formatDate={formatDate}
                  getMyPrediction={getMyPrediction}
                  getParticipant={getParticipant}
                  predictionCount={predictionCount}
                  expandedMatch={expandedMatch}
                  setExpandedMatch={setExpandedMatch}
                  showAllPredictions
                />
              ))
            )}
          </>
        )}
      </div>
    </div>
  );
}

function MatchCard({
  match,
  selectedUser,
  predictions,
  setPredictions,
  submitting,
  submitPrediction,
  getFlag,
  formatDate,
  getMyPrediction,
  getParticipant,
  predictionCount,
  expandedMatch,
  setExpandedMatch,
  isLive,
  showAllPredictions,
}: {
  match: Match;
  selectedUser: string;
  predictions: Record<string, { home: string; away: string }>;
  setPredictions: React.Dispatch<React.SetStateAction<Record<string, { home: string; away: string }>>>;
  submitting: Record<string, boolean>;
  submitPrediction: (matchId: string) => Promise<void>;
  getFlag: (team: string, flagField: string) => string;
  formatDate: (dateStr: string) => string;
  getMyPrediction: (match: Match) => Prediction | undefined;
  getParticipant: (name: string) => { name: string; initial: string; color: string } | undefined;
  predictionCount: (match: Match) => number;
  expandedMatch: string | null;
  setExpandedMatch: (id: string | null) => void;
  isLive?: boolean;
  showAllPredictions?: boolean;
}) {
  const myPred = getMyPrediction(match);
  const isExpanded = expandedMatch === match.id;
  const matchStarted = new Date() >= new Date(match.matchDate);

  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
      {/* Match Header */}
      <div className="px-4 pt-3 pb-1 flex items-center justify-between">
        <span className="text-xs text-gray-400 font-medium">{match.groupLabel}</span>
        <div className="flex items-center gap-2">
          {isLive && (
            <span className="bg-red-100 text-red-600 text-xs px-2 py-0.5 rounded-full font-semibold animate-pulse">
              CANLI
            </span>
          )}
          <span className="text-xs text-gray-400">{formatDate(match.matchDate)}</span>
        </div>
      </div>

      {/* Teams and Score */}
      <div className="px-4 py-3 flex items-center justify-between">
        <div className="flex-1 text-center">
          <div className="text-2xl mb-1">{getFlag(match.homeTeam, match.homeFlag)}</div>
          <div className="text-sm font-semibold">{match.homeTeam}</div>
        </div>

        <div className="px-4 text-center min-w-[80px]">
          {match.isFinished ? (
            <div className="text-2xl font-bold">
              {match.homeScore} - {match.awayScore}
            </div>
          ) : matchStarted ? (
            <div className="text-lg font-semibold text-gray-400">vs</div>
          ) : (
            <div className="text-lg font-semibold text-gray-300">vs</div>
          )}
        </div>

        <div className="flex-1 text-center">
          <div className="text-2xl mb-1">{getFlag(match.awayTeam, match.awayFlag)}</div>
          <div className="text-sm font-semibold">{match.awayTeam}</div>
        </div>
      </div>

      {match.stadium && (
        <div className="text-center text-xs text-gray-400 pb-2">📍 {match.stadium}</div>
      )}

      {/* Prediction Input (upcoming matches only) */}
      {!match.isFinished && !matchStarted && selectedUser && (
        <div className="px-4 pb-3 border-t border-gray-100 pt-3">
          {myPred ? (
            <div className="flex items-center justify-center gap-3 text-sm">
              <span className="text-gray-500">Tahminin:</span>
              <span className="bg-green-100 text-green-800 font-bold px-3 py-1 rounded-lg">
                {myPred.homeScore} - {myPred.awayScore}
              </span>
              <button
                onClick={() => {
                  setPredictions((p) => ({
                    ...p,
                    [match.id]: { home: String(myPred.homeScore), away: String(myPred.awayScore) },
                  }));
                }}
                className="text-xs text-gray-400 hover:text-green-600 underline"
              >
                Değiştir
              </button>
            </div>
          ) : (
            <></>
          )}

          {(predictions[match.id] || !myPred) && (
            <div className="flex items-center justify-center gap-2 mt-2">
              <input
                type="number"
                min="0"
                max="20"
                placeholder="0"
                value={predictions[match.id]?.home ?? ''}
                onChange={(e) =>
                  setPredictions((p) => ({
                    ...p,
                    [match.id]: { ...p[match.id], home: e.target.value, away: p[match.id]?.away ?? '' },
                  }))
                }
                className="w-14 h-10 text-center text-lg font-bold border-2 border-gray-200 rounded-lg focus:border-green-500 focus:outline-none"
              />
              <span className="text-gray-400 font-bold">-</span>
              <input
                type="number"
                min="0"
                max="20"
                placeholder="0"
                value={predictions[match.id]?.away ?? ''}
                onChange={(e) =>
                  setPredictions((p) => ({
                    ...p,
                    [match.id]: { home: p[match.id]?.home ?? '', away: e.target.value },
                  }))
                }
                className="w-14 h-10 text-center text-lg font-bold border-2 border-gray-200 rounded-lg focus:border-green-500 focus:outline-none"
              />
              <button
                onClick={() => submitPrediction(match.id)}
                disabled={
                  submitting[match.id] ||
                  !predictions[match.id]?.home ||
                  !predictions[match.id]?.away
                }
                className="ml-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-300 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all"
              >
                {submitting[match.id] ? '...' : myPred ? 'Güncelle' : 'Gönder'}
              </button>
            </div>
          )}

          <div className="text-center mt-2 text-xs text-gray-400">
            {predictionCount(match)}/8 kişi tahmin yaptı
          </div>
        </div>
      )}

      {/* All Predictions (past matches) */}
      {showAllPredictions && match.isFinished && (
        <div className="border-t border-gray-100">
          <button
            onClick={() => setExpandedMatch(isExpanded ? null : match.id)}
            className="w-full px-4 py-2 text-xs font-semibold text-green-700 hover:bg-green-50 transition-all flex items-center justify-center gap-1"
          >
            {isExpanded ? '▲ Tahminleri Gizle' : '▼ Tahminleri Göster'} ({predictionCount(match)}/8)
          </button>

          {isExpanded && (
            <div className="px-4 pb-3 space-y-1.5">
              {PARTICIPANTS.map((p) => {
                const pred = match.predictions.find((pr) => pr.participant === p.name);
                const participant = getParticipant(p.name);
                return (
                  <div
                    key={p.name}
                    className={`flex items-center justify-between py-1.5 px-2 rounded-lg text-sm ${
                      p.name === selectedUser ? 'bg-green-50' : ''
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold"
                        style={{ backgroundColor: participant?.color }}
                      >
                        {participant?.initial}
                      </span>
                      <span className="font-medium">{p.name}</span>
                    </div>
                    {pred ? (
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">
                          {pred.homeScore} - {pred.awayScore}
                        </span>
                        <span
                          className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                            pred.points >= 10
                              ? 'bg-yellow-100 text-yellow-700'
                              : pred.points > 0
                              ? 'bg-green-100 text-green-700'
                              : 'bg-gray-100 text-gray-500'
                          }`}
                        >
                          +{pred.points}
                        </span>
                      </div>
                    ) : (
                      <span className="text-xs text-gray-400">Tahmin yok</span>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Show own prediction for live/started matches */}
      {!match.isFinished && matchStarted && myPred && (
        <div className="px-4 pb-3 border-t border-gray-100 pt-2">
          <div className="flex items-center justify-center gap-3 text-sm">
            <span className="text-gray-500">Tahminin:</span>
            <span className="bg-green-100 text-green-800 font-bold px-3 py-1 rounded-lg">
              {myPred.homeScore} - {myPred.awayScore}
            </span>
          </div>
          <div className="text-center mt-1 text-xs text-gray-400">
            {predictionCount(match)}/8 kişi tahmin yaptı
          </div>
        </div>
      )}
    </div>
  );
}
