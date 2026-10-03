import React, { useState } from 'react';
import { SectionEyebrow, SectionHeading, Divider } from './BasicComponents';
import { RevealOnScroll } from './RevealOnScroll';
import { VenueMapModal } from './VenueMapModal';
import { WeddingConfig } from '../types';
import { Map, Plane, Train, Sparkles, Clock, Compass } from 'lucide-react';
import himalayanPanoramicImg from '../assets/images/himalayan_mountain_river_panoramic.png';
import { FlowerSketchAccent } from './FlowerSketchAccent';

interface TravelStayProps {
  config: WeddingConfig;
}

export const TravelStay: React.FC<TravelStayProps> = ({ config }) => {
  const [isMapModalOpen, setIsMapModalOpen] = useState(false);

  return (
    <section id="travel" className="pt-10 sm:pt-14 pb-12 sm:pb-16 px-3 sm:px-4 max-w-4xl mx-auto w-full relative">
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

      {/* ── SECTION HEADING WITH ELEGANT CURSIVE STYLING ── */}
      <RevealOnScroll delay={100}>
        <div className="text-center max-w-xl mx-auto mb-10 sm:mb-12 relative z-10">
          <SectionEyebrow
            cursiveAccent="Your Sacred Mountain Retreat"
            className="text-[#9A6B0A] font-semibold tracking-[0.28em]"
          >
            {config.travel.eyebrow}
          </SectionEyebrow>
          <SectionHeading
            cursiveSubtitle="Reaching the peaceful mountain valley of Rishikesh"
          >
            {config.travel.heading}
          </SectionHeading>
        </div>
      </RevealOnScroll>

      {/* ── LUXURY CRAFTED TRANSIT & SANCTUARY STAY CARDS ── */}
      <div className="space-y-6 max-w-xl mx-auto w-full relative z-10">
        {/* 1. By Air Luxury Card */}
        <RevealOnScroll delay={120}>
          <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-[#FFFDFB]/95 backdrop-blur-xs border border-[#DFC48F]/70 shadow-[0_8px_30px_rgba(198,161,91,0.08)] hover:shadow-[0_12px_36px_rgba(198,161,91,0.18)] hover:border-[#C6A15B] transition-all duration-300 p-5 sm:p-6 group">
            {/* Ambient Warm Golden Glow */}
            <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-gradient-to-br from-[#DFC48F]/25 to-transparent blur-2xl pointer-events-none" />

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#FFF9F5] to-[#F7EDE8] border border-[#DFC48F] flex items-center justify-center shrink-0 shadow-2xs text-[#B88E4C] group-hover:scale-105 transition-transform duration-300">
                <Plane size={22} className="stroke-[1.8]" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <span className="text-[10px] font-sans font-bold tracking-[0.24em] text-[#A27324] uppercase">
                    BY AIR · JOLLY GRANT AIRPORT (DED)
                  </span>
                  <span className="inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full bg-[#FAF2F0] border border-[#DFC48F]/50 text-[#8A7F72]">
                    <Clock size={11} className="text-[#C6A15B]" />
                    35 Mins Drive to Venue
                  </span>
                </div>

                <h3 className="font-serif text-xl sm:text-2xl text-[#2C2117] font-normal mt-1 leading-snug">
                  Direct Flights to Dehradun
                </h3>
                <p className="font-cursive text-lg text-[#9A6B0A] -mt-0.5 mb-1.5 font-normal">
                  Chauffeur Escort from Arrivals
                </p>

                <p className="text-xs text-[#5A4F44] font-normal leading-relaxed">
                  Regular daily flights connect Delhi, Mumbai, Bengaluru, and Ahmedabad to Jolly Grant Airport. Dedicated private wedding chauffeurs will welcome you at arrivals and escort you smoothly along the Ganga to Anand Kashi.
                </p>
              </div>
            </div>
          </div>
        </RevealOnScroll>

        {/* 2. By Train Luxury Card */}
        <RevealOnScroll delay={200}>
          <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-[#FFFDFB]/95 backdrop-blur-xs border border-[#DFC48F]/70 shadow-[0_8px_30px_rgba(198,161,91,0.08)] hover:shadow-[0_12px_36px_rgba(198,161,91,0.18)] hover:border-[#C6A15B] transition-all duration-300 p-5 sm:p-6 group">
            {/* Ambient Warm Golden Glow */}
            <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-gradient-to-br from-[#DFC48F]/25 to-transparent blur-2xl pointer-events-none" />

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#FFF9F5] to-[#F7EDE8] border border-[#DFC48F] flex items-center justify-center shrink-0 shadow-2xs text-[#B88E4C] group-hover:scale-105 transition-transform duration-300">
                <Train size={22} className="stroke-[1.8]" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <span className="text-[10px] font-sans font-bold tracking-[0.24em] text-[#A27324] uppercase">
                    BY RAIL · HARIDWAR & RISHIKESH
                  </span>
                  <span className="inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full bg-[#FAF2F0] border border-[#DFC48F]/50 text-[#8A7F72]">
                    <Clock size={11} className="text-[#C6A15B]" />
                    4.5 Hrs from New Delhi
                  </span>
                </div>

                <h3 className="font-serif text-xl sm:text-2xl text-[#2C2117] font-normal mt-1 leading-snug">
                  Vande Bharat & Express Trains
                </h3>
                <p className="font-cursive text-lg text-[#9A6B0A] -mt-0.5 mb-1.5 font-normal">
                  Picturesque Himalayan Foothills Journey
                </p>

                <p className="text-xs text-[#5A4F44] font-normal leading-relaxed">
                  High-speed Vande Bharat and Shatabdi express trains connect New Delhi directly to Haridwar (HW) and Yog Nagari Rishikesh (YNRK). Continuous private shuttles are stationed for guest reception.
                </p>
              </div>
            </div>
          </div>
        </RevealOnScroll>

        {/* 3. Sanctuary Accommodations & Cottages Luxury Card */}
        <RevealOnScroll delay={280}>
          <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-b from-[#FFFDFB] via-[#FFFBF8] to-[#FAF3F0] border-2 border-[#DFC48F]/90 shadow-[0_10px_35px_rgba(198,161,91,0.14)] hover:shadow-[0_16px_45px_rgba(198,161,91,0.22)] hover:border-[#C6A15B] transition-all duration-300 p-6 sm:p-7 group">
            {/* Shimmering Star Accent */}
            <div className="absolute top-4 right-4 text-[#C6A15B]/60 animate-pulse pointer-events-none">
              <Sparkles size={18} />
            </div>

            <div className="flex items-start gap-4">
              <div className="w-13 h-13 rounded-2xl bg-gradient-to-br from-[#FAF2F0] to-[#EBD5D1] border border-[#DFC48F] flex items-center justify-center shrink-0 shadow-xs text-[#9A6B0A] group-hover:scale-105 transition-transform duration-300">
                <Compass size={24} className="stroke-[1.8]" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <span className="text-[10px] font-sans font-bold tracking-[0.26em] text-[#9A6B0A] uppercase">
                    WEDDING SANCTUARY & COTTAGES
                  </span>
                  <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2.5 py-0.5 rounded-full bg-[#FAF2F0] border border-[#DFC48F] text-[#6E4B1F]">
                    Check-in: 2:00 PM · Check-out: 11:00 AM
                  </span>
                </div>

                <h3 className="font-serif text-2xl sm:text-[28px] text-[#241913] font-normal mt-1 leading-snug">
                  Anand Kashi by the Ganges
                </h3>
                <p className="font-cursive text-xl sm:text-2xl text-[#9A6B0A] -mt-0.5 mb-2 font-normal">
                  Private Riverside Suites & Cottages
                </p>

                <p className="text-xs sm:text-sm text-[#4A4038] font-light leading-relaxed mb-4">
                  Perched on the serene banks of the sacred River Ganga, Anand Kashi offers all wedding guests private riverside cottage suites, panoramic mountain vistas, and direct private ghat access.
                </p>

                {/* Highlights pill tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="text-[10px] font-medium px-2.5 py-1 rounded-full bg-[#FAF6F0] border border-[#DFC48F]/60 text-[#5A4F44]">
                    🌊 Private Ganga Beach & Ghat
                  </span>
                  <span className="text-[10px] font-medium px-2.5 py-1 rounded-full bg-[#FAF6F0] border border-[#DFC48F]/60 text-[#5A4F44]">
                    🏔️ Himalayan Valley Views
                  </span>
                  <span className="text-[10px] font-medium px-2.5 py-1 rounded-full bg-[#FAF6F0] border border-[#DFC48F]/60 text-[#5A4F44]">
                    ✨ Dedicated Hospitality Desk
                  </span>
                </div>

                {/* Interactive Map Trigger */}
                <button
                  type="button"
                  onClick={() => setIsMapModalOpen(true)}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#FAF2F0] hover:bg-[#F3E5E2] text-[#2C2117] text-xs font-sans font-semibold tracking-wider uppercase transition-all border border-[#DFC48F] shadow-2xs hover:scale-102 active:scale-98 cursor-pointer"
                >
                  <Map size={13} className="text-[#9A6B0A]" />
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

      <Divider />
    </section>
  );
};
