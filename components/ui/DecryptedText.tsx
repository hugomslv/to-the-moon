"use client";

// Inspiré de ReactBits – DecryptedText : révélation progressive avec caractères aléatoires
// Parfait pour le thème CTF
import React, { useEffect, useRef, useState, useCallback } from 'react';

const CHARS = '!<>-_\\/[]{}—=+*^?#ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

interface DecryptedTextProps {
  text: string;
  speed?: number;
  sequential?: boolean;
  characters?: string;
  animateOn?: 'hover' | 'view' | 'click';
  className?: string;
  revealedClassName?: string;
}

const DecryptedText: React.FC<DecryptedTextProps> = ({
  text,
  speed = 40,
  sequential = true,
  characters = CHARS,
  animateOn = 'view',
  className = '',
  revealedClassName = '',
}) => {
  const [output, setOutput] = useState(text);
  const [isAnimating, setIsAnimating] = useState(false);
  const iterRef = useRef(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const ref = useRef<HTMLSpanElement>(null);
  const hasAnimated = useRef(false);

  const getRandomChar = useCallback(
    () => characters[Math.floor(Math.random() * characters.length)],
    [characters]
  );

  const startAnimation = useCallback(() => {
    if (isAnimating) return;
    setIsAnimating(true);
    iterRef.current = 0;
    clearInterval(intervalRef.current!);

    intervalRef.current = setInterval(() => {
      if (sequential) {
        const revealed = Math.floor(iterRef.current);
        setOutput(
          text.split('').map((char, i) => {
            if (char === ' ') return ' ';
            if (i < revealed) return char;
            return getRandomChar();
          }).join('')
        );
        iterRef.current += 0.5;
        if (iterRef.current >= text.length) {
          clearInterval(intervalRef.current!);
          setOutput(text);
          setIsAnimating(false);
        }
      }
    }, speed);
  }, [text, speed, sequential, isAnimating, getRandomChar]);

  // Déclenche l'animation à l'entrée dans le viewport
  useEffect(() => {
    if (animateOn !== 'view') return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          startAnimation();
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [animateOn, startAnimation]);

  useEffect(() => () => clearInterval(intervalRef.current!), []);

  return (
    <span
      ref={ref}
      className={`${className} ${revealedClassName}`}
      onMouseEnter={animateOn === 'hover' ? startAnimation : undefined}
      onClick={animateOn === 'click' ? startAnimation : undefined}
    >
      {output}
    </span>
  );
};

export default DecryptedText;
