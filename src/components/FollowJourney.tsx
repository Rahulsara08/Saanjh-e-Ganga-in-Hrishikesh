import React from 'react';
import { SectionEyebrow, SectionHeading, Divider } from './BasicComponents';
import { RevealOnScroll } from './RevealOnScroll';
import { WeddingConfig, JourneyEvent } from '../types';
import { generateICS } from '../utils/ics';
import { PaperPlaneJourney } from './PaperPlaneJourney';

interface FollowJourneyProps {
  config: WeddingConfig;
}

// Concise, poetic one-line quotes for each ritual
const oneLineQuotes: { [key: string]: string } = {
  'Haldi & Phoolon Ki Holi': 'A shower of fragrant marigolds and laughter beside the sacred river.',
  'Riverside Mehndi & High Tea': 'Intricate henna blossoms with mountain music as the sun softens.',
  'Sangeet & Himalayan Starlight Gala': 'Dhol rhythms and starlit melodies echoing across pine-scented peaks.',
  'The Royal Barat & Welcome': 'A spirited dancing procession arriving at the sacred ghat gates.',
  'Varmala Ceremony': 'Exchanging fragrant rose and jasmine garlands with prayers by the river.',
  '7 Farre (Saat Phere) & Maha Aarti': 'Seven holy steps around the sacred fire as evening temple bells chime.',
  'The Royal Reception': 'A starlit evening of heartfelt toasts, joyful laughter, and a grand feast.',
};

export const FollowJourney: React.FC<FollowJourneyProps> = ({ config }) => {
  const handleAddToCalendar = (event: JourneyEvent) => {
    generateICS({
      title: `${event.title} · ${config.couple.brideName} & ${config.couple.groomName} Wedding`,
      description: `${oneLineQuotes[event.title] || event.description}\n\n${event.attire}`,
      location: event.venue,
      startDate: event.isoStart,
      endDate: event.isoEnd,
    });
  };

  return (
    <section id="journey" className="py-20 sm:py-28 px-3 sm:px-6 relative overflow-visible">
      <div className="max-w-4xl mx-auto relative">
        {/* Section Header */}
        <RevealOnScroll>
          <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
            <SectionEyebrow>WEDDING CELEBRATIONS</SectionEyebrow>
            <SectionHeading subtitle="Haldi · Mehndi · Sangeet · Barat · Varmala · 7 Farre · Reception">
              Wedding Celebrations & Sacred Rites
            </SectionHeading>
            <p className="font-serif italic text-xs xs:text-sm text-[#8A7F72] mt-2 max-w-sm mx-auto font-light leading-relaxed">
              Scroll down to send the sacred paper plane on its flight through each ritual along the Ganges.
            </p>
          </div>
        </RevealOnScroll>

        {/* ── Vertical Alternating Timeline with Continuous Paper Plane Flight ── */}
        <PaperPlaneJourney
          events={config.journey.events}
          oneLineQuotes={oneLineQuotes}
          onAddToCalendar={handleAddToCalendar}
        />
      </div>

      <Divider className="my-12 sm:my-16" />
    </section>
  );
};
