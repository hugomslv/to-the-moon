"use client";

// Section Leaderboard avec effet glassmorphism et animation d'apparition
import React, { useRef, useEffect, useState } from 'react';
import SpotlightCard from '@/components/ui/SpotlightCard';

interface Player {
  rank: number;
  pseudo: string;
  avatar: string;
  time: string;
  score: number;
  trend: 'up' | 'down' | 'stable';
  reward: string;
}

const MOCK_PLAYERS: Player[] = [
  { rank: 1,  pseudo: 'StarHunter42',   avatar: '🚀', time: '08:23', score: 9850, trend: 'up',     reward: '🥇' },
  { rank: 2,  pseudo: 'NebulaCoder',    avatar: '⭐', time: '09:11', score: 9720, trend: 'up',     reward: '🥈' },
  { rank: 3,  pseudo: 'CosmicHacker',   avatar: '🌟', time: '10:45', score: 9500, trend: 'down',   reward: '🥉' },
  { rank: 4,  pseudo: 'VoidWalker',     avatar: '💫', time: '11:02', score: 9250, trend: 'up',     reward: '🎖️' },
  { rank: 5,  pseudo: 'QuantumByte',    avatar: '🛸', time: '11:34', score: 9100, trend: 'stable', reward: '🎖️' },
  { rank: 6,  pseudo: 'GalaxySurfer',   avatar: '🌙', time: '12:08', score: 8900, trend: 'up',     reward: '🎖️' },
  { rank: 7,  pseudo: 'OrbitX',         avatar: '🪐', time: '12:55', score: 8750, trend: 'down',   reward: '🎖️' },
  { rank: 8,  pseudo: 'AstroNaut99',    avatar: '👨‍🚀', time: '13:20', score: 8600, trend: 'stable', reward: '🎖️' },
  { rank: 9,  pseudo: 'DarkMatterDev',  avatar: '🌌', time: '14:01', score: 8400, trend: 'up',     reward: '🎖️' },
  { rank: 10, pseudo: 'SolarFlare',     avatar: '☀️', time: '14:45', score: 8200, trend: 'down',   reward: '🎖️' },
];

const RANK_STYLES: Record<number, { border: string; glow: string; label: string }> = {
  1: { border: '#f8c843', glow: 'rgba(248,200,67,0.25)', label: 'Or' },
  2: { border: '#94a3b8', glow: 'rgba(148,163,184,0.2)', label: 'Argent' },
  3: { border: '#cd7c3b', glow: 'rgba(205,124,59,0.2)', label: 'Bronze' },
};

const TrendIcon: React.FC<{ trend: Player['trend'] }> = ({ trend }) => {
  if (trend === 'up')     return <span style={{ color: 'var(--space-green)' }}>▲</span>;
  if (trend === 'down')   return <span style={{ color: 'var(--space-red)' }}>▼</span>;
  return <span style={{ color: 'var(--space-muted)' }}>—</span>;
};

// Carte pour le podium top 3
const PodiumCard: React.FC<{ player: Player }> = ({ player }) => {
  const style = RANK_STYLES[player.rank];
  const isFirst = player.rank === 1;

  return (
    <SpotlightCard
      className="rounded-2xl flex-1 min-w-[200px]"
      spotlightColor={style.glow}
    >
      <div
        className="rounded-2xl p-6 text-center space-y-3 h-full"
        style={{
          background: 'rgba(13, 27, 42, 0.8)',
          border: `1px solid ${style.border}`,
          boxShadow: `0 0 ${isFirst ? 32 : 20}px ${style.glow}`,
          backdropFilter: 'blur(12px)',
        }}
      >
        {isFirst && (
          <div className="text-2xl animate-bounce">👑</div>
        )}
        <div className="text-4xl">{player.avatar}</div>
        <div>
          <p className="font-bold text-lg" style={{ color: 'var(--space-text)' }}>
            {player.pseudo}
          </p>
          <p className="text-sm font-mono" style={{ color: style.border }}>
            {player.reward} {style.label}
          </p>
        </div>
        <div
          className="px-3 py-1.5 rounded-full text-sm font-mono font-medium inline-block"
          style={{
            background: 'rgba(255,255,255,0.05)',
            border: `1px solid ${style.border}40`,
            color: style.border,
          }}
        >
          ⏱ {player.time}
        </div>
        <p className="text-2xl font-bold" style={{ color: style.border }}>
          {player.score.toLocaleString('fr-CH')}
        </p>
      </div>
    </SpotlightCard>
  );
};

// Ligne du classement (positions 4 à 10) avec animation au scroll
const LeaderboardRow: React.FC<{ player: Player; index: number }> = ({ player, index }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect(); } },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className="flex items-center gap-4 px-5 py-3.5 rounded-xl transition-all duration-500 cursor-default"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateX(0)' : 'translateX(-20px)',
        transitionDelay: `${index * 60}ms`,
        background: 'rgba(13, 27, 42, 0.6)',
        border: '1px solid rgba(30, 58, 95, 0.5)',
        backdropFilter: 'blur(8px)',
      }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLDivElement).style.background = 'rgba(76, 201, 240, 0.06)';
        (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(76, 201, 240, 0.25)';
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLDivElement).style.background = 'rgba(13, 27, 42, 0.6)';
        (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(30, 58, 95, 0.5)';
      }}
    >
      {/* Rang */}
      <span className="w-8 text-center text-sm font-bold font-mono" style={{ color: 'var(--space-muted)' }}>
        #{player.rank}
      </span>
      {/* Avatar */}
      <span className="text-xl">{player.avatar}</span>
      {/* Pseudo */}
      <span className="flex-1 text-sm font-semibold" style={{ color: 'var(--space-text)' }}>
        {player.pseudo}
      </span>
      {/* Score */}
      <span className="text-sm font-mono font-medium" style={{ color: 'var(--space-accent)' }}>
        {player.score.toLocaleString('fr-CH')}
      </span>
      {/* Temps */}
      <span className="text-sm font-mono w-14 text-right" style={{ color: 'var(--space-muted)' }}>
        {player.time}
      </span>
      {/* Tendance */}
      <span className="w-4 text-center text-xs">
        <TrendIcon trend={player.trend} />
      </span>
      {/* Récompense */}
      <span className="text-base">{player.reward}</span>
    </div>
  );
};

const LeaderboardSection: React.FC = () => {
  const top3 = MOCK_PLAYERS.slice(0, 3);
  const rest  = MOCK_PLAYERS.slice(3);

  return (
    <section
      id="leaderboard"
      className="py-24 px-6"
      style={{
        background: 'linear-gradient(180deg, rgba(13,27,42,0.9) 0%, var(--space-bg) 100%)',
      }}
    >
      <div className="max-w-4xl mx-auto space-y-12">
        {/* En-tête */}
        <div className="text-center space-y-3">
          <p className="text-xs font-mono tracking-widest uppercase" style={{ color: 'var(--space-accent)' }}>
            🏆 Classement en direct
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold" style={{ color: 'var(--space-text)' }}>
            Les meilleurs explorateurs
          </h2>
          <p className="text-base max-w-lg mx-auto" style={{ color: 'var(--space-muted)' }}>
            Le classement est trié par temps de complétion. Plus vite tu résous les énigmes, plus tu grimpes haut.
          </p>
        </div>

        {/* Podium Top 3 */}
        <div className="flex flex-col sm:flex-row gap-4 items-stretch">
          {/* 2e place à gauche */}
          <div className="flex-1">
            <PodiumCard player={top3[1]} />
          </div>
          {/* 1re place au centre, légèrement surélevée */}
          <div className="flex-1 sm:-mt-4">
            <PodiumCard player={top3[0]} />
          </div>
          {/* 3e place à droite */}
          <div className="flex-1">
            <PodiumCard player={top3[2]} />
          </div>
        </div>

        {/* En-tête du tableau */}
        <div className="flex items-center gap-4 px-5 pb-2"
          style={{ borderBottom: '1px solid rgba(30, 58, 95, 0.6)' }}>
          <span className="w-8 text-xs uppercase tracking-wider" style={{ color: 'var(--space-muted)' }}>#</span>
          <span className="text-xl invisible">x</span>
          <span className="flex-1 text-xs uppercase tracking-wider" style={{ color: 'var(--space-muted)' }}>Pseudo</span>
          <span className="text-xs uppercase tracking-wider" style={{ color: 'var(--space-muted)' }}>Score</span>
          <span className="w-14 text-right text-xs uppercase tracking-wider" style={{ color: 'var(--space-muted)' }}>Temps</span>
          <span className="w-4 text-xs uppercase tracking-wider" style={{ color: 'var(--space-muted)' }}>±</span>
          <span className="text-xs uppercase tracking-wider" style={{ color: 'var(--space-muted)' }}>Prix</span>
        </div>

        {/* Liste positions 4-10 */}
        <div className="space-y-2">
          {rest.map((player, i) => (
            <LeaderboardRow key={player.rank} player={player} index={i} />
          ))}
        </div>

        {/* Lien vers le vrai classement */}
        <div className="text-center">
          <a
            href="/leaderboard"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold transition-all duration-200"
            style={{
              background: 'rgba(76, 201, 240, 0.1)',
              border: '1px solid rgba(76, 201, 240, 0.3)',
              color: 'var(--space-accent)',
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(76, 201, 240, 0.2)';
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(76, 201, 240, 0.1)';
            }}
          >
            Voir le classement complet →
          </a>
        </div>
      </div>
    </section>
  );
};

export default LeaderboardSection;
