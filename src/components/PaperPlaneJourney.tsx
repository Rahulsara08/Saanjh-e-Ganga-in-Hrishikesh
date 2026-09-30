import React, { useEffect, useRef, useState, useCallback } from 'react';
import { JourneyEvent } from '../types';
import { RevealOnScroll } from './RevealOnScroll';
import { CalendarPlus, MapPin, Sparkles } from 'lucide-react';

interface PaperPlaneJourneyProps {
  events: JourneyEvent[];
  oneLineQuotes: { [key: string]: string };
  onAddToCalendar: (event: JourneyEvent) => void;
}

export const PaperPlaneJourney: React.FC<PaperPlaneJourneyProps> = ({
  events,
  oneLineQuotes,
  onAddToCalendar,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const guideRef = useRef<SVGPathElement>(null);
  const trailRef = useRef<SVGPathElement>(null);
  const ghostRef = useRef<SVGPathElement>(null);
  const planeRef = useRef<SVGGElement>(null);

  // Responsive SVG path data and dimensions
  const [pathData, setPathData] = useState<string>('');
  const [svgDimensions, setSvgDimensions] = useState<{ width: number; height: number }>({
    width: 420,
    height: 3400,
  });

  // Active event index that the plane has reached
  const [activeEventIndex, setActiveEventIndex] = useState<number>(0);

  // Direction table & dash intervals
  const dirTableRef = useRef<number[]>([]);
  const totalLengthRef = useRef<number>(0);
  const intervalsRef = useRef<[number, number][]>([]);

  // Animation state refs (smooth 60fps RAF loop)
  const animStateRef = useRef({
    cur: 0,
    tgt: 0,
    raf: 0,
    back: false,
    flip: 1,
  });

  // ──────────────────────────────────────────────────────────────────────────
  // 1. DYNAMIC PATH GENERATION BASED ON ACTUAL CARD POSITIONS
  // ──────────────────────────────────────────────────────────────────────────
  const calculatePath = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    const cRect = container.getBoundingClientRect();
    const W = container.clientWidth || cRect.width || 400;

    // Gather measured card bounding boxes relative to container
    const cardBoxes: { top: number; height: number; bottom: number; left: number; right: number; width: number }[] = [];

    events.forEach((_, idx) => {
      const el = cardRefs.current[idx];
      if (el) {
        const rect = el.getBoundingClientRect();
        const top = rect.top - cRect.top;
        const height = rect.height;
        const bottom = top + height;
        const left = rect.left - cRect.left;
        const right = rect.right - cRect.left;
        const width = rect.width;

        cardBoxes.push({ top, height, bottom, left, right, width });
      } else {
        // Fallback estimate if not yet measured
        const estH = 480;
        const estGap = 80;
        const top = 100 + idx * (estH + estGap);
        const isLeft = idx % 2 === 0;
        const cardW = Math.min(W * 0.8, 350);
        cardBoxes.push({
          top,
          height: estH,
          bottom: top + estH,
          left: isLeft ? 12 : W - cardW - 12,
          right: isLeft ? 12 + cardW : W - 12,
          width: cardW,
        });
      }
    });

    if (cardBoxes.length === 0) return;

    const lastCard = cardBoxes[cardBoxes.length - 1];
    const H = Math.max(container.scrollHeight, container.offsetHeight, lastCard ? lastCard.bottom + 180 : 3400);
    setSvgDimensions({ width: W, height: H });

    let d = '';

    // ── TAKEOFF FLIGHT (Loop-the-loop in open space above Event 1) ──
    const top0 = cardBoxes[0].top;
    const startX = Math.max(20, W * 0.18);
    const startY = Math.max(16, top0 - 130);

    d += `M ${startX.toFixed(1)} ${startY.toFixed(1)} `;
    // Climb up and to the right
    d += `C ${(W * 0.38).toFixed(1)} ${(startY - 14).toFixed(1)}, ${(W * 0.65).toFixed(1)} ${(startY + 8).toFixed(1)}, ${(W * 0.74).toFixed(1)} ${(startY + 40).toFixed(1)} `;
    // Loop back around to the left
    d += `C ${(W * 0.82).toFixed(1)} ${(startY + 68).toFixed(1)}, ${(W * 0.72).toFixed(1)} ${(startY + 105).toFixed(1)}, ${(W * 0.54).toFixed(1)} ${(startY + 98).toFixed(1)} `;
    // Loop closure
    d += `C ${(W * 0.40).toFixed(1)} ${(startY + 88).toFixed(1)}, ${(W * 0.44).toFixed(1)} ${(startY + 52).toFixed(1)}, ${(W * 0.62).toFixed(1)} ${(startY + 48).toFixed(1)} `;

    // ── CONNECTING EACH EVENT CARD ALTERNATING LEFT <-> RIGHT ──
    for (let i = 0; i < cardBoxes.length; i++) {
      const box = cardBoxes[i];
      const isLeft = i % 2 === 0;

      // Waypoint in the spacious open margin beside the card (never over the card!)
      const flankX = isLeft
        ? Math.min(W - 22, Math.max(box.right + 24, W * 0.89))
        : Math.max(22, Math.min(box.left - 24, W * 0.11));

      const centerY = box.top + box.height * 0.44;

      if (i === 0) {
        // Exit from takeoff loop into Event 1 right flank
        d += `C ${(W * 0.76).toFixed(1)} ${(startY + 46).toFixed(1)}, ${(flankX + 12).toFixed(1)} ${(box.top - 24).toFixed(1)}, ${flankX.toFixed(1)} ${centerY.toFixed(1)} `;
      }

      if (i < cardBoxes.length - 1) {
        const nextBox = cardBoxes[i + 1];
        const nextIsLeft = (i + 1) % 2 === 0;

        const nextFlankX = nextIsLeft
          ? Math.min(W - 22, Math.max(nextBox.right + 24, W * 0.89))
          : Math.max(22, Math.min(nextBox.left - 24, W * 0.11));

        const nextCenterY = nextBox.top + nextBox.height * 0.44;

        // Gap between bottom of current card and top of next card
        const gapY = Math.max(nextBox.top - box.bottom, 40);

        // Sweeping S-curve across the wide open vertical space between cards
        const cp1x = isLeft ? flankX + 18 : flankX - 18;
        const cp1y = box.bottom + gapY * 0.4;

        const cp2x = nextIsLeft ? nextFlankX + 24 : nextFlankX - 24;
        const cp2y = nextBox.top - gapY * 0.4;

        d += `C ${cp1x.toFixed(1)} ${cp1y.toFixed(1)}, ${cp2x.toFixed(1)} ${cp2y.toFixed(1)}, ${nextFlankX.toFixed(1)} ${nextCenterY.toFixed(1)} `;
      } else {
        // ── FINAL LANDING GLIDE AFTER LAST EVENT ──
        const bottom = box.bottom;
        const glideX1 = isLeft ? flankX + 10 : flankX - 10;
        const glideX2 = W * 0.52;
        const endX = W * 0.22;

        d += `C ${glideX1.toFixed(1)} ${(bottom + 40).toFixed(1)}, ${(W * 0.68).toFixed(1)} ${(bottom + 75).toFixed(1)}, ${glideX2.toFixed(1)} ${(bottom + 95).toFixed(1)} `;
        d += `C ${(W * 0.38).toFixed(1)} ${(bottom + 110).toFixed(1)}, ${(W * 0.28).toFixed(1)} ${(bottom + 92).toFixed(1)}, ${endX.toFixed(1)} ${(bottom + 74).toFixed(1)} `;
      }
    }

    setPathData(d);
  }, [events]);

  // Recalculate on mount, window resize, and DOM changes
  useEffect(() => {
    const timer = setTimeout(() => {
      calculatePath();
    }, 150);

    const handleResize = () => {
      calculatePath();
    };

    window.addEventListener('resize', handleResize);

    let ro: ResizeObserver | null = null;
    if (typeof ResizeObserver !== 'undefined' && containerRef.current) {
      ro = new ResizeObserver(() => {
        calculatePath();
      });
      ro.observe(containerRef.current);
    }

    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', handleResize);
      if (ro) ro.disconnect();
    };
  }, [calculatePath]);

  // ──────────────────────────────────────────────────────────────────────────
  // 2. DASH SYSTEM & DIRECTION TABLE INITIALIZATION
  // ──────────────────────────────────────────────────────────────────────────
  const dashes = useCallback((s: number): number[] => {
    const iv = intervalsRef.current;
    if (!iv || iv.length === 0) return [];
    const o: number[] = [];
    let prev = iv[0][0];

    for (const [a, b] of iv) {
      if (a >= s) break;
      if (o.length) o.push(a - prev);
      o.push(Math.min(b, s) - a);
      prev = b;
    }
    if (o.length) o.push(1e5);
    return o;
  }, []);

  // When pathData changes, rebuild direction table & dash intervals
  useEffect(() => {
    const guide = guideRef.current;
    const ghost = ghostRef.current;
    if (!guide || !pathData) return;

    try {
      const Lb = guide.getTotalLength();
      if (!Lb || isNaN(Lb) || Lb <= 0) return;

      totalLengthRef.current = Lb;

      // Rebuild dash intervals (14px dash, 14px gap)
      const dashLen = 14;
      const gapLen = 14;
      const iv: [number, number][] = [];
      for (let d = 6; d < Lb; d += dashLen + gapLen) {
        iv.push([d, Math.min(d + dashLen, Lb)]);
      }
      intervalsRef.current = iv;

      // Rebuild Direction Table: 800 unwrapped heading sample points
      const N = 800;
      const T: number[] = [];
      let prev = 0;

      for (let i = 0; i <= N; i++) {
        const s = (Lb * i) / N;
        const a = guide.getPointAtLength(Math.max(0, s - 3));
        const b = guide.getPointAtLength(Math.min(Lb, s + 3));
        let t = Math.atan2(b.y - a.y, b.x - a.x);
        if (i > 0) {
          t -= 2 * Math.PI * Math.round((t - prev) / (2 * Math.PI));
        }
        T.push(t);
        prev = t;
      }
      dirTableRef.current = T;

      // Set ghost path with full faint trail
      if (ghost) {
        ghost.setAttribute('stroke-dashoffset', `-${iv[0]?.[0] || 0}`);
        const fullDashes = dashes(Infinity);
        if (fullDashes.length) {
          ghost.setAttribute('stroke-dasharray', fullDashes.join(' '));
        }
      }

      // Initial render at current target
      render(animStateRef.current.cur);
    } catch (e) {
      console.warn('Paper plane path init warning:', e);
    }
  }, [pathData, dashes]);

  // ──────────────────────────────────────────────────────────────────────────
  // 3. RENDER FUNCTION (Plane Position, Rotation, Flip & Trail Inking)
  // ──────────────────────────────────────────────────────────────────────────
  const getHeading = (s: number): number => {
    const T = dirTableRef.current;
    const Lb = totalLengthRef.current;
    if (!T || T.length === 0 || !Lb) return 0;

    const N = T.length - 1;
    const f = Math.min(Math.max(s / Lb, 0), 1) * N;
    const i = Math.min(Math.floor(f), N - 1);
    return T[i] + (T[i + 1] - T[i]) * (f - i);
  };

  const render = (progress: number) => {
    const guide = guideRef.current;
    const trail = trailRef.current;
    const plane = planeRef.current;
    const Lb = totalLengthRef.current;
    if (!guide || !plane || !Lb || Lb <= 0) return;

    const s = Math.min(Math.max(progress, 0), 1) * Lb;
    const pt = guide.getPointAtLength(s);

    // Update active trail
    if (trail) {
      const o = dashes(s);
      trail.style.visibility = o.length ? 'visible' : 'hidden';
      if (o.length) {
        trail.setAttribute('stroke-dasharray', o.join(' '));
        trail.setAttribute('stroke-dashoffset', `-${intervalsRef.current[0]?.[0] || 0}`);
      }
    }

    // Direction calculation
    const heading = getHeading(s);
    const headingDeg = (heading * 180) / Math.PI;

    // Flip transition: mirrors along the flight axis when traveling backward
    const flip = animStateRef.current.flip;

    // Transform paper plane: translate -> rotate to tangent -> scale(flip 1) for reverse flight
    plane.setAttribute(
      'transform',
      `translate(${pt.x.toFixed(2)}, ${pt.y.toFixed(2)}) rotate(${headingDeg.toFixed(2)}) scale(${flip.toFixed(3)}, 1)`
    );

    // Update active station based on plane Y position
    const cardElements = cardRefs.current;
    let closestIndex = 0;
    for (let i = 0; i < cardElements.length; i++) {
      const el = cardElements[i];
      if (el && pt.y >= el.offsetTop - 80) {
        closestIndex = i;
      }
    }
    setActiveEventIndex(closestIndex);
  };

  // ──────────────────────────────────────────────────────────────────────────
  // 4. ANIMATION LOOP & SCROLL POSITION CALCULATION
  // ──────────────────────────────────────────────────────────────────────────
  const calcScrollProgress = useCallback((): number => {
    const container = containerRef.current;
    if (!container) return 0;

    let parent = container.parentElement;
    let scrollRoot: HTMLElement | null = null;
    while (parent) {
      const ov = window.getComputedStyle(parent).overflowY;
      if (ov === 'auto' || ov === 'scroll') {
        scrollRoot = parent;
        break;
      }
      parent = parent.parentElement;
    }

    const rect = container.getBoundingClientRect();

    if (scrollRoot) {
      // Inside PC Phone Mockup scroll container
      const rootRect = scrollRoot.getBoundingClientRect();
      const topInRoot = rect.top - rootRect.top;
      const vh = rootRect.height;

      const startOffset = vh * 0.48;
      const endOffset = vh * 0.52;
      const totalScrollable = rect.height - endOffset + startOffset;

      if (totalScrollable <= 0) return 0;
      const currentScroll = startOffset - topInRoot;
      return Math.min(Math.max(currentScroll / totalScrollable, 0), 1);
    } else {
      // Native window scroll (Mobile & Tablet)
      const vh = window.innerHeight;
      const startOffset = vh * 0.48;
      const endOffset = vh * 0.52;
      const totalScrollable = rect.height - endOffset + startOffset;

      if (totalScrollable <= 0) return 0;
      const currentScroll = startOffset - rect.top;
      return Math.min(Math.max(currentScroll / totalScrollable, 0), 1);
    }
  }, []);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const RM = mediaQuery.matches;

    const loop = () => {
      const state = animStateRef.current;

      // Eased interpolation for plane progress
      state.cur += (state.tgt - state.cur) * 0.12;
      if (Math.abs(state.tgt - state.cur) < 1e-4) {
        state.cur = state.tgt;
      }

      // Smooth flip transition when reversing
      const ft = state.back ? -1 : 1;
      state.flip += (ft - state.flip) * 0.16;
      if (Math.abs(ft - state.flip) < 0.002) {
        state.flip = ft;
      }

      render(state.cur);

      if (state.cur !== state.tgt || state.flip !== ft) {
        state.raf = requestAnimationFrame(loop);
      } else {
        state.raf = 0;
      }
    };

    const kick = () => {
      const state = animStateRef.current;
      const n = RM ? 1 : calcScrollProgress();

      if (n !== state.tgt) {
        state.back = n < state.tgt;
      }
      if (n <= 0) {
        state.back = false;
      }

      state.tgt = n;

      if (!state.raf) {
        state.raf = requestAnimationFrame(loop);
      }
    };

    let parent = containerRef.current?.parentElement;
    let scrollRoot: HTMLElement | null = null;
    while (parent) {
      const ov = window.getComputedStyle(parent).overflowY;
      if (ov === 'auto' || ov === 'scroll') {
        scrollRoot = parent;
        break;
      }
      parent = parent.parentElement;
    }

    if (RM) {
      animStateRef.current.cur = animStateRef.current.tgt = 1;
      render(1);
    } else {
      kick();
      window.addEventListener('scroll', kick, { passive: true });
      if (scrollRoot) {
        scrollRoot.addEventListener('scroll', kick, { passive: true });
      }
    }

    return () => {
      window.removeEventListener('scroll', kick);
      if (scrollRoot) {
        scrollRoot.removeEventListener('scroll', kick);
      }
      if (animStateRef.current.raf) {
        cancelAnimationFrame(animStateRef.current.raf);
      }
    };
  }, [calcScrollProgress, dashes]);

  return (
    <div ref={containerRef} className="relative w-full py-4 select-text">
      {/* ─── CONTINUOUS SVG PAPER PLANE FLIGHT SYSTEM ─── */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none z-10 overflow-visible"
        width={svgDimensions.width}
        height={svgDimensions.height}
        viewBox={`0 0 ${svgDimensions.width} ${svgDimensions.height}`}
        aria-hidden="true"
      >
        <defs>
          {/* Soft gold glow for flight trail */}
          <filter id="goldGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="1" stdDeviation="2.5" floodColor="#C6A15B" floodOpacity="0.35" />
          </filter>

          {/* Paper airplane wing shading gradients */}
          <linearGradient id="planeWingLight" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="100%" stopColor="#F8F3EC" />
          </linearGradient>

          <linearGradient id="planeWingShade" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#F3E9DD" />
            <stop offset="100%" stopColor="#E6D7C5" />
          </linearGradient>

          <linearGradient id="planeKeel" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#DFC48F" />
            <stop offset="100%" stopColor="#C6A15B" />
          </linearGradient>
        </defs>

        <g>
          {/* 1. Invisible guide path for mathematical pointAtLength & tangent calculations */}
          <path
            ref={guideRef}
            d={pathData}
            fill="none"
            stroke="none"
          />

          {/* 2. Ghost ribbon: delicate, low-contrast preview of the full flight trajectory */}
          <path
            ref={ghostRef}
            d={pathData}
            fill="none"
            stroke="#DFC48F"
            strokeWidth="1.8"
            strokeLinecap="round"
            opacity="0.25"
          />

          {/* 3. Trail ribbon: solid, progressive gold dashed ribbon drawn behind the paper plane */}
          <path
            ref={trailRef}
            d={pathData}
            fill="none"
            stroke="#C6A15B"
            strokeWidth="2.4"
            strokeLinecap="round"
            filter="url(#goldGlow)"
          />

          {/* 4. Elegant Handcrafted Paper Plane Asset */}
          <g
            ref={planeRef}
            className="transition-transform will-change-transform"
            style={{ transformOrigin: '0 0' }}
          >
            {/* Soft floating ambient drop shadow */}
            <path
              d="M 28 0 L -22 -14 L -15 0 L -22 14 Z"
              fill="rgba(74, 64, 56, 0.2)"
              transform="translate(1, 4) scale(1.02)"
            />

            {/* Underbody Keel Fold (Sacred Ganga Gold Tint) */}
            <polygon
              points="28,0 -16,0 -12,6"
              fill="url(#planeKeel)"
              opacity="0.9"
            />

            {/* Right / Shaded Wing */}
            <polygon
              points="28,0 -15,0 -22,14"
              fill="url(#planeWingShade)"
              stroke="#DFC48F"
              strokeWidth="0.6"
            />

            {/* Left / Illuminated Wing (Parchment Ivory) */}
            <polygon
              points="28,0 -22,-14 -15,0"
              fill="url(#planeWingLight)"
              stroke="#DFC48F"
              strokeWidth="0.6"
            />

            {/* Crisp Center Spine Crease (Gold Leaf Accent) */}
            <line
              x1="28"
              y1="0"
              x2="-16"
              y2="0"
              stroke="#C6A15B"
              strokeWidth="1"
              strokeLinecap="round"
            />

            {/* Sacred Lotus Spark at Plane Nose */}
            <circle cx="28" cy="0" r="1.5" fill="#B88E4C" />
          </g>
        </g>
      </svg>

      {/* ─── VERTICAL ALTERNATING TIMELINE (LEFT <-> RIGHT) ─── */}
      <div className="w-full relative z-20 flex flex-col space-y-14 xs:space-y-18 sm:space-y-24">
        {events.map((event, index) => {
          const isLeft = index % 2 === 0;
          const isPassed = index <= activeEventIndex;

          return (
            <div
              key={event.title}
              className={`w-full flex ${isLeft ? 'justify-start' : 'justify-end'}`}
            >
              <RevealOnScroll delay={Math.min(index * 60, 200)}>
                {/* ── Handcrafted Wedding Station Card ── */}
                <div
                  ref={(el) => {
                    cardRefs.current[index] = el;
                  }}
                  className={`w-[82%] xs:w-[80%] sm:w-[72%] max-w-[335px] sm:max-w-[380px] p-5 xs:p-6 sm:p-7 rounded-[26px] sm:rounded-[32px] bg-[#FAF6F0]/95 backdrop-blur-xs border transition-all duration-500 shadow-[0_10px_30px_-6px_rgba(74,64,56,0.1),0_0_0_1px_rgba(255,255,255,0.7)_inset] relative group hover:shadow-[0_16px_40px_-6px_rgba(198,161,91,0.22)] ${
                    isPassed
                      ? 'border-[#DFC48F]'
                      : 'border-[#DFC48F]/50 opacity-95'
                  }`}
                >
                  {/* Delicate Station Waypoint Indicator facing the flight path */}
                  <div
                    className={`absolute top-6 ${
                      isLeft ? '-right-3' : '-left-3'
                    } flex items-center justify-center`}
                  >
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center border transition-all duration-500 shadow-xs ${
                        isPassed
                          ? 'bg-[#C6A15B] text-white border-white scale-110 shadow-[0_0_12px_rgba(198,161,91,0.5)]'
                          : 'bg-[#FAF6F0] text-[#B88E4C] border-[#DFC48F]'
                      }`}
                    >
                      <span className="text-[10px] font-sans font-bold leading-none">
                        {event.number || index + 1}
                      </span>
                    </div>
                  </div>

                  {/* Header: Ceremony Step & Date */}
                  <div className="flex items-center justify-between pb-2 border-b border-[#DFC48F]/30">
                    <span className="text-[10px] font-bold tracking-[0.25em] uppercase font-sans text-[#B88E4C]">
                      ✦ RITUAL {event.number}
                    </span>
                    <span className="text-[10px] font-medium tracking-wider uppercase font-sans text-[#8A7F72]">
                      {event.date}
                    </span>
                  </div>

                  {/* Custom Ceremony Illustration */}
                  {event.imageUrl && (
                    <div className="w-full aspect-[4/3] xs:aspect-[1.3/1] flex items-center justify-center my-3 relative overflow-hidden rounded-2xl bg-gradient-to-b from-[#F5EDE1]/40 to-transparent p-2">
                      <img
                        src={event.imageUrl}
                        alt={event.title}
                        className="w-full h-full object-contain object-center transition-transform duration-700 group-hover:scale-105 drop-shadow-sm select-none"
                      />
                    </div>
                  )}

                  {/* Event Title */}
                  <h3 className="font-serif text-2xl xs:text-3xl text-[#4A4038] font-normal tracking-wide leading-snug mt-1">
                    {event.title}
                  </h3>

                  {/* Venue */}
                  <div className="flex items-center space-x-1.5 text-[#8A7F72] text-xs font-sans mt-2">
                    <MapPin size={13} className="text-[#C6A15B] shrink-0" />
                    <span className="font-medium tracking-wide">{event.venue}</span>
                  </div>

                  {/* Poetic One-Line Quote */}
                  <p className="font-serif italic text-base xs:text-lg text-[#C6A15B] font-light leading-relaxed my-3">
                    “{oneLineQuotes[event.title] || event.description}”
                  </p>

                  {/* Attire Guide & Add to Calendar Button */}
                  <div className="flex flex-col xs:flex-row xs:items-center justify-between gap-3 pt-3 border-t border-[#DFC48F]/30">
                    <div className="inline-flex items-center space-x-1.5 text-xs text-[#8A7F72]">
                      <Sparkles size={12} className="text-[#C6A15B] shrink-0" />
                      <span className="font-sans text-[11px] font-medium">{event.attire}</span>
                    </div>

                    <button
                      id={`add-cal-event-${index + 1}`}
                      type="button"
                      onClick={() => onAddToCalendar(event)}
                      className="inline-flex items-center space-x-1.5 px-4 py-1.5 rounded-full bg-[#FAF6F0] hover:bg-[#F3EDE3] text-[#4A4038] text-[10px] tracking-wider uppercase font-medium border border-[#DFC48F] transition-all shadow-2xs self-start xs:self-auto hover:border-[#C6A15B] hover:scale-102 active:scale-98 cursor-pointer"
                    >
                      <CalendarPlus size={12} className="text-[#C6A15B]" />
                      <span>Add to Calendar</span>
                    </button>
                  </div>
                </div>
              </RevealOnScroll>
            </div>
          );
        })}
      </div>
    </div>
  );
};
