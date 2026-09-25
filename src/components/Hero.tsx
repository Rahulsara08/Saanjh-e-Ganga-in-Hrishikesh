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
    <section className="relative min-h-[100dvh] flex flex-col items-center justify-between text-center overflow-hidden pt-16 sm:pt-28 pb-4 sm:pb-8">
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
        <div className="inline-flex items-center space-x-2 px-4 sm:px-5 py-1.5 sm:py-2 rounded-full bg-[#FFF8F7]/95 backdrop-blur-xs border-2 border-[#8A5A00] text-[#6B4200] text-[11px] sm:text-xs font-sans font-extrabold tracking-[0.25em] sm:tracking-[0.3em] uppercase mb-2 sm:mb-4 shadow-sm">
          <span>✦</span>
          <span>{guestGreeting || 'DEAR GUEST,'}</span>
          <span>✦</span>
        </div>

        {/* Save the date cursive - Deep, Rich, High-Contrast Royal Gold */}
        <p className="font-serif italic text-3xl sm:text-6xl text-[#7A4F00] font-bold tracking-wide my-1 leading-tight drop-shadow-[0_2px_12px_rgba(255,255,255,0.95)]">
          save the date
        </p>

        {/* Couple Names - Ultra Bold Deep Obsidian Charcoal Ink */}
        <h1 className="font-serif text-4xl sm:text-7xl md:text-8xl font-black text-[#0A0705] tracking-tight uppercase leading-[1.05] mt-1 mb-2 drop-shadow-[0_2px_14px_rgba(255,255,255,1)]">
          {config.couple.brideName}{' '}
          <span className="font-serif italic text-3xl sm:text-6xl text-[#8A5A00] font-bold lowercase">
            &
          </span>{' '}
          {config.couple.groomName}
        </h1>

        {/* Invitation Sentence - Bold Deep Espresso, High Clarity */}
        <p className="font-serif italic text-lg sm:text-3xl text-[#1A1108] font-bold my-2 sm:my-3.5 max-w-2xl leading-snug sm:leading-relaxed drop-shadow-[0_2px_10px_rgba(255,255,255,0.95)]">
          are getting married along the sacred flowing waters of River Ganga
        </p>

        {/* Gold Framed Date Ribbon - Bold, High-Contrast & Prominent */}
        <div className="w-full max-w-md flex items-center justify-center my-2.5 sm:my-4 space-x-3 sm:space-x-4">
          <div className="h-[2.5px] flex-1 bg-[#8A5A00]" />
          <span className="px-3.5 sm:px-5 py-1 text-base sm:text-2xl font-serif tracking-[0.22em] sm:tracking-[0.28em] text-[#6B4200] uppercase font-black drop-shadow-[0_2px_6px_rgba(255,255,255,1)]">
            {config.couple.weddingDateString}
          </span>
          <div className="h-[2.5px] flex-1 bg-[#8A5A00]" />
        </div>

        {/* Venue Name - Solid & Clear */}
        <p className="text-xl sm:text-3xl font-serif text-[#0A0705] tracking-wide mt-1 font-extrabold drop-shadow-[0_2px_8px_rgba(255,255,255,1)]">
          {config.couple.venueName}
        </p>

        {/* Venue City & Country - Bold, Crisp Uppercase */}
        <p className="text-xs sm:text-base font-sans text-[#20150C] tracking-[0.25em] sm:tracking-[0.3em] uppercase mt-1 sm:mt-2 font-black drop-shadow-[0_1px_6px_rgba(255,255,255,1)]">
          {config.couple.venueCity}, {config.couple.venueCountry}
        </p>

        {/* Ganga Diya Accent */}
        <div className="my-2.5 sm:my-4 flex justify-center scale-90 sm:scale-100">
          <GangaDiya size={34} />
        </div>

        {/* Minimalist Countdown Timer - Directly on background */}
        <div className="mb-3 sm:mb-6 w-full max-w-xs mx-auto">
          <div className="grid grid-cols-4 gap-2 bg-[#FFF6F5]/90 backdrop-blur-xs py-2 sm:py-2.5 px-2.5 sm:px-3 rounded-2xl border-2 border-[#C6A15B] shadow-sm">
            {[
              { label: 'DAYS', value: timeLeft.days },
              { label: 'HOURS', value: timeLeft.hours },
              { label: 'MINS', value: timeLeft.minutes },
              { label: 'SECS', value: timeLeft.seconds },
            ].map((item) => (
              <div key={item.label} className="flex flex-col items-center">
                <span className="font-serif text-lg sm:text-2xl text-[#140F0A] font-bold">
                  {String(item.value).padStart(2, '0')}
                </span>
                <span className="text-[7.5px] sm:text-[8px] font-sans tracking-[0.2em] text-[#9A6B0A] font-extrabold mt-0.5">
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Call to Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3">
          <a
            href="#rsvp"
            className="w-full sm:w-auto px-6 sm:px-8 py-2.5 sm:py-3 rounded-full bg-[#EED8D3] hover:bg-[#E3C4BE] text-[#2C2219] text-[11px] sm:text-xs font-bold tracking-[0.2em] sm:tracking-[0.25em] uppercase transition-all shadow-md border border-[#DFB6AE] hover:shadow-lg"
          >
            Kindly Reply (RSVP)
          </a>
          <a
            href="#journey"
            className="w-full sm:w-auto px-6 sm:px-7 py-2.5 sm:py-3 rounded-full bg-[#FFF6F5]/90 hover:bg-[#F3E5E2] text-[#2C2219] hover:text-[#140F0A] text-[11px] sm:text-xs font-bold tracking-[0.2em] sm:tracking-[0.25em] uppercase transition-all border-2 border-[#C6A15B] flex items-center justify-center space-x-1.5 shadow-sm hover:shadow-md"
          >
            <Calendar size={13} className="text-[#9A6B0A]" />
            <span>Celebration Rituals</span>
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
