import React from 'react';
import { Phone, MessageCircle, Clock, HeartHandshake, UserCheck, BedDouble, Car } from 'lucide-react';
import { Divider } from './BasicComponents';
import { RevealOnScroll } from './RevealOnScroll';

interface ContactPerson {
  name: string;
  role: string;
  phone: string;
  displayPhone: string;
  availability: string;
  whatsappMessage: string;
  icon: React.ReactNode;
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
      icon: <UserCheck size={18} className="text-[#8A5A00]" />,
    },
    {
      name: 'Priya Verma',
      role: 'Guest Hospitality & Stay Concierge',
      phone: '+919876543211',
      displayPhone: '+91 98765 43211',
      availability: 'Check-in, rooms & hotel arrangements',
      whatsappMessage: 'Hi Priya, I need assistance with my accommodation and stay for the wedding.',
      icon: <BedDouble size={18} className="text-[#8A5A00]" />,
    },
    {
      name: 'Vikram Singh',
      role: 'Travel, Airport & Local Transfers Desk',
      phone: '+919876543212',
      displayPhone: '+91 98765 43212',
      availability: 'Dehradun Airport & Haridwar cab coordination',
      whatsappMessage: 'Hi Vikram, could you please help me coordinate my airport/station transfer to Anand Kashi?',
      icon: <Car size={18} className="text-[#8A5A00]" />,
    },
  ];

  return (
    <section id="helpdesk" className="pt-12 pb-20 sm:pt-14 sm:pb-24 px-3 sm:px-4 w-full max-w-full box-border relative overflow-x-hidden">
      <div className="relative z-10 w-full max-w-xl mx-auto box-border">
        {/* Section Header: Clean, High-Contrast & Accessible to Everyone */}
        <RevealOnScroll>
          <div className="text-center w-full max-w-xl mx-auto mb-8 sm:mb-10 px-4 box-border">
            <span className="text-[11px] sm:text-xs font-sans tracking-[0.26em] text-[#8A5A00] uppercase font-bold block mb-1">
              WE ARE HERE FOR YOU
            </span>
            <h2 className="font-serif text-2xl xs:text-3xl sm:text-4xl text-[#140F0A] font-bold leading-tight break-words">
              Helping Desk & Guest Concierge
            </h2>
            <p className="font-cursive text-xl sm:text-2xl text-[#7A4B00] mt-1.5 font-normal tracking-wide break-words">
              Here for your convenience & peace of mind
            </p>
          </div>
        </RevealOnScroll>

        {/* ── Crafted Cards with Sculpted Bent-Curve Edges (Not Plain Boxes) ── */}
        <div className="flex flex-col space-y-5 w-full max-w-xl mx-auto box-border">
          {contacts.map((contact, idx) => (
            <RevealOnScroll key={contact.name} delay={idx * 120}>
              <div
                className="helpdesk-card relative overflow-hidden bg-[#FFFDFB]/60 backdrop-blur-md border border-[#DFC48F]/75 p-4 sm:p-5 shadow-[0_8px_32px_rgba(74,64,56,0.08)] hover:shadow-[0_12px_36px_rgba(198,161,91,0.22)] hover:bg-[#FFFDFB]/80 hover:border-[#8A5A00] transition-all duration-300 group box-border w-full"
                style={{
                  borderRadius: '32px 14px 32px 14px',
                }}
              >
                {/* Decorative Bent-Curve Corner Hairlines */}
                <div
                  aria-hidden="true"
                  className="absolute inset-1.5 pointer-events-none border border-[#DFC48F]/30"
                  style={{ borderRadius: '28px 10px 28px 10px' }}
                />

                <div className="helpdesk-card-body relative z-10 w-full flex flex-col gap-3.5 box-border min-w-0">
                  {/* Contact Information */}
                  <div className="w-full min-w-0 text-left">
                    <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                      <span className="p-1 rounded-md bg-[#FAF2F0] border border-[#DFC48F]/60 shrink-0">
                        {contact.icon}
                      </span>
                      <span className="text-[10px] sm:text-[10.5px] font-sans font-bold tracking-[0.22em] uppercase text-[#8A5A00] leading-tight break-words">
                        {contact.role}
                      </span>
                    </div>

                    <h3 className="font-serif text-2xl sm:text-[26px] text-[#140F0A] font-bold leading-snug break-words">
                      {contact.name}
                    </h3>

                    <div className="flex items-center gap-1.5 text-xs text-[#554A40] mt-1 font-medium">
                      <Clock size={12} className="text-[#8A5A00] shrink-0" />
                      <span className="font-sans break-words">{contact.availability}</span>
                    </div>

                    <p className="font-sans font-bold text-sm text-[#2C2117] tracking-wider mt-1.5">
                      {contact.displayPhone}
                    </p>
                  </div>

                  {/* Call & WhatsApp Action Buttons — In own row below on narrow/phone screens, sharing width equally */}
                  <div className="helpdesk-card-actions grid grid-cols-2 gap-2.5 pt-3 w-full border-t border-[#DFC48F]/30 box-border">
                    {/* Call Button */}
                    <a
                      href={`tel:${contact.phone}`}
                      className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-full text-xs font-sans font-bold tracking-wider uppercase text-[#140F0A] hover:text-black bg-[#FAF6F0] hover:bg-white border border-[#DFC48F] hover:border-[#8A5A00] shadow-2xs hover:shadow-xs transition-all hover:scale-102 active:scale-98 cursor-pointer whitespace-nowrap min-w-0 text-center"
                    >
                      <Phone size={13} className="text-[#8A5A00] shrink-0" />
                      <span>Call</span>
                    </a>

                    {/* WhatsApp Button */}
                    <a
                      href={`https://wa.me/${contact.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(contact.whatsappMessage)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-full text-xs font-sans font-bold tracking-wider uppercase text-[#1B5E20] hover:text-[#0D3810] bg-[#EAF5EB] hover:bg-[#D5EED8] border border-[#A5D6A7] hover:border-[#66BB6A] shadow-2xs hover:shadow-xs transition-all hover:scale-102 active:scale-98 cursor-pointer whitespace-nowrap min-w-0 text-center"
                    >
                      <MessageCircle size={14} className="text-[#2E7D32] shrink-0" />
                      <span>WhatsApp</span>
                    </a>
                  </div>
                </div>
              </div>
            </RevealOnScroll>
          ))}
        </div>

        {/* 24/7 dedicated desk note */}
        <div className="text-center mt-8 px-2 w-full max-w-full box-border flex justify-center">
          <div className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-[#FFFDFB]/70 backdrop-blur-md border border-[#DFC48F]/80 text-[11px] xs:text-xs font-sans font-medium text-[#4A4038] shadow-2xs max-w-full text-center box-border">
            <HeartHandshake size={15} className="text-[#8A5A00] shrink-0" />
            <span className="leading-snug break-words">24/7 dedicated guest desk at Anand Kashi Reception Lobby</span>
          </div>
        </div>
      </div>

      <Divider className="mt-8 sm:mt-10" />
    </section>
  );
};
