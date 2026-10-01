import React from 'react';
import { Phone, MessageCircle, Clock, HeartHandshake } from 'lucide-react';
import { SectionEyebrow, SectionHeading, Divider } from './BasicComponents';
import { RevealOnScroll } from './RevealOnScroll';
import floralBgImg from '../assets/images/floral_frame_transparent.png';
import plantSketchImg from '../assets/images/flower-sketch.png';

interface ContactPerson {
  name: string;
  role: string;
  phone: string;
  displayPhone: string;
  availability: string;
  whatsappMessage: string;
}

export const HelpingDesk: React.FC = () => {
  const contacts: ContactPerson[] = [
    {
      name: 'Rohan Sharma',
      role: 'Wedding Coordinator & General Enquiries',
      phone: '+919876543210',
      displayPhone: '+91 98765 43210',
      availability: 'Available 24/7 during wedding week',
      whatsappMessage: 'Hi Rohan, I have a question regarding Meher & Kabir\'s wedding celebrations in Rishikesh.',
    },
    {
      name: 'Priya Verma',
      role: 'Guest Hospitality & Stay Concierge',
      phone: '+919876543211',
      displayPhone: '+91 98765 43211',
      availability: 'Check-in, rooms & hotel arrangements',
      whatsappMessage: 'Hi Priya, I need assistance with my accommodation and stay for the wedding.',
    },
    {
      name: 'Vikram Singh',
      role: 'Travel, Airport & Local Transfers Desk',
      phone: '+919876543212',
      displayPhone: '+91 98765 43212',
      availability: 'Dehradun Airport & Haridwar cab coordination',
      whatsappMessage: 'Hi Vikram, could you please help me coordinate my airport/station transfer to Anand Kashi?',
    },
  ];

  return (
    <section id="helpdesk" className="py-20 px-4 max-w-3xl mx-auto relative overflow-hidden">
      {/* ── Crafted Botanical Background Illustrations ── */}
      {/* Soft watercolor floral corner accent from user reference */}
      <div
        aria-hidden="true"
        className="absolute -left-14 -bottom-10 w-52 sm:w-64 h-auto opacity-[0.22] pointer-events-none select-none z-0"
      >
        <img
          src={floralBgImg}
          alt=""
          className="w-full h-auto object-contain transform -rotate-12"
        />
      </div>

      {/* Second delicate botanical plant sketch on opposite side */}
      <div
        aria-hidden="true"
        className="absolute -right-8 -top-8 w-40 sm:w-48 h-auto opacity-[0.20] pointer-events-none select-none z-0"
      >
        <img
          src={plantSketchImg}
          alt=""
          className="w-full h-auto object-contain transform rotate-6"
        />
      </div>

      <div className="relative z-10">
        {/* Section Header */}
        <RevealOnScroll>
          <div className="text-center max-w-xl mx-auto mb-14">
            <SectionEyebrow>WE ARE HERE FOR YOU</SectionEyebrow>
            <SectionHeading subtitle="Dedicated hospitality & logistics team to assist your pilgrimage">
              Helping Desk & Guest Concierge
            </SectionHeading>
            <p className="font-serif italic text-xs xs:text-sm text-[#8A7F72] mt-2 max-w-md mx-auto leading-relaxed">
              Whether you need travel coordination, room check-in help, or local guidance along the Ganges, our wedding team is just a call or message away.
            </p>
          </div>
        </RevealOnScroll>

        {/* ── 3 Plain Text Contacts (No Card Chrome / No Boxes) ── */}
        <div className="flex flex-col space-y-12 sm:space-y-14 max-w-xl mx-auto">
          {contacts.map((contact, idx) => (
            <RevealOnScroll key={contact.name} delay={idx * 120}>
              <div className="w-full flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-8 border-b border-[#DFC48F]/30 last:border-b-0">
                {/* Contact Plain Text Information */}
                <div className="flex-1 min-w-0 text-left">
                  <span className="text-[10px] sm:text-[11px] font-sans font-semibold tracking-[0.25em] uppercase text-[#B88E4C] block mb-1">
                    {contact.role}
                  </span>
                  <h3 className="font-serif text-2xl sm:text-[26px] text-[#2C2117] font-normal leading-snug">
                    {contact.name}
                  </h3>
                  <div className="flex items-center gap-1.5 text-xs text-[#8A7F72] mt-1">
                    <Clock size={12} className="text-[#C6A15B] shrink-0" />
                    <span>{contact.availability}</span>
                  </div>
                  <p className="font-sans font-medium text-sm text-[#5A4F44] tracking-wider mt-1.5">
                    {contact.displayPhone}
                  </p>
                </div>

                {/* Call & WhatsApp Action Buttons */}
                <div className="flex items-center gap-2.5 shrink-0 pt-1 sm:pt-0">
                  {/* Call Button */}
                  <a
                    href={`tel:${contact.phone}`}
                    className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-full text-xs font-medium tracking-wider uppercase text-[#4A4038] hover:text-[#2C2117] bg-[#FAF6F0]/90 hover:bg-white border border-[#DFC48F]/80 hover:border-[#C6A15B] transition-all shadow-2xs hover:scale-103 active:scale-97 cursor-pointer whitespace-nowrap"
                  >
                    <Phone size={13} className="text-[#B88E4C]" />
                    <span>Call</span>
                  </a>

                  {/* WhatsApp Button */}
                  <a
                    href={`https://wa.me/${contact.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(contact.whatsappMessage)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-full text-xs font-medium tracking-wider uppercase text-[#1B5E20] hover:text-[#0D3810] bg-[#E8F5E9]/90 hover:bg-[#C8E6C9] border border-[#A5D6A7]/80 hover:border-[#66BB6A] transition-all shadow-2xs hover:scale-103 active:scale-97 cursor-pointer whitespace-nowrap"
                  >
                    <MessageCircle size={13} className="text-[#2E7D32]" />
                    <span>WhatsApp</span>
                  </a>
                </div>
              </div>
            </RevealOnScroll>
          ))}
        </div>

        {/* Reassurance note */}
        <div className="text-center mt-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FAF6F0]/60 border border-[#DFC48F]/40 text-[11px] font-sans text-[#8A7F72]">
            <HeartHandshake size={14} className="text-[#C6A15B]" />
            <span>24/7 dedicated guest desk at Anand Kashi Reception Lobby</span>
          </div>
        </div>
      </div>

      <Divider className="mt-16" />
    </section>
  );
};
