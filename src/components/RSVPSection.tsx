import React, { useState } from 'react';
import { SectionEyebrow, SectionHeading, Divider } from './BasicComponents';
import { RevealOnScroll } from './RevealOnScroll';
import { WeddingConfig, RSVPRecord } from '../types';
import { generateICS } from '../utils/ics';
import { Heart, CalendarPlus, CheckCircle2, Users } from 'lucide-react';
import { SmoothInput } from './ui/SmoothInput';

interface RSVPSectionProps {
  config: WeddingConfig;
  onRSVPSubmitted?: () => void;
}

const RSVP_STORAGE_KEY = 'meher_kabir_rsvps_warm_v4';

export const RSVPSection: React.FC<RSVPSectionProps> = ({ config, onRSVPSubmitted }) => {
  const [fullName, setFullName] = useState('');
  const [guestCount, setGuestCount] = useState<number | string>(2);
  const [note, setNote] = useState('');
  const [submittedRecord, setSubmittedRecord] = useState<RSVPRecord | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) return;

    const parsedCount = typeof guestCount === 'number' ? guestCount : parseInt(guestCount, 10) || 1;

    const newRecord: RSVPRecord = {
      id: `rsvp-${Date.now()}`,
      attendance: 'accept',
      fullName: fullName.trim(),
      email: '',
      phone: '',
      guestCount: Math.max(1, parsedCount),
      events: ['haldi', 'mehndi', 'sangeet', 'barat', 'ceremony'],
      dietary: '',
      note: note.trim(),
      submittedAt: new Date().toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      }),
    };

    try {
      const existing = localStorage.getItem(RSVP_STORAGE_KEY);
      const parsed: RSVPRecord[] = existing ? JSON.parse(existing) : [];
      const updated = [newRecord, ...parsed];
      localStorage.setItem(RSVP_STORAGE_KEY, JSON.stringify(updated));
    } catch (err) {
      console.error(err);
    }

    setSubmittedRecord(newRecord);
    if (onRSVPSubmitted) onRSVPSubmitted();
  };

  const handleDownloadFullWeddingCalendar = () => {
    generateICS({
      title: `${config.couple.brideName} & ${config.couple.groomName}'s Rishikesh Wedding`,
      description: `Wedding celebration of ${config.couple.brideName} & ${config.couple.groomName} at ${config.couple.venueName}, ${config.couple.venueCity}.\n\nSacred Vedic union on the banks of River Ganga.`,
      location: `${config.couple.venueName}, ${config.couple.venueCity}, ${config.couple.venueCountry}`,
      startDate: config.couple.targetTimestamp,
      endDate: '2027-11-22T13:00:00+05:30',
    });
  };

  return (
    <section id="rsvp" className="py-20 px-4 max-w-xl mx-auto">
      <RevealOnScroll>
        <div className="text-center mb-8">
          <SectionEyebrow>
            {config.rsvp.eyebrow} · {config.rsvp.deadlineText}
          </SectionEyebrow>
          <SectionHeading>
            Kindly Reply
          </SectionHeading>
          <p className="font-serif italic text-base text-[#8A7F72] mt-2">
            “Your presence completes our celebration beside the sacred River Ganga.”
          </p>
        </div>
      </RevealOnScroll>

      <RevealOnScroll delay={100}>
        <div className="p-7 sm:p-9 rounded-3xl bg-[#FFF9F8]/85 backdrop-blur-xs border border-[#DFC48F]/70 shadow-xs">
          {submittedRecord ? (
            <div className="text-center py-6 space-y-4">
              <div className="w-12 h-12 rounded-full bg-[#FFF6F5] border border-[#DFC48F] mx-auto flex items-center justify-center text-[#C6A15B]">
                <CheckCircle2 size={24} />
              </div>

              <div>
                <h3 className="font-serif text-3xl text-[#4A4038] font-normal mb-1">
                  We Await You with Joy!
                </h3>
                <p className="font-serif italic text-[#8A7F72] text-base max-w-md mx-auto">
                  Thank you, {submittedRecord.fullName}. Your gracious RSVP for a party of{' '}
                  {submittedRecord.guestCount} has been recorded.
                </p>
              </div>

              <div className="pt-2 flex justify-center">
                <button
                  type="button"
                  onClick={handleDownloadFullWeddingCalendar}
                  className="px-6 py-2.5 rounded-full bg-[#EED8D3] hover:bg-[#E3C4BE] text-[#3D332A] text-xs font-semibold tracking-wider uppercase transition-all shadow-xs border border-[#DFB6AE] flex items-center space-x-2"
                >
                  <CalendarPlus size={14} className="text-[#C6A15B]" />
                  <span>Add to Calendar (.ics)</span>
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Guest Name with Smooth Caret Input */}
              <div>
                <label className="block text-xs font-sans text-[#4A4038] font-medium mb-1.5 uppercase tracking-wider text-[11px]">
                  Guest or Family Name <span className="text-[#C6A15B]">*</span>
                </label>
                <SmoothInput
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Vikramaditya Sharma & Family"
                />
              </div>

              {/* Number of Guests: Typed Number Input with Smooth Caret */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label htmlFor="rsvp-guest-count" className="block text-xs font-sans text-[#4A4038] font-medium uppercase tracking-wider text-[11px]">
                    Total Number of Attending Guests <span className="text-[#C6A15B]">*</span>
                  </label>
                  <span className="text-[11px] font-serif italic text-[#8A7F72]">
                    Type any number of guests
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <SmoothInput
                      id="rsvp-guest-count"
                      numericOnly
                      inputMode="numeric"
                      pattern="[0-9]*"
                      value={guestCount}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (val === '') {
                          setGuestCount('');
                        } else {
                          const num = parseInt(val, 10);
                          if (!isNaN(num) && num >= 0 && num <= 99) {
                            setGuestCount(num);
                          }
                        }
                      }}
                      placeholder="e.g. 1, 2, 7, 10..."
                      className="text-base font-semibold"
                    />
                  </div>

                  {/* Quick stepper buttons */}
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={() => {
                        const current = typeof guestCount === 'number' ? guestCount : parseInt(guestCount, 10) || 1;
                        setGuestCount(Math.max(1, current - 1));
                      }}
                      className="w-11 h-11 rounded-2xl bg-[#FFF9F8] border border-[#DFC48F]/70 hover:border-[#C6A15B] hover:bg-[#F1D9D6]/30 text-[#4A4038] font-semibold text-lg flex items-center justify-center transition-all active:scale-95 shadow-2xs cursor-pointer"
                      title="Decrease guest count"
                      aria-label="Decrease guest count"
                    >
                      −
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const current = typeof guestCount === 'number' ? guestCount : parseInt(guestCount, 10) || 1;
                        setGuestCount(Math.min(99, current + 1));
                      }}
                      className="w-11 h-11 rounded-2xl bg-[#FFF9F8] border border-[#DFC48F]/70 hover:border-[#C6A15B] hover:bg-[#F1D9D6]/30 text-[#4A4038] font-semibold text-lg flex items-center justify-center transition-all active:scale-95 shadow-2xs cursor-pointer"
                      title="Increase guest count"
                      aria-label="Increase guest count"
                    >
                      +
                    </button>
                  </div>
                </div>
                <p className="text-[11px] font-sans text-[#8A7F72] mt-1.5 pl-1">
                  Enter the exact headcount of your party attending the celebrations.
                </p>
              </div>

              {/* Personal Note */}
              <div>
                <label className="block text-xs font-sans text-[#4A4038] font-medium mb-1.5 uppercase tracking-wider text-[11px]">
                  A Note or Blessing for Meher & Kabir
                </label>
                <textarea
                  rows={3}
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Leave a heartfelt prayer or sweet note for the couple..."
                  className="w-full px-4 py-3 rounded-2xl bg-[#FFF9F8] border border-[#DFC48F]/70 text-sm text-[#4A4038] focus:outline-hidden focus:border-[#C6A15B] transition-colors resize-none"
                />
              </div>

              {/* Single ONLY Accept Button */}
              <div className="pt-2 text-center">
                <button
                  type="submit"
                  className="w-full sm:w-auto px-12 py-3.5 rounded-full bg-[#C6A15B] hover:bg-[#B88E4C] text-white text-xs font-semibold tracking-[0.25em] uppercase transition-all shadow-md inline-flex items-center justify-center space-x-2"
                >
                  <Heart size={14} className="fill-white" />
                  <span>Joyfully Accept & RSVP</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </RevealOnScroll>

      <Divider />
    </section>
  );
};
