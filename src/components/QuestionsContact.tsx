import React, { useState } from 'react';
import { SectionEyebrow, SectionHeading, GangaDiya } from './BasicComponents';
import { RevealOnScroll } from './RevealOnScroll';
import { WeddingConfig } from '../types';
import { MessageCircle, Phone, Mail, ChevronDown, Sparkles } from 'lucide-react';

interface QuestionsContactProps {
  config: WeddingConfig;
}

export const QuestionsContact: React.FC<QuestionsContactProps> = ({ config }) => {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const toggleFaq = (idx: number) => {
    setOpenFaqIndex(openFaqIndex === idx ? null : idx);
  };

  const whatsappUrl = `https://wa.me/${config.contact.whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
    config.contact.whatsappMessage
  )}`;

  return (
    <section id="contact" className="py-20 px-4 max-w-3xl mx-auto">
      <RevealOnScroll>
        <div className="text-center">
          <div className="flex justify-center mb-3">
            <GangaDiya size={40} />
          </div>
          <SectionEyebrow>{config.contact.eyebrow}</SectionEyebrow>
          <SectionHeading subtitle={config.contact.subtext}>
            {config.contact.heading}
          </SectionHeading>
        </div>
      </RevealOnScroll>

      {/* Direct WhatsApp Concierge Button */}
      <RevealOnScroll delay={100} className="text-center mb-12">
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center space-x-2 px-7 py-3 rounded-full bg-[#EED8D3] hover:bg-[#E3C4BE] text-[#382E27] border border-[#DFB6AE] text-[11px] font-semibold tracking-widest uppercase transition-all shadow-xs"
        >
          <MessageCircle size={15} className="text-[#382E27]" />
          <span>Chat with Wedding Concierge on WhatsApp</span>
        </a>
      </RevealOnScroll>

      {/* Coordinators Contact Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-14">
        {config.contact.coordinators.map((coordinator, idx) => (
          <RevealOnScroll key={coordinator.name} delay={idx * 150}>
            <div className="bg-[#FDFBF7] p-5 sm:p-6 rounded-2xl border border-[#DFC48F]/60 shadow-[0_4px_20px_-5px_rgba(74,64,56,0.06)] flex flex-col justify-between">
              <div>
                <span className="text-[9px] font-medium tracking-[0.25em] uppercase text-[#B88E4C] font-sans block mb-1">
                  {coordinator.role}
                </span>
                <h4 className="font-serif text-xl text-[#382E27] font-normal mb-2.5">
                  {coordinator.name}
                </h4>
              </div>

              <div className="space-y-1.5 pt-2 border-t border-[#DFC48F]/30 text-xs text-[#8A7F72]">
                <a
                  href={`tel:${coordinator.phone}`}
                  className="flex items-center space-x-2 text-[#4A4038] hover:text-[#B88E4C] transition-colors"
                >
                  <Phone size={13} className="text-[#B88E4C]" />
                  <span>{coordinator.phone}</span>
                </a>
                <a
                  href={`mailto:${coordinator.email}`}
                  className="flex items-center space-x-2 text-[#4A4038] hover:text-[#B88E4C] transition-colors"
                >
                  <Mail size={13} className="text-[#B88E4C]" />
                  <span>{coordinator.email}</span>
                </a>
              </div>
            </div>
          </RevealOnScroll>
        ))}
      </div>

      {/* Collapsible FAQ Accordion */}
      <RevealOnScroll delay={250}>
        <div className="bg-[#FDFBF7] p-6 sm:p-8 rounded-3xl border border-[#DFC48F]/60 shadow-[0_4px_25px_-5px_rgba(74,64,56,0.06)]">
          <div className="flex items-center justify-center space-x-2 mb-6">
            <span className="text-xs text-[#B88E4C]">✦</span>
            <h4 className="font-serif text-2xl text-[#382E27] font-normal text-center">
              A Few Sacred Notes
            </h4>
            <span className="text-xs text-[#B88E4C]">✦</span>
          </div>

          <div className="space-y-3">
            {config.contact.faqs.map((faq, index) => {
              const isOpen = openFaqIndex === index;
              return (
                <div
                  key={index}
                  className="bg-[#FAF6F0] rounded-xl border border-[#DFC48F]/40 overflow-hidden transition-all"
                >
                  <button
                    onClick={() => toggleFaq(index)}
                    className="w-full text-left px-4 py-3.5 flex items-center justify-between gap-4"
                  >
                    <span className="font-serif text-base text-[#382E27] font-medium">
                      {faq.question}
                    </span>
                    <ChevronDown
                      size={16}
                      className={`text-[#B88E4C] shrink-0 transition-transform duration-300 ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  {isOpen && (
                    <div className="px-4 pb-4 pt-1 text-xs text-[#4A4038]/90 font-sans font-light leading-relaxed border-t border-[#DFC48F]/20">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </RevealOnScroll>
    </section>
  );
};
