import React, { useState, useEffect } from 'react';
import { GangaDiya } from './BasicComponents';
import { WeddingConfig } from '../types';
import { Calendar, ChevronDown } from 'lucide-react';
import rishikeshMandapBg from '../assets/images/rishikesh_mandap_watercolor_1790240774713.jpg';

interface HeroProps {
  config: WeddingConfig;
  guestGreeting: string;
}

export const Hero: React.FC<HeroProps> = ({ config, guestGreeting }) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const target = new Date(config.couple.targetTimestamp).getTime();

    const updateTimer = () => {
      const now = new Date().getTime();
      const difference = target - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [config.couple.targetTimestamp]);

  return (
    <section className="relative min-h-[100dvh] flex flex-col items-center justify-between text-center overflow-hidden py-8 px-3">
      {/* ── Background Image: Sacred Rishikesh Mandap Watercolor Artwork with Seamless Feathering ── */}
      <div
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          maskImage: 'linear-gradient(to bottom, black 0%, black 50%, rgba(0,0,0,0.85) 65%, rgba(0,0,0,0.3) 82%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to bottom, black 0%, black 50%, rgba(0,0,0,0.85) 65%, rgba(0,0,0,0.3) 82%, transparent 100%)',
        }}
      >
        <img
          src={rishikeshMandapBg}
          alt="Rishikesh Ganga Mandap Watercolor"
          className="w-full h-full object-cover object-top sm:object-center"
        />
        {/* Soft luminous radial vignette to make text crystal clear without any card */}
        <div
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse 75% 70% at 50% 42%, rgba(255, 252, 250, 0.78) 0%, rgba(250, 242, 240, 0.55) 55%, rgba(250, 242, 240, 0.1) 100%)',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#FAF2F0]/70 via-transparent to-transparent" />
      </div>

      {/* Progressive theme background blur feathering into the blush paper texture */}
      <div
        className="absolute bottom-0 inset-x-0 h-44 sm:h-64 pointer-events-none z-0 backdrop-blur-[6px]"
        style={{
          maskImage: 'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.25) 25%, rgba(0,0,0,0.8) 65%, black 100%)',
          WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.25) 25%, rgba(0,0,0,0.8) 65%, black 100%)',
        }}
      />

      {/* ── Center Content: Directly on background without any card (High Contrast & Clear) ── */}
      <div className="relative z-10 w-full max-w-3xl mx-auto px-4 flex flex-col items-center my-auto">
        {/* Guest Salutation */}
        <div className="inline-flex items-center space-x-1.5 px-3.5 py-1 rounded-full bg-[#FFF8F7]/95 backdrop-blur-xs border border-[#8A5A00]/80 text-[#6B4200] text-[10px] font-sans font-bold tracking-[0.25em] uppercase mb-2 shadow-2xs">
          <span className="text-[9px]">✦</span>
          <span>{guestGreeting || 'DEAR GUEST,'}</span>
          <span className="text-[9px]">✦</span>
        </div>

        {/* Save the date cursive - Deep, Rich, High-Contrast Royal Gold */}
        <p className="font-serif italic text-2xl xs:text-3xl text-[#7A4F00] font-bold tracking-wide my-0.5 leading-tight drop-shadow-sm">
          save the date
        </p>

        {/* Couple Names - Elegant, Majestic Serif Ink (Balanced Mobile Scale matching Image 4) */}
        <h1 className="font-serif text-3xl xs:text-4xl sm:text-[42px] font-black text-[#0A0705] tracking-tight uppercase leading-[1.1] mt-1 mb-1.5 drop-shadow-[0_2px_10px_rgba(255,255,255,0.95)]">
          {config.couple.brideName}{' '}
          <span className="font-serif italic text-2xl xs:text-3xl text-[#8A5A00] font-bold lowercase">
            &
          </span>{' '}
          {config.couple.groomName}
        </h1>

        {/* Invitation Sentence - High Clarity */}
        <p className="font-serif italic text-xs xs:text-sm text-[#1A1108] font-bold my-1.5 max-w-xs leading-relaxed drop-shadow-[0_1px_6px_rgba(255,255,255,0.95)]">
          are getting married along the sacred flowing waters of River Ganga
        </p>

        {/* Gold Framed Date Ribbon */}
        <div className="w-full max-w-xs flex items-center justify-center my-2 space-x-2.5">
          <div className="h-[1.5px] flex-1 bg-[#8A5A00]" />
          <span className="px-3 py-0.5 text-xs xs:text-sm font-serif tracking-[0.22em] text-[#6B4200] uppercase font-black drop-shadow-[0_1px_4px_rgba(255,255,255,1)]">
            {config.couple.weddingDateString}
          </span>
          <div className="h-[1.5px] flex-1 bg-[#8A5A00]" />
        </div>

        {/* Venue Name - Solid & Clear */}
        <p className="text-base xs:text-lg font-serif text-[#0A0705] tracking-wide mt-0.5 font-extrabold drop-shadow-[0_1px_6px_rgba(255,255,255,1)]">
          {config.couple.venueName}
        </p>

        {/* Venue City & Country - Crisp Uppercase */}
        <p className="text-[10px] xs:text-[11px] font-sans text-[#20150C] tracking-[0.25em] uppercase mt-0.5 font-bold drop-shadow-[0_1px_4px_rgba(255,255,255,1)]">
          {config.couple.venueCity}, {config.couple.venueCountry}
        </p>

        {/* Ganga Diya Accent */}
        <div className="my-2 flex justify-center scale-85">
          <GangaDiya size={30} />
        </div>

        {/* Minimalist Countdown Timer */}
        <div className="mb-2.5 w-full max-w-[280px] mx-auto">
          <div className="grid grid-cols-4 gap-1.5 bg-[#FFF6F5]/90 backdrop-blur-xs py-1.5 px-2 rounded-xl border border-[#C6A15B] shadow-2xs">
            {[
              { label: 'DAYS', value: timeLeft.days },
              { label: 'HOURS', value: timeLeft.hours },
              { label: 'MINS', value: timeLeft.minutes },
              { label: 'SECS', value: timeLeft.seconds },
            ].map((item) => (
              <div key={item.label} className="flex flex-col items-center">
                <span className="font-serif text-base text-[#140F0A] font-bold">
                  {String(item.value).padStart(2, '0')}
                </span>
                <span className="text-[7px] font-sans tracking-[0.2em] text-[#9A6B0A] font-extrabold mt-0.5">
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Call to Action Buttons */}
        <div className="flex flex-col xs:flex-row items-center justify-center gap-2 w-full max-w-[290px]">
          <a
            href="#rsvp"
            className="w-full xs:w-auto flex-1 px-4 py-2 rounded-full bg-[#EED8D3] hover:bg-[#E3C4BE] text-[#2C2219] text-[10px] font-bold tracking-[0.2em] uppercase transition-all shadow-xs border border-[#DFB6AE] text-center"
          >
            Kindly Reply (RSVP)
          </a>
          <a
            href="#journey"
            className="w-full xs:w-auto flex-1 px-4 py-2 rounded-full bg-[#FFF6F5]/90 hover:bg-[#F3E5E2] text-[#2C2219] text-[10px] font-bold tracking-[0.2em] uppercase transition-all border border-[#C6A15B] flex items-center justify-center space-x-1.5 shadow-2xs text-center"
          >
            <Calendar size={11} className="text-[#9A6B0A]" />
            <span>Celebrations</span>
          </a>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="relative z-10 pt-2 sm:pt-6 flex flex-col items-center">
        <a
          href="#our-story"
          className="text-[#9A6B0A] hover:text-[#735315] transition-transform hover:scale-110 flex flex-col items-center"
        >
          <span className="text-[9px] sm:text-[10px] font-sans uppercase tracking-[0.25em] text-[#3A2B1D] font-extrabold mb-1 drop-shadow-sm">
            Discover Our Story
          </span>
          <ChevronDown size={18} className="text-[#9A6B0A] animate-bounce" />
        </a>
      </div>
    </section>
  );
};
