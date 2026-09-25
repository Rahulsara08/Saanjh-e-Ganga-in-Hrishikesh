import React from 'react';
import { SanskritSeal, MountainRidgeHairline } from './BasicComponents';
import { ArrowUp, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="py-20 px-4 border-t border-[#DFC48F]/40 bg-gradient-to-b from-transparent to-[#F1D9D6]/35 text-center relative overflow-hidden">
      <div className="max-w-2xl mx-auto flex flex-col items-center space-y-6">
        <SanskritSeal size={54} />

        <div className="space-y-3 pt-2">
          <span className="text-[10px] font-sans font-semibold tracking-[0.35em] uppercase text-[#C6A15B] block">
            WITH BOUNDLESS GRATITUDE
          </span>
          <h3 className="font-serif text-3xl sm:text-4xl text-[#4A4038] font-light">
            Thank You for Blessing Our Journey
          </h3>
          <p className="font-serif italic text-base sm:text-lg text-[#8A7F72] font-light max-w-lg mx-auto leading-relaxed">
            “Your presence, cherished prayers, and love along the sacred banks of River Ganga mean more to us than words can ever hold. Thank you for traveling across mountains and rivers to celebrate with us.”
          </p>
        </div>

        <div className="my-2 w-full max-w-xs mx-auto">
          <MountainRidgeHairline />
        </div>

        <div>
          <h4 className="font-serif text-2xl sm:text-3xl text-[#4A4038] font-normal tracking-wide">
            Meher <span className="text-[#C6A15B] italic font-serif">&</span> Kabir
          </h4>
          <p className="text-[11px] font-sans tracking-[0.3em] uppercase text-[#8A7F72] font-medium mt-1">
            21 · 11 · 2027 · Rishikesh · Uttarakhand
          </p>
        </div>

        <div className="pt-2">
          <button
            type="button"
            onClick={scrollToTop}
            className="inline-flex items-center space-x-2 text-[10px] uppercase tracking-[0.2em] text-[#8A7F72] hover:text-[#C6A15B] transition-colors py-2 px-5 rounded-full border border-[#DFC48F] hover:border-[#C6A15B] bg-[#FAF6F0] shadow-2xs"
          >
            <ArrowUp size={12} className="text-[#C6A15B]" />
            <span>Return to Top</span>
          </button>
        </div>

        <p className="text-[9px] text-[#8A7F72]/80 font-sans tracking-widest uppercase pt-2 flex items-center justify-center space-x-1">
          <span>Handcrafted with</span>
          <Heart size={10} className="fill-[#C6A15B] text-[#C6A15B]" />
          <span>for our beloved family & friends</span>
        </p>
      </div>
    </footer>
  );
};
