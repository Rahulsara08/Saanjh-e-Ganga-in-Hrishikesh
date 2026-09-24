import React from 'react';
import { SectionEyebrow, SectionHeading, Divider } from './BasicComponents';
import { MomentSVG } from './EventSVGs';
import { RevealOnScroll } from './RevealOnScroll';
import { WeddingConfig } from '../types';

interface OrderOfDayProps {
  config: WeddingConfig;
}

export const OrderOfDay: React.FC<OrderOfDayProps> = ({ config }) => {
  return (
    <section id="order-of-day" className="py-20 px-4 max-w-4xl mx-auto">
      <RevealOnScroll>
        <div className="text-center">
          <SectionEyebrow>{config.orderOfDay.eyebrow}</SectionEyebrow>
          <SectionHeading subtitle={config.orderOfDay.subtitle}>
            {config.orderOfDay.heading}
          </SectionHeading>
        </div>
      </RevealOnScroll>

      {/* Timeline container */}
      <div className="relative mt-16">
        {/* Central hairline gold spine */}
        <div className="absolute left-6 md:left-1/2 top-4 bottom-4 w-[1px] bg-gradient-to-b from-transparent via-[#DFC48F] to-transparent -translate-x-1/2" />

        <div className="space-y-12 sm:space-y-16">
          {config.orderOfDay.moments.map((moment, index) => {
            const isEven = index % 2 === 0;

            return (
              <RevealOnScroll key={moment.id} delay={index * 100}>
                <div
                  className={`relative flex flex-col md:flex-row items-start md:items-center ${
                    isEven ? 'md:flex-row-reverse' : ''
                  }`}
                >
                  {/* Center Node / Moment Node on spine */}
                  <div className="absolute left-6 md:left-1/2 -translate-x-1/2 flex items-center justify-center z-10">
                    <div className="w-10 h-10 rounded-full bg-[#FAF6F0] border-2 border-[#C6A15B] flex items-center justify-center shadow-sm">
                      <div className="w-3 h-3 rounded-full bg-[#E3B9B4]" />
                    </div>
                  </div>

                  {/* Content Card (offset on desktop, padded on mobile) */}
                  <div
                    className={`ml-16 md:ml-0 md:w-1/2 ${
                      isEven ? 'md:pl-12 text-left' : 'md:pr-12 md:text-right'
                    } w-full`}
                  >
                    <div className="bg-[#F3EDE3]/70 hover:bg-[#F3EDE3] transition-colors p-5 sm:p-6 rounded-2xl border border-[#DFC48F]/40 shadow-xs group">
                      <div
                        className={`flex flex-col sm:flex-row items-start sm:items-center gap-4 ${
                          isEven ? '' : 'md:flex-row-reverse'
                        }`}
                      >
                        {/* Real SVG Event Artwork */}
                        <div className="p-2.5 rounded-xl bg-[#FAF6F0] border border-[#DFC48F]/50 shadow-2xs text-[#C6A15B] group-hover:scale-105 transition-transform duration-300 shrink-0">
                          <MomentSVG type={moment.iconType} size={48} />
                        </div>

                        <div className="flex-1">
                          <span className="inline-block font-sans text-xs font-semibold tracking-[0.25em] text-[#C6A15B] uppercase mb-1">
                            {moment.time}
                          </span>
                          <h3 className="font-serif text-xl sm:text-2xl text-[#4A4038] font-normal">
                            {moment.title}
                          </h3>
                          <p className="font-serif italic text-sm text-[#8A7F72] mt-0.5 mb-2">
                            {moment.subtitle}
                          </p>
                          <p className="font-sans text-xs sm:text-sm text-[#4A4038]/90 font-light leading-relaxed">
                            {moment.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </RevealOnScroll>
            );
          })}
        </div>
      </div>

      <Divider />
    </section>
  );
};
