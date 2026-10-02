import React from 'react';
import { SectionEyebrow, SectionHeading, Divider } from './BasicComponents';
import { RevealOnScroll } from './RevealOnScroll';
import { FramedPhoto } from './FramedPhoto';
import { WeddingConfig } from '../types';
import cherryBlossomBranch from '../assets/images/cherry_blossom_branch.png';
import pinkFlowerBouquet from '../assets/images/pink_flower_bouquet.png';

interface WithOurFamiliesProps {
  config: WeddingConfig;
}

export const WithOurFamilies: React.FC<WithOurFamiliesProps> = ({ config }) => {
  return (
    <section id="families" className="pt-12 pb-14 sm:pt-14 sm:pb-16 px-4 max-w-5xl mx-auto overflow-hidden">
      <RevealOnScroll>
        <div className="text-center max-w-xl mx-auto mb-10 sm:mb-12">
          <SectionEyebrow>{config.families.eyebrow}</SectionEyebrow>
          <SectionHeading subtitle={config.families.blessingQuote}>
            {config.families.heading}
          </SectionHeading>
        </div>
      </RevealOnScroll>

      {/* Stacked Vertical Layout: One on top, one on bottom, framed directly on page background */}
      <div className="flex flex-col items-center space-y-16 sm:space-y-20 max-w-md mx-auto w-full">
        {/* Bride's Parents - On Top */}
        <RevealOnScroll delay={100} className="w-full flex justify-center">
          <div className="text-center flex flex-col items-center w-full relative">
            {/* Cherry Blossom Branch: Emerging from the left screen border into background behind frame */}
            <div
              aria-hidden="true"
              className="absolute -left-10 sm:-left-14 -top-8 sm:-top-12 w-48 sm:w-60 pointer-events-none select-none z-0 overflow-visible"
            >
              <img
                src={cherryBlossomBranch}
                alt=""
                className="w-full h-auto object-contain opacity-95 drop-shadow-[0_4px_14px_rgba(74,64,56,0.08)]"
              />
            </div>

            {/* Hand-drawn Wavy Floral Border Frame (with Pink Flower Bouquet Accent) */}
            <div className="w-56 sm:w-64 mb-5 transition-transform duration-500 hover:scale-[1.02] relative z-10">
              <FramedPhoto
                src={config.families.brideParents.photoUrl}
                alt={config.families.brideParents.names}
              />
              {/* Pink Flower Bouquet: Placed delicately at bottom right of the frame */}
              <div
                aria-hidden="true"
                className="absolute -right-4 sm:-right-6 -bottom-5 sm:-bottom-7 w-20 sm:w-24 pointer-events-none select-none z-20"
              >
                <img
                  src={pinkFlowerBouquet}
                  alt=""
                  className="w-full h-auto object-contain rotate-6 drop-shadow-[0_6px_14px_rgba(74,64,56,0.15)]"
                />
              </div>
            </div>

            <span className="text-[10px] font-medium tracking-[0.3em] uppercase text-[#B88E4C] font-sans mb-1 relative z-10">
              {config.families.brideParents.side}
            </span>

            <h3 className="font-serif text-2xl sm:text-3xl text-[#4A4038] font-normal mb-2 relative z-10">
              {config.families.brideParents.names}
            </h3>

            <p className="font-serif italic text-sm text-[#8A7F72] max-w-xs leading-relaxed relative z-10">
              “{config.families.brideParents.blessing}”
            </p>
          </div>
        </RevealOnScroll>

        {/* Groom's Parents - On Bottom with Mirrored Branch from Right */}
        <RevealOnScroll delay={200} className="w-full flex justify-center">
          <div className="text-center flex flex-col items-center w-full relative">
            {/* Cherry Blossom Branch: Emerging from the right screen border into background behind frame */}
            <div
              aria-hidden="true"
              className="absolute -right-10 sm:-right-14 -top-8 sm:-top-12 w-48 sm:w-60 pointer-events-none select-none z-0 overflow-visible"
            >
              <img
                src={cherryBlossomBranch}
                alt=""
                className="w-full h-auto object-contain scale-x-[-1] opacity-95 drop-shadow-[0_4px_14px_rgba(74,64,56,0.08)]"
              />
            </div>

            {/* Hand-drawn Wavy Floral Border Frame (with Pink Flower Bouquet Accent) */}
            <div className="w-56 sm:w-64 mb-5 transition-transform duration-500 hover:scale-[1.02] relative z-10">
              <FramedPhoto
                src={config.families.groomParents.photoUrl}
                alt={config.families.groomParents.names}
              />
              {/* Pink Flower Bouquet: Placed delicately at bottom left of the frame */}
              <div
                aria-hidden="true"
                className="absolute -left-4 sm:-left-6 -bottom-5 sm:-bottom-7 w-20 sm:w-24 pointer-events-none select-none z-20"
              >
                <img
                  src={pinkFlowerBouquet}
                  alt=""
                  className="w-full h-auto object-contain -rotate-6 scale-x-[-1] drop-shadow-[0_6px_14px_rgba(74,64,56,0.15)]"
                />
              </div>
            </div>

            <span className="text-[10px] font-medium tracking-[0.3em] uppercase text-[#B88E4C] font-sans mb-1 relative z-10">
              {config.families.groomParents.side}
            </span>

            <h3 className="font-serif text-2xl sm:text-3xl text-[#4A4038] font-normal mb-2 relative z-10">
              {config.families.groomParents.names}
            </h3>

            <p className="font-serif italic text-sm text-[#8A7F72] max-w-xs leading-relaxed relative z-10">
              “{config.families.groomParents.blessing}”
            </p>
          </div>
        </RevealOnScroll>
      </div>

      <Divider className="mt-6 sm:mt-8" />
    </section>
  );
};
