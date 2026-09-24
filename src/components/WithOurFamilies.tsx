import React from 'react';
import { SectionEyebrow, SectionHeading, Divider, PhotoFrame } from './BasicComponents';
import { RevealOnScroll } from './RevealOnScroll';
import { WeddingConfig } from '../types';

interface WithOurFamiliesProps {
  config: WeddingConfig;
}

export const WithOurFamilies: React.FC<WithOurFamiliesProps> = ({ config }) => {
  return (
    <section id="families" className="py-20 px-4 max-w-5xl mx-auto overflow-hidden">
      <RevealOnScroll>
        <div className="text-center max-w-xl mx-auto mb-12">
          <SectionEyebrow>{config.families.eyebrow}</SectionEyebrow>
          <SectionHeading subtitle={config.families.blessingQuote}>
            {config.families.heading}
          </SectionHeading>
        </div>
      </RevealOnScroll>

      {/* Split layout: Bride's parents and Groom's parents */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
        {/* Bride's Parents */}
        <RevealOnScroll delay={100} className="w-full">
          <div className="p-7 sm:p-9 rounded-3xl bg-[#FAF6F0] border border-[#DFC48F]/70 text-center flex flex-col items-center shadow-xs transition-transform duration-500 hover:-translate-y-1">
            <div className="mb-5">
              <PhotoFrame
                src={config.families.brideParents.photoUrl}
                alt={config.families.brideParents.names}
                shape="circle"
                className="w-40 h-40 sm:w-48 sm:h-48"
              />
            </div>

            <span className="text-[10px] font-medium tracking-[0.3em] uppercase text-[#B88E4C] font-sans mb-1">
              {config.families.brideParents.side}
            </span>

            <h3 className="font-serif text-2xl sm:text-3xl text-[#4A4038] font-normal mb-2">
              {config.families.brideParents.names}
            </h3>

            <p className="font-serif italic text-sm text-[#8A7F72] max-w-xs leading-relaxed">
              “{config.families.brideParents.blessing}”
            </p>
          </div>
        </RevealOnScroll>

        {/* Groom's Parents */}
        <RevealOnScroll delay={200} className="w-full">
          <div className="p-7 sm:p-9 rounded-3xl bg-[#FAF6F0] border border-[#DFC48F]/70 text-center flex flex-col items-center shadow-xs transition-transform duration-500 hover:-translate-y-1">
            <div className="mb-5">
              <PhotoFrame
                src={config.families.groomParents.photoUrl}
                alt={config.families.groomParents.names}
                shape="circle"
                className="w-40 h-40 sm:w-48 sm:h-48"
              />
            </div>

            <span className="text-[10px] font-medium tracking-[0.3em] uppercase text-[#B88E4C] font-sans mb-1">
              {config.families.groomParents.side}
            </span>

            <h3 className="font-serif text-2xl sm:text-3xl text-[#4A4038] font-normal mb-2">
              {config.families.groomParents.names}
            </h3>

            <p className="font-serif italic text-sm text-[#8A7F72] max-w-xs leading-relaxed">
              “{config.families.groomParents.blessing}”
            </p>
          </div>
        </RevealOnScroll>
      </div>

      <Divider />
    </section>
  );
};
