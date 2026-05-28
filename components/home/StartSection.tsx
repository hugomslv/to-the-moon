"use client";

// Section de démarrage de la mission avec le formulaire de saisie
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { saveGameState } from '@/lib/storage';
import { PUZZLES } from '@/lib/puzzles';
import SpotlightCard from '@/components/ui/SpotlightCard';

const StartSection: React.FC = () => {
  const [teamName, setTeamName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [missionId, setMissionId] = useState('');
  const router = useRouter();

  // Génération côté client uniquement pour éviter la hydration mismatch
  useEffect(() => {
    setMissionId(String(Math.floor(Math.random() * 9000) + 1000));
  }, []);

  async function handleStart(e: React.FormEvent) {
    e.preventDefault();
    const name = teamName.trim();
    if (!name) {
      setError("Entre un pseudo ou un nom d'équipe pour décoller !");
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ teamName: name }),
      });
      if (!res.ok) throw new Error('Erreur serveur');
      const { sessionId } = (await res.json()) as { sessionId: string };

      saveGameState({
        sessionId,
        teamName: name,
        startedAt: Date.now(),
        currentPuzzleIndex: 0,
        completedPuzzles: [],
        hintsUsed: {},
        penaltyMs: 0,
      });

      router.push(`/game/${PUZZLES[0].id}`);
    } catch {
      setError('Impossible de démarrer la mission. Réessaie.');
      setLoading(false);
    }
  }

  return (
    <section
      id="start"
      className="py-24 px-6 flex flex-col items-center justify-center"
      style={{ background: 'linear-gradient(180deg, var(--space-bg) 0%, rgba(13,27,42,0.9) 100%)' }}
    >
      <div className="max-w-lg w-full">
        {/* Titre de section */}
        <div className="text-center mb-10 space-y-3">
          <p
            className="text-xs font-mono tracking-widest uppercase"
            style={{ color: 'var(--space-accent)' }}
          >
            Briefing de mission
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold" style={{ color: 'var(--space-text)' }}>
            Prêt pour le décollage ?
          </h2>
          <p className="text-base" style={{ color: 'var(--space-muted)' }}>
            Saisis ton pseudo ou ton nom d&apos;équipe pour initialiser la mission.
            Trois énigmes t&apos;attendent dans le cosmos.
          </p>
        </div>

        {/* Carte formulaire avec SpotlightCard */}
        <SpotlightCard
          className="rounded-2xl p-8"
          spotlightColor="rgba(76, 201, 240, 0.12)"
        >
          <div
            style={{
              background: 'var(--space-surface)',
              border: '1px solid var(--space-border)',
              borderRadius: '1rem',
              padding: '2rem',
            }}
          >
            {/* Icône mission */}
            <div className="text-center mb-6">
              <div
                className="inline-flex items-center justify-center w-16 h-16 rounded-full text-3xl mb-3"
                style={{
                  background: 'rgba(76, 201, 240, 0.1)',
                  border: '1px solid rgba(76, 201, 240, 0.3)',
                }}
              >
                🛸
              </div>
              <p className="text-sm font-mono" style={{ color: 'var(--space-accent)' }}>
                {missionId ? `MISSION-${missionId}` : 'MISSION-????'}
              </p>
            </div>

            <form onSubmit={handleStart} className="space-y-4">
              <div>
                <label
                  htmlFor="teamName"
                  className="block text-sm font-medium mb-2"
                  style={{ color: 'var(--space-muted)' }}
                >
                  Identifiant d&apos;équipe
                </label>
                <input
                  id="teamName"
                  type="text"
                  value={teamName}
                  onChange={e => setTeamName(e.target.value)}
                  placeholder="Ex: Stargazers, Team42…"
                  maxLength={32}
                  autoComplete="off"
                  className="w-full px-4 py-3 rounded-xl text-base outline-none transition-all duration-200"
                  style={{
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid var(--space-border)',
                    color: 'var(--space-text)',
                  }}
                  onFocus={e => (e.target.style.borderColor = 'var(--space-accent)')}
                  onBlur={e => (e.target.style.borderColor = 'var(--space-border)')}
                />
              </div>

              {error && (
                <p className="text-sm px-3 py-2 rounded-lg"
                  style={{ color: 'var(--space-red)', background: 'rgba(239,35,60,0.1)' }}>
                  ⚠ {error}
                </p>
              )}

              <button
                type="submit"
                disabled={loading || !teamName.trim()}
                className="w-full py-4 rounded-xl text-base font-bold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  background: loading
                    ? 'rgba(76, 201, 240, 0.4)'
                    : 'linear-gradient(135deg, var(--space-accent), #7c3aed)',
                  color: '#fff',
                  boxShadow: loading ? 'none' : '0 0 24px rgba(76, 201, 240, 0.3)',
                }}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Initialisation…
                  </span>
                ) : (
                  'Décoller 🚀'
                )}
              </button>
            </form>

            {/* Info timer */}
            <p className="text-center text-xs mt-4" style={{ color: 'var(--space-muted)' }}>
              ⏱ Le chronomètre démarre dès le décollage
            </p>
          </div>
        </SpotlightCard>
      </div>
    </section>
  );
};

export default StartSection;
