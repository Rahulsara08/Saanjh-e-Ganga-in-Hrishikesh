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
    <section className="relative min-h-[95vh] flex flex-col items-center justify-between text-center overflow-hidden pt-28 pb-12">
      {/* ── Background Image: Sacred Rishikesh Mandap Watercolor Artwork ── */}
      <div className="absolute inset-0 z-0">
        <img
          src={rishikeshMandapBg}
          alt="Rishikesh Ganga Mandap Watercolor"
          className="w-full h-full object-cover object-top sm:object-center"
        />
        {/* Luminous warm overlay allowing watercolor art to remain visible while giving text high-contrast background */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#FAF6F0]/85 via-[#FAF6F0]/75 to-[#FAF6F0]" />
      </div>

      {/* ── Center Content: Directly on background without any card ── */}
      <div className="relative z-10 w-full max-w-3xl mx-auto px-4 flex flex-col items-center">
        {/* Guest Salutation */}
        <div className="inline-flex items-center space-x-2 px-5 py-1.5 rounded-full bg-[#FAF6F0] border-2 border-[#B88E4C] text-[#8C6418] text-xs font-sans font-bold tracking-[0.3em] uppercase mb-4 shadow-sm">
          <span>✦</span>
          <span>{guestGreeting || 'DEAR GUEST,'}</span>
          <span>✦</span>
        </div>

        {/* Save the date cursive - Bright & Bold Gold */}
        <p className="font-serif italic text-4xl sm:text-6xl text-[#B8860B] font-bold tracking-wide my-1 leading-tight drop-shadow-[0_2px_8px_rgba(255,255,255,0.85)]">
          save the date
        </p>

        {/* Couple Names - Ultra Bold & Deep Charcoal Ink */}
        <h1 className="font-serif text-5xl sm:text-7xl md:text-8xl font-bold text-[#140F0A] tracking-tight uppercase leading-[1.05] mt-1 mb-2 drop-shadow-[0_2px_12px_rgba(255,255,255,0.9)]">
          {config.couple.brideName}{' '}
          <span className="font-serif italic text-4xl sm:text-6xl text-[#C69214] font-bold lowercase">
            &
          </span>{' '}
          {config.couple.groomName}
        </h1>

        {/* Invitation Sentence - Bold, Deep Warm Espresso */}
        <p className="font-serif italic text-xl sm:text-3xl text-[#2B1D12] font-semibold my-3 max-w-2xl leading-relaxed drop-shadow-[0_2px_8px_rgba(255,255,255,0.9)]">
          are getting married along the sacred flowing waters of River Ganga
        </p>

        {/* Gold Framed Date Ribbon - Bold & Prominent */}
        <div className="w-full max-w-sm flex items-center justify-center my-4 space-x-4">
          <div className="h-[2px] flex-1 bg-[#B8860B]" />
          <span className="px-4 py-1 text-base sm:text-xl font-serif tracking-[0.25em] text-[#9A6B0A] uppercase font-extrabold drop-shadow-[0_1px_4px_rgba(255,255,255,0.9)]">
            {config.couple.weddingDateString}
          </span>
          <div className="h-[2px] flex-1 bg-[#B8860B]" />
        </div>

        {/* Venue Name - Bold & Prominent */}
        <p className="text-xl sm:text-2xl font-serif text-[#140F0A] tracking-wide mt-1 font-bold drop-shadow-[0_1px_6px_rgba(255,255,255,0.85)]">
          {config.couple.venueName}
        </p>

        {/* Venue City & Country - Bold Uppercase */}
        <p className="text-sm sm:text-base font-sans text-[#3A2B1D] tracking-[0.25em] uppercase mt-1.5 font-bold drop-shadow-[0_1px_4px_rgba(255,255,255,0.85)]">
          {config.couple.venueCity}, {config.couple.venueCountry}
        </p>

        {/* Ganga Diya Accent */}
        <div className="my-5 flex justify-center">
          <GangaDiya size={36} />
        </div>

        {/* Minimalist Countdown Timer - Directly on background */}
        <div className="mb-6 w-full max-w-xs mx-auto">
          <div className="grid grid-cols-4 gap-2 bg-[#FAF6F0] py-2.5 px-3 rounded-2xl border-2 border-[#C6A15B] shadow-sm">
            {[
              { label: 'DAYS', value: timeLeft.days },
              { label: 'HOURS', value: timeLeft.hours },
              { label: 'MINS', value: timeLeft.minutes },
              { label: 'SECS', value: timeLeft.seconds },
            ].map((item) => (
              <div key={item.label} className="flex flex-col items-center">
                <span className="font-serif text-xl sm:text-2xl text-[#140F0A] font-bold">
                  {String(item.value).padStart(2, '0')}
                </span>
                <span className="text-[8px] font-sans tracking-[0.2em] text-[#9A6B0A] font-extrabold mt-0.5">
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Call to Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <a
            href="#rsvp"
            className="w-full sm:w-auto px-8 py-3 rounded-full bg-[#EED8D3] hover:bg-[#E3C4BE] text-[#2C2219] text-xs font-bold tracking-[0.25em] uppercase transition-all shadow-md border border-[#DFB6AE] hover:shadow-lg"
          >
            Kindly Reply (RSVP)
          </a>
          <a
            href="#journey"
            className="w-full sm:w-auto px-7 py-3 rounded-full bg-[#FAF6F0] hover:bg-[#F3EDE3] text-[#2C2219] hover:text-[#140F0A] text-xs font-bold tracking-[0.25em] uppercase transition-all border-2 border-[#C6A15B] flex items-center justify-center space-x-1.5 shadow-sm hover:shadow-md"
          >
            <Calendar size={14} className="text-[#9A6B0A]" />
            <span>Celebration Rituals</span>
          </a>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="relative z-10 pt-6 flex flex-col items-center">
        <a
          href="#our-story"
          className="text-[#9A6B0A] hover:text-[#735315] transition-transform hover:scale-110 flex flex-col items-center"
        >
          <span className="text-[10px] font-sans uppercase tracking-[0.25em] text-[#3A2B1D] font-extrabold mb-1 drop-shadow-sm">
            Discover Our Story
          </span>
          <ChevronDown size={20} className="text-[#9A6B0A]" />
        </a>
      </div>
    </section>
  );
};
