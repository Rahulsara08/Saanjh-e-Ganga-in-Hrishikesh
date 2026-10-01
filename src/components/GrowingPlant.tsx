import React, { useEffect, useState, useRef } from 'react';
import plantData from '../data/plant_paths.json';

interface GrowingPlantProps {
  containerRef?: React.RefObject<HTMLElement | null>;
  className?: string;
  style?: React.CSSProperties;
}

export const GrowingPlant: React.FC<GrowingPlantProps> = ({
  containerRef,
  className = '',
  style = {},
}) => {
  const [isInView, setIsInView] = useState(false);
  const [isDrawn, setIsDrawn] = useState(false);
  const [isBloomed, setIsBloomed] = useState(false);
  const [isReducedMotion, setIsReducedMotion] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Check prefers-reduced-motion
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setIsReducedMotion(mediaQuery.matches);
    const handler = (e: MediaQueryListEvent) => setIsReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  // IntersectionObserver on the Family Details section (plays once per visit)
  useEffect(() => {
    const target = containerRef?.current || wrapperRef.current?.closest('section') || wrapperRef.current?.parentElement;
    if (!target) return;

    const phoneScroll = document.querySelector('[data-phone-scroll="true"]') as HTMLElement | null;

    let bloomTimer1: ReturnType<typeof setTimeout>;
    let bloomTimer2: ReturnType<typeof setTimeout>;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          // Start stem drawing
          setIsDrawn(true);

          // Once stem and leaves finish drawing (~1.5-1.7s), animate flower heads blooming
          bloomTimer1 = setTimeout(() => {
            setIsBloomed(true);
          }, 1500);
        } else {
          // Reset when scrolled completely away so it replays cleanly on return visit
          setIsInView(false);
          setIsDrawn(false);
          setIsBloomed(false);
          clearTimeout(bloomTimer1);
          clearTimeout(bloomTimer2);
        }
      },
      {
        root: phoneScroll || null,
        threshold: 0.18,
      }
    );

    observer.observe(target);
    return () => {
      observer.disconnect();
      clearTimeout(bloomTimer1);
      clearTimeout(bloomTimer2);
    };
  }, [containerRef]);

  const {
    viewBox,
    mainStems,
    leafStems,
    leaves,
    flowerOpen,
    flowerBud,
    openFlowerBase,
    budFlowerBase,
  } = plantData as {
    viewBox: string;
    width: number;
    height: number;
    mainStems: string[];
    leafStems: string[];
    leaves: string[];
    flowerOpen: string[];
    flowerBud: string[];
    openFlowerBase: { x: number; y: number };
    budFlowerBase: { x: number; y: number };
  };

  // If user prefers reduced motion: fully drawn and bloomed with 0 animation
  const showFully = isReducedMotion;

  return (
    <div
      ref={wrapperRef}
      aria-hidden="true"
      className={`pointer-events-none select-none z-10 overflow-visible ${className}`}
      style={style}
    >
      <style>{`
        .plant-stem-drawing {
          stroke-dasharray: 100;
          transition: stroke-dashoffset 1.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }
        .plant-leaf-drawing {
          stroke-dasharray: 100;
          transition: stroke-dashoffset 1.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.3s;
        }

        /* Flower blooming soft bounce ease */
        .flower-open-bloom {
          transform-origin: ${openFlowerBase.x}px ${openFlowerBase.y}px;
          transition: transform 700ms cubic-bezier(0.34, 1.56, 0.64, 1), opacity 500ms ease;
        }
        .flower-bud-bloom {
          transform-origin: ${budFlowerBase.x}px ${budFlowerBase.y}px;
          transition: transform 700ms cubic-bezier(0.34, 1.56, 0.64, 1) 220ms, opacity 500ms ease 180ms;
        }
      `}</style>

      <svg
        viewBox={viewBox}
        className="w-full h-full overflow-visible drop-shadow-[0_2px_8px_rgba(74,64,56,0.06)]"
        style={{
          stroke: '#4A4038',
          strokeWidth: 1.65,
          strokeLinecap: 'round',
          strokeLinejoin: 'round',
          fill: 'none',
        }}
      >
        {/* ── 1. MAIN STEMS (Draw upward from base) ── */}
        <g id="main-stems" style={{ strokeWidth: 1.8 }}>
          {mainStems.map((d, i) => (
            <path
              key={`stem-${i}`}
              d={d}
              pathLength={100}
              className={showFully ? '' : 'plant-stem-drawing'}
              style={{
                strokeDashoffset: showFully || isDrawn ? 0 : 100,
              }}
            />
          ))}
        </g>

        {/* ── 2. BRANCHING LEAF STEMS ── */}
        <g id="leaf-stems" style={{ strokeWidth: 1.4 }}>
          {leafStems.map((d, i) => (
            <path
              key={`leaf-stem-${i}`}
              d={d}
              pathLength={100}
              className={showFully ? '' : 'plant-leaf-drawing'}
              style={{
                strokeDashoffset: showFully || isDrawn ? 0 : 100,
              }}
            />
          ))}
        </g>

        {/* ── 3. LEAVES ── */}
        <g id="leaves" style={{ strokeWidth: 1.45 }}>
          {leaves.map((d, i) => (
            <path
              key={`leaf-${i}`}
              d={d}
              pathLength={100}
              className={showFully ? '' : 'plant-leaf-drawing'}
              style={{
                strokeDashoffset: showFully || isDrawn ? 0 : 100,
              }}
            />
          ))}
        </g>

        {/* ── 4. FULLER OPEN FLOWER HEAD (Blooming at Top) ── */}
        <g
          id="flower-open"
          className={showFully ? '' : 'flower-open-bloom'}
          style={{
            transform: showFully || isBloomed ? 'scale(1)' : 'scale(0.85)',
            opacity: showFully || isBloomed ? 1 : 0.08,
            willChange: isInView ? 'transform, opacity' : 'auto',
          }}
        >
          {flowerOpen.map((d, i) => (
            <path key={`flower-open-${i}`} d={d} />
          ))}
        </g>

        {/* ── 5. SMALLER BUDDING FLOWER HEAD (Blooming Below) ── */}
        <g
          id="flower-bud"
          className={showFully ? '' : 'flower-bud-bloom'}
          style={{
            transform: showFully || isBloomed ? 'scale(1)' : 'scale(0.85)',
            opacity: showFully || isBloomed ? 1 : 0.08,
            willChange: isInView ? 'transform, opacity' : 'auto',
          }}
        >
          {flowerBud.map((d, i) => (
            <path key={`flower-bud-${i}`} d={d} />
          ))}
        </g>
      </svg>
    </div>
  );
};
