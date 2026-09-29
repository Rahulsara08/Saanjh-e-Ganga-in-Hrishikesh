import React from 'react';
import { SectionEyebrow, SectionHeading, Divider } from './BasicComponents';
import { RevealOnScroll } from './RevealOnScroll';
import { OptimizedImage } from './OptimizedImage';
import { WeddingConfig } from '../types';

interface WithOurFamiliesProps {
  config: WeddingConfig;
}

// Royal Indian Heritage Silhouette (Normalized 0..1 for SVG clipPathUnits="objectBoundingBox")
const ROYAL_ARCH_CLIP =
  'M 0.50 0.02 C 0.54 0.03, 0.59 0.045, 0.64 0.07 C 0.78 0.12, 0.94 0.18, 0.97 0.28 L 0.97 0.88 C 0.97 0.95, 0.93 0.98, 0.86 0.98 L 0.14 0.98 C 0.07 0.98, 0.03 0.95, 0.03 0.88 L 0.03 0.28 C 0.06 0.18, 0.22 0.12, 0.36 0.07 C 0.41 0.045, 0.46 0.03, 0.50 0.02 Z';

const ROYAL_ARCH_STROKE =
  'M 50 2 C 54 3, 59 4.5, 64 7 C 78 12, 94 18, 97 28 L 97 88 C 97 95, 93 98, 86 98 L 14 98 C 7 98, 3 95, 3 88 L 3 28 C 6 18, 22 12, 36 7 C 41 4.5, 46 3, 50 2 Z';

export const WithOurFamilies: React.FC<WithOurFamiliesProps> = ({ config }) => {
  return (
    <section id="families" className="py-20 px-4 max-w-5xl mx-auto overflow-hidden">
      {/* Hidden SVG defs for custom shape */}
      <svg className="sr-only" aria-hidden="true" width="0" height="0">
        <defs>
          <clipPath id="royal-arch-clip" clipPathUnits="objectBoundingBox">
            <path d={ROYAL_ARCH_CLIP} />
          </clipPath>
        </defs>
      </svg>

      <RevealOnScroll>
        <div className="text-center max-w-xl mx-auto mb-14">
          <SectionEyebrow>{config.families.eyebrow}</SectionEyebrow>
          <SectionHeading subtitle={config.families.blessingQuote}>
            {config.families.heading}
          </SectionHeading>
        </div>
      </RevealOnScroll>

      {/* Stacked Vertical Layout: One on top, one on down with the same frame */}
      <div className="flex flex-col items-center space-y-16 sm:space-y-20 max-w-md mx-auto w-full">
        {/* Bride's Parents - On Top */}
        <RevealOnScroll delay={100} className="w-full">
          <div className="text-center flex flex-col items-center w-full">
            {/* Same Royal Arch Shape with delicate gold hairline */}
            <div
              className="relative w-56 h-72 sm:w-64 sm:h-80 mb-6 transition-transform duration-500 hover:scale-[1.02]"
              style={{ filter: 'drop-shadow(0 12px 24px rgba(74, 64, 56, 0.14))' }}
            >
              <div
                className="w-full h-full overflow-hidden bg-[#FAF6F0]"
                style={{ clipPath: 'url(#royal-arch-clip)' }}
              >
                <OptimizedImage
                  src={config.families.brideParents.photoUrl}
                  alt={config.families.brideParents.names}
                  disableAspectRatio={true}
                  sizes="320px"
                  className="w-full h-full"
                  imgClassName="w-full h-full object-cover object-center transition-transform duration-700 hover:scale-105"
                />
              </div>

              {/* Exact silhouette gold hairline border */}
              <svg
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
                className="absolute inset-0 pointer-events-none w-full h-full overflow-visible"
              >
                <path
                  d={ROYAL_ARCH_STROKE}
                  fill="none"
                  stroke="#DFC48F"
                  strokeWidth="1.25"
                  strokeOpacity="0.85"
                />
              </svg>
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

        {/* Groom's Parents - On Bottom with the Same Frame */}
        <RevealOnScroll delay={200} className="w-full">
          <div className="text-center flex flex-col items-center w-full">
            {/* Same Royal Arch Shape with delicate gold hairline */}
            <div
              className="relative w-56 h-72 sm:w-64 sm:h-80 mb-6 transition-transform duration-500 hover:scale-[1.02]"
              style={{ filter: 'drop-shadow(0 12px 24px rgba(74, 64, 56, 0.14))' }}
            >
              <div
                className="w-full h-full overflow-hidden bg-[#FAF6F0]"
                style={{ clipPath: 'url(#royal-arch-clip)' }}
              >
                <OptimizedImage
                  src={config.families.groomParents.photoUrl}
                  alt={config.families.groomParents.names}
                  disableAspectRatio={true}
                  sizes="320px"
                  className="w-full h-full"
                  imgClassName="w-full h-full object-cover object-center transition-transform duration-700 hover:scale-105"
                />
              </div>

              {/* Exact silhouette gold hairline border */}
              <svg
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
                className="absolute inset-0 pointer-events-none w-full h-full overflow-visible"
              >
                <path
                  d={ROYAL_ARCH_STROKE}
                  fill="none"
                  stroke="#DFC48F"
                  strokeWidth="1.25"
                  strokeOpacity="0.85"
                />
              </svg>
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
