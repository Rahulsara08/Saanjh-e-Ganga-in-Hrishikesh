import React, { useEffect, useState, useRef } from 'react';

// Watercolor butterfly assets (left wing, right wing, body cutouts)
import wb1Left from '../assets/images/butterflies/wb1_left.png';
import wb1Right from '../assets/images/butterflies/wb1_right.png';
import wb1Body from '../assets/images/butterflies/wb1_body.png';

import wb2Left from '../assets/images/butterflies/wb2_left.png';
import wb2Right from '../assets/images/butterflies/wb2_right.png';
import wb2Body from '../assets/images/butterflies/wb2_body.png';

import wb3Left from '../assets/images/butterflies/wb3_left.png';
import wb3Right from '../assets/images/butterflies/wb3_right.png';
import wb3Body from '../assets/images/butterflies/wb3_body.png';

interface RSVPButterfliesProps {
  containerRef?: React.RefObject<HTMLElement | null>;
  className?: string;
}

export const RSVPButterflies: React.FC<RSVPButterfliesProps> = ({
  containerRef,
  className = '',
}) => {
  const [isInView, setIsInView] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Check prefers-reduced-motion
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    const listener = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', listener);
    return () => mediaQuery.removeEventListener('change', listener);
  }, []);

  // IntersectionObserver to trigger flight when RSVP enters viewport
  useEffect(() => {
    const target = containerRef?.current || wrapperRef.current?.parentElement;
    if (!target) return;

    // Detect scroll root (phone mockup scroll container vs window)
    const phoneScroll = document.querySelector('[data-phone-scroll="true"]') as HTMLElement | null;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      {
        root: phoneScroll || null,
        threshold: 0.18, // meaningfully enters viewport
      }
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, [containerRef]);

  const isFlying = isInView && !prefersReducedMotion;

  return (
    <div
      ref={wrapperRef}
      aria-hidden="true"
      className={`absolute inset-0 pointer-events-none select-none z-20 overflow-visible ${className}`}
    >
      <style>{`
        /* ── High-frequency wing flaps (8-12 flaps/sec) around body hinge ── */
        @keyframes wb1-wing-left {
          0% { transform: scale(1, 1) skewY(0deg); }
          100% { transform: scale(0.68, 1.1) skewY(14deg); }
        }
        @keyframes wb1-wing-right {
          0% { transform: scale(1, 1) skewY(0deg); }
          100% { transform: scale(0.72, 1.08) skewY(-12deg); }
        }

        @keyframes wb2-wing-left {
          0% { transform: scale(1, 1) skewY(0deg); }
          100% { transform: scale(0.74, 1.12) skewY(-14deg); }
        }
        @keyframes wb2-wing-right {
          0% { transform: scale(1, 1) skewY(0deg); }
          100% { transform: scale(0.72, 1.08) skewY(12deg); }
        }

        @keyframes wb3-wing-left {
          0% { transform: scale(1, 1) skewY(0deg); }
          100% { transform: scale(0.64, 1.15) skewY(16deg); }
        }
        @keyframes wb3-wing-right {
          0% { transform: scale(1, 1) skewY(0deg); }
          100% { transform: scale(0.70, 1.10) skewY(-10deg); }
        }

        /* ── Flight wandering loops within RSVP section margins ── */
        @keyframes wb1-flight {
          0% {
            transform: translate3d(calc(12% - 20px), -14px, 0) rotate(-10deg) scale(0.18);
          }
          18% {
            transform: translate3d(calc(5% - 10px), 70px, 0) rotate(-28deg) scale(0.19);
          }
          38% {
            transform: translate3d(calc(2% - 5px), 210px, 0) rotate(8deg) scale(0.18);
          }
          55% {
            transform: translate3d(calc(8% + 10px), 330px, 0) rotate(32deg) scale(0.19);
          }
          72% {
            transform: translate3d(calc(14% + 15px), 180px, 0) rotate(-16deg) scale(0.18);
          }
          88% {
            transform: translate3d(calc(18% + 10px), 40px, 0) rotate(-38deg) scale(0.18);
          }
          100% {
            transform: translate3d(calc(12% - 20px), -14px, 0) rotate(-10deg) scale(0.18);
          }
        }

        @keyframes wb2-flight {
          0% {
            transform: translate3d(calc(48% - 25px), -20px, 0) rotate(8deg) scale(0.16);
          }
          20% {
            transform: translate3d(calc(30% - 20px), -48px, 0) rotate(-22deg) scale(0.17);
          }
          42% {
            transform: translate3d(calc(66% + 10px), -36px, 0) rotate(26deg) scale(0.17);
          }
          65% {
            transform: translate3d(calc(82% + 5px), 65px, 0) rotate(14deg) scale(0.16);
          }
          82% {
            transform: translate3d(calc(62% - 10px), -12px, 0) rotate(-14deg) scale(0.16);
          }
          100% {
            transform: translate3d(calc(48% - 25px), -20px, 0) rotate(8deg) scale(0.16);
          }
        }

        @keyframes wb3-flight {
          0% {
            transform: translate3d(calc(84% - 18px), -16px, 0) rotate(-14deg) scale(0.20);
          }
          22% {
            transform: translate3d(calc(90% + 5px), 95px, 0) rotate(16deg) scale(0.21);
          }
          45% {
            transform: translate3d(calc(93% + 10px), 235px, 0) rotate(-12deg) scale(0.20);
          }
          64% {
            transform: translate3d(calc(86% - 5px), 350px, 0) rotate(-28deg) scale(0.21);
          }
          82% {
            transform: translate3d(calc(80% - 15px), 170px, 0) rotate(18deg) scale(0.20);
          }
          100% {
            transform: translate3d(calc(84% - 18px), -16px, 0) rotate(-14deg) scale(0.20);
          }
        }

        .butterfly-resting {
          transition: transform 500ms cubic-bezier(0.25, 1, 0.5, 1), opacity 500ms ease;
        }
      `}</style>

      {/* ── BUTTERFLY 1: WARM PINK WATERCOLOR BUTTERFLY (Left Flank) ── */}
      <div
        className={`absolute top-0 left-0 w-[200px] h-[310px] origin-top-left ${
          isFlying ? 'animate-[wb1-flight_8.4s_ease-in-out_infinite]' : 'butterfly-resting'
        }`}
        style={{
          transform: !isFlying
            ? 'translate3d(calc(12% - 20px), -14px, 0) rotate(-10deg) scale(0.18)'
            : undefined,
          willChange: isFlying ? 'transform' : 'auto',
        }}
      >
        <div className="relative w-full h-full drop-shadow-[0_4px_8px_rgba(74,64,56,0.18)]">
          {/* Left / Upper Wing */}
          <img
            src={wb1Left}
            alt=""
            className="absolute inset-0 w-full h-full object-contain pointer-events-none select-none"
            style={{
              transformOrigin: '52px 185px',
              animation: isFlying ? 'wb1-wing-left 0.09s ease-in-out infinite alternate' : 'none',
              willChange: isFlying ? 'transform' : 'auto',
            }}
          />

          {/* Right / Lower Wing */}
          <img
            src={wb1Right}
            alt=""
            className="absolute inset-0 w-full h-full object-contain pointer-events-none select-none"
            style={{
              transformOrigin: '52px 185px',
              animation: isFlying ? 'wb1-wing-right 0.09s ease-in-out infinite alternate' : 'none',
              willChange: isFlying ? 'transform' : 'auto',
            }}
          />

          {/* Shared Body & Antennae */}
          <img
            src={wb1Body}
            alt=""
            className="absolute inset-0 w-full h-full object-contain pointer-events-none select-none z-10"
          />
        </div>
      </div>

      {/* ── BUTTERFLY 2: PALE BLUE WATERCOLOR BUTTERFLY (Center Top) ── */}
      <div
        className={`absolute top-0 left-0 w-[260px] h-[235px] origin-top-left ${
          isFlying ? 'animate-[wb2-flight_10.8s_ease-in-out_infinite]' : 'butterfly-resting'
        }`}
        style={{
          transform: !isFlying
            ? 'translate3d(calc(48% - 25px), -20px, 0) rotate(8deg) scale(0.16)'
            : undefined,
          willChange: isFlying ? 'transform' : 'auto',
        }}
      >
        <div className="relative w-full h-full drop-shadow-[0_4px_8px_rgba(74,64,56,0.18)]">
          {/* Left Wing */}
          <img
            src={wb2Left}
            alt=""
            className="absolute inset-0 w-full h-full object-contain pointer-events-none select-none"
            style={{
              transformOrigin: '147px 130px',
              animation: isFlying ? 'wb2-wing-left 0.10s ease-in-out infinite alternate' : 'none',
              willChange: isFlying ? 'transform' : 'auto',
            }}
          />

          {/* Right Wing */}
          <img
            src={wb2Right}
            alt=""
            className="absolute inset-0 w-full h-full object-contain pointer-events-none select-none"
            style={{
              transformOrigin: '147px 130px',
              animation: isFlying ? 'wb2-wing-right 0.10s ease-in-out infinite alternate' : 'none',
              willChange: isFlying ? 'transform' : 'auto',
            }}
          />

          {/* Shared Body & Antennae */}
          <img
            src={wb2Body}
            alt=""
            className="absolute inset-0 w-full h-full object-contain pointer-events-none select-none z-10"
          />
        </div>
      </div>

      {/* ── BUTTERFLY 3: MAGENTA / PINK WATERCOLOR BUTTERFLY (Right Flank) ── */}
      <div
        className={`absolute top-0 left-0 w-[210px] h-[330px] origin-top-left ${
          isFlying ? 'animate-[wb3-flight_9.2s_ease-in-out_infinite]' : 'butterfly-resting'
        }`}
        style={{
          transform: !isFlying
            ? 'translate3d(calc(84% - 18px), -16px, 0) rotate(-14deg) scale(0.20)'
            : undefined,
          willChange: isFlying ? 'transform' : 'auto',
        }}
      >
        <div className="relative w-full h-full drop-shadow-[0_4px_8px_rgba(74,64,56,0.18)]">
          {/* Left Wing (Back Wing) */}
          <img
            src={wb3Left}
            alt=""
            className="absolute inset-0 w-full h-full object-contain pointer-events-none select-none"
            style={{
              transformOrigin: '136px 175px',
              animation: isFlying ? 'wb3-wing-left 0.085s ease-in-out infinite alternate' : 'none',
              willChange: isFlying ? 'transform' : 'auto',
            }}
          />

          {/* Right Wing (Front Wing) */}
          <img
            src={wb3Right}
            alt=""
            className="absolute inset-0 w-full h-full object-contain pointer-events-none select-none"
            style={{
              transformOrigin: '136px 175px',
              animation: isFlying ? 'wb3-wing-right 0.085s ease-in-out infinite alternate' : 'none',
              willChange: isFlying ? 'transform' : 'auto',
            }}
          />

          {/* Shared Body & Antennae */}
          <img
            src={wb3Body}
            alt=""
            className="absolute inset-0 w-full h-full object-contain pointer-events-none select-none z-10"
          />
        </div>
      </div>
    </div>
  );
};
