import React, { useRef } from 'react';
import { SectionEyebrow, SectionHeading, Divider } from './BasicComponents';
import { RevealOnScroll } from './RevealOnScroll';
import { WeddingConfig, JourneyEvent } from '../types';
import { generateICS } from '../utils/ics';
import { EventRow, EventRowProps } from './EventRow';
import { ScrollPaperPlane } from './ScrollPaperPlane';

interface FollowJourneyProps {
  config: WeddingConfig;
}

export const FollowJourney: React.FC<FollowJourneyProps> = ({ config }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const rowRefs = useRef<(HTMLDivElement | null)[]>([]);

  const handleAddToCalendar = (event: JourneyEvent, shortName: string) => {
    generateICS({
      title: `${shortName} · ${config.couple.brideName} & ${config.couple.groomName} Wedding`,
      description: `${event.description}\n\n${event.attire}`,
      location: event.venue,
      startDate: event.isoStart,
      endDate: event.isoEnd,
    });
  };

  // 7 Events in exact order, no day-grouping, no numbering
  // Haldi (left), Mehndi (right), Sangeet (left), Baraat (right), Varmala (left), Saat Phere (right), Reception (left)
  const eventItems: Omit<EventRowProps, 'rowRef' | 'onAddToCalendar'>[] = [
    {
      image: config.journey.events[0]?.imageUrl || '',
      side: 'left',
      name: 'Haldi',
      dateTime: config.journey.events[0]?.date || '20 Nov · 10:30 AM',
      venue: config.journey.events[0]?.venue || 'The Riverfront Kuan Lawn · Anand Kashi',
      attire: 'Sunshine Yellows, Marigold & Ivory Cottons',
      altText: 'Haldi ceremony illustration with fragrant marigolds and turmeric',
    },
    {
      image: config.journey.events[1]?.imageUrl || '',
      side: 'right',
      name: 'Mehndi',
      dateTime: config.journey.events[1]?.date || '20 Nov · 4:30 PM',
      venue: config.journey.events[1]?.venue || 'The Temple Orchard · Rishikesh',
      attire: 'Sage Green, Olive & Floral Pastels',
      altText: 'Riverside Mehndi ceremony illustration with intricate henna',
    },
    {
      image: config.journey.events[2]?.imageUrl || '',
      side: 'left',
      name: 'Sangeet',
      dateTime: config.journey.events[2]?.date || '20 Nov · 7:30 PM',
      venue: config.journey.events[2]?.venue || 'The Amphitheatre Lawn by the River',
      attire: 'Royal Velvet, Silk & Shimmering Festive Wear',
      altText: 'Sangeet gala illustration with festive mountain dance and music',
    },
    {
      image: config.journey.events[3]?.imageUrl || '',
      side: 'right',
      name: 'Baraat',
      dateTime: config.journey.events[3]?.date || '21 Nov · 3:30 PM',
      venue: config.journey.events[3]?.venue || 'The Pine Path to Holy Ghat · Rishikesh',
      attire: 'Royal Sherwanis, Safa Turbans & Banarasi Silks',
      altText: 'Baraat groom procession illustration with brass band and dhol',
    },
    {
      image: config.journey.events[4]?.imageUrl || '',
      side: 'left',
      name: 'Varmala',
      dateTime: config.journey.events[4]?.date || '21 Nov · 5:00 PM',
      venue: config.journey.events[4]?.venue || 'The Riverfront Floral Deck · Anand Kashi',
      attire: 'Pastel Royal Silks',
      altText: 'Varmala garland exchange ceremony illustration beside the Ganges',
    },
    {
      image: config.journey.events[5]?.imageUrl || '',
      side: 'right',
      name: 'Saat Phere',
      dateTime: config.journey.events[5]?.date || '21 Nov · 6:30 PM',
      venue: config.journey.events[5]?.venue || 'The Holy Ganga Ghat Mandap · Anand Kashi',
      attire: 'Raw Silk, Organza & Temple Gold',
      altText: '7 Farre Saat Phere Vedic vows illustration around the sacred Agni fire',
    },
    {
      image: config.journey.events[6]?.imageUrl || '',
      side: 'left',
      name: 'Reception',
      dateTime: config.journey.events[6]?.date || '21 Nov · 8:30 PM',
      venue: config.journey.events[6]?.venue || 'The Riverside Starlight Lawn · Anand Kashi',
      attire: 'Formal Evening Elegance',
      altText: 'Royal Reception starlight banquet illustration',
    },
  ];

  return (
    <section id="journey" className="pt-10 pb-16 sm:pt-14 sm:pb-20 px-3 sm:px-6 relative overflow-visible">
      <div className="max-w-3xl mx-auto relative">
        {/* Section Header */}
        <RevealOnScroll>
          <div className="text-center max-w-xl mx-auto mb-5 sm:mb-7">
            <SectionEyebrow>WEDDING CELEBRATIONS</SectionEyebrow>
            <SectionHeading subtitle="Haldi · Mehndi · Sangeet · Baraat · Varmala · Saat Phere · Reception">
              Wedding Celebrations & Sacred Rites
            </SectionHeading>
            <p className="font-serif italic text-xs xs:text-sm text-[#8A7F72] mt-1.5 max-w-sm mx-auto font-light leading-relaxed">
              Scroll down to send the sacred paper plane on its flight through each ritual along the Ganges.
            </p>
          </div>
        </RevealOnScroll>

        {/* ── Flight Path Container with Auto-Generated SVG & Alternating Plain Event Rows ── */}
        <div ref={containerRef} className="relative w-full overflow-visible pb-36 sm:pb-44">
          {/* Scroll-driven Paper Plane Flight System */}
          <ScrollPaperPlane containerRef={containerRef} rowRefs={rowRefs} />

          {/* Seven Plain Alternating Event Rows (No card/box chrome) */}
          <div className="w-full relative z-20 flex flex-col">
            {eventItems.map((item, idx) => (
              <EventRow
                key={item.name}
                rowRef={(el) => {
                  rowRefs.current[idx] = el;
                }}
                image={item.image}
                side={item.side}
                name={item.name}
                dateTime={item.dateTime}
                venue={item.venue}
                attire={item.attire}
                altText={item.altText}
                onAddToCalendar={() => {
                  const ev = config.journey.events[idx];
                  if (ev) handleAddToCalendar(ev, item.name);
                }}
              />
            ))}
          </div>
        </div>
      </div>

      <Divider className="my-4 sm:my-6" />
    </section>
  );
};
