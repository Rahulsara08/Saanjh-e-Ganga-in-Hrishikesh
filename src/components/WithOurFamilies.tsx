import React, { useRef } from 'react';
import { SectionEyebrow, SectionHeading, Divider } from './BasicComponents';
import { RevealOnScroll } from './RevealOnScroll';
import { FramedPhoto } from './FramedPhoto';
import { GrowingPlant } from './GrowingPlant';
import { WeddingConfig } from '../types';

interface WithOurFamiliesProps {
  config: WeddingConfig;
}

export const WithOurFamilies: React.FC<WithOurFamiliesProps> = ({ config }) => {
  const sectionRef = useRef<HTMLElement>(null);

  return (
    <section
      id="families"
      ref={sectionRef}
      className="py-20 px-4 max-w-5xl mx-auto relative overflow-visible"
    >
      {/* ── Botanical Plant Drawing & Bloom Animation Accent ── */}
      <GrowingPlant
        containerRef={sectionRef}
        className="absolute -right-4 sm:-right-8 top-24 sm:top-32 w-36 sm:w-52 h-[420px] sm:h-[580px] opacity-75 sm:opacity-85 pointer-events-none -z-0 hidden xs:block"
      />

      <RevealOnScroll>
        <div className="text-center max-w-xl mx-auto mb-14 relative z-10">
          <SectionEyebrow>{config.families.eyebrow}</SectionEyebrow>
          <SectionHeading subtitle={config.families.blessingQuote}>
            {config.families.heading}
          </SectionHeading>
        </div>
      </RevealOnScroll>

      {/* Stacked Vertical Layout: One on top, one on bottom, framed directly on page background */}
      <div className="flex flex-col items-center space-y-16 sm:space-y-20 max-w-md mx-auto w-full relative z-10">
        {/* ── 1. Groom's Parents ── */}
        <RevealOnScroll delay={100} className="w-full flex justify-center">
          <div className="text-center flex flex-col items-center w-full">
            {/* Hand-drawn Wavy Floral Border (No card box, photo sits directly on page background inside the frame) */}
            <div className="w-56 sm:w-64 mb-5 transition-transform duration-500 hover:scale-[1.02]">
              <FramedPhoto
                src={config.families.groomParents.photoUrl}
                alt={config.families.groomParents.names}
              />
            </div>

            {/* Label outside the frame */}
            <span className="text-[10px] sm:text-[11px] font-sans font-semibold tracking-[0.28em] uppercase text-[#B88E4C] mb-1.5">
              {config.families.groomParents.side}
            </span>

            {/* Names outside the frame */}
            <h3 className="font-serif text-2xl sm:text-3xl text-[#4A4038] font-normal mb-2 leading-tight">
              {config.families.groomParents.names}
            </h3>

            {/* Blessing quote outside the frame */}
            <p className="font-serif italic text-sm text-[#8A7F72] max-w-xs leading-relaxed">
              “{config.families.groomParents.blessing}”
            </p>
          </div>
        </RevealOnScroll>

        {/* ── 2. Bride's Parents ── */}
        <RevealOnScroll delay={200} className="w-full flex justify-center">
          <div className="text-center flex flex-col items-center w-full">
            {/* Hand-drawn Wavy Floral Border (No card box, photo sits directly on page background inside the frame) */}
            <div className="w-56 sm:w-64 mb-5 transition-transform duration-500 hover:scale-[1.02]">
              <FramedPhoto
                src={config.families.brideParents.photoUrl}
                alt={config.families.brideParents.names}
              />
            </div>

            {/* Label outside the frame */}
            <span className="text-[10px] sm:text-[11px] font-sans font-semibold tracking-[0.28em] uppercase text-[#B88E4C] mb-1.5">
              {config.families.brideParents.side}
            </span>

            {/* Names outside the frame */}
            <h3 className="font-serif text-2xl sm:text-3xl text-[#4A4038] font-normal mb-2 leading-tight">
              {config.families.brideParents.names}
            </h3>

            {/* Blessing quote outside the frame */}
            <p className="font-serif italic text-sm text-[#8A7F72] max-w-xs leading-relaxed">
              “{config.families.brideParents.blessing}”
            </p>
          </div>
        </RevealOnScroll>
      </div>

      <Divider className="mt-16" />
    </section>
  );
};
