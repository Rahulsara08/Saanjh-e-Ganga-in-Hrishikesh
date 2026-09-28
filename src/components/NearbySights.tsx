import React, { useState, useEffect, useRef } from 'react';
import {
  motion,
  AnimatePresence,
  useInView,
  useMotionValue,
  useSpring,
  useTransform,
} from 'framer-motion';
import { MapPin, X } from 'lucide-react';
import { Divider } from './BasicComponents';

import { OptimizedImage } from './OptimizedImage';

const triveniImg = 'triveni_ghat_aarti_rishikesh_1790244353114';
const ramJhulaImg = 'ram_jhula_suspension_bridge_1790244371749';
const neerGarhImg = 'neer_garh_waterfall_rishikesh_1790244391014';
const beatlesImg = 'beatles_ashram_rishikesh_1790244403526';
const kunjapuriImg = 'kunjapuri_devi_sunrise_real';

export interface SightItem {
  id: string;
  title: string;
  location: string;
  description: string;
  image: string;
}

// 5 authentic sights in Rishikesh & sacred valley
const SIGHTS_DATA: SightItem[] = [
  {
    id: 'triveni-ghat',
    title: 'Triveni Ghat Aarti',
    location: 'Mayakund, Rishikesh',
    description:
      'The sacred confluence where thousands gather at dusk for the mesmerising Ganga Maha Aarti, accompanied by floating earthen lamps, temple bells, and timeless Vedic hymns.',
    image: triveniImg,
  },
  {
    id: 'ram-jhula',
    title: 'Ram Jhula & Swarg Ashram',
    location: 'Muni Ki Reti, Rishikesh',
    description:
      'The iconic suspension bridge spanning the emerald Ganges, connecting historic spiritual ashrams, temple bells, and tranquil riverside walking pathways.',
    image: ramJhulaImg,
  },
  {
    id: 'neer-garh',
    title: 'Neer Garh Waterfall',
    location: 'Neer Waterfall Road, Rishikesh',
    description:
      'A cascading natural mountain stream and tiered emerald pools hidden within lush Garhwal Himalayan forest trails, offering cool mountain serenity.',
    image: neerGarhImg,
  },
  {
    id: 'beatles-ashram',
    title: 'The Beatles Ashram',
    location: 'Chaurasi Kutia, Swarg Ashram',
    description:
      'The legendary 1968 transcendental meditation retreat where The Beatles stayed, covered in vibrant street art, stone igloos, and quiet meditation chambers.',
    image: beatlesImg,
  },
  {
    id: 'kunjapuri-peak',
    title: 'Kunjapuri Devi Sunrise Peak',
    location: 'Hindolakhal, Tehri Garhwal',
    description:
      'Perched at an elevation of 1,665m, this revered hilltop shrine offers panoramic 360-degree vistas of Himalayan snow-clad peaks and a breathtaking sunrise over the holy valley.',
    image: kunjapuriImg,
  },
];

// Unified spring physics from service-cards-banner-scroll-animation.md
const FLIGHT_SPRING = {
  type: 'spring' as const,
  damping: 22,
  stiffness: 120,
};

interface FanGeometry {
  x: number;
  y: number;
  rotate: number;
  zIndex: number;
}

/**
 * Calculates fanX, fanR, fanY dynamically from `index` and `total` count.
 * Automatically balances whenever cards are added or removed.
 */
const getFanGeometry = (index: number, total: number, isMobile: boolean): FanGeometry => {
  const mid = (total - 1) / 2;
  const offset = index - mid; // e.g. for total=5: -2, -1, 0, 1, 2

  const xStep = isMobile ? 24 : 48;
  const yFactor = isMobile ? 3.0 : 4.5;

  const rotate = 0; // ZERO TILT: cards stay strictly straight and level
  const x = offset * xStep;
  const y = Math.pow(offset, 2) * yFactor;
  const zIndex = Math.round(50 - Math.abs(offset) * 2);

  return { x, y, rotate, zIndex };
};

interface SightCardProps {
  sight: SightItem;
  className?: string;
  onClick?: () => void;
  showCaption?: boolean;
}

/**
 * Flat, elegant card component with smooth hover scaling and zero tilt.
 */
const SightCard: React.FC<SightCardProps> = ({
  sight,
  className = '',
  onClick,
  showCaption = false,
}) => {
  return (
    <div
      onClick={onClick}
      className={`relative group cursor-pointer ${className}`}
    >
      <div className="w-full h-full rounded-2xl sm:rounded-3xl overflow-hidden border-2 border-[#DFC48F]/80 bg-[#FAF6F0] shadow-md group-hover:shadow-2xl transition-shadow duration-300">
        {/* Sight Image - Pure & Uncluttered with OptimizedImage (eager priority for instant load) */}
        <div className="w-full h-full overflow-hidden bg-[#F3EDE3]">
          <OptimizedImage
            src={sight.image}
            alt={sight.title}
            priority={true}
            disableAspectRatio={true}
            sizes="(max-width: 640px) 350px, (max-width: 1024px) 450px, 600px"
            className="w-full h-full"
            containerStyle={{ width: '100%', height: '100%' }}
            imgClassName="object-cover group-hover:scale-105 transition-transform duration-700 ease-out w-full h-full"
          />
        </div>

        {/* Small subtle caption overlay only in fan view */}
        {showCaption && (
          <div
            className="absolute inset-x-0 bottom-0 pt-8 pb-3 px-3 bg-gradient-to-t from-black/80 via-black/35 to-transparent pointer-events-none"
          >
            <p className="font-serif text-xs text-white font-medium leading-snug drop-shadow-sm text-center truncate">
              {sight.title}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export const NearbySights: React.FC = () => {
  const sights = SIGHTS_DATA;
  const sectionRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // isFanned = true when user is at the top of the section (cards banded together)
  // isFanned = false when user scrolls down into the section (cards unpack starting with Sight 1 at top)
  const [isFanned, setIsFanned] = useState(true);
  const isFannedRef = useRef(true);

  // Set hasLoaded to true instantly so cards render without artificial delay
  const [hasLoaded, setHasLoaded] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [selectedSight, setSelectedSight] = useState<SightItem | null>(null);

  // Responsive screen check & instant background image preloader
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);

    sights.forEach((sight) => {
      const img = new Image();
      img.src = sight.image;
    });

    return () => window.removeEventListener('resize', checkMobile);
  }, [sights]);

  // Section in-view trigger for initial stagger entrance
  const isInView = useInView(sectionRef, { once: true, amount: 0.08 });

  useEffect(() => {
    if (isInView && !hasLoaded) {
      const timer = setTimeout(() => {
        setHasLoaded(true);
      }, sights.length * 100 + 600);
      return () => clearTimeout(timer);
    }
  }, [isInView, hasLoaded, sights.length]);

  // Scroll detection relative to section top:
  // When scrolling down into section -> unpack starting from Sight 1 at top
  // When scrolling up back to top of section -> band together into the fan deck
  useEffect(() => {
    const phoneScrollEl = document.querySelector('[data-phone-scroll="true"]');

    const handleScroll = () => {
      if (!sectionRef.current) return;
      const sectionRect = sectionRef.current.getBoundingClientRect();

      let relativeTop = sectionRect.top;
      let containerHeight = window.innerHeight;

      if (phoneScrollEl) {
        const phoneRect = phoneScrollEl.getBoundingClientRect();
        relativeTop = sectionRect.top - phoneRect.top;
        containerHeight = phoneScrollEl.clientHeight;
      }

      // Hysteresis threshold for smooth card flight:
      // When user arrives at the section, the fanned deck is centered.
      // Scrolling down past the center triggers smooth flight down to the description rows.
      // Scrolling back up re-fans the deck smoothly.
      const unpackThreshold = containerHeight * 0.18;
      const refanThreshold = containerHeight * 0.38;

      if (relativeTop <= unpackThreshold && isFannedRef.current) {
        isFannedRef.current = false;
        setIsFanned(false);
      } else if (relativeTop > refanThreshold && !isFannedRef.current) {
        isFannedRef.current = true;
        setIsFanned(true);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    if (phoneScrollEl) {
      phoneScrollEl.addEventListener('scroll', handleScroll, { passive: true });
    }

    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (phoneScrollEl) {
        phoneScrollEl.removeEventListener('scroll', handleScroll);
      }
    };
  }, []);

  // Keyboard accessibility: Escape to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && selectedSight) {
        setSelectedSight(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedSight]);

  // Focus trap for modal
  useEffect(() => {
    if (selectedSight) {
      closeButtonRef.current?.focus();

      const handleTabTrap = (e: KeyboardEvent) => {
        if (e.key !== 'Tab' || !modalRef.current) return;
        const focusable = modalRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusable.length === 0) return;

        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === first) {
            e.preventDefault();
            last.focus();
          }
        } else {
          if (document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
      };

      window.addEventListener('keydown', handleTabTrap);
      return () => window.removeEventListener('keydown', handleTabTrap);
    }
  }, [selectedSight]);

  // Background body scroll lock when detail modal is open
  useEffect(() => {
    if (selectedSight) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [selectedSight]);

  return (
    <section
      id="nearby-sights"
      ref={sectionRef}
      className="relative w-full py-16 sm:py-24 px-4 max-w-5xl mx-auto"
    >
      {/* Section title (Clean, elegant, static) */}
      <div className="text-center max-w-xl mx-auto mb-8 sm:mb-12 pointer-events-none">
        <span className="text-[11px] sm:text-xs font-sans tracking-[0.25em] text-[#8A5A00] uppercase font-bold">
          NEARBY EXPERIENCES
        </span>
        <h2 className="font-serif text-3xl sm:text-4xl text-[#140F0A] font-bold mt-1">
          Sights of the Sacred Valley
        </h2>
        <p className="font-sans text-xs sm:text-sm text-[#6E6359] mt-1.5 font-medium">
          {isFanned
            ? 'Scroll down to explore each sight or click to expand'
            : 'Click any photo to view full location details'}
        </p>
      </div>

      {/* 1. TOP-OF-SECTION FAN STATE (Cards Banded Together at the top) */}
      {isFanned && (
        <div className="relative w-full h-[320px] sm:h-[380px] flex items-center justify-center mx-auto">
          {sights.map((sight, index) => {
            const geom = getFanGeometry(index, sights.length, isMobile);
            return (
              <motion.div
                key={sight.id}
                layoutId={`sight-card-${sight.id}`}
                transition={FLIGHT_SPRING}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedSight(sight);
                }}
                whileHover={{ scale: 1.05, zIndex: 60 }}
                style={{
                  position: 'absolute',
                  zIndex: geom.zIndex,
                  originX: 0.5,
                  originY: 0.5,
                  rotate: 0,
                }}
                animate={{
                  x: geom.x,
                  y: geom.y,
                  rotate: 0,
                }}
                initial={
                  !hasLoaded
                    ? { opacity: 0, y: 50, scale: 0.88, rotate: 0 }
                    : false
                }
                className="w-38 h-52 sm:w-46 sm:h-64 md:w-52 md:h-72 cursor-pointer select-none rounded-2xl sm:rounded-3xl"
              >
                <SightCard
                  sight={sight}
                  onClick={() => setSelectedSight(sight)}
                  showCaption={true}
                  className="w-full h-full"
                />
              </motion.div>
            );
          })}
        </div>
      )}

      {/* 2. SEQUENTIAL SIGHTS LIST (Sight 1 at the top, followed by 2, 3, 4, 5) */}
      {/* Cards sit completely flat and level with ZERO tilt, fitting their place perfectly */}
      {!isFanned && (
        <div className="w-full max-w-sm mx-auto flex flex-col space-y-12 pt-2">
          {sights.map((sight, index) => (
            <div
              key={sight.id}
              className="flex flex-col items-start gap-3 w-full pb-8 border-b border-[#DFC48F]/40 last:border-b-0"
            >
              {/* Image Card: Flies smoothly from the fan deck into this row spot with ZERO tilt */}
              <motion.div
                layoutId={`sight-card-${sight.id}`}
                transition={FLIGHT_SPRING}
                style={{
                  originX: 0.5,
                  originY: 0.5,
                  rotate: 0,
                }}
                animate={{ rotate: 0, x: 0, y: 0 }}
                onClick={() => setSelectedSight(sight)}
                className="w-full aspect-[16/10] shrink-0 rounded-2xl sm:rounded-3xl overflow-hidden cursor-pointer shadow-md hover:shadow-xl transition-shadow"
              >
                <SightCard sight={sight} showCaption={false} className="w-full h-full" />
              </motion.div>

              {/* Details Side: Below the card directly on background */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.12 + index * 0.04, duration: 0.5 }}
                className="w-full flex flex-col justify-center text-left py-1 space-y-1.5 min-w-0"
              >
                {/* Location Tag with Icon */}
                <div className="flex items-center gap-1.5 text-xs text-[#8A5A00] font-sans font-bold uppercase tracking-wider">
                  <MapPin size={14} className="shrink-0 text-[#8A5A00]" />
                  <span>{sight.location}</span>
                </div>

                {/* Sight Title */}
                <h3
                  onClick={() => setSelectedSight(sight)}
                  className="font-serif text-2xl sm:text-3xl text-[#140F0A] font-bold leading-snug cursor-pointer hover:text-[#8A5A00] transition-colors"
                >
                  {sight.title}
                </h3>

                {/* Full Description: Same exact details as Image 1 & 2 */}
                <p className="font-sans text-sm sm:text-base text-[#554A40] leading-relaxed">
                  {sight.description}
                </p>
              </motion.div>
            </div>
          ))}
        </div>
      )}

      {/* 3. DETAIL MODAL OVERLAY (Image 1 match: Appears automatically when user clicks card) */}
      <AnimatePresence>
        {selectedSight && (
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby={`sight-modal-title-${selectedSight.id}`}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
          >
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={() => setSelectedSight(null)}
              className="fixed inset-0 bg-black/65 backdrop-blur-xs"
            />

            {/* Modal Card (Exact match to Image 1) */}
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 15 }}
              transition={{ type: 'spring', stiffness: 280, damping: 26 }}
              ref={modalRef}
              tabIndex={-1}
              className="relative z-10 w-full max-w-md bg-[#FAF6F0] rounded-3xl overflow-hidden shadow-2xl border-2 border-[#DFC48F] focus:outline-none"
            >
              {/* Close Button: X in circular dark frosted pill */}
              <button
                ref={closeButtonRef}
                type="button"
                onClick={() => setSelectedSight(null)}
                aria-label="Close details"
                className="absolute top-3.5 right-3.5 z-30 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-black/65 hover:bg-black/85 text-white flex items-center justify-center transition-all border-2 border-white/50 shadow-lg focus:outline-none cursor-pointer"
              >
                <X size={18} />
              </button>

              {/* Modal Image */}
              <div className="w-full h-64 sm:h-72 overflow-hidden bg-[#F3EDE3]">
                <img
                  src={selectedSight.image}
                  alt={selectedSight.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Details: Exact match to Image 1 */}
              <div className="p-6 sm:p-7 space-y-2.5 text-left">
                <div className="flex items-center gap-1.5 text-xs text-[#8A5A00] font-sans font-bold uppercase tracking-wider">
                  <MapPin size={13} className="shrink-0 text-[#8A5A00]" />
                  <span>{selectedSight.location}</span>
                </div>

                <h3
                  id={`sight-modal-title-${selectedSight.id}`}
                  className="font-serif text-2xl sm:text-3xl text-[#140F0A] font-bold leading-tight"
                >
                  {selectedSight.title}
                </h3>

                <p className="font-sans text-sm text-[#554A40] leading-relaxed pt-1">
                  {selectedSight.description}
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="max-w-5xl mx-auto px-4 mt-12 sm:mt-16">
        <Divider />
      </div>
    </section>
  );
};
