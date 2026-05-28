"use client";

// Section statistiques avec CountUp animé (ReactBits)
import React from 'react';
import CountUp from '@/components/ui/CountUp';

const STATS = [
  {
    value: 150,
    label: 'Parties jouées',
    suffix: '+',
    icon: '🎮',
    color: 'var(--space-accent)',
    description: 'depuis le lancement',
  },
  {
    value: 50,
    label: 'Équipes',
    suffix: '+',
    icon: '👥',
    color: '#7c3aed',
    description: 'participantes',
  },
  {
    value: 78,
    label: 'Taux de complétion',
    suffix: '%',
    icon: '✅',
    color: 'var(--space-green)',
    description: 'des joueurs terminent',
  },
  {
    value: 4.5,
    label: 'Satisfaction',
    suffix: '/5',
    icon: '⭐',
    color: 'var(--space-gold)',
    description: 'note moyenne',
  },
];

const StatsSection: React.FC = () => {
  return (
    <section
      className="py-20 px-6"
      style={{
        background: 'linear-gradient(180deg, var(--space-bg) 0%, rgba(13,27,42,0.8) 100%)',
        borderTop: '1px solid rgba(30, 58, 95, 0.4)',
        borderBottom: '1px solid rgba(30, 58, 95, 0.4)',
      }}
    >
      <div className="max-w-5xl mx-auto">
        {/* En-tête */}
        <div className="text-center mb-14 space-y-2">
          <p className="text-xs font-mono tracking-widest uppercase" style={{ color: 'var(--space-accent)' }}>
            Métriques de mission
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold" style={{ color: 'var(--space-text)' }}>
            Le projet en chiffres
          </h2>
        </div>

        {/* Grille de stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {STATS.map(stat => (
            <div
              key={stat.label}
              className="text-center space-y-2 p-6 rounded-2xl transition-all duration-300"
              style={{
                background: 'rgba(13, 27, 42, 0.6)',
                border: '1px solid rgba(30, 58, 95, 0.5)',
                backdropFilter: 'blur(8px)',
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLDivElement).style.borderColor = `${stat.color}50`;
                (e.currentTarget as HTMLDivElement).style.boxShadow = `0 0 20px ${stat.color}15`;
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(30, 58, 95, 0.5)';
                (e.currentTarget as HTMLDivElement).style.boxShadow = 'none';
              }}
            >
              <div className="text-3xl">{stat.icon}</div>

              {/* Compteur animé */}
              <div className="text-4xl font-extrabold font-mono tracking-tight" style={{ color: stat.color }}>
                <CountUp
                  to={stat.value}
                  duration={2.5}
                  delay={0.2}
                />
                <span>{stat.suffix}</span>
              </div>

              <div>
                <p className="font-semibold text-sm" style={{ color: 'var(--space-text)' }}>
                  {stat.label}
                </p>
                <p className="text-xs" style={{ color: 'var(--space-muted)' }}>
                  {stat.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
