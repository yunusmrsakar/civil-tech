'use client';

import { useState, useEffect, useCallback } from 'react';
import { TEAM_FLAGS } from '@/lib/worldcup';

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
  predictions: { id: string; participant: string; homeScore: number; awayScore: number; points: number }[];
}

export default function AdminClient() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    homeTeam: '',
    awayTeam: '',
    matchDate: '',
    groupLabel: '',
    stadium: '',
  });
  const [results, setResults] = useState<Record<string, { home: string; away: string }>>({});
  const [saving, setSaving] = useState<Record<string, boolean>>({});

  const fetchMatches = useCallback(async () => {
    const res = await fetch('/api/worldcup/matches');
    const data = await res.json();
    setMatches(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchMatches();
  }, [fetchMatches]);

  const addMatch = async () => {
    if (!form.homeTeam || !form.awayTeam || !form.matchDate) return;
    await fetch('/api/worldcup/matches', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...form,
        homeFlag: TEAM_FLAGS[form.homeTeam] || '',
        awayFlag: TEAM_FLAGS[form.awayTeam] || '',
      }),
    });
    setForm({ homeTeam: '', awayTeam: '', matchDate: '', groupLabel: '', stadium: '' });
    setShowForm(false);
    fetchMatches();
  };

  const setResult = async (matchId: string) => {
    const r = results[matchId];
    if (!r || r.home === '' || r.away === '') return;
    setSaving((s) => ({ ...s, [matchId]: true }));
    await fetch(`/api/worldcup/matches/${matchId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ homeScore: Number(r.home), awayScore: Number(r.away) }),
    });
    setSaving((s) => ({ ...s, [matchId]: false }));
    setResults((prev) => {
      const next = { ...prev };
      delete next[matchId];
      return next;
    });
    fetchMatches();
  };

  const deleteMatch = async (matchId: string) => {
    if (!confirm('Bu maçı silmek istediğinize emin misiniz?')) return;
    await fetch(`/api/worldcup/matches/${matchId}`, { method: 'DELETE' });
    fetchMatches();
  };

  const teamNames = Object.keys(TEAM_FLAGS);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500">Yükleniyor...</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-green-800">🏆 Maç Yönetimi</h1>
        <a href="/worldcup" className="text-sm text-green-600 hover:underline">
          ← Ana Sayfa
        </a>
      </div>

      {/* Add Match */}
      <div className="bg-white rounded-2xl shadow-sm mb-6 overflow-hidden">
        <button
          onClick={() => setShowForm(!showForm)}
          className="w-full px-4 py-3 text-left font-semibold text-green-700 hover:bg-green-50 flex items-center justify-between"
        >
          <span>➕ Yeni Maç Ekle</span>
          <span>{showForm ? '▲' : '▼'}</span>
        </button>

        {showForm && (
          <div className="px-4 pb-4 space-y-3 border-t border-gray-100 pt-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Ev Sahibi</label>
                <input
                  list="teams"
                  value={form.homeTeam}
                  onChange={(e) => setForm((f) => ({ ...f, homeTeam: e.target.value }))}
                  className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-green-500"
                  placeholder="Takım adı"
                />
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Deplasman</label>
                <input
                  list="teams"
                  value={form.awayTeam}
                  onChange={(e) => setForm((f) => ({ ...f, awayTeam: e.target.value }))}
                  className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-green-500"
                  placeholder="Takım adı"
                />
              </div>
            </div>
            <datalist id="teams">
              {teamNames.map((t) => (
                <option key={t} value={t} />
              ))}
            </datalist>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Tarih ve Saat</label>
              <input
                type="datetime-local"
                value={form.matchDate}
                onChange={(e) => setForm((f) => ({ ...f, matchDate: e.target.value }))}
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-green-500"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Grup / Aşama</label>
                <input
                  value={form.groupLabel}
                  onChange={(e) => setForm((f) => ({ ...f, groupLabel: e.target.value }))}
                  className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-green-500"
                  placeholder="Grup A"
                />
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Stadyum</label>
                <input
                  value={form.stadium}
                  onChange={(e) => setForm((f) => ({ ...f, stadium: e.target.value }))}
                  className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-green-500"
                  placeholder="MetLife Stadium"
                />
              </div>
            </div>
            <button
              onClick={addMatch}
              className="w-full bg-green-600 hover:bg-green-700 text-white py-2.5 rounded-lg font-semibold transition-all"
            >
              Maç Ekle
            </button>
          </div>
        )}
      </div>

      {/* Match List */}
      <div className="space-y-3">
        {matches.map((match) => (
          <div key={match.id} className="bg-white rounded-2xl shadow-sm p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-gray-400">{match.groupLabel}</span>
              <div className="flex items-center gap-2">
                {match.isFinished && (
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                    Bitti
                  </span>
                )}
                <span className="text-xs text-gray-400">
                  {new Date(match.matchDate).toLocaleString('tr-TR')}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span>{TEAM_FLAGS[match.homeTeam] || '🏳️'}</span>
                <span className="font-semibold text-sm">{match.homeTeam}</span>
              </div>
              <div className="text-center font-bold">
                {match.isFinished
                  ? `${match.homeScore} - ${match.awayScore}`
                  : 'vs'}
              </div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-sm">{match.awayTeam}</span>
                <span>{TEAM_FLAGS[match.awayTeam] || '🏳️'}</span>
              </div>
            </div>

            {/* Set Result */}
            {!match.isFinished && (
              <div className="flex items-center gap-2 border-t border-gray-100 pt-3">
                <span className="text-xs text-gray-500">Sonuç:</span>
                <input
                  type="number"
                  min="0"
                  placeholder="0"
                  value={results[match.id]?.home ?? ''}
                  onChange={(e) =>
                    setResults((r) => ({
                      ...r,
                      [match.id]: { ...r[match.id], home: e.target.value, away: r[match.id]?.away ?? '' },
                    }))
                  }
                  className="w-12 h-8 text-center border rounded text-sm focus:outline-none focus:border-green-500"
                />
                <span className="text-gray-400">-</span>
                <input
                  type="number"
                  min="0"
                  placeholder="0"
                  value={results[match.id]?.away ?? ''}
                  onChange={(e) =>
                    setResults((r) => ({
                      ...r,
                      [match.id]: { home: r[match.id]?.home ?? '', away: e.target.value },
                    }))
                  }
                  className="w-12 h-8 text-center border rounded text-sm focus:outline-none focus:border-green-500"
                />
                <button
                  onClick={() => setResult(match.id)}
                  disabled={saving[match.id]}
                  className="ml-auto bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded-lg text-xs font-semibold disabled:bg-gray-300"
                >
                  {saving[match.id] ? '...' : 'Sonuç Gir'}
                </button>
              </div>
            )}

            {/* Predictions summary */}
            <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-100">
              <span className="text-xs text-gray-400">
                {match.predictions.length}/8 tahmin
              </span>
              <button
                onClick={() => deleteMatch(match.id)}
                className="text-xs text-red-400 hover:text-red-600"
              >
                Sil
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
