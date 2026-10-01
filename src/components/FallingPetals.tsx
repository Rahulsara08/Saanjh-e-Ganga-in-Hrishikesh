import React, { useEffect, useState, useRef, useCallback } from 'react';

interface PetalItem {
  id: number;
  shape: 0 | 1 | 2; // 0: Rose petal, 1: Tulip petal, 2: Cupped petal
  color: string;
  strokeColor: string;
  size: number;
  leftPercent: number;
  swayDistance: number;
  fallDuration: number;
  swayDuration: number;
  rotateDeg: number;
  opacity: number;
  initialY?: number; // for initial staggered petals on load
}

const PALETTE = [
  { fill: '#FCEAEB', stroke: '#E8B6BA' }, // pale blush pink
  { fill: '#F8D7D9', stroke: '#DB989D' }, // soft blush
  { fill: '#EFB0B4', stroke: '#CE787F' }, // soft rose red
  { fill: '#F5D3D6', stroke: '#DE999E' }, // gentle petal pink
];

let petalCounter = 0;

export const FallingPetals: React.FC = () => {
  const [petals, setPetals] = useState<PetalItem[]>([]);
  const [isReducedMotion, setIsReducedMotion] = useState(false);
  const isVisibleRef = useRef(true);

  // Check prefers-reduced-motion
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setIsReducedMotion(mediaQuery.matches);
    const handler = (e: MediaQueryListEvent) => setIsReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  const createPetal = useCallback((initialProgress = 0): PetalItem => {
    petalCounter += 1;
    const colorTheme = PALETTE[Math.floor(Math.random() * PALETTE.length)];
    const duration = 9 + Math.random() * 5; // 9s to 14s
    return {
      id: petalCounter,
      shape: (Math.floor(Math.random() * 3)) as 0 | 1 | 2,
      color: colorTheme.fill,
      strokeColor: colorTheme.stroke,
      size: 16 + Math.random() * 10, // 16px to 26px
      leftPercent: 3 + Math.random() * 94, // 3% to 97% across screen
      swayDistance: 20 + Math.random() * 30, // 20px to 50px side sway
      fallDuration: duration,
      swayDuration: 3 + Math.random() * 2, // 3s to 5s sway period
      rotateDeg: (Math.random() > 0.5 ? 1 : -1) * (140 + Math.random() * 220),
      opacity: 0.42 + Math.random() * 0.18, // 42% to 60%
      initialY: initialProgress > 0 ? initialProgress * 100 : undefined,
    };
  }, []);

  // Initialize a few staggered petals mid-flight on first mount
  useEffect(() => {
    if (isReducedMotion) return;
    const initial: PetalItem[] = [];
    const count = 5;
    for (let i = 0; i < count; i++) {
      initial.push(createPetal((i + 1) / (count + 1)));
    }
    setPetals(initial);
  }, [isReducedMotion, createPetal]);

  // Handle visibility state (pause spawner when tab hidden)
  useEffect(() => {
    const handleVisibility = () => {
      isVisibleRef.current = !document.hidden;
    };
    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, []);

  // Continuous Spawner loop
  useEffect(() => {
    if (isReducedMotion) return;

    const interval = setInterval(() => {
      if (!isVisibleRef.current) return;

      setPetals((prev) => {
        // Keep density low: handful on screen (max 10)
        if (prev.length >= 10) return prev;
        return [...prev, createPetal()];
      });
    }, 1400);

    return () => clearInterval(interval);
  }, [isReducedMotion, createPetal]);

  // Remove petal on animation completion
  const handleRemove = (id: number) => {
    setPetals((prev) => prev.filter((p) => p.id !== id));
  };

  if (isReducedMotion) {
    return null;
  }

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none z-15 overflow-hidden select-none"
      style={{ perspective: 1000 }}
    >
      <style>{`
        @keyframes petal-fall {
          0% {
            transform: translate3d(0, -50px, 0);
            opacity: 0;
          }
          10% {
            opacity: var(--target-opacity);
          }
          85% {
            opacity: var(--target-opacity);
          }
          100% {
            transform: translate3d(0, 108vh, 0);
            opacity: 0;
          }
        }

        @keyframes petal-sway-and-spin {
          0% {
            transform: translateX(0px) rotate(0deg) rotateY(0deg);
          }
          50% {
            transform: translateX(var(--sway-x)) rotate(calc(var(--target-rot) * 0.5)) rotateY(180deg);
          }
          100% {
            transform: translateX(0px) rotate(var(--target-rot)) rotateY(360deg);
          }
        }
      `}</style>

      {petals.map((petal) => (
        <div
          key={petal.id}
          onAnimationEnd={() => handleRemove(petal.id)}
          className="absolute top-0 will-change-transform"
          style={
            {
              left: `${petal.leftPercent}%`,
              animation: `petal-fall ${petal.fallDuration}s linear forwards`,
              animationDelay: petal.initialY ? `-${(petal.initialY / 100) * petal.fallDuration}s` : '0s',
              '--target-opacity': petal.opacity,
            } as React.CSSProperties
          }
        >
          <div
            style={
              {
                width: `${petal.size}px`,
                height: `${petal.size * 1.3}px`,
                animation: `petal-sway-and-spin ${petal.swayDuration}s ease-in-out infinite alternate`,
                '--sway-x': `${petal.swayDistance}px`,
                '--target-rot': `${petal.rotateDeg}deg`,
              } as React.CSSProperties
            }
          >
            <svg
              viewBox="0 0 24 30"
              className="w-full h-full overflow-visible drop-shadow-[0_1px_2px_rgba(74,64,56,0.08)]"
            >
              {petal.shape === 0 && (
                /* Rose Petal: Rounded, slightly cupped */
                <g>
                  <path
                    d="M 12 2 C 6 2, 2 8, 3 17 C 4 23, 9 27, 12 28 C 15 27, 20 23, 21 17 C 22 8, 18 2, 12 2 Z"
                    fill={petal.color}
                    stroke={petal.strokeColor}
                    strokeWidth="0.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  {/* Subtle inner petal vein */}
                  <path
                    d="M 12 5 C 11.8 12, 12 19, 12 26"
                    fill="none"
                    stroke={petal.strokeColor}
                    strokeWidth="0.5"
                    strokeOpacity="0.45"
                  />
                </g>
              )}

              {petal.shape === 1 && (
                /* Tulip Petal: Pointed oval, graceful curve */
                <g>
                  <path
                    d="M 12 1 C 7 7, 3 15, 5 22 C 7 27, 10 28, 12 28 C 14 28, 17 27, 19 22 C 21 15, 17 7, 12 1 Z"
                    fill={petal.color}
                    stroke={petal.strokeColor}
                    strokeWidth="0.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M 12 4 C 12 11, 12.2 18, 12 26"
                    fill="none"
                    stroke={petal.strokeColor}
                    strokeWidth="0.5"
                    strokeOpacity="0.45"
                  />
                </g>
              )}

              {petal.shape === 2 && (
                /* Curled Organic Petal */
                <g>
                  <path
                    d="M 9 2 C 4 5, 2 14, 5 21 C 8 27, 14 28, 17 24 C 21 19, 21 11, 16 5 C 14 3, 11 1, 9 2 Z"
                    fill={petal.color}
                    stroke={petal.strokeColor}
                    strokeWidth="0.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M 10 4 C 9 12, 11 18, 13 24"
                    fill="none"
                    stroke={petal.strokeColor}
                    strokeWidth="0.5"
                    strokeOpacity="0.45"
                  />
                </g>
              )}
            </svg>
          </div>
        </div>
      ))}
    </div>
  );
};
