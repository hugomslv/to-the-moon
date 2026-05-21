"use client";

import { useEffect, useRef } from "react";

const STAR_COUNT = 80;

export default function StarField() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const stars = Array.from({ length: STAR_COUNT }, () => {
      const el = document.createElement("div");
      const size = Math.random() * 2 + 1;
      el.style.cssText = [
        `position:fixed`,
        `width:${size}px`,
        `height:${size}px`,
        `background:white`,
        `border-radius:50%`,
        `top:${Math.random() * 100}vh`,
        `left:${Math.random() * 100}vw`,
        `opacity:${(Math.random() * 0.6 + 0.2).toFixed(2)}`,
        `animation:twinkle ${(Math.random() * 3 + 2).toFixed(1)}s ${(Math.random() * 2).toFixed(1)}s infinite`,
        `pointer-events:none`,
        `z-index:0`,
      ].join(";");
      container.appendChild(el);
      return el;
    });

    return () => {
      stars.forEach((s) => s.remove());
    };
  }, []);

  return <div ref={containerRef} aria-hidden="true" />;
}
