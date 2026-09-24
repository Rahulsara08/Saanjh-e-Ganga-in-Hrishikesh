import React, { useState } from 'react';
import { SectionEyebrow, SectionHeading, Divider } from './BasicComponents';
import { RevealOnScroll } from './RevealOnScroll';
import { WeddingConfig, RSVPRecord } from '../types';
import { generateICS } from '../utils/ics';
import { Heart, CalendarPlus, CheckCircle2 } from 'lucide-react';

interface RSVPSectionProps {
  config: WeddingConfig;
  onRSVPSubmitted?: () => void;
}

const RSVP_STORAGE_KEY = 'meher_kabir_rsvps_warm_v4';

export const RSVPSection: React.FC<RSVPSectionProps> = ({ config, onRSVPSubmitted }) => {
  const [fullName, setFullName] = useState('');
  const [guestCount, setGuestCount] = useState(2);
  const [note, setNote] = useState('');
  const [submittedRecord, setSubmittedRecord] = useState<RSVPRecord | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) return;

    const newRecord: RSVPRecord = {
      id: `rsvp-${Date.now()}`,
      attendance: 'accept',
      fullName: fullName.trim(),
      email: '',
      phone: '',
      guestCount,
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
        <div className="p-7 sm:p-9 rounded-3xl bg-[#FAF6F0] border border-[#DFC48F]/70 shadow-xs">
          {submittedRecord ? (
            <div className="text-center py-6 space-y-4">
              <div className="w-12 h-12 rounded-full bg-[#FAF6F0] border border-[#DFC48F] mx-auto flex items-center justify-center text-[#C6A15B]">
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
              {/* Guest Name */}
              <div>
                <label className="block text-xs font-sans text-[#4A4038] font-medium mb-1.5 uppercase tracking-wider text-[11px]">
                  Guest or Family Name <span className="text-[#C6A15B]">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Vikramaditya Sharma & Family"
                  className="w-full px-4 py-3 rounded-2xl bg-[#FAF6F0] border border-[#DFC48F]/70 text-sm text-[#4A4038] focus:outline-hidden focus:border-[#C6A15B] transition-colors"
                />
              </div>

              {/* Number of Guests */}
              <div>
                <label className="block text-xs font-sans text-[#4A4038] font-medium mb-1.5 uppercase tracking-wider text-[11px]">
                  Total Number of Attending Guests
                </label>
                <div className="flex items-center space-x-2.5">
                  {[1, 2, 3, 4, 5, 6].map((num) => (
                    <button
                      type="button"
                      key={num}
                      onClick={() => setGuestCount(num)}
                      className={`flex-1 py-2.5 rounded-xl text-xs font-semibold border transition-all ${
                        guestCount === num
                          ? 'bg-[#C6A15B] text-white border-[#C6A15B] shadow-xs'
                          : 'bg-[#FAF6F0] text-[#4A4038] border-[#DFC48F]/70 hover:border-[#C6A15B]'
                      }`}
                    >
                      {num}
                    </button>
                  ))}
                </div>
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
                  className="w-full px-4 py-3 rounded-2xl bg-[#FAF6F0] border border-[#DFC48F]/70 text-sm text-[#4A4038] focus:outline-hidden focus:border-[#C6A15B] transition-colors resize-none"
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
