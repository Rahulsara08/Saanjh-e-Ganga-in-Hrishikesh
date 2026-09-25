import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Music } from 'lucide-react';
import { qaafiranaAudio } from '../utils/audio';
import { WeddingConfig } from '../types';

interface NavbarProps {
  config: WeddingConfig;
}

export const Navbar: React.FC<NavbarProps> = ({ config }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const unsubscribe = qaafiranaAudio.subscribe((state) => {
      setIsAudioPlaying(state.isPlaying);
    });
    return unsubscribe;
  }, []);

  const handleToggleAudio = () => {
    qaafiranaAudio.toggle();
  };

  const navLinks = [
    { label: 'Our Story', href: '#our-story' },
    { label: 'With Families', href: '#families' },
    { label: 'Nearby Sights', href: '#nearby-sights' },
    { label: 'Celebrations', href: '#journey' },
    { label: 'Blessings', href: '#wishes' },
    { label: 'RSVP', href: '#rsvp' },
    { label: 'Travel', href: '#travel' },
  ];

  const brideInitial = config.couple.brideName ? config.couple.brideName.charAt(0) : 'M';
  const groomInitial = config.couple.groomName ? config.couple.groomName.charAt(0) : 'K';

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${
        isScrolled
          ? 'bg-[#FAF2F0]/95 backdrop-blur-md shadow-[0_4px_20px_-10px_rgba(74,64,56,0.08)] py-3 border-b border-[#DFC48F]/40'
          : 'bg-[#FAF2F0]/80 backdrop-blur-sm py-4 border-b border-[#DFC48F]/20'
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between">
        {/* Left: Couple Monogram */}
        <a
          href="#"
          className="group flex items-center space-x-2 text-[#4A4038] hover:text-[#C6A15B] transition-colors"
        >
          <span className="font-serif text-xl sm:text-2xl tracking-widest font-light">
            {brideInitial}{' '}
            <span className="text-[#C6A15B] font-serif italic text-base sm:text-lg">&</span>{' '}
            {groomInitial}
          </span>
          <span className="hidden md:inline-block text-[10px] tracking-[0.25em] text-[#8A7F72] uppercase font-sans border-l border-[#DFC48F] pl-2.5">
            Rishikesh · 21 Nov 2027
          </span>
        </a>

        {/* Center: Desktop Nav Links */}
        <nav className="hidden lg:flex items-center space-x-7">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-xs uppercase tracking-[0.22em] text-[#8A7F72] hover:text-[#C6A15B] transition-colors font-medium relative group py-1"
            >
              {link.label}
              <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-[#C6A15B] transition-all duration-300 group-hover:w-full" />
            </a>
          ))}
        </nav>

        {/* Right: Qaafirana song button */}
        <div className="flex items-center space-x-2.5">
          <button
            onClick={handleToggleAudio}
            title={isAudioPlaying ? 'Pause Qaafirana' : 'Play Qaafirana · Kedarnath (Arijit Singh & Nikhita)'}
            aria-label="Toggle Qaafirana wedding song"
            className={`px-3 py-1.5 rounded-full border transition-all duration-300 flex items-center space-x-2 ${
              isAudioPlaying
                ? 'bg-[#F1D9D6] border-[#E3B9B4] text-[#4A4038] shadow-sm'
                : 'border-[#DFC48F]/70 text-[#8A7F72] hover:text-[#4A4038] hover:border-[#C6A15B] bg-[#FAF6F0]'
            }`}
          >
            {isAudioPlaying ? (
              <div className="flex items-center space-x-1.5">
                <Volume2 size={15} className="text-[#C6A15B]" />
                <div className="flex items-end space-x-0.5 h-2.5">
                  <span className="w-0.5 h-2 bg-[#C6A15B] animate-[bounce_0.8s_ease-in-out_infinite]" />
                  <span className="w-0.5 h-2.5 bg-[#C6A15B] animate-[bounce_1.1s_ease-in-out_infinite]" />
                  <span className="w-0.5 h-1.5 bg-[#C6A15B] animate-[bounce_0.7s_ease-in-out_infinite]" />
                </div>
              </div>
            ) : (
              <VolumeX size={15} />
            )}
            <span className="text-[10px] tracking-wider uppercase font-medium">
              {isAudioPlaying ? 'Qaafirana ♪' : 'Qaafirana'}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};
