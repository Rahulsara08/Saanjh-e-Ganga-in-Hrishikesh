import React, { useState } from 'react';
import { SectionEyebrow, SectionHeading, Divider } from './BasicComponents';
import { RevealOnScroll } from './RevealOnScroll';
import { VenueMapModal } from './VenueMapModal';
import { WeddingConfig } from '../types';
import { Map, Plane, Train, Home, Clock } from 'lucide-react';
import himalayanPanoramicImg from '../assets/images/himalayan_mountain_river_panoramic.png';
import { FlowerSketchAccent } from './FlowerSketchAccent';

interface TravelStayProps {
  config: WeddingConfig;
}

export const TravelStay: React.FC<TravelStayProps> = ({ config }) => {
  const [isMapModalOpen, setIsMapModalOpen] = useState(false);

  return (
    <section id="travel" className="pt-10 sm:pt-14 pb-12 sm:pb-16 px-4 max-w-4xl mx-auto w-full relative">
      {/* ── TOP PANORAMIC HIMALAYAN MOUNTAINS & RIVER ARTWORK ── */}
      <RevealOnScroll>
        <div className="relative w-full max-w-md sm:max-w-lg mx-auto flex items-center justify-center select-none pointer-events-none mb-3">
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

      {/* ── SECTION HEADING: CLEAN, HIGH-CONTRAST & EASY TO READ ── */}
      <RevealOnScroll delay={100}>
        <div className="text-center max-w-xl mx-auto mb-10 sm:mb-12 relative z-10">
          <span className="text-[11px] sm:text-xs font-sans tracking-[0.26em] text-[#8A5A00] uppercase font-bold block mb-1">
            {config.travel.eyebrow}
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl text-[#140F0A] font-bold leading-tight">
            {config.travel.heading}
          </h2>
          <p className="font-cursive text-xl sm:text-2xl text-[#140F0A] mt-1.5 font-normal tracking-wide">
            Reaching the peaceful mountain valley of Rishikesh
          </p>
        </div>
      </RevealOnScroll>

      {/* ── TRANSIT & STAY: NO CARDS, CLEAN CONCISE 1-2 LINES DIRECTLY ON THEME BACKGROUND ── */}
      <div className="space-y-8 max-w-lg mx-auto w-full relative z-10">
        {/* 1. By Air */}
        <RevealOnScroll delay={120}>
          <div className="flex items-start gap-4 pb-6 border-b border-[#DFC48F]/40">
            <div className="w-11 h-11 rounded-2xl bg-[#FAF2F0] border border-[#DFC48F] flex items-center justify-center shrink-0 shadow-2xs text-[#8A5A00] mt-0.5">
              <Plane size={20} className="stroke-[2]" />
            </div>

            <div className="flex-1 min-w-0 text-left">
              <div className="flex items-center justify-between gap-2 flex-wrap mb-0.5">
                <span className="text-[10px] sm:text-[10.5px] font-sans font-bold tracking-[0.22em] text-[#8A5A00] uppercase">
                  BY AIR · JOLLY GRANT AIRPORT (DED)
                </span>
                <span className="text-[10.5px] font-sans font-semibold text-[#554A40] flex items-center gap-1">
                  <Clock size={11} className="text-[#8A5A00]" />
                  35 Mins Drive
                </span>
              </div>

              <h3 className="font-serif text-xl sm:text-2xl text-[#140F0A] font-bold leading-snug">
                Direct Flights to Dehradun
              </h3>

              {/* Concise 1-2 lines */}
              <p className="text-xs sm:text-[13px] text-[#4A4038] font-medium leading-relaxed mt-1">
                Daily flights connect Delhi, Mumbai, Bengaluru & Ahmedabad to Jolly Grant Airport. Dedicated wedding chauffeurs will welcome you at arrivals.
              </p>
            </div>
          </div>
        </RevealOnScroll>

        {/* 2. By Rail */}
        <RevealOnScroll delay={200}>
          <div className="flex items-start gap-4 pb-6 border-b border-[#DFC48F]/40">
            <div className="w-11 h-11 rounded-2xl bg-[#FAF2F0] border border-[#DFC48F] flex items-center justify-center shrink-0 shadow-2xs text-[#8A5A00] mt-0.5">
              <Train size={20} className="stroke-[2]" />
            </div>

            <div className="flex-1 min-w-0 text-left">
              <div className="flex items-center justify-between gap-2 flex-wrap mb-0.5">
                <span className="text-[10px] sm:text-[10.5px] font-sans font-bold tracking-[0.22em] text-[#8A5A00] uppercase">
                  BY RAIL · HARIDWAR & RISHIKESH
                </span>
                <span className="text-[10.5px] font-sans font-semibold text-[#554A40] flex items-center gap-1">
                  <Clock size={11} className="text-[#8A5A00]" />
                  4.5 Hrs from Delhi
                </span>
              </div>

              <h3 className="font-serif text-xl sm:text-2xl text-[#140F0A] font-bold leading-snug">
                Vande Bharat & Express Trains
              </h3>

              {/* Concise 1-2 lines */}
              <p className="text-xs sm:text-[13px] text-[#4A4038] font-medium leading-relaxed mt-1">
                High-speed express trains connect New Delhi to Haridwar (HW) and Yog Nagari Rishikesh (YNRK). Continuous private shuttles are stationed for guest reception.
              </p>
            </div>
          </div>
        </RevealOnScroll>

        {/* 3. Sanctuary Stay */}
        <RevealOnScroll delay={280}>
          <div className="flex items-start gap-4 pb-4">
            <div className="w-11 h-11 rounded-2xl bg-[#FAF2F0] border border-[#DFC48F] flex items-center justify-center shrink-0 shadow-2xs text-[#8A5A00] mt-0.5">
              <Home size={20} className="stroke-[2]" />
            </div>

            <div className="flex-1 min-w-0 text-left">
              <div className="flex items-center justify-between gap-2 flex-wrap mb-0.5">
                <span className="text-[10px] sm:text-[10.5px] font-sans font-bold tracking-[0.22em] text-[#8A5A00] uppercase">
                  SANCTUARY ACCOMMODATIONS
                </span>
                <span className="text-[10.5px] font-sans font-semibold text-[#554A40]">
                  Check-in: 2:00 PM · Check-out: 11:00 AM
                </span>
              </div>

              <h3 className="font-serif text-xl sm:text-2xl text-[#140F0A] font-bold leading-snug">
                Anand Kashi by the Ganges
              </h3>

              {/* Concise 1-2 lines */}
              <p className="text-xs sm:text-[13px] text-[#4A4038] font-medium leading-relaxed mt-1">
                Luxury riverside cottage suites with mountain views and direct private ghat access along the sacred Ganga.
              </p>

              <div className="pt-3">
                <button
                  type="button"
                  onClick={() => setIsMapModalOpen(true)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#FAF2F0] hover:bg-[#F3E5E2] text-[#2C2117] text-[11px] font-sans font-bold tracking-wider uppercase transition-all border border-[#DFC48F] shadow-2xs active:scale-98 cursor-pointer"
                >
                  <Map size={12} className="text-[#8A5A00]" />
                  <span>Sanctuary Map & Directions</span>
                </button>
              </div>
            </div>
          </div>
        </RevealOnScroll>
      </div>

      {/* Subtle Flower Sketch Background Accent */}
      <FlowerSketchAccent
        className="absolute bottom-8 right-2 sm:right-6 w-32 sm:w-44 h-[220px] pointer-events-none z-0 hidden xs:block"
        opacity={0.18}
        rotation={8}
      />

      <VenueMapModal
        isOpen={isMapModalOpen}
        onClose={() => setIsMapModalOpen(false)}
        config={config}
      />

      <Divider className="mt-8 sm:mt-10" />
    </section>
  );
};
