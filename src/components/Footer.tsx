import React from 'react';
import { SanskritSeal, MountainRidgeHairline } from './BasicComponents';
import { ArrowUp } from 'lucide-react';
import thankyouVineLeft from '../assets/images/thankyou_vine_left.png';
import thankyouVineRight from '../assets/images/thankyou_vine_right.png';
import thankyouCenterBg from '../assets/images/thankyou_center_bg.png';

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
      className="relative w-full pt-8 pb-16 px-3 sm:px-6 text-center overflow-hidden select-none bg-transparent"
    >
      {/* ── Seamless Theme Background: Text and plants sit directly on global theme background (No lines, no separate card) ── */}

      {/* ── Left Botanical Vine Border (Directly on theme background) ── */}
      <div
        aria-hidden="true"
        className="absolute left-0 top-0 bottom-4 w-[52px] xs:w-[60px] sm:w-[72px] md:w-[84px] pointer-events-none select-none z-1 overflow-hidden flex items-stretch"
      >
        <img
          src={thankyouVineLeft}
          alt=""
          className="h-full w-auto max-w-none object-contain object-left pointer-events-none select-none filter contrast-[1.02] drop-shadow-[0_1px_3px_rgba(0,0,0,0.06)]"
        />
      </div>

      {/* ── Right Botanical Vine Border (Directly on theme background) ── */}
      <div
        aria-hidden="true"
        className="absolute right-0 top-0 bottom-4 w-[52px] xs:w-[60px] sm:w-[72px] md:w-[84px] pointer-events-none select-none z-1 overflow-hidden flex justify-end items-stretch"
      >
        <img
          src={thankyouVineRight}
          alt=""
          className="h-full w-auto max-w-none object-contain object-right pointer-events-none select-none filter contrast-[1.02] drop-shadow-[0_1px_3px_rgba(0,0,0,0.06)]"
        />
      </div>

      {/* ── Center Background Couple Watercolor Artwork (Softly blended in middle) ── */}
      <div
        aria-hidden="true"
        className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-0"
      >
        <img
          src={thankyouCenterBg}
          alt=""
          className="max-h-[260px] xs:max-h-[295px] sm:max-h-[335px] max-w-[250px] xs:max-w-[285px] sm:max-w-[325px] object-contain opacity-[0.32] mix-blend-multiply translate-y-3"
        />
      </div>

      {/* Floating Botanical Leaf Accents */}
      <svg
        className="absolute left-[13%] xs:left-[15%] sm:left-[18%] top-10 w-4 h-6 text-[#8BA87C] opacity-75 pointer-events-none z-1 -rotate-12"
        viewBox="0 0 24 36"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M12 2 C18 10, 22 22, 12 34 C2 22, 6 10, 12 2 Z" opacity="0.85" />
        <path d="M12 4 L12 32" stroke="#688559" strokeWidth="0.8" opacity="0.7" />
      </svg>
      <svg
        className="absolute right-[14%] xs:right-[16%] sm:right-[19%] top-24 w-3.5 h-4.5 text-[#E5A8B8] opacity-75 pointer-events-none z-1 -rotate-30"
        viewBox="0 0 20 28"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M10 2 C16 8, 18 18, 10 26 C2 18, 4 8, 10 2 Z" />
      </svg>

      {/* ── Central Safe Area: Crisp, Clear, High-Contrast Typography for All Ages ── */}
      <div className="max-w-[340px] xs:max-w-[390px] sm:max-w-[450px] mx-auto flex flex-col items-center space-y-4 relative z-10 text-center px-1">
        {/* Auspicious Vedic Seal */}
        <div className="pt-0.5 transform hover:scale-105 transition-transform duration-500">
          <SanskritSeal size={52} />
        </div>

        {/* Eyebrow & Heading: Clean, crisp, universally legible & consuming space nicely */}
        <div className="space-y-1.5 pt-0.5">
          <span className="text-[11px] xs:text-[12px] sm:text-[13px] font-sans font-bold tracking-[0.34em] uppercase text-[#8A5A00] block">
            WITH BOUNDLESS GRATITUDE
          </span>
          <h3 className="font-serif text-[28px] xs:text-[32px] sm:text-[38px] text-[#140F0A] font-bold leading-[1.18] pt-1">
            Thank You for Blessing<br />Our Sacred Journey
          </h3>
          <p className="font-serif italic text-[15px] xs:text-[17px] sm:text-[18px] text-[#3D2E24] font-medium max-w-[320px] xs:max-w-[370px] sm:max-w-[420px] mx-auto leading-relaxed pt-2">
            “Your presence, prayers, and love along the sacred Ganga mean more to us than words can hold.”
          </p>
        </div>

        {/* Subtle Himalayan Ridge Line Accent */}
        <div className="my-0.5 w-full max-w-[200px] xs:max-w-[230px] sm:max-w-[260px] mx-auto opacity-75">
          <MountainRidgeHairline />
        </div>

        {/* Couple Names + Date/Location */}
        <div className="pt-0.5">
          <h4 className="font-serif text-[32px] xs:text-[36px] sm:text-[42px] text-[#140F0A] font-bold tracking-wide">
            Meher <span className="text-[#8A5A00] italic px-1 font-serif">&</span> Kabir
          </h4>
          <p className="text-[10px] xs:text-[11px] sm:text-[12px] font-sans tracking-[0.28em] uppercase text-[#554A40] font-bold mt-1.5">
            21 · 11 · 2027 · RISHIKESH · UTTARAKHAND
          </p>
        </div>

        {/* Return to Top Pill Button */}
        <div className="pt-2">
          <button
            type="button"
            onClick={scrollToTop}
            className="inline-flex items-center justify-center space-x-2 text-[10.5px] xs:text-[11.5px] font-sans font-bold uppercase tracking-[0.24em] text-[#3D2D20] hover:text-[#1F1710] py-3 px-8 rounded-full border border-[#DFC48F] hover:border-[#8A5A00] bg-[#FFFDFB]/95 hover:bg-white shadow-[0_3px_12px_rgba(180,130,90,0.14)] hover:shadow-[0_5px_18px_rgba(180,130,90,0.22)] transition-all hover:scale-102 active:scale-98 cursor-pointer"
            aria-label="Return to top of page"
          >
            <ArrowUp size={14} className="text-[#8A5A00] stroke-[2.5]" />
            <span>Return to Top</span>
          </button>
        </div>
      </div>
    </footer>
  );
};
