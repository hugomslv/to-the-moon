"use client";

import React from 'react';
import dynamic from 'next/dynamic';
import BlurText from '@/components/ui/BlurText';
import ShinyText from '@/components/ui/ShinyText';
import DecryptedText from '@/components/ui/DecryptedText';

// Chargement côté client uniquement : WebGL ne tourne pas sur le serveur
const Particles = dynamic(() => import('@/components/ui/Particles'), {
  ssr: false,
  loading: () => <div className="w-full h-full" style={{ background: 'var(--space-bg)' }} />,
});

const HeroSection: React.FC = () => {
  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative min-h-svh flex flex-col items-center justify-center overflow-hidden">
      {/* Background Particles (WebGL, client only) */}
      <div className="absolute inset-0 z-0">
        <Particles
          particleCount={180}
          particleSpread={14}
          speed={0.04}
          particleColors={['#ffffff', '#4cc9f0', '#7c3aed', '#f8c843', '#06d6a0']}
          alphaParticles
          particleBaseSize={90}
          sizeRandomness={1.5}
          moveParticlesOnHover
          particleHoverFactor={0.25}
        />
      </div>

      {/* Dégradé d'assombrissement sur les bords */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          zIndex: 1,
          background: 'radial-gradient(ellipse 80% 60% at 50% 50%, transparent 30%, rgba(5,10,24,0.7) 100%)',
        }}
      />

      {/* Contenu centré */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center space-y-8">
        {/* Badge CTF avec effet DecryptedText */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-mono font-medium uppercase tracking-widest"
          style={{
            background: 'rgba(76, 201, 240, 0.1)',
            border: '1px solid rgba(76, 201, 240, 0.3)',
            color: 'var(--space-accent)',
          }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
          <DecryptedText
            text="Mission CTF – ICT-306"
            animateOn="view"
            speed={35}
          />
        </div>

        {/* Titre principal avec BlurText */}
        <div className="space-y-2">
          <BlurText
            text="To The Moon"
            animateBy="words"
            direction="bottom"
            delay={120}
            stepDuration={0.5}
            className="!flex-wrap justify-center text-6xl sm:text-7xl md:text-8xl font-extrabold tracking-tight leading-none"
            animationFrom={{ filter: 'blur(12px)', opacity: 0, y: 60 }}
            animationTo={[
              { filter: 'blur(6px)', opacity: 0.5, y: 15 },
              { filter: 'blur(0px)', opacity: 1, y: 0 },
            ]}
          />
          {/* Sous-titre gradient doré */}
          <div
            className="text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tight leading-none"
            style={{
              background: 'linear-gradient(135deg, #f8c843, #ffd700, #f8c843)',
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            🚀
          </div>
        </div>

        {/* Sous-titre ShinyText */}
        <div className="text-xl sm:text-2xl font-light">
          <ShinyText
            text="Trois énigmes spatiales t'attendent. Peux-tu les résoudre toutes ?"
            speed={3.5}
            color="rgba(226, 232, 240, 0.7)"
            shineColor="#e2e8f0"
            spread={90}
          />
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          {/* CTA principal */}
          <button
            onClick={() => scrollTo('start')}
            className="group px-8 py-4 rounded-2xl text-base font-bold transition-all duration-300 cursor-pointer"
            style={{
              background: 'linear-gradient(135deg, #4cc9f0, #7c3aed)',
              color: '#fff',
              boxShadow: '0 0 32px rgba(76, 201, 240, 0.35)',
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 0 48px rgba(76, 201, 240, 0.55)';
              (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 0 32px rgba(76, 201, 240, 0.35)';
              (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(0)';
            }}
          >
            Commencer la mission &nbsp;🚀
          </button>

          {/* CTA secondaire */}
          <button
            onClick={() => scrollTo('how')}
            className="px-8 py-4 rounded-2xl text-base font-semibold transition-all duration-300 cursor-pointer"
            style={{
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.15)',
              color: 'var(--space-text)',
              backdropFilter: 'blur(8px)',
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.1)';
              (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255,255,255,0.3)';
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.05)';
              (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255,255,255,0.15)';
            }}
          >
            En savoir plus
          </button>
        </div>
      </div>

      {/* Indicateur de scroll */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 opacity-50">
        <span className="text-xs tracking-widest uppercase" style={{ color: 'var(--space-muted)' }}>
          Scroll
        </span>
        <div className="w-px h-8 bg-gradient-to-b from-current to-transparent animate-bounce"
          style={{ color: 'var(--space-muted)' }} />
      </div>
    </section>
  );
};

export default HeroSection;
