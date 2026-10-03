import React, { useState, useEffect, useRef } from 'react';
import {
  motion,
  AnimatePresence,
  useInView,
} from 'framer-motion';
import { MapPin, X, Sparkles } from 'lucide-react';
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

  const xStep = isMobile ? 26 : 42;

  const rotate = 0; // ZERO TILT: cards stay strictly straight and level
  const x = offset * xStep;
  const y = 0; // All cards flush and aligned at bottom - prevents bottom edges protruding
  const zIndex = Math.round(50 - Math.abs(offset) * 2);

  return { x, y, rotate, zIndex };
};

/**
 * Corner filigree ornament component for vintage travel collector's postcards
 */
const PostcardFiligree: React.FC<{ position: 'tl' | 'tr' | 'bl' | 'br' }> = ({ position }) => {
  const rotationMap = {
    tl: '',
    tr: 'rotate-90',
    br: 'rotate-180',
    bl: '-rotate-90',
  };
  const positionClasses = {
    tl: 'top-1.5 left-1.5',
    tr: 'top-1.5 right-1.5',
    bl: 'bottom-1.5 left-1.5',
    br: 'bottom-1.5 right-1.5',
  };

  return (
    <div
      aria-hidden="true"
      className={`absolute ${positionClasses[position]} z-10 pointer-events-none text-[#C6A15B]/70 ${rotationMap[position]}`}
    >
      <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor">
        <path d="M2 14 V4 C2 2.9 2.9 2 4 2 H14" strokeWidth="1.2" strokeLinecap="round" />
        <circle cx="5" cy="5" r="1.2" fill="currentColor" stroke="none" />
      </svg>
    </div>
  );
};

interface SightCardProps {
  sight: SightItem;
  className?: string;
  onClick?: () => void;
  showCaption?: boolean;
}

/**
 * Handcrafted Collector's Travel Postcard Card Component with Textured Border & Filigree
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
      {/* Outer Handcrafted Postcard Mount with Fine Deckled Double Border */}
      <div className="w-full h-full p-1.5 sm:p-2 rounded-2xl sm:rounded-3xl bg-[#FFFDFB] border border-[#DFC48F]/85 shadow-[0_6px_22px_rgba(74,64,56,0.12)] group-hover:shadow-[0_12px_32px_rgba(198,161,91,0.24)] group-hover:border-[#C6A15B] transition-all duration-300 relative overflow-hidden flex flex-col">
        {/* Vintage Postcard Filigree Accents in 4 corners */}
        <PostcardFiligree position="tl" />
        <PostcardFiligree position="tr" />
        <PostcardFiligree position="bl" />
        <PostcardFiligree position="br" />

        {/* Inner Photo Frame with Golden Hairline Edge */}
        <div className="w-full h-full rounded-xl sm:rounded-2xl overflow-hidden border border-[#DFC48F]/50 bg-[#F3EDE3] relative">
          <OptimizedImage
            src={sight.image}
            alt={sight.title}
            priority={true}
            disableAspectRatio={true}
            sizes="(max-width: 640px) 350px, (max-width: 1024px) 450px, 600px"
            className="w-full h-full"
            containerStyle={{ width: '100%', height: '100%' }}
            imgClassName="object-cover group-hover:scale-106 transition-transform duration-700 ease-out w-full h-full"
          />

          {/* Frosted Postcard Collector Caption in Fan View */}
          {showCaption && (
            <div className="absolute inset-x-0 bottom-2.5 flex justify-center px-2 pointer-events-none z-10">
              <div className="bg-[#FFFDFB]/95 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-[#DFC48F]/85 shadow-[0_2px_10px_rgba(74,64,56,0.18)] max-w-[94%] flex items-center justify-center gap-1.5">
                <MapPin size={11} className="text-[#9A6B0A] shrink-0" />
                <p className="font-serif text-[11px] sm:text-xs text-[#241913] font-semibold leading-tight text-center truncate tracking-wide">
                  {sight.title}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export const NearbySights: React.FC = () => {
  const sights = SIGHTS_DATA;
  const sectionRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // isFanned = true when user is at top of section (cards banded together)
  // isFanned = false when user scrolls down into section (cards unpack starting with Sight 1 at top)
  const [isFanned, setIsFanned] = useState(true);
  const isFannedRef = useRef(true);

  const [hasLoaded, setHasLoaded] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [selectedSight, setSelectedSight] = useState<SightItem | null>(null);

  // Responsive screen check & instant preloader
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(
        window.innerWidth < 640 || !!document.querySelector('[data-phone-scroll="true"]')
      );
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);

    sights.forEach((sight) => {
      const img = new Image();
      img.src = sight.image;
    });

    return () => window.removeEventListener('resize', checkMobile);
  }, [sights]);

  // Section in-view trigger
  const isInView = useInView(sectionRef, { once: true, amount: 0.08 });

  useEffect(() => {
    if (isInView && !hasLoaded) {
      const timer = setTimeout(() => {
        setHasLoaded(true);
      }, sights.length * 100 + 600);
      return () => clearTimeout(timer);
    }
  }, [isInView, hasLoaded, sights.length]);

  // Scroll detection relative to section top
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

  // Background body scroll lock when modal open
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
      className="relative w-full py-12 sm:py-18 px-3 sm:px-4 max-w-5xl mx-auto"
    >
      {/* ── Background Card Removed as explicitly requested: sits naturally on paper texture ── */}

      {/* Section title with High-Contrast Cursive Typography (Matches Image 1 layout) */}
      <div className="text-center max-w-xl mx-auto mb-8 sm:mb-12 pointer-events-none relative z-10">
        <span className="font-cursive text-2xl sm:text-3xl text-[#9A6B0A] block leading-none font-normal mb-1">
          Wonders of the Sacred Valley
        </span>
        <span className="text-[11px] sm:text-xs font-sans tracking-[0.26em] text-[#8A5A00] uppercase font-bold">
          NEARBY EXPERIENCES
        </span>
        <h2 className="font-serif text-3xl sm:text-4xl text-[#140F0A] font-bold mt-1.5 leading-tight">
          Sights of the Sacred Valley
        </h2>
        <p className="font-sans text-xs sm:text-sm text-[#6E6359] mt-2 font-medium">
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
      {!isFanned && (
        <div className="w-full max-w-sm mx-auto flex flex-col space-y-12 pt-2">
          {sights.map((sight, index) => (
            <div
              key={sight.id}
              className="flex flex-col items-start gap-3.5 w-full pb-8 border-b border-[#DFC48F]/40 last:border-b-0"
            >
              {/* Image Card: Flies smoothly from fan deck into row spot */}
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
                className="w-full aspect-[16/10] shrink-0 rounded-2xl sm:rounded-3xl cursor-pointer"
              >
                <SightCard sight={sight} showCaption={false} className="w-full h-full" />
              </motion.div>

              {/* Details Side: Below card directly on paper background */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.12 + index * 0.04, duration: 0.45 }}
                className="w-full flex flex-col justify-center text-left py-1 space-y-1 min-w-0"
              >
                {/* Location Tag with Icon */}
                <div className="flex items-center gap-1.5 text-xs text-[#B88E4C] font-sans font-semibold uppercase tracking-wider">
                  <MapPin size={13} className="shrink-0 text-[#B88E4C]" />
                  <span>{sight.location}</span>
                </div>

                {/* Sight Title with Tap Trigger */}
                <div
                  onClick={() => setSelectedSight(sight)}
                  className="flex items-center justify-between group cursor-pointer"
                >
                  <h3 className="font-serif text-2xl sm:text-[26px] text-[#241A12] font-semibold leading-snug group-hover:text-[#B88E4C] transition-colors">
                    {sight.title}
                  </h3>
                  <span className="text-xs font-sans font-medium tracking-wide text-[#B88E4C] group-hover:translate-x-1 transition-transform shrink-0 ml-2">
                    Explore →
                  </span>
                </div>
              </motion.div>
            </div>
          ))}
        </div>
      )}

      {/* 3. DETAIL MODAL OVERLAY */}
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

            {/* Modal Card with Collector Postcard Styling */}
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 15 }}
              transition={{ type: 'spring', stiffness: 280, damping: 26 }}
              ref={modalRef}
              tabIndex={-1}
              className="relative z-10 w-full max-w-md bg-[#FFFDFB] rounded-3xl overflow-hidden shadow-2xl border-2 border-[#DFC48F] focus:outline-none p-2 sm:p-2.5"
            >
              <PostcardFiligree position="tl" />
              <PostcardFiligree position="tr" />
              <PostcardFiligree position="bl" />
              <PostcardFiligree position="br" />

              {/* Close Button: X in circular dark frosted pill */}
              <button
                ref={closeButtonRef}
                type="button"
                onClick={() => setSelectedSight(null)}
                aria-label="Close details"
                className="absolute top-5 right-5 z-30 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-black/65 hover:bg-black/85 text-white flex items-center justify-center transition-all border-2 border-white/60 shadow-lg focus:outline-none cursor-pointer"
              >
                <X size={18} />
              </button>

              <div className="rounded-2xl overflow-hidden border border-[#DFC48F]/50 bg-[#F3EDE3]">
                {/* Modal Image */}
                <div className="w-full h-60 sm:h-68 overflow-hidden bg-[#F3EDE3]">
                  <OptimizedImage
                    src={selectedSight.image}
                    alt={selectedSight.title}
                    priority={true}
                    disableAspectRatio={true}
                    className="w-full h-full"
                    containerStyle={{ width: '100%', height: '100%' }}
                    imgClassName="w-full h-full object-cover"
                  />
                </div>

                {/* Details */}
                <div className="p-5 sm:p-6 space-y-2 text-left bg-[#FFFDFB]">
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
