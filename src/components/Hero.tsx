import React, { useState, useEffect } from 'react';
import { GangaDiya } from './BasicComponents';
import { WeddingConfig } from '../types';
import { Calendar, ChevronDown } from 'lucide-react';
import { OptimizedImage } from './OptimizedImage';
import { FlowerSketchAccent } from './FlowerSketchAccent';
const rishikeshMandapBg = 'rishikesh_mandap_watercolor_1790240774713';

interface HeroProps {
  config: WeddingConfig;
  guestGreeting: string;
  revealed?: boolean;
}

export const Hero: React.FC<HeroProps> = ({ config, guestGreeting, revealed = true }) => {
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
    <section
      className="relative min-h-[100dvh] flex flex-col items-center justify-between text-center overflow-hidden py-8 px-3"
      data-hero
      data-revealed={revealed}
    >
      {/* ── Background Image: Sacred Rishikesh Mandap Watercolor Artwork with Seamless Feathering ── */}
      <div
        className="hero-bg absolute inset-0 z-0 pointer-events-none"
        style={{
          maskImage: 'linear-gradient(to bottom, black 0%, black 50%, rgba(0,0,0,0.85) 65%, rgba(0,0,0,0.3) 82%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to bottom, black 0%, black 50%, rgba(0,0,0,0.85) 65%, rgba(0,0,0,0.3) 82%, transparent 100%)',
        }}
      >
        <img
          src="/images/main_header_mandap.jpg"
          alt="Rishikesh Ganga Mandap Watercolor"
          className="w-full h-full object-cover object-top sm:object-center"
        />
        {/* Soft luminous radial vignette to make text crystal clear without any card */}
        <div
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse 80% 75% at 50% 42%, rgba(255, 253, 251, 0.90) 0%, rgba(250, 242, 240, 0.72) 60%, rgba(250, 242, 240, 0.25) 100%)',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#FAF2F0]/80 via-transparent to-[#FAF2F0]/60" />
      </div>

      {/* Subtle Flower Sketch Background Accent */}
      <FlowerSketchAccent
        className="absolute -bottom-8 -right-6 w-36 sm:w-44 h-[240px] pointer-events-none z-0 hidden xs:block"
        opacity={0.18}
        rotation={14}
      />

      {/* Progressive theme background blur feathering into the blush paper texture */}
      <div
        className="absolute bottom-0 inset-x-0 h-44 sm:h-64 pointer-events-none z-0 backdrop-blur-[6px]"
        style={{
          maskImage: 'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.25) 25%, rgba(0,0,0,0.8) 65%, black 100%)',
          WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.25) 25%, rgba(0,0,0,0.8) 65%, black 100%)',
        }}
      />

      {/* ── Center Content: Highly Visible, Bold, High-Contrast Typography ── */}
      <div className="hero-stagger relative z-10 w-full max-w-3xl mx-auto px-4 flex flex-col items-center my-auto">
        {/* Guest Salutation */}
        <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-[#FFF9F8] border border-[#8A5A00] text-[#5C3900] text-[10.5px] font-sans font-extrabold tracking-[0.25em] uppercase mb-2 shadow-xs">
          <span className="text-[10px] text-[#A6731B]">✦</span>
          <span>{guestGreeting || 'DEAR GUEST,'}</span>
          <span className="text-[10px] text-[#A6731B]">✦</span>
        </div>

        {/* Save the date cursive - Deep, Rich, High-Contrast Royal Gold */}
        <p className="font-serif italic text-2xl xs:text-3xl sm:text-4xl text-[#6D4200] font-extrabold tracking-wide my-1 leading-tight drop-shadow-[0_1px_6px_rgba(255,255,255,1)]">
          save the date
        </p>

        {/* Couple Names - Elegant, Majestic Serif Ink, Crisp & Bold */}
        <h1 className="font-serif text-3xl xs:text-4xl sm:text-[44px] font-black text-[#140D07] tracking-tight uppercase leading-[1.1] mt-1 mb-1.5 drop-shadow-[0_2px_12px_rgba(255,255,255,1)]">
          {config.couple.brideName}{' '}
          <span className="font-serif italic text-2xl xs:text-3xl sm:text-4xl text-[#7D4D00] font-extrabold lowercase">
            &
          </span>{' '}
          {config.couple.groomName}
        </h1>

        {/* Invitation Sentence - High Clarity, Bold */}
        <p className="font-serif italic text-xs xs:text-sm sm:text-base text-[#1F140A] font-extrabold my-2 max-w-sm leading-relaxed drop-shadow-[0_1px_6px_rgba(255,255,255,1)]">
          are getting married along the sacred flowing waters of River Ganga
        </p>

        {/* Gold Framed Date Ribbon */}
        <div className="w-full max-w-xs flex items-center justify-center my-2.5 space-x-2.5">
          <div className="h-[1.5px] flex-1 bg-[#8A5A00]" />
          <span className="px-4 py-1 rounded-full bg-[#FFFDFB] border border-[#8A5A00] text-xs xs:text-sm font-serif tracking-[0.25em] text-[#523300] uppercase font-black shadow-2xs">
            {config.couple.weddingDateString}
          </span>
          <div className="h-[1.5px] flex-1 bg-[#8A5A00]" />
        </div>

        {/* Venue Name - Solid & Clear */}
        <p className="text-base xs:text-lg sm:text-xl font-serif text-[#140D07] tracking-wide mt-1 font-black drop-shadow-[0_1px_6px_rgba(255,255,255,1)]">
          {config.couple.venueName}
        </p>

        {/* Venue City & Country - Crisp Uppercase */}
        <p className="text-[10.5px] xs:text-[11.5px] font-sans text-[#2A1B0E] tracking-[0.28em] uppercase mt-0.5 font-extrabold drop-shadow-[0_1px_4px_rgba(255,255,255,1)]">
          {config.couple.venueCity}, {config.couple.venueCountry}
        </p>

        {/* Ganga Diya Accent */}
        <div className="my-2 flex justify-center scale-85">
          <GangaDiya size={30} />
        </div>

        {/* Minimalist Countdown Timer */}
        <div className="mb-3.5 w-full max-w-[280px] mx-auto">
          <div className="grid grid-cols-4 gap-1.5 bg-[#FFFDFB]/95 py-1.5 px-2 rounded-xl border border-[#C6A15B] shadow-xs">
            {[
              { label: 'DAYS', value: timeLeft.days },
              { label: 'HOURS', value: timeLeft.hours },
              { label: 'MINS', value: timeLeft.minutes },
              { label: 'SECS', value: timeLeft.seconds },
            ].map((item) => (
              <div key={item.label} className="flex flex-col items-center">
                <span className="font-serif text-base sm:text-lg text-[#140D07] font-black">
                  {String(item.value).padStart(2, '0')}
                </span>
                <span className="text-[7px] font-sans tracking-[0.2em] text-[#7A4F00] font-black mt-0.5">
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Call to Action Button: Celebrations (Centered) */}
        <div className="flex items-center justify-center w-full max-w-[260px]">
          <a
            href="#journey"
            className="w-full px-6 py-2.5 rounded-full bg-[#FFFDFB] hover:bg-[#F5ECE8] text-[#2C2219] text-[10.5px] sm:text-[11px] font-bold tracking-[0.22em] uppercase transition-all border border-[#8A5A00] flex items-center justify-center space-x-2 shadow-xs text-center"
          >
            <Calendar size={13} className="text-[#8A5A00]" />
            <span>Celebrations</span>
          </a>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="hero-last relative z-10 pt-2 sm:pt-6 flex flex-col items-center">
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
