import React, { useState, useEffect, useRef } from 'react';
import { WeddingConfig } from '../types';
import paperBg from '../assets/images/paper_blush_texture.jpg';
import { MusicPlayer } from './MusicPlayer';
import { OptimizedImage } from './OptimizedImage';
import { QrCode, Smartphone } from 'lucide-react';

const pcMockupBg = 'pc_mockup_backdrop_blossom';

interface PhoneMockupProps {
  config: WeddingConfig;
  children: React.ReactNode;
}

export const PhoneMockup: React.FC<PhoneMockupProps> = ({
  config,
  children,
}) => {
  const [isMobile, setIsMobile] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth < 1024;
    }
    return false;
  });

  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const phoneScrollRef = useRef<HTMLDivElement>(null);

  // Responsive screen dimension detection (< 1024px = native full screen, >= 1024px = PC mockup)
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Check prefers-reduced-motion
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      setPrefersReducedMotion(mediaQuery.matches);
      const listener = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
      mediaQuery.addEventListener('change', listener);
      return () => mediaQuery.removeEventListener('change', listener);
    }
  }, []);

  // Gentle mouse-move parallax on leaf background (PC desktop mode)
  useEffect(() => {
    if (isMobile || prefersReducedMotion) return;

    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      const xPct = e.clientX / innerWidth - 0.5;
      const yPct = e.clientY / innerHeight - 0.5;
      setMouseOffset({
        x: xPct * 12, // max 6px translate
        y: yPct * 12,
      });
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [isMobile, prefersReducedMotion]);

  // Smooth scroll anchor navigation inside phone viewport (PC mockup)
  useEffect(() => {
    const container = phoneScrollRef.current;
    if (!container) return;

    const handleAnchorClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest('a');
      if (!target) return;
      const href = target.getAttribute('href');
      if (href && href.startsWith('#') && href.length > 1) {
        const targetEl = container.querySelector(href) || document.querySelector(href);
        if (targetEl) {
          e.preventDefault();
          targetEl.scrollIntoView({ behavior: 'smooth' });
        }
      }
    };

    container.addEventListener('click', handleAnchorClick);
    return () => container.removeEventListener('click', handleAnchorClick);
  }, [isMobile]);

  // ──────────────────────────────────────────────────────────────────────────
  // 1. MOBILE & TABLET VIEW (< 1024px): Pure native mobile display
  // NO phone frame, NO camera notch / Dynamic Island, NO status bar, NO chassis
  // ──────────────────────────────────────────────────────────────────────────
  if (isMobile) {
    return (
      <div className="min-h-screen w-full relative overflow-x-hidden selection:bg-[#F1D9D6] bg-[#FAF2F0]">
        {/* Fixed paper texture background layer (does NOT move while scrolling) */}
        <div
          className="fixed inset-0 pointer-events-none z-0"
          style={{
            backgroundImage: `url(${paperBg})`,
            backgroundRepeat: 'repeat',
            backgroundSize: '420px auto',
            backgroundColor: '#FAF2F0',
          }}
        />

        {/* Full-bleed native mobile application */}
        <div className="w-full min-h-screen relative overflow-x-hidden z-10">
          {children}
        </div>

        {/* Floating Wedding Song Player for native mobile */}
        <MusicPlayer className="fixed bottom-6 right-5 z-40" />
      </div>
    );
  }

  // ──────────────────────────────────────────────────────────────────────────
  // 2. PC VIEW (>= 1024px): Centered Phone Mockup + Soft Leaves Backdrop
  // ──────────────────────────────────────────────────────────────────────────
  return (
    <div className="relative min-h-screen w-full overflow-hidden flex items-center justify-center selection:bg-[#F1D9D6] bg-[#FAF2F0]">
      {/* ─── SOFT BLUSH-PINK LEAVES BACKGROUND WITH GENTLE PARALLAX ─── */}
      <div
        className="fixed inset-0 pointer-events-none -z-20 overflow-hidden transition-transform duration-300 ease-out"
        style={{
          transform: `translate3d(${mouseOffset.x}px, ${mouseOffset.y}px, 0) scale(1.02)`,
        }}
      >
        <OptimizedImage
          src={pcMockupBg}
          alt="Soft blush pink leaves background"
          priority={true}
          disableAspectRatio={true}
          sizes="100vw"
          className="w-full h-full"
          imgClassName="object-cover object-center"
        />
        {/* Very light cream overlay for contrast */}
        <div className="absolute inset-0 bg-[#FAF2F0]/25 backdrop-blur-[0.5px]" />
      </div>

      {/* ─── CENTER PHONE MOCKUP SCREEN ─── */}
      <main className="relative z-10 flex items-center justify-center p-3 sm:p-5 md:p-6 my-auto">
        <div className="relative flex items-center justify-center select-none">
          {/* Soft ambient glow behind phone chassis */}
          <div className="absolute inset-0 rounded-[54px] bg-[#C6A15B]/20 blur-2xl transform scale-95 pointer-events-none" />

          {/* Phone Chassis Container */}
          <div className="w-[390px] md:w-[412px] h-[830px] md:h-[860px] max-h-[92vh] bg-[#161311] rounded-[52px] p-[10px] md:p-[12px] shadow-[0_25px_80px_-10px_rgba(0,0,0,0.85),0_0_50px_rgba(198,161,91,0.25),0_0_0_1px_rgba(255,255,255,0.12)] ring-1 ring-white/15 relative flex flex-col transition-all duration-300">
            {/* ── HARDWARE SIDE BUTTONS (FLUSH WITH CHASSIS) ── */}
            {/* Left Side: Mute Switch */}
            <div className="absolute -left-[5px] top-[115px] w-[5px] h-[26px] bg-gradient-to-r from-[#3A322B] via-[#241E1A] to-[#120F0D] rounded-l-md shadow-md border-l border-white/20 z-10" />
            {/* Left Side: Volume Up Button */}
            <div className="absolute -left-[5px] top-[154px] w-[5px] h-[50px] bg-gradient-to-r from-[#3A322B] via-[#241E1A] to-[#120F0D] rounded-l-md shadow-md border-l border-white/20 z-10" />
            {/* Left Side: Volume Down Button */}
            <div className="absolute -left-[5px] top-[216px] w-[5px] h-[50px] bg-gradient-to-r from-[#3A322B] via-[#241E1A] to-[#120F0D] rounded-l-md shadow-md border-l border-white/20 z-10" />
            {/* Right Side: Power / Lock Button */}
            <div className="absolute -right-[5px] top-[170px] w-[5px] h-[75px] bg-gradient-to-l from-[#3A322B] via-[#241E1A] to-[#120F0D] rounded-r-md shadow-md border-r border-white/20 z-10" />

            {/* Speaker Earpiece micro-slit on top frame */}
            <div className="absolute top-2 inset-x-0 mx-auto w-14 h-1 bg-[#0A0807] rounded-full z-50 pointer-events-none" />

            {/* Inner Phone Screen Window */}
            <div className="w-full h-full rounded-[42px] overflow-hidden relative flex flex-col shadow-inner bg-[#FAF2F0]">
              {/* Fixed paper texture background layer inside phone window */}
              <div
                className="absolute inset-0 pointer-events-none z-0"
                style={{
                  backgroundImage: `url(${paperBg})`,
                  backgroundRepeat: 'repeat',
                  backgroundSize: '420px auto',
                  backgroundColor: '#FAF2F0',
                }}
              />

              {/* ── FLOATING SLEEK DYNAMIC ISLAND ── */}
              <div className="absolute left-1/2 -translate-x-1/2 top-2.5 z-50 w-[96px] sm:w-[104px] h-[24px] bg-black rounded-full flex items-center justify-end pr-2 space-x-1.5 shadow-md pointer-events-none">
                {/* Front camera lens reflection */}
                <div className="w-2.5 h-2.5 rounded-full bg-[#1A1A24] border border-[#2E2E3E]/70 flex items-center justify-center">
                  <div className="w-1 h-1 rounded-full bg-[#121B33]" />
                </div>
              </div>

              {/* ── SCROLLABLE PHONE SCREEN INVITATION CONTENT ── */}
              <div
                ref={phoneScrollRef}
                data-phone-scroll="true"
                className="flex-1 w-full overflow-y-auto overflow-x-hidden phone-scrollbar scroll-smooth relative z-10"
              >
                {children}
              </div>

              {/* Floating Wedding Song Player inside phone frame */}
              <MusicPlayer className="absolute bottom-6 right-5 z-40" />

              {/* ── BOTTOM IOS HOME INDICATOR BAR ── */}
              <div className="w-full h-4 bg-[#FAF2F0]/85 backdrop-blur-xs shrink-0 flex items-center justify-center select-none pointer-events-none z-30">
                <div className="w-32 h-1 bg-[#4A4038]/30 rounded-full" />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

