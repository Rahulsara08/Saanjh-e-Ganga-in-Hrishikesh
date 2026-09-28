import React, { useState, useEffect, useRef } from 'react';
import { SectionEyebrow, SectionHeading, Divider } from './BasicComponents';
import { RevealOnScroll } from './RevealOnScroll';
import { WeddingConfig } from '../types';
import { generateICS } from '../utils/ics';
import { Heart, CalendarPlus, CheckCircle2 } from 'lucide-react';
import { FloatingHearts, FloatingHeartsRef } from './FloatingHearts';

interface RSVPSectionProps {
  config: WeddingConfig;
  onRSVPSubmitted?: () => void;
  onAccept?: () => void;
}

const RSVP_ACCEPT_KEY = 'meher_kabir_rsvp_accepted_v5';

export const RSVPSection: React.FC<RSVPSectionProps> = ({
  config,
  onRSVPSubmitted,
  onAccept,
}) => {
  const [isAccepted, setIsAccepted] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(RSVP_ACCEPT_KEY);
      return saved === 'true';
    } catch (e) {
      return false;
    }
  });

  const heartsRef = useRef<FloatingHeartsRef>(null);

  const handleAcceptClick = () => {
    if (isAccepted) return;

    // Trigger floating hearts animation
    if (heartsRef.current) {
      heartsRef.current.trigger();
    }

    // Save accepted state to localStorage
    try {
      localStorage.setItem(RSVP_ACCEPT_KEY, 'true');
    } catch (e) {
      console.error('Failed to save RSVP state in localStorage', e);
    }

    // Update state to thank you message
    setIsAccepted(true);

    // Callbacks
    if (onAccept) onAccept();
    if (onRSVPSubmitted) onRSVPSubmitted();
  };

  const handleDownloadCalendar = () => {
    generateICS({
      title: `${config.couple.brideName} & ${config.couple.groomName}'s Rishikesh Wedding`,
      description: `Wedding celebration of ${config.couple.brideName} & ${config.couple.groomName} at ${config.couple.venueName}, ${config.couple.venueCity}.\n\nSacred Vedic union on the banks of River Ganga.`,
      location: `${config.couple.venueName}, ${config.couple.venueCity}, ${config.couple.venueCountry}`,
      startDate: config.couple.targetTimestamp,
      endDate: '2027-11-22T13:00:00+05:30',
    });
  };

  return (
    <section id="rsvp" className="py-20 px-4 max-w-xl mx-auto relative">
      {/* Floating Hearts Animation Layer */}
      <FloatingHearts ref={heartsRef} />

      {/* Header */}
      <RevealOnScroll>
        <div className="text-center mb-8">
          <SectionEyebrow>
            {config.rsvp.eyebrow} · {config.rsvp.deadlineText}
          </SectionEyebrow>
          <SectionHeading>Kindly Reply</SectionHeading>
          <p className="font-serif italic text-base sm:text-lg text-[#8A7F72] mt-2">
            “Your presence completes our celebration beside the sacred River Ganga.”
          </p>
        </div>
      </RevealOnScroll>

      {/* Prominent Acceptance Container */}
      <RevealOnScroll delay={100}>
        <div className="p-8 sm:p-10 rounded-3xl bg-[#FFF9F8]/85 backdrop-blur-xs border border-[#DFC48F]/70 shadow-sm text-center flex flex-col items-center justify-center space-y-6">
          {/* Prominent Single Acceptance Button */}
          <div className="w-full flex flex-col items-center justify-center">
            <button
              type="button"
              disabled={isAccepted}
              onClick={handleAcceptClick}
              aria-label={
                isAccepted
                  ? 'RSVP already accepted, see you at the wedding'
                  : 'Joyfully accept wedding invitation'
              }
              className={`w-full max-w-md min-h-[54px] px-8 py-4 rounded-full font-sans text-xs sm:text-sm font-semibold tracking-[0.22em] uppercase transition-all duration-500 ease-out flex items-center justify-center space-x-2.5 outline-none focus:ring-2 focus:ring-[#C6A15B] focus:ring-offset-2 select-none cursor-pointer ${
                isAccepted
                  ? 'bg-[#F3E5E2] text-[#4A4038] border border-[#DFC48F]/80 shadow-inner cursor-default opacity-95 scale-100'
                  : 'bg-gradient-to-r from-[#C6A15B] via-[#B88E4C] to-[#C6A15B] hover:from-[#B88E4C] hover:to-[#9A6B0A] text-white shadow-md hover:shadow-[0_12px_28px_-6px_rgba(198,161,91,0.45)] hover:scale-[1.03] active:scale-[0.98]'
              }`}
            >
              {isAccepted ? (
                <span className="flex items-center space-x-2 transition-opacity duration-500 animate-fade-in">
                  <CheckCircle2 size={16} className="text-[#9A6B0A] shrink-0" />
                  <span>Thank you, see you at the wedding!</span>
                </span>
              ) : (
                <span className="flex items-center space-x-2 transition-opacity duration-500">
                  <Heart size={15} className="fill-white shrink-0 animate-pulse" />
                  <span>Joyfully Accept</span>
                </span>
              )}
            </button>

            {isAccepted && (
              <p className="font-serif italic text-sm text-[#8A7F72] mt-3 animate-fade-in">
                Your acceptance has been graciously recorded.
              </p>
            )}
          </div>

          {/* Add to Calendar Option */}
          <div className="pt-2 flex justify-center border-t border-[#DFC48F]/30 w-full">
            <button
              type="button"
              onClick={handleDownloadCalendar}
              className="px-6 py-2.5 rounded-full bg-[#FAF6F0] hover:bg-[#F3EDE3] text-[#4A4038] text-[11px] font-sans font-medium tracking-wider uppercase transition-colors border border-[#DFC48F] flex items-center space-x-2 shadow-2xs cursor-pointer"
            >
              <CalendarPlus size={13} className="text-[#C6A15B]" />
              <span>Add to Calendar (.ics)</span>
            </button>
          </div>
        </div>
      </RevealOnScroll>

      <Divider />
    </section>
  );
};
