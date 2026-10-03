import React, { useEffect, useRef, useState } from 'react';
import { CalendarPlus, MapPin, Sparkles } from 'lucide-react';

export interface EventRowProps {
  image: string;
  side: 'left' | 'right';
  name: string;
  dateTime: string;
  venue: string;
  venueUrl?: string;
  attire?: string;
  altText: string;
  onAddToCalendar?: () => void;
  rowRef?: React.Ref<HTMLDivElement>;
  imageRef?: React.Ref<HTMLDivElement>;
  textRef?: React.Ref<HTMLDivElement>;
}

export const EventRow: React.FC<EventRowProps> = ({
  image,
  side,
  name,
  dateTime,
  venue,
  venueUrl,
  attire,
  altText,
  onAddToCalendar,
  rowRef,
  imageRef,
  textRef,
}) => {
  const localRowRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Respect prefers-reduced-motion
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setIsVisible(true);
      return;
    }

    const targetEl = localRowRef.current;
    if (!targetEl) return;

    // Detect actual scroll container (e.g. phone screen scroll container)
    let parent = targetEl.parentElement;
    let scrollRoot: HTMLElement | null = null;
    while (parent) {
      if (parent.getAttribute('data-phone-scroll') === 'true') {
        scrollRoot = parent;
        break;
      }
      parent = parent.parentElement;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(targetEl);
        }
      },
      {
        root: scrollRoot,
        threshold: 0.1,
        rootMargin: '0px 0px -30px 0px',
      }
    );

    observer.observe(targetEl);

    // Fallback timer so content is never stuck invisible
    const timer = setTimeout(() => setIsVisible(true), 1200);

    return () => {
      observer.disconnect();
      clearTimeout(timer);
    };
  }, []);

  // Merge outer rowRef and localRowRef
  const setCombinedRef = (node: HTMLDivElement | null) => {
    localRowRef.current = node;
    if (typeof rowRef === 'function') {
      rowRef(node);
    } else if (rowRef && 'current' in rowRef) {
      (rowRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
    }
  };

  const isLeft = side === 'left';
  // Fade + slide in from its image side (24px, 450ms ease-out)
  const initialTranslate = isLeft ? '-24px' : '24px';
  const transformStyle = isVisible ? 'translateX(0)' : `translateX(${initialTranslate})`;

  return (
    <div
      ref={setCombinedRef}
      className="w-full relative z-20 my-12 sm:my-18 first:mt-2 last:mb-6 overflow-visible"
      style={{
        opacity: isVisible ? 1 : 0,
        transform: transformStyle,
        transition: 'opacity 480ms cubic-bezier(0.16, 1, 0.3, 1), transform 480ms cubic-bezier(0.16, 1, 0.3, 1)',
        willChange: 'opacity, transform',
      }}
    >
      <div
        className={`w-full flex items-center justify-between gap-3 xs:gap-4 sm:gap-6 overflow-visible ${
          isLeft ? 'flex-row' : 'flex-row-reverse'
        }`}
      >
        {/* ── CUTOUT ILLUSTRATION (No harsh border cuts, soft bottom watercolor feather) ── */}
        <div
          ref={imageRef}
          className="w-[42%] xs:w-[44%] sm:w-[45%] max-w-[280px] shrink-0 relative z-20 flex items-center justify-center overflow-visible p-0"
        >
          <img
            src={image}
            alt={altText}
            loading="lazy"
            className="w-full h-auto object-contain object-bottom block max-w-full drop-shadow-[0_8px_20px_rgba(74,64,56,0.10)] select-none pointer-events-none transition-transform duration-500 hover:scale-103"
            style={{
              maskImage: 'linear-gradient(to bottom, black 86%, transparent 100%)',
              WebkitMaskImage: 'linear-gradient(to bottom, black 86%, transparent 100%)',
            }}
          />
        </div>

        {/* ── BALANCED TEXT BLOCK (vertically centered, plain on page background, fits completely without truncation) ── */}
        <div
          ref={textRef}
          className={`flex-1 min-w-0 flex flex-col justify-center relative z-20 py-1 ${
            isLeft ? 'text-left pl-1 sm:pl-3' : 'text-left pr-1 sm:pr-3'
          }`}
        >
          {/* Celebratory Event Name */}
          <h3 className="font-display text-2xl xs:text-[27px] sm:text-[32px] font-semibold text-[#2C2117] tracking-wide leading-tight">
            {name}
          </h3>

          {/* Delicate Ornamental Flourish Underline */}
          <div className="flex items-center gap-1.5 my-1.5 opacity-90">
            <div className="h-[1px] w-5 bg-gradient-to-r from-transparent to-[#C6A15B]" />
            <svg className="w-3.5 h-3.5 text-[#C6A15B] shrink-0" viewBox="0 0 16 16" fill="currentColor">
              <path d="M8 1.5 C8 4.8 11.2 8 14.5 8 C11.2 8 8 11.2 8 14.5 C8 11.2 4.8 8 1.5 8 C4.8 8 8 4.8 8 1.5 Z" />
            </svg>
            <div className="h-[1px] w-12 bg-gradient-to-r from-[#C6A15B] to-transparent" />
          </div>

          {/* One-Line Date & Time (fits without truncation) */}
          <div className="text-[11px] xs:text-xs sm:text-[13px] font-sans font-semibold tracking-wider text-[#B88E4C] uppercase flex items-center gap-1.5 whitespace-nowrap">
            <span className="w-1.5 h-1.5 rounded-full bg-[#B88E4C] shrink-0" />
            <span>{dateTime}</span>
          </div>

          {/* Clean Venue Line — Tapping directs to Google Maps */}
          <a
            href={venueUrl || `https://maps.google.com/?q=${encodeURIComponent(venue + ', Anand Kashi Rishikesh')}`}
            target="_blank"
            rel="noopener noreferrer"
            title="View venue on Google Maps"
            className="text-[11px] xs:text-xs sm:text-[12.5px] font-sans text-[#7A6F62] hover:text-[#8A5A00] mt-1 flex items-start gap-1 leading-snug transition-colors group cursor-pointer"
          >
            <MapPin size={12} className="text-[#C6A15B] group-hover:text-[#8A5A00] shrink-0 mt-0.5 transition-colors" />
            <span className="break-words leading-tight underline decoration-[#DFC48F]/60 group-hover:decoration-[#8A5A00] underline-offset-2">
              {venue}
            </span>
          </a>

          {/* Compact Attire Line (wraps cleanly, no truncation) */}
          {attire && (
            <div className="text-[10px] xs:text-[11px] sm:text-[11.5px] font-sans text-[#8A7F72] mt-1 flex items-start gap-1 leading-snug">
              <Sparkles size={11} className="text-[#C6A15B] shrink-0 mt-0.5" />
              <span className="break-words leading-tight">{attire}</span>
            </div>
          )}

          {/* Action Buttons: Add to Calendar & Venue Map */}
          <div className="flex items-center gap-2 mt-2.5 flex-wrap">
            {onAddToCalendar && (
              <button
                type="button"
                onClick={onAddToCalendar}
                aria-label={`Add ${name} to calendar`}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] tracking-wider uppercase font-medium text-[#5A4F44] hover:text-[#2C241E] bg-[#FAF6F0]/90 hover:bg-white border border-[#DFC48F]/80 hover:border-[#C6A15B] transition-all shadow-2xs hover:scale-102 active:scale-98 cursor-pointer whitespace-nowrap"
              >
                <CalendarPlus size={11} className="text-[#C6A15B] shrink-0" />
                <span className="whitespace-nowrap">Add to Calendar</span>
              </button>
            )}

            <a
              href={venueUrl || `https://maps.google.com/?q=${encodeURIComponent(venue + ', Anand Kashi Rishikesh')}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`View ${venue} on Google Maps`}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] tracking-wider uppercase font-medium text-[#5A4F44] hover:text-[#8A5A00] bg-[#FAF6F0]/90 hover:bg-white border border-[#DFC48F]/80 hover:border-[#8A5A00] transition-all shadow-2xs hover:scale-102 active:scale-98 cursor-pointer whitespace-nowrap"
            >
              <MapPin size={11} className="text-[#8A5A00] shrink-0" />
              <span className="whitespace-nowrap">Venue Map</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
