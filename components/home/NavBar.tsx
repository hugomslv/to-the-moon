"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';

const NavBar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        background: scrolled
          ? 'rgba(5, 10, 24, 0.85)'
          : 'transparent',
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(30, 58, 95, 0.6)' : 'none',
      }}
    >
      <nav className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="flex items-center gap-2 text-lg font-bold tracking-tight cursor-pointer"
          style={{ color: 'var(--space-text)' }}
        >
          <span className="text-xl">🚀</span>
          <span style={{ color: 'var(--space-gold)' }}>To The Moon</span>
        </button>

        {/* Liens */}
        <div className="hidden md:flex items-center gap-6 text-sm" style={{ color: 'var(--space-muted)' }}>
          <button
            onClick={() => scrollTo('how')}
            className="hover:text-white transition-colors cursor-pointer"
          >
            Comment ça marche
          </button>
          <button
            onClick={() => scrollTo('leaderboard')}
            className="hover:text-white transition-colors cursor-pointer"
          >
            Classement
          </button>
          <Link
            href="/leaderboard"
            className="hover:text-white transition-colors"
          >
            Live
          </Link>
        </div>

        {/* CTA */}
        <button
          onClick={() => scrollTo('start')}
          className="px-5 py-2 rounded-full text-sm font-semibold transition-all duration-200 cursor-pointer"
          style={{
            background: 'linear-gradient(135deg, var(--space-accent), #7c3aed)',
            color: '#fff',
            boxShadow: '0 0 16px rgba(76, 201, 240, 0.25)',
          }}
        >
          Commencer
        </button>
      </nav>
    </header>
  );
};

export default NavBar;
