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
    <footer className="pt-10 pb-12 px-3 sm:px-4 border-t border-[#DFC48F]/40 bg-gradient-to-b from-transparent to-[#F1D9D6]/35 text-center relative overflow-hidden">
      {/* ── Continuous Left Floral Border: Big, prominent watercolor vines along left edge ── */}
      <div
        aria-hidden="true"
        className="absolute left-0 top-2 bottom-2 w-14 xs:w-16 sm:w-20 md:w-24 pointer-events-none select-none z-1 flex items-stretch overflow-hidden"
      >
        <img
          src={thankyouVineLeft}
          alt=""
          className="h-full w-full object-fill object-left opacity-100"
        />
      </div>

      {/* ── Continuous Right Floral Border: Big, prominent watercolor vines along right edge ── */}
      <div
        aria-hidden="true"
        className="absolute right-0 top-2 bottom-2 w-14 xs:w-16 sm:w-20 md:w-24 pointer-events-none select-none z-1 flex items-stretch overflow-hidden"
      >
        <img
          src={thankyouVineRight}
          alt=""
          className="h-full w-full object-fill object-right opacity-100"
        />
      </div>

      {/* ── Center Background Couple Watercolor Artwork (Softly blended in the middle) ── */}
      <div
        aria-hidden="true"
        className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-0"
      >
        <img
          src={thankyouCenterBg}
          alt=""
          className="max-h-[68%] max-w-[180px] xs:max-w-[210px] sm:max-w-[240px] object-contain opacity-[0.32] mix-blend-multiply"
        />
      </div>

      {/* ── Central Safe Area: Perfectly fitted between the left and right border plants ── */}
      <div className="max-w-[235px] xs:max-w-[265px] sm:max-w-[310px] mx-auto flex flex-col items-center space-y-3.5 relative z-10 text-center px-1">
        {/* Top Auspicious Seal + Shubh Vivah */}
        <SanskritSeal size={50} />

        {/* Heading & Eyebrow */}
        <div className="space-y-1.5 pt-0.5">
          <span className="text-[10px] xs:text-[10.5px] font-sans font-semibold tracking-[0.28em] uppercase text-[#B88E4C] block">
            WITH BOUNDLESS GRATITUDE
          </span>
          <h3 className="font-serif text-2xl xs:text-[25px] sm:text-3xl text-[#241A12] font-normal leading-snug drop-shadow-2xs">
            Thank You for Blessing Our Journey
          </h3>
          <p className="font-serif italic text-xs xs:text-[13.5px] sm:text-[15px] text-[#382C22] font-normal max-w-[230px] xs:max-w-[250px] mx-auto leading-relaxed pt-0.5">
            “Your presence, prayers, and love along the sacred Ganga mean more to us than words can hold.”
          </p>
        </div>

        {/* Mountain Ridge & Moon Line */}
        <div className="my-0.5 w-full max-w-[180px] sm:max-w-[210px] mx-auto opacity-80">
          <MountainRidgeHairline />
        </div>

        {/* Couple Names */}
        <div>
          <h4 className="font-serif text-2xl xs:text-[26px] sm:text-3xl text-[#241A12] font-normal tracking-wide">
            Meher <span className="text-[#C6A15B] italic font-serif px-1">&</span> Kabir
          </h4>
          <p className="text-[9px] xs:text-[10px] font-sans tracking-[0.24em] uppercase text-[#5C4F44] font-semibold mt-1">
            21 · 11 · 2027 · Rishikesh · Uttarakhand
          </p>
        </div>

        {/* Return to Top Button */}
        <div className="pt-1.5">
          <button
            type="button"
            onClick={scrollToTop}
            className="inline-flex items-center space-x-1.5 text-[10px] xs:text-[10.5px] font-sans font-semibold uppercase tracking-[0.2em] text-[#3D3228] hover:text-[#1F1710] py-2 px-5 rounded-full border border-[#DFC48F]/90 hover:border-[#C6A15B] bg-[#FFFBF7]/95 hover:bg-white shadow-2xs transition-all hover:scale-102 active:scale-98 cursor-pointer"
          >
            <ArrowUp size={12} className="text-[#B88E4C]" />
            <span>Return to Top</span>
          </button>
        </div>
      </div>
    </footer>
  );
};
