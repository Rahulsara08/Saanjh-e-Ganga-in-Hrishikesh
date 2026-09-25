import React, { useState, useEffect, useRef } from 'react';
import { WeddingConfig } from '../types';
import rishikeshGangaSunset from '../assets/images/rishikesh_ganga_sunset_serenity_1790240916023.jpg';
import paperBg from '../assets/images/paper_blush_texture.jpg';
import { MusicPlayer } from './MusicPlayer';

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
      return window.innerWidth < 768;
    }
    return false;
  });

  const [currentTime, setCurrentTime] = useState('9:41');
  const phoneScrollRef = useRef<HTMLDivElement>(null);

  // Responsive screen dimension detection
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Digital clock for phone status bar (PC mockup only)
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = now.getHours();
      const minutes = now.getMinutes().toString().padStart(2, '0');
      setCurrentTime(`${hours % 12 || 12}:${minutes}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 30000);
    return () => clearInterval(interval);
  }, []);

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
  // 1. MOBILE VIEW (< 768px): Pure native mobile display
  // NO phone frame, NO camera notch / Dynamic Island, NO status bar, NO chassis
  // ──────────────────────────────────────────────────────────────────────────
  if (isMobile) {
    return (
      <div
        className="min-h-screen w-full relative overflow-x-hidden selection:bg-[#F1D9D6]"
        style={{
          backgroundImage: `url(${paperBg})`,
          backgroundRepeat: 'repeat',
          backgroundSize: '420px auto',
          backgroundColor: '#FAF2F0',
        }}
      >
        {/* Full-bleed native mobile application */}
        <div className="w-full min-h-screen relative overflow-x-hidden">
          {children}
        </div>

        {/* Floating Wedding Song Player for native mobile */}
        <MusicPlayer className="fixed bottom-6 right-5 z-40" />
      </div>
    );
  }

  // ──────────────────────────────────────────────────────────────────────────
  // 2. PC VIEW (>= 768px): Centered Phone Mockup + Rishikesh Scenery Background
  // NO top header bar (Image 3 removed), NO bottom caption bar (clean viewport)
  // ──────────────────────────────────────────────────────────────────────────
  return (
    <div className="relative min-h-screen w-full overflow-hidden flex items-center justify-center selection:bg-[#F1D9D6]">
      {/* ─── BREATHTAKING PC SCENERY BACKGROUND (RISHIKESH GANGES) ─── */}
      <div className="fixed inset-0 pointer-events-none -z-20 overflow-hidden">
        <img
          src={rishikeshGangaSunset}
          alt="Breathtaking scenery of Rishikesh Uttarakhand at golden sunset"
          className="w-full h-full object-cover object-center scale-102"
        />
        {/* Soft atmospheric vignette & warm cinematic grading */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#18120E]/50 via-[#18120E]/25 to-[#18120E]/65 backdrop-blur-[1px]" />
        <div className="absolute inset-0 bg-radial-gradient from-transparent via-[#18120E]/30 to-[#18120E]/70" />
      </div>

      {/* Floating golden sparks & marigold embers */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-[12%] left-[10%] w-3 h-3 rounded-full bg-[#E5A855]/70 blur-[1px] animate-pulse" />
        <div className="absolute top-[28%] right-[14%] w-2 h-2 rounded-full bg-[#F4C47A]/80 blur-[0.5px] animate-ping" />
        <div className="absolute top-[50%] left-[15%] w-2.5 h-2.5 rounded-full bg-[#D48B3D]/70 blur-[1px] animate-pulse" />
        <div className="absolute top-[70%] right-[10%] w-3.5 h-3.5 rounded-full bg-[#E5A855]/60 blur-[1px] animate-bounce" />
        <div className="absolute top-[85%] left-[22%] w-2 h-2 rounded-full bg-[#F4C47A]/80 blur-[0.5px] animate-pulse" />
      </div>

      {/* ─── CENTER PHONE MOCKUP SCREEN (NO TOP/BOTTOM EXTERNAL BARS) ─── */}
      <main className="relative z-10 flex items-center justify-center p-3 sm:p-5 md:p-6 my-auto">
        <div className="relative flex items-center justify-center select-none">
          {/* Phone Hardware Side Buttons */}
          <div className="absolute -left-[13px] top-[135px] w-[5px] h-[30px] bg-[#2E2822] rounded-l-sm shadow-md" />
          <div className="absolute -left-[13px] top-[185px] w-[5px] h-[52px] bg-[#2E2822] rounded-l-sm shadow-md" />
          <div className="absolute -left-[13px] top-[250px] w-[5px] h-[52px] bg-[#2E2822] rounded-l-sm shadow-md" />
          <div className="absolute -right-[13px] top-[185px] w-[5px] h-[78px] bg-[#2E2822] rounded-r-sm shadow-md" />

          {/* Phone Chassis Container */}
          <div className="w-[390px] md:w-[412px] h-[830px] md:h-[860px] max-h-[92vh] bg-[#161311] rounded-[52px] p-[10px] md:p-[12px] shadow-[0_25px_80px_-10px_rgba(0,0,0,0.85),0_0_60px_rgba(198,161,91,0.22),0_0_0_1px_rgba(255,255,255,0.12)] ring-1 ring-white/15 relative flex flex-col transition-all duration-300">
            {/* Speaker Earpiece micro-slit on top frame */}
            <div className="absolute top-2 inset-x-0 mx-auto w-14 h-1 bg-[#0A0807] rounded-full z-50 pointer-events-none" />

            {/* Inner Phone Screen Window */}
            <div
              className="w-full h-full rounded-[42px] overflow-hidden relative flex flex-col shadow-inner"
              style={{
                backgroundImage: `url(${paperBg})`,
                backgroundRepeat: 'repeat',
                backgroundSize: '420px auto',
                backgroundColor: '#FAF2F0',
              }}
            >
              {/* ── TOP PHONE STATUS BAR & DYNAMIC ISLAND (PC MOCKUP ONLY) ── */}
              <div className="w-full h-11 z-40 shrink-0 px-6 sm:px-7 flex items-center justify-between text-[#4A4038] font-sans text-xs relative select-none bg-[#FAF2F0]/85 backdrop-blur-sm border-b border-[#DFC48F]/20">
                {/* Digital Clock */}
                <span className="font-semibold tracking-tight text-[11px] text-[#4A4038]">
                  {currentTime}
                </span>

                {/* Dynamic Island Pill (Image 2) */}
                <div className="absolute left-1/2 -translate-x-1/2 top-2 w-[104px] sm:w-[112px] h-[26px] bg-black rounded-full flex items-center justify-end pr-2.5 space-x-1.5 shadow-inner">
                  {/* Front camera lens reflection */}
                  <div className="w-2.5 h-2.5 rounded-full bg-[#1A1A24] border border-[#2E2E3E]/70 flex items-center justify-center">
                    <div className="w-1 h-1 rounded-full bg-[#121B33]" />
                  </div>
                </div>

                {/* Network 5G & Battery Icons */}
                <div className="flex items-center space-x-1.5 text-[10px]">
                  <span className="font-bold text-[9px] tracking-wider uppercase text-[#8A7F72]">5G</span>
                  <div className="w-5 h-2.5 rounded-[3px] border border-[#4A4038] p-0.5 flex items-center">
                    <div className="w-full h-full bg-[#4A4038] rounded-[1px]" />
                  </div>
                </div>
              </div>

              {/* ── SCROLLABLE PHONE SCREEN INVITATION CONTENT (MOBILE VIEW) ── */}
              <div
                ref={phoneScrollRef}
                data-phone-scroll="true"
                className="flex-1 w-full overflow-y-auto overflow-x-hidden phone-scrollbar scroll-smooth relative"
              >
                {children}
              </div>

              {/* Floating Wedding Song Player inside phone frame */}
              <MusicPlayer className="absolute bottom-6 right-5 z-40" />

              {/* ── BOTTOM IOS HOME INDICATOR BAR ── */}
              <div className="w-full h-5 bg-[#FAF2F0]/85 backdrop-blur-xs shrink-0 flex items-center justify-center select-none pointer-events-none">
                <div className="w-32 h-1 bg-[#4A4038]/30 rounded-full" />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

