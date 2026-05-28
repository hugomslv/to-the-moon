"use client";

// Section "Comment ça marche" avec SpotlightCard (ReactBits)
import React from 'react';
import SpotlightCard from '@/components/ui/SpotlightCard';

const STEPS = [
  {
    icon: '👤',
    step: '01',
    title: 'Rejoins la mission',
    description:
      'Entre ton pseudo ou ton nom d\'équipe sur la page d\'accueil. Aucun compte requis — le chronomètre démarre immédiatement.',
    accent: '#4cc9f0',
    glow: 'rgba(76, 201, 240, 0.12)',
  },
  {
    icon: '🔐',
    step: '02',
    title: 'Déchiffre les codes',
    description:
      'Résous trois énigmes spatiales : morse, binaire, code César. Des indices sont disponibles si tu bloques — mais ils coûtent du temps !',
    accent: '#7c3aed',
    glow: 'rgba(124, 58, 237, 0.12)',
  },
  {
    icon: '🏆',
    step: '03',
    title: 'Décroche la victoire',
    description:
      'Complète la mission et rejoins le classement. Le meilleur temps gagne. Bats les records et montre que tu es le meilleur explorateur.',
    accent: '#f8c843',
    glow: 'rgba(248, 200, 67, 0.12)',
  },
];

const HowItWorksSection: React.FC = () => {
  return (
    <section
      id="how"
      className="py-24 px-6"
      style={{ background: 'var(--space-bg)' }}
    >
      <div className="max-w-5xl mx-auto space-y-12">
        {/* En-tête */}
        <div className="text-center space-y-3">
          <p className="text-xs font-mono tracking-widest uppercase" style={{ color: 'var(--space-accent)' }}>
            Guide de mission
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold" style={{ color: 'var(--space-text)' }}>
            Comment ça marche ?
          </h2>
          <p className="text-base max-w-lg mx-auto" style={{ color: 'var(--space-muted)' }}>
            Trois étapes simples pour vivre l&apos;expérience spatiale et tenter de battre le record.
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {STEPS.map(step => (
            <SpotlightCard
              key={step.step}
              className="rounded-2xl h-full"
              spotlightColor={step.glow}
            >
              <div
                className="rounded-2xl p-6 h-full space-y-4 flex flex-col transition-all duration-300"
                style={{
                  background: 'var(--space-surface)',
                  border: '1px solid var(--space-border)',
                }}
              >
                {/* Numéro d'étape */}
                <div className="flex items-center justify-between">
                  <span
                    className="text-xs font-mono font-bold tracking-widest px-2.5 py-1 rounded-full"
                    style={{
                      background: `${step.accent}18`,
                      border: `1px solid ${step.accent}40`,
                      color: step.accent,
                    }}
                  >
                    STEP {step.step}
                  </span>
                  <span className="text-3xl">{step.icon}</span>
                </div>

                {/* Contenu */}
                <div className="flex-1 space-y-2">
                  <h3 className="text-lg font-bold" style={{ color: 'var(--space-text)' }}>
                    {step.title}
                  </h3>
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--space-muted)' }}>
                    {step.description}
                  </p>
                </div>

                {/* Barre décorative */}
                <div
                  className="h-0.5 w-12 rounded-full"
                  style={{ background: `linear-gradient(90deg, ${step.accent}, transparent)` }}
                />
              </div>
            </SpotlightCard>
          ))}
        </div>

        {/* Note de bas de section */}
        <div className="text-center">
          <p className="text-sm" style={{ color: 'var(--space-muted)' }}>
            Durée estimée : <strong style={{ color: 'var(--space-text)' }}>moins de 15 minutes</strong>.
            Jouable sur smartphone, sans connexion internet.
          </p>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
