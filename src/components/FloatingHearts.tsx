import React, { useState, useEffect, useCallback, useImperativeHandle, forwardRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export interface FloatingHeartsRef {
  trigger: () => void;
}

interface FloatingHeartItem {
  id: string;
  startX: number; // 0 to 100 (vw)
  swayX: number; // offset sway px (-40 to 40)
  size: number; // 16 to 38 px
  color: string; // warm theme colors
  duration: number; // 3.5 to 5.5 s
  delay: number; // 0 to 1 s
  rotation: number; // -35 to 35 deg
}

const HEART_COLORS = [
  '#E85D75', // Soft Crimson
  '#F1D9D6', // Blush Pink
  '#E3B9B4', // Deep Blush
  '#C6A15B', // Royal Gold
  '#DFC48F', // Soft Gold
  '#FFF4F2', // Ivory Pink
  '#D4A373', // Warm Amber
];

interface FloatingHeartsProps {
  onComplete?: () => void;
}

export const FloatingHearts = forwardRef<FloatingHeartsRef, FloatingHeartsProps>(
  ({ onComplete }, ref) => {
    const [hearts, setHearts] = useState<FloatingHeartItem[]>([]);
    const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

    useEffect(() => {
      if (typeof window !== 'undefined') {
        const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
        setPrefersReducedMotion(mediaQuery.matches);
        const listener = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
        mediaQuery.addEventListener('change', listener);
        return () => mediaQuery.removeEventListener('change', listener);
      }
    }, []);

    const spawnHearts = useCallback(() => {
      const count = prefersReducedMotion ? 6 : 28;
      const newHearts: FloatingHeartItem[] = Array.from({ length: count }, (_, i) => ({
        id: `heart-${Date.now()}-${i}-${Math.random()}`,
        startX: Math.random() * 94 + 3, // 3vw to 97vw
        swayX: (Math.random() - 0.5) * (prefersReducedMotion ? 15 : 70),
        size: Math.floor(Math.random() * 22) + 18, // 18px to 40px
        color: HEART_COLORS[Math.floor(Math.random() * HEART_COLORS.length)],
        duration: prefersReducedMotion ? 2.2 : Math.random() * 2.2 + 3.5, // 3.5s to 5.7s
        delay: Math.random() * 0.85, // 0s to 0.85s
        rotation: (Math.random() - 0.5) * 60,
      }));

      setHearts(newHearts);

      // Clean up state when all animations complete
      const maxTime = Math.max(...newHearts.map((h) => (h.duration + h.delay) * 1000)) + 300;
      setTimeout(() => {
        setHearts([]);
        if (onComplete) onComplete();
      }, maxTime);
    }, [prefersReducedMotion, onComplete]);

    useImperativeHandle(ref, () => ({
      trigger: spawnHearts,
    }));

    return (
      <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden select-none">
        <AnimatePresence>
          {hearts.map((heart) => (
            <motion.div
              key={heart.id}
              initial={{
                opacity: 0,
                scale: 0,
                x: `${heart.startX}vw`,
                y: '105vh',
                rotate: 0,
              }}
              animate={{
                opacity: [0, 1, 0.95, 0.8, 0],
                scale: [0, 1.15, 1, 0.9, 0.7],
                y: '-15vh',
                x: [
                  `${heart.startX}vw`,
                  `calc(${heart.startX}vw + ${heart.swayX}px)`,
                  `calc(${heart.startX}vw - ${heart.swayX * 0.7}px)`,
                  `calc(${heart.startX}vw + ${heart.swayX * 0.4}px)`,
                ],
                rotate: heart.rotation,
              }}
              transition={{
                duration: heart.duration,
                delay: heart.delay,
                ease: [0.25, 0.46, 0.45, 0.94],
              }}
              style={{
                position: 'absolute',
                width: heart.size,
                height: heart.size,
                willChange: 'transform, opacity',
              }}
            >
              {/* Crisp SVG Heart */}
              <svg
                width={heart.size}
                height={heart.size}
                viewBox="0 0 24 24"
                fill={heart.color}
                className="drop-shadow-[0_2px_8px_rgba(0,0,0,0.15)]"
              >
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    );
  }
);

FloatingHearts.displayName = 'FloatingHearts';
