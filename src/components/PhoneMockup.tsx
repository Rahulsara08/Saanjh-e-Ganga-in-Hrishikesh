import React, { useState, useEffect, useRef } from 'react';
import { WeddingConfig } from '../types';
import {
  Maximize2,
  Minimize2,
  Sparkles,
  MapPin,
  Image as ImageIcon,
  Compass
} from 'lucide-react';
import rishikeshGangaSunset from '../assets/images/rishikesh_ganga_sunset_serenity_1790240916023.jpg';
import rishikeshBestViewBg from '../assets/images/rishikesh_best_view_bg_1790236456536.jpg';
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
  const [isFullscreenMode, setIsFullscreenMode] = useState(false);
  const [activeScenery, setActiveScenery] = useState<'sunset' | 'waterfall'>('sunset');
  const [currentTime, setCurrentTime] = useState('9:41');
  const phoneScrollRef = useRef<HTMLDivElement>(null);

  // Digital clock for phone status bar
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

  // Smooth scroll anchor navigation inside phone viewport
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
  }, []);

  const currentSceneryBg = activeScenery === 'sunset' ? rishikeshGangaSunset : rishikeshBestViewBg;

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden flex flex-col justify-between selection:bg-[#F1D9D6]">
      {/* ─── 1. BREATHTAKING PC SCENERY BACKGROUND (RISHIKESH GANGES) ─── */}
      <div className="fixed inset-0 pointer-events-none -z-20 overflow-hidden">
        <img
          src={currentSceneryBg}
          alt="Breathtaking scenery of Rishikesh Uttarakhand at golden sunset"
          className="w-full h-full object-cover object-center transition-all duration-1000 scale-102"
        />
        {/* Soft atmospheric vignette & warm cinematic grading */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#18120E]/50 via-[#18120E]/20 to-[#18120E]/60 backdrop-blur-[1px]" />
        <div className="absolute inset-0 bg-radial-gradient from-transparent via-[#18120E]/30 to-[#18120E]/70" />
      </div>

      {/* ─── FLOATING GOLDEN SPARKS & MARIGOLD EMBERS ─── */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden hidden sm:block">
        <div className="absolute top-[12%] left-[10%] w-3 h-3 rounded-full bg-[#E5A855]/70 blur-[1px] animate-pulse" />
        <div className="absolute top-[28%] right-[14%] w-2 h-2 rounded-full bg-[#F4C47A]/80 blur-[0.5px] animate-ping" />
        <div className="absolute top-[50%] left-[15%] w-2.5 h-2.5 rounded-full bg-[#D48B3D]/70 blur-[1px] animate-pulse" />
        <div className="absolute top-[70%] right-[10%] w-3.5 h-3.5 rounded-full bg-[#E5A855]/60 blur-[1px] animate-bounce" />
        <div className="absolute top-[85%] left-[22%] w-2 h-2 rounded-full bg-[#F4C47A]/80 blur-[0.5px] animate-pulse" />
      </div>

      {/* ─── 2. TOP LUXURY DESKTOP HEADER BAR ─── */}
      <header className="relative z-30 w-full px-4 sm:px-8 py-3.5 hidden sm:flex items-center justify-between backdrop-blur-md bg-[#1C1510]/60 border-b border-[#DFC48F]/30 shadow-lg text-[#FAF6F0]">
        {/* Couple & Sacred Location */}
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-full bg-[#FAF6F0]/15 border border-[#DFC48F]/70 flex items-center justify-center text-[#DFC48F] text-xs font-serif font-bold shadow-inner">
            ॐ
          </div>
          <div>
            <h2 className="font-serif text-base sm:text-lg text-[#FAF6F0] tracking-wider leading-none">
              {config.couple.brideName}{' '}
              <span className="text-[#DFC48F] italic font-serif">&</span>{' '}
              {config.couple.groomName}
            </h2>
            <p className="text-[9px] font-sans tracking-[0.24em] text-[#DFC48F]/90 uppercase mt-0.5 flex items-center gap-1">
              <MapPin size={10} className="text-[#DFC48F]" />
              <span>{config.couple.venueCity}, {config.couple.venueCountry} · {config.couple.weddingDateString}</span>
            </p>
          </div>
        </div>

        {/* Desktop Controls: Scenery Toggle & Fullscreen Mode */}
        <div className="flex items-center space-x-2.5">
          {/* Switch Background Scenery */}
          <button
            onClick={() => setActiveScenery(activeScenery === 'sunset' ? 'waterfall' : 'sunset')}
            className="px-3 py-1.5 rounded-full bg-[#FAF6F0]/15 hover:bg-[#FAF6F0]/25 border border-[#DFC48F]/40 text-[#FAF6F0] text-xs font-sans tracking-wider uppercase transition-all flex items-center space-x-1.5"
            title="Toggle Rishikesh scenery background"
          >
            <ImageIcon size={13} className="text-[#DFC48F]" />
            <span className="text-[10px] font-medium hidden md:inline">
              {activeScenery === 'sunset' ? 'Sacred Ghats' : 'Ram Jhula View'}
            </span>
          </button>

          {/* Toggle Fullscreen / Phone Mockup View */}
          <button
            onClick={() => setIsFullscreenMode(!isFullscreenMode)}
            className="px-3.5 py-1.5 rounded-full bg-[#FAF6F0]/20 hover:bg-[#FAF6F0]/30 border border-[#DFC48F]/50 text-[#FAF6F0] text-xs font-sans tracking-wider uppercase transition-all flex items-center space-x-1.5 shadow-sm hover:scale-102"
            title={isFullscreenMode ? 'Switch to Phone Mockup View' : 'Switch to Fullscreen Desktop View'}
          >
            {isFullscreenMode ? (
              <>
                <Minimize2 size={13} className="text-[#DFC48F]" />
                <span className="text-[10px] font-semibold">Phone Mockup</span>
              </>
            ) : (
              <>
                <Maximize2 size={13} className="text-[#DFC48F]" />
                <span className="text-[10px] font-semibold">Full Screen</span>
              </>
            )}
          </button>
        </div>
      </header>

      {/* ─── 3. CENTER VIEWPORT: PHONE MOCKUP SCREEN (REFERENCE IMAGE 2) ─── */}
      <main className="relative flex-1 flex items-center justify-center p-0 sm:p-5 md:p-8">
        {isFullscreenMode ? (
          /* Fullscreen Desktop Expansion Mode */
          <div
            className="w-full max-w-6xl mx-auto rounded-2xl sm:rounded-3xl shadow-[0_25px_70px_rgba(0,0,0,0.5)] border border-[#DFC48F]/60 overflow-hidden my-2 sm:my-4 relative"
            style={{
              backgroundImage: `url(${paperBg})`,
              backgroundRepeat: 'repeat',
              backgroundSize: '420px auto',
              backgroundColor: '#FAF2F0',
            }}
          >
            <div className="max-h-[88vh] overflow-y-auto phone-scrollbar">
              {children}
            </div>
            <MusicPlayer className="fixed bottom-6 right-6 z-40" />
          </div>
        ) : (
          /* 📱 REALISTIC PHONE MOCKUP FRAME */
          <div className="relative flex items-center justify-center select-none w-full sm:w-auto h-full sm:h-auto">
            
            {/* Phone Hardware Side Buttons (visible on sm and up) */}
            {/* Left side: Action Button & Volume Rockers */}
            <div className="hidden sm:block absolute -left-[14px] top-[135px] w-[5px] h-[30px] bg-[#2E2822] rounded-l-sm shadow-md" />
            <div className="hidden sm:block absolute -left-[14px] top-[185px] w-[5px] h-[52px] bg-[#2E2822] rounded-l-sm shadow-md" />
            <div className="hidden sm:block absolute -left-[14px] top-[250px] w-[5px] h-[52px] bg-[#2E2822] rounded-l-sm shadow-md" />
            {/* Right side: Power / Lock Button */}
            <div className="hidden sm:block absolute -right-[14px] top-[185px] w-[5px] h-[78px] bg-[#2E2822] rounded-r-sm shadow-md" />

            {/* Phone Chassis Container */}
            <div className="w-full sm:w-[395px] md:w-[420px] h-screen sm:h-[840px] md:h-[870px] max-h-screen sm:max-h-[88vh] bg-[#161311] sm:rounded-[52px] p-0 sm:p-[10px] md:p-[12px] shadow-[0_25px_80px_-10px_rgba(0,0,0,0.8),0_0_60px_rgba(198,161,91,0.22),0_0_0_1px_rgba(255,255,255,0.12)] ring-1 ring-white/15 relative flex flex-col transition-all duration-300">
              
              {/* Speaker Earpiece micro-slit on top frame */}
              <div className="hidden sm:block absolute top-2 inset-x-0 mx-auto w-14 h-1 bg-[#0A0807] rounded-full z-50 pointer-events-none" />

              {/* Inner Phone Screen Window */}
              <div
                className="w-full h-full sm:rounded-[42px] overflow-hidden relative flex flex-col shadow-inner"
                style={{
                  backgroundImage: `url(${paperBg})`,
                  backgroundRepeat: 'repeat',
                  backgroundSize: '420px auto',
                  backgroundColor: '#FAF2F0',
                }}
              >
                {/* ── TOP PHONE STATUS BAR & DYNAMIC ISLAND ── */}
                <div className="w-full h-11 z-40 shrink-0 px-6 sm:px-7 flex items-center justify-between text-[#4A4038] font-sans text-xs relative select-none bg-[#FAF2F0]/80 backdrop-blur-sm border-b border-[#DFC48F]/20">
                  {/* Digital Clock */}
                  <span className="font-semibold tracking-tight text-[11px] text-[#4A4038]">
                    {currentTime}
                  </span>

                  {/* Dynamic Island Pill */}
                  <div className="absolute left-1/2 -translate-x-1/2 top-2 w-[100px] sm:w-[112px] h-[26px] bg-black rounded-full flex items-center justify-end pr-2.5 space-x-1.5 shadow-inner">
                    {/* Front camera reflection */}
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

                {/* ── SCROLLABLE PHONE SCREEN INVITATION CONTENT ── */}
                <div
                  ref={phoneScrollRef}
                  data-phone-scroll="true"
                  className="flex-1 w-full overflow-y-auto overflow-x-hidden phone-scrollbar scroll-smooth relative"
                >
                  {children}
                </div>

                {/* Floating Wedding Song Player inside phone frame */}
                <MusicPlayer className="fixed sm:absolute bottom-6 right-5 z-40" />

                {/* ── BOTTOM IOS HOME INDICATOR BAR ── */}
                <div className="w-full h-5 bg-[#FAF2F0]/80 backdrop-blur-xs shrink-0 flex items-center justify-center select-none pointer-events-none">
                  <div className="w-32 h-1 bg-[#4A4038]/30 rounded-full" />
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* ─── 4. BOTTOM CAPTION BAR (PC DESKTOP ONLY) ─── */}
      <footer className="relative z-20 w-full py-2.5 px-4 text-center text-[10px] sm:text-[11px] font-sans text-[#FAF6F0]/90 tracking-[0.25em] uppercase backdrop-blur-sm bg-[#18120E]/40 border-t border-[#DFC48F]/20 hidden sm:block">
        Anand Kashi by the Ganges · {config.couple.venueCity}, {config.couple.venueCountry} · {config.couple.weddingDateString}
      </footer>
    </div>
  );
};
