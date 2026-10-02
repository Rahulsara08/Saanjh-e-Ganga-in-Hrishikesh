import React, { useEffect, useState, useRef, useCallback } from 'react';

interface PetalItem {
  id: number;
  shape: 0 | 1 | 2 | 3; // 0: Rose petal, 1: Tulip petal, 2: Cupped petal, 3: Watercolor leaf
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

const PETAL_PALETTE = [
  { fill: '#FCEAEB', stroke: '#E8B6BA' }, // pale blush pink
  { fill: '#F8D7D9', stroke: '#DB989D' }, // soft blush
  { fill: '#EFB0B4', stroke: '#CE787F' }, // soft rose red
  { fill: '#F5D3D6', stroke: '#DE999E' }, // gentle petal pink
  { fill: '#F9E8DF', stroke: '#DCBCA0' }, // peach rose
];

const LEAF_PALETTE = [
  { fill: '#DEE8D6', stroke: '#9EB892' }, // sage leaf
  { fill: '#E4ECD9', stroke: '#AEC09E' }, // soft botanical leaf
  { fill: '#D3E2CB', stroke: '#8DAE80' }, // olive green leaf
];

let petalCounter = 0;

interface FallingPetalsProps {
  className?: string;
  isAbsolute?: boolean;
}

export const FallingPetals: React.FC<FallingPetalsProps> = ({
  className = '',
  isAbsolute = false,
}) => {
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
    // 70% petals, 30% botanical leaves
    const isLeaf = Math.random() < 0.32;
    const shape = (isLeaf ? 3 : Math.floor(Math.random() * 3)) as 0 | 1 | 2 | 3;
    const palette = isLeaf ? LEAF_PALETTE : PETAL_PALETTE;
    const colorTheme = palette[Math.floor(Math.random() * palette.length)];
    const duration = 8.5 + Math.random() * 5.5; // 8.5s to 14s

    return {
      id: petalCounter,
      shape,
      color: colorTheme.fill,
      strokeColor: colorTheme.stroke,
      size: isLeaf ? 15 + Math.random() * 8 : 16 + Math.random() * 10,
      leftPercent: 3 + Math.random() * 94, // 3% to 97% across screen
      swayDistance: 18 + Math.random() * 28, // 18px to 46px side sway
      fallDuration: duration,
      swayDuration: 2.8 + Math.random() * 2.2, // 2.8s to 5s sway period
      rotateDeg: (Math.random() > 0.5 ? 1 : -1) * (140 + Math.random() * 220),
      opacity: isLeaf ? 0.48 + Math.random() * 0.2 : 0.45 + Math.random() * 0.22,
      initialY: initialProgress > 0 ? initialProgress * 100 : undefined,
    };
  }, []);

  // Initialize a few staggered petals mid-flight on first mount
  useEffect(() => {
    if (isReducedMotion) return;
    const initial: PetalItem[] = [];
    const count = 6;
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
        // Keep density balanced: max 12 petals/leaves on screen
        if (prev.length >= 12) return prev;
        return [...prev, createPetal()];
      });
    }, 1200);

    return () => clearInterval(interval);
  }, [isReducedMotion, createPetal]);

  // Remove petal on animation completion
  const handleRemove = (id: number) => {
    setPetals((prev) => prev.filter((p) => p.id !== id));
  };

  if (isReducedMotion) {
    return null;
  }

  const containerClass = isAbsolute
    ? `absolute inset-0 pointer-events-none z-20 overflow-hidden select-none ${className}`
    : `fixed inset-0 pointer-events-none z-20 overflow-hidden select-none ${className}`;

  return (
    <div
      aria-hidden="true"
      className={containerClass}
      style={{ perspective: 1000 }}
    >
      <style>{`
        @keyframes petal-fall {
          0% {
            transform: translate3d(0, -40px, 0);
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

              {petal.shape === 3 && (
                /* Delicate Botanical Watercolor Leaf with spine & side veins */
                <g>
                  <path
                    d="M 12 1 C 6 6, 4 16, 7 23 C 9 26, 12 28, 12 28 C 12 28, 15 26, 17 23 C 20 16, 18 6, 12 1 Z"
                    fill={petal.color}
                    stroke={petal.strokeColor}
                    strokeWidth="0.85"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  {/* Central leaf spine / stem */}
                  <path
                    d="M 12 2 C 12 10, 12 19, 12 28"
                    fill="none"
                    stroke={petal.strokeColor}
                    strokeWidth="0.6"
                    strokeOpacity="0.65"
                  />
                  {/* Delicate lateral branch veins */}
                  <path
                    d="M 12 9 L 8.5 7.5 M 12 14 L 15.5 12.5 M 12 19 L 9 18"
                    fill="none"
                    stroke={petal.strokeColor}
                    strokeWidth="0.45"
                    strokeOpacity="0.5"
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
