import React, { useState, useEffect, useRef } from 'react';
import { SectionEyebrow, SectionHeading, Divider } from './BasicComponents';
import { RevealOnScroll } from './RevealOnScroll';
import { WeddingConfig } from '../types';
import { generateICS } from '../utils/ics';
import { Heart, CalendarPlus, CheckCircle2 } from 'lucide-react';
import { FloatingHearts, FloatingHeartsRef } from './FloatingHearts';

import bfPinkSoft from '../assets/images/butterfly-pink-soft.png';
import bfBlue from '../assets/images/butterfly-blue.png';
import bfPinkSpotted from '../assets/images/butterfly-pink-spotted.png';

interface RSVPSectionProps {
  config: WeddingConfig;
  onRSVPSubmitted?: () => void;
  onAccept?: () => void;
}

const RSVP_ACCEPT_KEY = 'meher_kabir_rsvp_accepted_v5';

export const RSVPSection: React.FC<RSVPSectionProps> = ({
  config,
  onRSVPSubmitted,
  onAccept,
}) => {
  const [isAccepted, setIsAccepted] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(RSVP_ACCEPT_KEY);
      return saved === 'true';
    } catch (e) {
      return false;
    }
  });

  const heartsRef = useRef<FloatingHeartsRef>(null);

  // Butterfly animation elements and lifecycle refs
  const sectionRef = useRef<HTMLElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const bf1Ref = useRef<HTMLDivElement>(null);
  const bf2Ref = useRef<HTMLDivElement>(null);
  const bf3Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const RM = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const section = sectionRef.current;
    const card = cardRef.current;
    const bfEls = [bf1Ref.current, bf2Ref.current, bf3Ref.current];

    if (!section || !card || bfEls.some(el => !el)) return;

    const bees = bfEls.map((el, i) => ({
      el: el!,
      x: 0,
      y: 0,
      vx: 0,
      vy: 0,
      currentAngle: 0,
      seed: Math.random() * 1000 + i * 137,
      flapSeed: Math.random() * 1000,
    }));

    let flying = false;
    let raf: number | null = null;

    function restingSpots() {
      if (!card || !section) return [];
      const cr = card.getBoundingClientRect();
      const sr = section.getBoundingClientRect();
      const top = cr.top - sr.top;
      const left = cr.left - sr.left;
      return [
        { x: left + cr.width * 0.18, y: top - 18, r: -8 },
        { x: left + cr.width * 0.50, y: top - 28, r: 4  },
        { x: left + cr.width * 0.82, y: top - 14, r: 10 },
      ];
    }

    function settle() {
      const spots = restingSpots();
      if (!spots.length) return;
      bees.forEach((b, i) => {
        b.x = spots[i].x;
        b.y = spots[i].y;
        b.vx = 0;
        b.vy = 0;
        b.currentAngle = spots[i].r;
        b.el.style.transition = 'transform .7s cubic-bezier(0.2, 0.8, 0.25, 1)';
        b.el.style.transform = `translate3d(${b.x.toFixed(1)}px, ${b.y.toFixed(1)}px, 0px) rotate(${spots[i].r}deg) scaleX(1)`;
      });
    }

    function startFlying() {
      if (flying || RM) return;
      flying = true;
      bees.forEach(b => {
        b.el.style.transition = 'none';
      });
      loop();
    }

    function stopFlying() {
      flying = false;
      if (raf) {
        cancelAnimationFrame(raf);
        raf = null;
      }
      settle();
    }

    function loop(t: number = performance.now()) {
      if (!flying) return;
      if (!section || !card) return;

      const sr = section.getBoundingClientRect();
      const cr = card.getBoundingClientRect();
      const noGo = { // keep clear of the card's text/button
        left: cr.left - sr.left + cr.width * 0.10,
        right: cr.left - sr.left + cr.width * 0.90,
        top: cr.top - sr.top + cr.height * 0.15,
        bottom: cr.top - sr.top + cr.height * 0.85,
      };

      const tSec = t / 1000;
      bees.forEach((b, i) => {
        // Calm harmonic Lissajous drift around the card
        const s = tSec * 0.38 + b.seed;
        const spanX = sr.width * 0.40;
        const spanY = Math.min(125, sr.height * 0.20);

        // Target anchor point centered gently above each resting quadrant
        const anchorX = cr.left - sr.left + cr.width * (0.2 + 0.3 * i);
        const anchorY = cr.top - sr.top - 25;

        let gx = anchorX + Math.sin(s * 0.55) * spanX * 0.5 + Math.cos(s * 0.28) * 30;
        let gy = anchorY + Math.cos(s * 0.45) * spanY * 0.55 + Math.sin(s * 0.35) * 18;

        // Smooth repulsion if approaching card text/buttons
        if (gx > noGo.left - 15 && gx < noGo.right + 15 && gy > noGo.top - 15 && gy < noGo.bottom + 15) {
          gy = noGo.top - 32 - Math.abs(Math.sin(s * 0.6)) * 25;
        }

        // Soft viewport boundaries
        gx = Math.max(15, Math.min(sr.width - 55, gx));
        gy = Math.max(10, Math.min(sr.height - 40, gy));

        // Smooth, soft acceleration (no sudden jerks)
        b.vx += (gx - b.x) * 0.012 - b.vx * 0.085;
        b.vy += (gy - b.y) * 0.012 - b.vy * 0.085;
        b.x += b.vx;
        b.y += b.vy;

        // Smooth angle lerp (no snapping or fast jitter)
        const targetAngle = Math.atan2(b.vy, b.vx) * (180 / Math.PI) * 0.30;
        let diff = targetAngle - b.currentAngle;
        while (diff > 180) diff -= 360;
        while (diff < -180) diff += 360;
        b.currentAngle += diff * 0.08;

        // Serene wing flutter (gentle 4-5 flaps/sec)
        const flap = 0.74 + 0.26 * Math.cos(tSec * 9.5 + b.flapSeed);

        b.el.style.transform = `translate3d(${b.x.toFixed(1)}px, ${b.y.toFixed(1)}px, 0px) rotate(${b.currentAngle.toFixed(1)}deg) scaleX(${flap.toFixed(3)})`;
      });

      raf = requestAnimationFrame(loop);
    }

    settle();
    const timer1 = setTimeout(settle, 100);
    const timer2 = setTimeout(settle, 300);

    const handleResize = () => { if (!flying) settle(); };
    window.addEventListener('resize', handleResize);

    // Scroll root detection for phone mockup or native window
    const phoneScroll = document.querySelector<HTMLElement>('[data-phone-scroll="true"]');
    const isPhoneMockupActive = Boolean(
      phoneScroll &&
      phoneScroll.clientHeight > 0 &&
      typeof window !== 'undefined' &&
      window.innerWidth >= 1024
    );
    const scrollRoot = isPhoneMockupActive ? phoneScroll : null;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          startFlying();
        } else {
          stopFlying();
        }
      });
    }, {
      root: scrollRoot,
      threshold: 0.25,
    });

    observer.observe(section);

    return () => {
      observer.disconnect();
      clearTimeout(timer1);
      clearTimeout(timer2);
      window.removeEventListener('resize', handleResize);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  const handleAcceptClick = () => {
    if (isAccepted) return;

    // Trigger floating hearts animation
    if (heartsRef.current) {
      heartsRef.current.trigger();
    }

    // Save accepted state to localStorage
    try {
      localStorage.setItem(RSVP_ACCEPT_KEY, 'true');
    } catch (e) {
      console.error('Failed to save RSVP state in localStorage', e);
    }

    // Update state to thank you message
    setIsAccepted(true);

    // Callbacks
    if (onAccept) onAccept();
    if (onRSVPSubmitted) onRSVPSubmitted();
  };

  const handleDownloadCalendar = () => {
    generateICS({
      title: `${config.couple.brideName} & ${config.couple.groomName}'s Rishikesh Wedding`,
      description: `Wedding celebration of ${config.couple.brideName} & ${config.couple.groomName} at ${config.couple.venueName}, ${config.couple.venueCity}.\n\nSacred Vedic union on the banks of River Ganga.`,
      location: `${config.couple.venueName}, ${config.couple.venueCity}, ${config.couple.venueCountry}`,
      startDate: config.couple.targetTimestamp,
      endDate: '2027-11-22T13:00:00+05:30',
    });
  };

  return (
    <section id="rsvp" ref={sectionRef} className="rsvp-section py-20 px-4 max-w-xl mx-auto relative overflow-visible">
      {/* Floating Hearts Animation Layer */}
      <FloatingHearts ref={heartsRef} />

      {/* Butterfly Animation Layer */}
      <div className="bf-layer absolute inset-0 pointer-events-none overflow-visible z-30" id="bfLayer">
        <div
          ref={bf1Ref}
          id="bf1"
          className="bf absolute w-[48px] h-[48px] sm:w-[52px] sm:h-[52px] will-change-transform select-none flex items-center justify-center"
          style={{ transformOrigin: '50% 60%', filter: 'drop-shadow(0 4px 8px rgba(0,0,0,.15))' }}
        >
          <img src={bfPinkSoft} alt="" className="block max-w-full max-h-full w-auto h-auto object-contain select-none pointer-events-none" />
        </div>
        <div
          ref={bf2Ref}
          id="bf2"
          className="bf absolute w-[48px] h-[48px] sm:w-[52px] sm:h-[52px] will-change-transform select-none flex items-center justify-center"
          style={{ transformOrigin: '50% 60%', filter: 'drop-shadow(0 4px 8px rgba(0,0,0,.15))' }}
        >
          <img src={bfBlue} alt="" className="block max-w-full max-h-full w-auto h-auto object-contain select-none pointer-events-none" />
        </div>
        <div
          ref={bf3Ref}
          id="bf3"
          className="bf absolute w-[48px] h-[48px] sm:w-[52px] sm:h-[52px] will-change-transform select-none flex items-center justify-center"
          style={{ transformOrigin: '50% 60%', filter: 'drop-shadow(0 4px 8px rgba(0,0,0,.15))' }}
        >
          <img src={bfPinkSpotted} alt="" className="block max-w-full max-h-full w-auto h-auto object-contain select-none pointer-events-none" />
        </div>
      </div>

      {/* Header */}
      <RevealOnScroll>
        <div className="text-center mb-8">
          <SectionEyebrow>
            {config.rsvp.eyebrow} · {config.rsvp.deadlineText}
          </SectionEyebrow>
          <SectionHeading>Kindly Reply</SectionHeading>
          <p className="font-serif italic text-base sm:text-lg text-[#8A7F72] mt-2">
            “Your presence completes our celebration beside the sacred River Ganga.”
          </p>
        </div>
      </RevealOnScroll>

      {/* Prominent Acceptance Container */}
      <RevealOnScroll delay={100}>
        <div
          ref={cardRef}
          id="rsvpCard"
          className="rsvp-card p-8 sm:p-10 rounded-3xl bg-[#FFF9F8]/85 backdrop-blur-xs border border-[#DFC48F]/70 shadow-sm text-center flex flex-col items-center justify-center space-y-6 relative z-10"
        >
          {/* Prominent Single Acceptance Button */}
          <div className="w-full flex flex-col items-center justify-center">
            <button
              type="button"
              disabled={isAccepted}
              onClick={handleAcceptClick}
              aria-label={
                isAccepted
                  ? 'RSVP already accepted, see you at the wedding'
                  : 'Joyfully accept wedding invitation'
              }
              className={`w-full max-w-md min-h-[54px] px-8 py-4 rounded-full font-sans text-xs sm:text-sm font-semibold tracking-[0.22em] uppercase transition-all duration-500 ease-out flex items-center justify-center space-x-2.5 outline-none focus:ring-2 focus:ring-[#C6A15B] focus:ring-offset-2 select-none cursor-pointer ${
                isAccepted
                  ? 'bg-[#F3E5E2] text-[#4A4038] border border-[#DFC48F]/80 shadow-inner cursor-default opacity-95 scale-100'
                  : 'bg-gradient-to-r from-[#C6A15B] via-[#B88E4C] to-[#C6A15B] hover:from-[#B88E4C] hover:to-[#9A6B0A] text-white shadow-md hover:shadow-[0_12px_28px_-6px_rgba(198,161,91,0.45)] hover:scale-[1.03] active:scale-[0.98]'
              }`}
            >
              {isAccepted ? (
                <span className="flex items-center space-x-2 transition-opacity duration-500 animate-fade-in">
                  <CheckCircle2 size={16} className="text-[#9A6B0A] shrink-0" />
                  <span>Thank you, see you at the wedding!</span>
                </span>
              ) : (
                <span className="flex items-center space-x-2 transition-opacity duration-500">
                  <Heart size={15} className="fill-white shrink-0 animate-pulse" />
                  <span>Joyfully Accept</span>
                </span>
              )}
            </button>

            {isAccepted && (
              <p className="font-serif italic text-sm text-[#8A7F72] mt-3 animate-fade-in">
                Your acceptance has been graciously recorded.
              </p>
            )}
          </div>

          {/* Add to Calendar Option */}
          <div className="pt-2 flex justify-center border-t border-[#DFC48F]/30 w-full">
            <button
              type="button"
              onClick={handleDownloadCalendar}
              className="px-6 py-2.5 rounded-full bg-[#FAF6F0] hover:bg-[#F3EDE3] text-[#4A4038] text-[11px] font-sans font-medium tracking-wider uppercase transition-colors border border-[#DFC48F] flex items-center space-x-2 shadow-2xs cursor-pointer"
            >
              <CalendarPlus size={13} className="text-[#C6A15B]" />
              <span>Add to Calendar (.ics)</span>
            </button>
          </div>
        </div>
      </RevealOnScroll>

      <Divider />
    </section>
  );
};
