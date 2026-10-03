import React from 'react';
import { SanskritSeal, MountainRidgeHairline } from './BasicComponents';
import { ArrowUp, Sparkles } from 'lucide-react';
import thankyouVineLeft from '../assets/images/thankyou_vine_left.png';
import thankyouVineRight from '../assets/images/thankyou_vine_right.png';
import thankyouCenterBg from '../assets/images/thankyou_center_bg.png';
import paperBlushTexture from '../assets/images/paper_blush_texture.jpg';

export const Footer: React.FC = () => {
  const scrollToTop = () => {
    const phoneContainer = document.querySelector('[data-phone-scroll="true"]');
    if (phoneContainer) {
      phoneContainer.scrollTo({ top: 0, behavior: 'smooth' });
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer
      className="relative w-full pt-11 pb-16 px-3 sm:px-6 text-center overflow-hidden border-t border-[#DFC48F]/50 select-none"
      style={{
        backgroundColor: '#FAF2F0',
      }}
    >
      {/* ── 1. Enhanced Handcrafted Blush Paper Background Texture ── */}
      <div
        className="absolute inset-0 pointer-events-none z-0 opacity-40 mix-blend-multiply"
        style={{
          backgroundImage: `url(${paperBlushTexture})`,
          backgroundRepeat: 'repeat',
          backgroundSize: '400px auto',
        }}
      />

      {/* Subtle organic watercolor wash & soft deckled edge vignette */}
      <div
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          background:
            'radial-gradient(ellipse 90% 85% at 50% 48%, rgba(255, 252, 250, 0.85) 0%, rgba(250, 240, 238, 0.65) 55%, rgba(245, 226, 229, 0.88) 100%)',
          boxShadow: 'inset 0 0 50px rgba(220, 175, 185, 0.25)',
        }}
      />

      {/* ── 2. Complete Left Botanical Vine Border (Hugging left edge from top to bottom) ── */}
      <div
        aria-hidden="true"
        className="absolute left-0 top-3 bottom-4 w-[52px] xs:w-[60px] sm:w-[72px] md:w-[84px] pointer-events-none select-none z-1 overflow-hidden flex items-stretch"
      >
        <img
          src={thankyouVineLeft}
          alt=""
          className="h-full w-auto max-w-none object-contain object-left pointer-events-none select-none filter contrast-[1.02] drop-shadow-[0_1px_3px_rgba(0,0,0,0.06)]"
        />
      </div>

      {/* ── 3. Complete Right Botanical Vine Border (Hugging right edge from top to bottom) ── */}
      <div
        aria-hidden="true"
        className="absolute right-0 top-3 bottom-4 w-[52px] xs:w-[60px] sm:w-[72px] md:w-[84px] pointer-events-none select-none z-1 overflow-hidden flex justify-end items-stretch"
      >
        <img
          src={thankyouVineRight}
          alt=""
          className="h-full w-auto max-w-none object-contain object-right pointer-events-none select-none filter contrast-[1.02] drop-shadow-[0_1px_3px_rgba(0,0,0,0.06)]"
        />
      </div>

      {/* ── 4. Center Background Couple Watercolor Artwork (Softly blended in the middle) ── */}
      <div
        aria-hidden="true"
        className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-0"
      >
        <img
          src={thankyouCenterBg}
          alt=""
          className="max-h-[220px] xs:max-h-[245px] sm:max-h-[275px] max-w-[210px] xs:max-w-[235px] sm:max-w-[265px] object-contain opacity-[0.36] mix-blend-multiply translate-y-3"
        />
      </div>

      {/* ── 5. Sparkling Gold Micro-Accents ── */}
      <div className="absolute left-[24%] top-16 text-[#C6A15B]/50 animate-pulse pointer-events-none z-1">
        <Sparkles size={14} />
      </div>
      <div className="absolute right-[24%] top-20 text-[#DFC48F]/60 animate-pulse delay-500 pointer-events-none z-1">
        <Sparkles size={12} />
      </div>
      <div className="absolute right-[28%] bottom-32 text-[#C6A15B]/40 animate-pulse delay-700 pointer-events-none z-1">
        <Sparkles size={13} />
      </div>
      <div className="absolute left-[26%] bottom-36 text-[#DFC48F]/50 animate-pulse delay-300 pointer-events-none z-1">
        <Sparkles size={11} />
      </div>

      {/* Floating Botanical Details */}
      <svg
        className="absolute left-[16%] xs:left-[18%] sm:left-[21%] top-14 w-4 h-6 text-[#8BA87C] opacity-75 pointer-events-none z-1 -rotate-12"
        viewBox="0 0 24 36"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M12 2 C18 10, 22 22, 12 34 C2 22, 6 10, 12 2 Z" opacity="0.85" />
        <path d="M12 4 L12 32" stroke="#688559" strokeWidth="0.8" opacity="0.7" />
      </svg>
      <svg
        className="absolute right-[20%] xs:right-[22%] sm:right-[24%] top-32 w-3.5 h-4.5 text-[#E5A8B8] opacity-75 pointer-events-none z-1 -rotate-30"
        viewBox="0 0 20 28"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M10 2 C16 8, 18 18, 10 26 C2 18, 4 8, 10 2 Z" />
      </svg>
      <svg
        className="absolute left-[15%] xs:left-[17%] sm:left-[20%] bottom-28 w-3 h-4 text-[#E8B2BF] opacity-70 pointer-events-none z-1 rotate-25"
        viewBox="0 0 20 28"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M10 2 C16 8, 18 18, 10 26 C2 18, 4 8, 10 2 Z" />
      </svg>

      {/* ── 6. Central Safe Area: Luxurious Cursive & Editorial Typography ── */}
      <div className="max-w-[280px] xs:max-w-[310px] sm:max-w-[360px] mx-auto flex flex-col items-center space-y-3 xs:space-y-3.5 relative z-10 text-center px-1">
        {/* Auspicious Vedic Seal + Shubh Vivah */}
        <div className="pt-0.5 transform hover:scale-105 transition-transform duration-500">
          <SanskritSeal size={50} />
        </div>

        {/* Eyebrow with High-Contrast Cursive Script */}
        <div className="space-y-1 pt-0.5">
          <span className="font-cursive text-2xl xs:text-3xl text-[#9A6B0A] block leading-none font-normal">
            With Boundless Gratitude
          </span>
          <span className="text-[9.5px] xs:text-[10px] font-sans font-bold tracking-[0.32em] uppercase text-[#B88E4C] block drop-shadow-2xs">
            A PRAYER OF THANKS
          </span>
          <h3 className="font-serif text-[26px] xs:text-[28px] sm:text-[33px] text-[#22160E] font-normal leading-[1.2] tracking-wide pt-1">
            Thank You for Blessing<br />Our Sacred Journey
          </h3>
          {/* Heartfelt couple blessing quote in elegant cursive */}
          <p className="font-cursive text-xl xs:text-[22px] sm:text-[24px] text-[#3D2E24] font-normal max-w-[260px] xs:max-w-[290px] mx-auto leading-[1.5] tracking-wide pt-2">
            “Your presence, prayers, and love along the sacred Ganga mean more to us than words can hold.”
          </p>
        </div>

        {/* Subtle Himalayan Ridge Line Accent */}
        <div className="my-0.5 w-full max-w-[170px] xs:max-w-[190px] sm:max-w-[220px] mx-auto opacity-75">
          <MountainRidgeHairline />
        </div>

        {/* Couple Names in Luxurious High-Contrast Cursive Typography */}
        <div className="pt-0.5">
          <h4 className="font-cursive text-[36px] xs:text-[40px] sm:text-[44px] text-[#22160E] font-normal leading-tight">
            Meher <span className="text-[#C6A15B] px-1 text-[32px] xs:text-[36px]">&</span> Kabir
          </h4>
          <p className="text-[9.5px] xs:text-[10px] sm:text-[10.5px] font-sans tracking-[0.26em] uppercase text-[#6B5A4D] font-bold mt-1">
            21 · 11 · 2027 · RISHIKESH · UTTARAKHAND
          </p>
        </div>

        {/* Return to Top Pill Button */}
        <div className="pt-2">
          <button
            type="button"
            onClick={scrollToTop}
            className="inline-flex items-center justify-center space-x-2 text-[10px] xs:text-[10.5px] font-sans font-bold uppercase tracking-[0.22em] text-[#3D2D20] hover:text-[#1F1710] py-2.5 px-6 rounded-full border border-[#DFC48F] hover:border-[#C6A15B] bg-[#FFFDFB]/95 hover:bg-white shadow-[0_3px_12px_rgba(180,130,90,0.14)] hover:shadow-[0_5px_18px_rgba(180,130,90,0.22)] transition-all hover:scale-102 active:scale-98 cursor-pointer"
            aria-label="Return to top of page"
          >
            <ArrowUp size={13} className="text-[#A87B38] stroke-[2.5]" />
            <span>Return to Top</span>
          </button>
        </div>
      </div>
    </footer>
  );
};
