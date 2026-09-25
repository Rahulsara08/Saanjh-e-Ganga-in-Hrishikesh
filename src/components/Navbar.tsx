import React, { useState, useEffect } from 'react';
import { WeddingConfig } from '../types';

interface NavbarProps {
  config: WeddingConfig;
}

export const Navbar: React.FC<NavbarProps> = ({ config }) => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const brideInitial = config.couple.brideName ? config.couple.brideName.charAt(0) : 'M';
  const groomInitial = config.couple.groomName ? config.couple.groomName.charAt(0) : 'K';

  return (
    <header
      className={`sticky top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#FAF2F0]/95 backdrop-blur-md shadow-[0_4px_16px_rgba(74,64,56,0.08)] py-2 border-b border-[#DFC48F]/40'
          : 'bg-[#FAF2F0]/85 backdrop-blur-sm py-2.5 border-b border-[#DFC48F]/20'
      }`}
    >
      <div className="w-full px-4 flex items-center justify-center text-center">
        <a
          href="#hero"
          className="group flex items-center space-x-2 text-[#4A4038] hover:text-[#C6A15B] transition-colors select-none"
        >
          <span className="font-serif text-lg tracking-widest font-light">
            {brideInitial}{' '}
            <span className="text-[#C6A15B] font-serif italic text-base">&</span>{' '}
            {groomInitial}
          </span>
          <span className="text-[9px] tracking-[0.22em] text-[#8A7F72] uppercase font-sans border-l border-[#DFC48F]/70 pl-2.5">
            Rishikesh · 21 Nov 2027
          </span>
        </a>
      </div>
    </header>
  );
};


