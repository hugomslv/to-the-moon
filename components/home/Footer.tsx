"use client";

import React from 'react';
import Link from 'next/link';

const Footer: React.FC = () => {
  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer
      className="py-12 px-6"
      style={{
        background: 'var(--space-bg)',
        borderTop: '1px solid rgba(30, 58, 95, 0.5)',
      }}
    >
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">
          {/* Branding */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-lg font-bold">
              <span>🚀</span>
              <span style={{ color: 'var(--space-gold)' }}>To The Moon</span>
            </div>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--space-muted)' }}>
              Un CTF spatial interactif conçu pour les portes ouvertes de l&apos;école.
              Jouez depuis votre smartphone, sans connexion internet.
            </p>
          </div>

          {/* Navigation */}
          <div className="space-y-3">
            <p className="text-xs font-mono tracking-widest uppercase" style={{ color: 'var(--space-accent)' }}>
              Navigation
            </p>
            <ul className="space-y-2 text-sm" style={{ color: 'var(--space-muted)' }}>
              <li>
                <button onClick={() => scrollTo('start')} className="hover:text-white transition-colors cursor-pointer">
                  Commencer la mission
                </button>
              </li>
              <li>
                <button onClick={() => scrollTo('how')} className="hover:text-white transition-colors cursor-pointer">
                  Comment ça marche
                </button>
              </li>
              <li>
                <button onClick={() => scrollTo('leaderboard')} className="hover:text-white transition-colors cursor-pointer">
                  Classement
                </button>
              </li>
              <li>
                <Link href="/leaderboard" className="hover:text-white transition-colors">
                  Classement live
                </Link>
              </li>
            </ul>
          </div>

          {/* Projet */}
          <div className="space-y-3">
            <p className="text-xs font-mono tracking-widest uppercase" style={{ color: 'var(--space-accent)' }}>
              Projet
            </p>
            <ul className="space-y-2 text-sm" style={{ color: 'var(--space-muted)' }}>
              <li>Module ICT-306</li>
              <li>Raspberry Pi 5 — 100% offline</li>
              <li>Portes ouvertes 2026</li>
              <li>
                <Link href="/admin" className="hover:text-white transition-colors">
                  Admin
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bas de page */}
        <div
          className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs"
          style={{
            borderTop: '1px solid rgba(30, 58, 95, 0.4)',
            color: 'var(--space-muted)',
          }}
        >
          <p>© 2026 To The Moon — Module ICT-306</p>
          <p>
            Fait avec ❤️ par{' '}
            <span style={{ color: 'var(--space-accent)' }}>Hugo, Mathéo, Brayan &amp; Juan David</span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
