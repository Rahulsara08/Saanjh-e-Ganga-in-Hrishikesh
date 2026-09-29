import React, { useState } from 'react';
import { SectionEyebrow, SectionHeading, Divider } from './BasicComponents';
import { RevealOnScroll } from './RevealOnScroll';
import { VenueMapModal } from './VenueMapModal';
import { WeddingConfig } from '../types';
import { Map } from 'lucide-react';
import himalayanPanoramicImg from '../assets/images/himalayan_mountain_river_panoramic.png';

interface TravelStayProps {
  config: WeddingConfig;
}

export const TravelStay: React.FC<TravelStayProps> = ({ config }) => {
  const [isMapModalOpen, setIsMapModalOpen] = useState(false);

  return (
    <section id="travel" className="pt-10 sm:pt-14 pb-20 px-4 max-w-5xl mx-auto w-full relative">
      {/* ── TOP PANORAMIC HIMALAYAN MOUNTAINS & RIVER ARTWORK ── */}
      <RevealOnScroll>
        <div className="relative w-full max-w-md sm:max-w-lg mx-auto flex items-center justify-center select-none pointer-events-none mb-4">
          <img
            src={himalayanPanoramicImg}
            alt="Watercolor Himalayan Mountains and Sacred Ganga River"
            className="w-full h-auto object-contain pointer-events-none select-none drop-shadow-xs"
            style={{
              maskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 75%, rgba(0,0,0,0) 100%)',
              WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 75%, rgba(0,0,0,0) 100%)',
            }}
          />
        </div>
      </RevealOnScroll>

      {/* ── SECTION HEADING: 'YOUR JOURNEY TO RISHIKESH' & 'TRAVEL & MOUNTAIN STAYS' ── */}
      <RevealOnScroll delay={100}>
        <div className="text-center max-w-xl mx-auto mb-12 relative z-10">
          <SectionEyebrow className="text-[#A27324] font-semibold tracking-[0.3em]">
            {config.travel.eyebrow}
          </SectionEyebrow>
          <SectionHeading subtitle="Reaching the peaceful mountain valley of Rishikesh">
            {config.travel.heading}
          </SectionHeading>
        </div>
      </RevealOnScroll>

      {/* Transit & Accommodations with static icons (animation removed) */}
      <div className="space-y-10 max-w-md mx-auto w-full">
        {/* 1. By Air: Static Icon Block */}
        <RevealOnScroll delay={100}>
          <div className="flex flex-col items-start gap-3 pb-8 border-b border-[#DFC48F]/40">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-2xl bg-[#FFF9F8]/90 border border-[#DFC48F] flex items-center justify-center shrink-0 shadow-2xs text-[#C6A15B]">
                {/* Clean Plane Icon */}
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z"/>
                </svg>
              </div>

              <div>
                <span className="text-[9px] font-sans font-semibold tracking-widest text-[#C6A15B] uppercase block">
                  BY AIR · JOLLY GRANT AIRPORT (DED)
                </span>
                <h4 className="font-serif text-xl text-[#4A4038] font-normal">
                  Direct Flights to Dehradun
                </h4>
              </div>
            </div>

            <div className="space-y-1 pl-1">
              <p className="text-xs text-[#8A7F72] font-sans font-medium">
                35 Minutes Scenic Drive along Ganga to Venue
              </p>
              <p className="text-xs text-[#4A4038] font-light leading-relaxed">
                Regular daily flights connect Delhi, Mumbai, Bengaluru, and Ahmedabad to Jolly Grant Airport. Dedicated wedding chauffeurs will welcome you at arrivals.
              </p>
            </div>
          </div>
        </RevealOnScroll>

        {/* 2. By Train: Static Icon Block */}
        <RevealOnScroll delay={200}>
          <div className="flex flex-col items-start gap-3 pb-8 border-b border-[#DFC48F]/40">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-2xl bg-[#FFF9F8]/90 border border-[#DFC48F] flex items-center justify-center shrink-0 shadow-2xs text-[#C6A15B]">
                {/* Clean Train Icon */}
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="4" y="3" width="16" height="16" rx="2" />
                  <path d="M4 11h16" />
                  <path d="M12 3v8" />
                  <path d="m8 19-2 3" />
                  <path d="m16 19 2 3" />
                  <circle cx="8" cy="15" r="1" fill="currentColor" />
                  <circle cx="16" cy="15" r="1" fill="currentColor" />
                </svg>
              </div>

              <div>
                <span className="text-[9px] font-sans font-semibold tracking-widest text-[#C6A15B] uppercase block">
                  BY RAIL · HARIDWAR & RISHIKESH
                </span>
                <h4 className="font-serif text-xl text-[#4A4038] font-normal">
                  Vande Bharat & Express Trains
                </h4>
              </div>
            </div>

            <div className="space-y-1 pl-1">
              <p className="text-xs text-[#8A7F72] font-sans font-medium">
                Vande Bharat Express: Just 4.5 Hours from New Delhi
              </p>
              <p className="text-xs text-[#4A4038] font-light leading-relaxed">
                High-speed rail connectivity to Haridwar (HW) and Yog Nagari Rishikesh (YNRK). Continuous chauffeur pickups are arranged for our guests.
              </p>
            </div>
          </div>
        </RevealOnScroll>

        {/* 3. Sanctuary Accommodations: Clean Icon Block */}
        <RevealOnScroll delay={300}>
          <div className="flex flex-col items-start gap-3 pb-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-2xl bg-[#FFF9F8]/90 border border-[#DFC48F] flex items-center justify-center shrink-0 shadow-2xs text-[#C6A15B]">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 21h18" />
                  <path d="M19 21v-4" />
                  <path d="M19 11V5a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v16" />
                  <path d="M9 7h1" />
                  <path d="M9 11h1" />
                  <path d="M9 15h1" />
                  <path d="M14 7h1" />
                  <path d="M14 11h1" />
                  <path d="M14 15h1" />
                </svg>
              </div>

              <div>
                <span className="text-[9px] font-sans font-semibold tracking-widest text-[#C6A15B] uppercase block">
                  SANCTUARY ACCOMMODATIONS
                </span>
                <h4 className="font-serif text-xl text-[#4A4038] font-normal">
                  Anand Kashi by the Ganges
                </h4>
              </div>
            </div>

            <div className="space-y-2 pl-1">
              <p className="text-xs text-[#4A4038] font-light leading-relaxed">
                Stunning luxury heritage property right on the bank of the Ganges river with private ghat access and mountain view suites.
              </p>
              <div className="flex items-center space-x-2 pt-1">
                <button
                  type="button"
                  onClick={() => setIsMapModalOpen(true)}
                  className="px-4 py-2 rounded-full bg-[#FFF9F8] hover:bg-[#F3E5E2] text-[#4A4038] text-[11px] font-sans tracking-wide transition-colors border border-[#DFC48F] flex items-center space-x-1.5 shadow-2xs"
                >
                  <Map size={12} className="text-[#C6A15B]" />
                  <span>Sanctuary Map & Directions</span>
                </button>
              </div>
            </div>
          </div>
        </RevealOnScroll>
      </div>

      <VenueMapModal
        isOpen={isMapModalOpen}
        onClose={() => setIsMapModalOpen(false)}
        config={config}
      />

      <Divider />
    </section>
  );
};
