import React, { useState } from 'react';
import { SectionEyebrow, SectionHeading, Divider } from './BasicComponents';
import { RevealOnScroll } from './RevealOnScroll';
import { VenueMapModal } from './VenueMapModal';
import { WeddingConfig } from '../types';
import { Copy, Check, Map } from 'lucide-react';

interface TravelStayProps {
  config: WeddingConfig;
}

export const TravelStay: React.FC<TravelStayProps> = ({ config }) => {
  const [isMapModalOpen, setIsMapModalOpen] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(config.travel.roomBlock.promoCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2500);
  };

  return (
    <section id="travel" className="py-20 px-4 max-w-5xl mx-auto">
      <RevealOnScroll>
        <div className="text-center max-w-xl mx-auto mb-14">
          <SectionEyebrow>{config.travel.eyebrow}</SectionEyebrow>
          <SectionHeading subtitle="Reaching the peaceful mountain valley of Rishikesh">
            {config.travel.heading}
          </SectionHeading>
        </div>
      </RevealOnScroll>

      {/* Transit & Accommodations with static icons (animation removed) */}
      <div className="space-y-14">
        {/* 1. By Air: Static Icon Block */}
        <RevealOnScroll delay={100}>
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-10 border-b border-[#DFC48F]/40">
            <div className="flex items-center space-x-4">
              <div className="w-14 h-14 rounded-2xl bg-[#FFF9F8]/90 border border-[#DFC48F] flex items-center justify-center shrink-0 shadow-2xs text-[#C6A15B]">
                {/* Clean Plane Icon */}
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z"/>
                </svg>
              </div>

              <div>
                <span className="text-[10px] font-sans font-semibold tracking-widest text-[#C6A15B] uppercase block">
                  BY AIR · JOLLY GRANT AIRPORT (DED)
                </span>
                <h4 className="font-serif text-2xl sm:text-3xl text-[#4A4038] font-normal">
                  Direct Flights to Dehradun
                </h4>
              </div>
            </div>

            <div className="max-w-md md:text-right space-y-1">
              <p className="text-xs text-[#8A7F72] font-sans font-medium">
                35 Minutes Scenic Drive along Ganga to Venue
              </p>
              <p className="text-xs sm:text-sm text-[#4A4038] font-light leading-relaxed">
                Regular daily flights connect Delhi, Mumbai, Bengaluru, and Ahmedabad to Jolly Grant Airport. Dedicated wedding chauffeurs will welcome you at arrivals.
              </p>
            </div>
          </div>
        </RevealOnScroll>

        {/* 2. By Train: Static Icon Block */}
        <RevealOnScroll delay={200}>
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-10 border-b border-[#DFC48F]/40">
            <div className="flex items-center space-x-4">
              <div className="w-14 h-14 rounded-2xl bg-[#FFF9F8]/90 border border-[#DFC48F] flex items-center justify-center shrink-0 shadow-2xs text-[#C6A15B]">
                {/* Clean Train Icon */}
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
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
                <span className="text-[10px] font-sans font-semibold tracking-widest text-[#C6A15B] uppercase block">
                  BY RAIL · HARIDWAR & YOG NAGARI RISHIKESH
                </span>
                <h4 className="font-serif text-2xl sm:text-3xl text-[#4A4038] font-normal">
                  Vande Bharat & Express Trains
                </h4>
              </div>
            </div>

            <div className="max-w-md md:text-right space-y-1">
              <p className="text-xs text-[#8A7F72] font-sans font-medium">
                Vande Bharat Express: Just 4.5 Hours from New Delhi
              </p>
              <p className="text-xs sm:text-sm text-[#4A4038] font-light leading-relaxed">
                High-speed rail connectivity to Haridwar (HW) and Yog Nagari Rishikesh (YNRK). Continuous chauffeur pickups are arranged for our guests.
              </p>
            </div>
          </div>
        </RevealOnScroll>

        {/* 3. Sanctuary Accommodations: Clean Icon Block */}
        <RevealOnScroll delay={300}>
          <div className="flex flex-col md:flex-row items-start justify-between gap-6 pb-6">
            <div className="flex items-center space-x-4">
              <div className="w-14 h-14 rounded-2xl bg-[#FFF9F8]/90 border border-[#DFC48F] flex items-center justify-center shrink-0 shadow-2xs text-[#C6A15B]">
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
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
                <span className="text-[10px] font-sans font-semibold tracking-widest text-[#C6A15B] uppercase block">
                  SANCTUARY ACCOMMODATIONS
                </span>
                <h4 className="font-serif text-2xl sm:text-3xl text-[#4A4038] font-normal">
                  Anand Kashi by the Ganges
                </h4>
              </div>
            </div>

            <div className="max-w-md md:text-right space-y-2">
              <p className="text-xs text-[#8A7F72] font-sans">
                Quote Wedding Retreat Code:{' '}
                <span className="font-mono font-bold text-[#C6A15B] bg-[#F3EDE3] px-2 py-0.5 rounded-md border border-[#DFC48F]/50">
                  {config.travel.roomBlock.promoCode}
                </span>{' '}
                for exclusive courtesy rates.
              </p>
              <div className="flex items-center justify-start md:justify-end space-x-2 pt-1">
                <button
                  type="button"
                  onClick={handleCopyCode}
                  className="px-3.5 py-1.5 rounded-full bg-[#FFF9F8] hover:bg-[#F3E5E2] text-[#4A4038] text-[10px] font-sans tracking-wide transition-colors border border-[#DFC48F] flex items-center space-x-1.5"
                >
                  {copiedCode ? <Check size={11} className="text-emerald-700" /> : <Copy size={11} className="text-[#C6A15B]" />}
                  <span>{copiedCode ? 'Code Copied' : 'Copy Promo Code'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsMapModalOpen(true)}
                  className="px-3.5 py-1.5 rounded-full bg-[#FFF9F8] hover:bg-[#F3E5E2] text-[#4A4038] text-[10px] font-sans tracking-wide transition-colors border border-[#DFC48F] flex items-center space-x-1.5"
                >
                  <Map size={11} className="text-[#C6A15B]" />
                  <span>Sanctuary Map</span>
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
