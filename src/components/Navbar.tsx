import React, { useState, useEffect } from 'react';
import { WeddingConfig } from '../types';
import { Menu, X, Sparkles } from 'lucide-react';

interface NavbarProps {
  config: WeddingConfig;
}

export const Navbar: React.FC<NavbarProps> = ({ config }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Our Story', href: '#our-story' },
    { label: 'With Families', href: '#families' },
    { label: 'Nearby Sights', href: '#nearby-sights' },
    { label: 'Celebrations', href: '#journey' },
    { label: 'Blessings Wall', href: '#wishes' },
    { label: 'RSVP', href: '#rsvp' },
    { label: 'Travel & Stay', href: '#travel' },
  ];

  const brideInitial = config.couple.brideName ? config.couple.brideName.charAt(0) : 'M';
  const groomInitial = config.couple.groomName ? config.couple.groomName.charAt(0) : 'K';

  const handleLinkClick = (href: string) => {
    setIsMenuOpen(false);
    // Smooth scroll inside phone container or window
    const phoneContainer = document.querySelector('[data-phone-scroll="true"]');
    const targetEl = document.querySelector(href);
    if (targetEl) {
      if (phoneContainer) {
        targetEl.scrollIntoView({ behavior: 'smooth' });
      } else {
        targetEl.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <header
      className={`sticky top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#FAF2F0]/95 backdrop-blur-md shadow-[0_4px_16px_rgba(74,64,56,0.08)] py-2.5 border-b border-[#DFC48F]/40'
          : 'bg-[#FAF2F0]/85 backdrop-blur-sm py-3 border-b border-[#DFC48F]/20'
      }`}
    >
      <div className="w-full px-4 flex items-center justify-between">
        {/* Left: Couple Monogram & Sacred City */}
        <a
          href="#hero"
          onClick={() => setIsMenuOpen(false)}
          className="group flex items-center space-x-2 text-[#4A4038] hover:text-[#C6A15B] transition-colors select-none"
        >
          <span className="font-serif text-lg tracking-widest font-light">
            {brideInitial}{' '}
            <span className="text-[#C6A15B] font-serif italic text-base">&</span>{' '}
            {groomInitial}
          </span>
          <span className="text-[9px] tracking-[0.22em] text-[#8A7F72] uppercase font-sans border-l border-[#DFC48F]/70 pl-2">
            Rishikesh · 2027
          </span>
        </a>

        {/* Right: Mobile Hamburger / Close Button */}
        <button
          type="button"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
          className="px-2.5 py-1.5 rounded-full bg-[#FFF8F7] hover:bg-[#F5EBE8] border border-[#DFC48F]/70 text-[#4A4038] flex items-center space-x-1.5 transition-colors shadow-2xs select-none"
        >
          <span className="text-[10px] uppercase tracking-widest font-sans font-semibold text-[#8A7F72]">
            {isMenuOpen ? 'Close' : 'Menu'}
          </span>
          {isMenuOpen ? (
            <X size={14} className="text-[#C6A15B]" />
          ) : (
            <Menu size={14} className="text-[#C6A15B]" />
          )}
        </button>
      </div>

      {/* ── Mobile Navigation Dropdown Menu ── */}
      {isMenuOpen && (
        <div className="w-full bg-[#FAF2F0]/98 backdrop-blur-md border-b border-[#DFC48F]/50 px-5 py-4 transition-all duration-300 shadow-md">
          <div className="space-y-1">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => {
                  e.preventDefault();
                  handleLinkClick(link.href);
                }}
                className="flex items-center justify-between py-2 px-3 rounded-xl hover:bg-[#FFF8F7] text-xs uppercase tracking-[0.2em] text-[#4A4038] hover:text-[#C6A15B] font-medium transition-colors group"
              >
                <span>{link.label}</span>
                <span className="text-[#DFC48F] opacity-0 group-hover:opacity-100 transition-opacity">
                  ✦
                </span>
              </a>
            ))}
          </div>
          <div className="pt-3 mt-2 border-t border-[#DFC48F]/30 text-center">
            <p className="text-[9px] font-sans tracking-[0.25em] uppercase text-[#8A7F72]">
              Saanjh-e-Ganga · Anand Kashi
            </p>
          </div>
        </div>
      )}
    </header>
  );
};

