import React from 'react';
import { SectionEyebrow, SectionHeading, Divider } from './BasicComponents';
import { RevealOnScroll } from './RevealOnScroll';
import { WeddingConfig, JourneyEvent } from '../types';
import { generateICS } from '../utils/ics';
import { CalendarPlus, MapPin, Sparkles } from 'lucide-react';

interface FollowJourneyProps {
  config: WeddingConfig;
}

// Concise, poetic one-line quotes for each ritual (no heavy paragraphs, no cards)
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
    <section id="journey" className="py-24 px-4">
      <div className="max-w-6xl mx-auto">
        <RevealOnScroll>
          <div className="text-center max-w-2xl mx-auto mb-16">
            <SectionEyebrow>WEDDING CELEBRATIONS</SectionEyebrow>
            <SectionHeading subtitle="Haldi · Mehndi · Sangeet · Barat · Varmala · 7 Farre · Reception">
              Wedding Celebrations & Sacred Rites
            </SectionHeading>
          </div>
        </RevealOnScroll>

        {/* ── Mobile Chronological Stream: Rituals Flow ── */}
        <div className="w-full max-w-md mx-auto space-y-12">
          {config.journey.events.map((event, index) => (
              <RevealOnScroll key={event.title} delay={index * 60}>
                {/* Clean container without card boxes */}
                <div className="space-y-3 pb-12 border-b border-[#DFC48F]/40 last:border-b-0">
                  {/* Event Image */}
                  {event.imageUrl && (
                    <div className="w-full aspect-[16/10] sm:aspect-[2/1] rounded-3xl overflow-hidden shadow-xs mb-3">
                      <img
                        src={event.imageUrl}
                        alt={event.title}
                        loading="lazy"
                        className="w-full h-full object-cover transition-transform duration-700 hover:scale-102"
                      />
                    </div>
                  )}

                  {/* Date Badge (Clean text, no numbering) */}
                  <div>
                    <span className="text-[10px] font-semibold tracking-[0.25em] uppercase font-sans text-[#B88E4C]">
                      {event.date}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="font-serif text-3xl sm:text-4xl text-[#4A4038] font-normal tracking-wide">
                    {event.title}
                  </h3>

                  {/* Venue */}
                  <div className="flex items-center space-x-2 text-[#8A7F72] text-xs font-sans">
                    <MapPin size={13} className="text-[#C6A15B] shrink-0" />
                    <span className="font-medium tracking-wide">{event.venue}</span>
                  </div>

                  {/* One-Line Cursive Quote Directly on Background (No card box) */}
                  <p className="font-serif italic text-lg sm:text-xl text-[#C6A15B] font-light leading-relaxed pt-1">
                    “{oneLineQuotes[event.title] || event.description}”
                  </p>

                  {/* Attire Section & Add to Calendar */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
                    <div className="inline-flex items-center space-x-1.5 text-xs text-[#8A7F72]">
                      <Sparkles size={13} className="text-[#C6A15B] shrink-0" />
                      <span className="font-sans font-medium">{event.attire}</span>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleAddToCalendar(event)}
                      className="inline-flex items-center space-x-2 px-5 py-2 rounded-full bg-[#FAF6F0] hover:bg-[#F3EDE3] text-[#4A4038] text-[10px] tracking-wider uppercase font-medium border border-[#DFC48F] transition-all shadow-2xs self-start sm:self-auto"
                    >
                      <CalendarPlus size={12} className="text-[#C6A15B]" />
                      <span>Add to Calendar (.ics)</span>
                    </button>
                  </div>
                </div>
              </RevealOnScroll>
            ))}
        </div>
      </div>

      <Divider />
    </section>
  );
};
