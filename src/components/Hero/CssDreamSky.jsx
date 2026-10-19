import { useMemo } from 'react';
import './CssDreamSky.css';

/**
 * Deterministic pseudo-random number generator for pure rendering.
 */
function pseudoRandom(seed) {
  const x = Math.sin(seed * 9999) * 10000;
  return x - Math.floor(x);
}

/**
 * High-performance, lightweight pure CSS dream sky fallback.
 * Renders glowing crescent moon, layered floating clouds, and twinkling stars.
 * Designed for ultra-smooth 60fps performance on integrated graphics.
 */
export default function CssDreamSky() {
  // Generate deterministic stars
  const stars = useMemo(() => {
    return Array.from({ length: 48 }, (_, i) => {
      const r1 = pseudoRandom(i + 1);
      const r2 = pseudoRandom(i + 50);
      const r3 = pseudoRandom(i + 100);
      return {
        id: i,
        x: Math.round(r1 * 960) / 10 + 2,
        y: Math.round(r2 * 920) / 10 + 2,
        size: (i % 3 === 0 ? 3.5 : i % 2 === 0 ? 2.5 : 1.5),
        delay: (r3 * 3).toFixed(2),
        duration: (2.5 + (i % 4) * 0.8).toFixed(2),
        color: i % 5 === 0 ? '#fbcfe8' : i % 4 === 0 ? '#fef08a' : i % 3 === 0 ? '#e9d5ff' : '#ffffff',
      };
    });
  }, []);

  return (
    <div className="css-dream-sky" aria-hidden="true">
      {/* Deep atmospheric gradients */}
      <div className="sky-nebula sky-nebula-top" />
      <div className="sky-nebula sky-nebula-right" />
      <div className="sky-nebula sky-nebula-bottom" />

      {/* Large Glowing Crescent Moon */}
      <div className="dream-moon-container">
        <div className="moon-glow-aura" />
        <svg
          className="dream-crescent-moon"
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="moonGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fffbeb" />
              <stop offset="50%" stopColor="#fef08a" />
              <stop offset="100%" stopColor="#fde047" />
            </linearGradient>
            <filter id="moonSoftGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="glow" />
              <feComposite in="SourceGraphic" in2="glow" operator="over" />
            </filter>
          </defs>
          {/* Stylized peaceful crescent moon */}
          <path
            d="M 68,14 C 42,20 28,44 32,70 C 35,84 45,94 56,98 C 30,95 10,72 12,46 C 14,24 28,8 48,2 C 55,0 62,4 68,14 Z"
            fill="url(#moonGrad)"
            filter="url(#moonSoftGlow)"
          />
          {/* Soft eye sleeping arc */}
          <path
            d="M 33 50 Q 37 54 41 50"
            stroke="#b45309"
            strokeWidth="1.6"
            strokeLinecap="round"
            fill="none"
            opacity="0.6"
          />
          {/* Subtle blush */}
          <circle cx="39" cy="56" r="3.5" fill="#f472b6" opacity="0.4" />
        </svg>
      </div>

      {/* Twinkling Dream Stars */}
      <div className="star-layer">
        {stars.map((s) => (
          <span
            key={s.id}
            className="twinkle-star"
            style={{
              left: `${s.x}%`,
              top: `${s.y}%`,
              width: `${s.size}px`,
              height: `${s.size}px`,
              backgroundColor: s.color,
              boxShadow: `0 0 ${s.size * 2}px ${s.color}`,
              animationDelay: `${s.delay}s`,
              animationDuration: `${s.duration}s`,
            }}
          />
        ))}
      </div>

      {/* Floating Fluffy Clouds at Different Depths */}
      <div className="cloud-layer cloud-layer-back">
        <div className="cloud cloud-1" />
        <div className="cloud cloud-2" />
      </div>

      <div className="cloud-layer cloud-layer-mid">
        <div className="cloud cloud-3" />
        <div className="cloud cloud-4" />
      </div>

      <div className="cloud-layer cloud-layer-front">
        <div className="cloud cloud-5" />
      </div>

      {/* Soft Vignette / Horizon Mist */}
      <div className="sky-mist" />
    </div>
  );
}
