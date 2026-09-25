import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform, animate, PanInfo } from 'framer-motion';
import { SectionEyebrow, SectionHeading, Divider } from './BasicComponents';
import { RevealOnScroll } from './RevealOnScroll';
import { WeddingConfig, Wish } from '../types';
import { Heart, Send, Feather, Sparkles } from 'lucide-react';
import { SmoothInput } from './ui/SmoothInput';

interface WishingWallProps {
  config: WeddingConfig;
  isHostMode?: boolean;
}

const STORAGE_KEY = 'meher_kabir_wishes_warm_v4';

// ── Realistic Cherry Blossom Sprig SVG ──
const CherryBlossomSprig: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    viewBox="0 0 120 120"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    {/* Main woody branch */}
    <path
      d="M15 110 C 35 85, 55 60, 95 20 C 105 10, 110 5, 115 2"
      stroke="#6E4D36"
      strokeWidth="2.5"
      strokeLinecap="round"
    />
    {/* Side offshoot branch 1 */}
    <path
      d="M50 65 C 40 50, 30 42, 22 35"
      stroke="#7D583F"
      strokeWidth="1.8"
      strokeLinecap="round"
    />
    {/* Side offshoot branch 2 */}
    <path
      d="M75 38 C 82 28, 90 24, 98 22"
      stroke="#7D583F"
      strokeWidth="1.5"
      strokeLinecap="round"
    />

    {/* Green leaf buds */}
    <path
      d="M20 35 C 16 30, 18 22, 25 24 C 28 26, 26 33, 20 35 Z"
      fill="#8FA879"
      stroke="#6B8556"
      strokeWidth="0.8"
    />
    <path
      d="M98 22 C 103 17, 108 19, 106 25 C 103 28, 97 27, 98 22 Z"
      fill="#8FA879"
      stroke="#6B8556"
      strokeWidth="0.8"
    />

    {/* Blossom Flower 1 (Large - Center) */}
    <g transform="translate(56, 52)">
      {/* 5 Soft Pink Petals */}
      <circle cx="0" cy="-9" r="6.5" fill="#FCE5E8" stroke="#F5BAC4" strokeWidth="0.6" />
      <circle cx="8.5" cy="-2.5" r="6.5" fill="#FCE5E8" stroke="#F5BAC4" strokeWidth="0.6" />
      <circle cx="5.5" cy="7.5" r="6.5" fill="#FDEAEB" stroke="#F5BAC4" strokeWidth="0.6" />
      <circle cx="-5.5" cy="7.5" r="6.5" fill="#FCE5E8" stroke="#F5BAC4" strokeWidth="0.6" />
      <circle cx="-8.5" cy="-2.5" r="6.5" fill="#FDEAEB" stroke="#F5BAC4" strokeWidth="0.6" />
      {/* Flower Center & Stamens */}
      <circle cx="0" cy="0" r="3.5" fill="#E88C9C" />
      <circle cx="-2" cy="-2" r="0.9" fill="#E5A855" />
      <circle cx="2" cy="-2" r="0.9" fill="#E5A855" />
      <circle cx="-2" cy="2" r="0.9" fill="#E5A855" />
      <circle cx="2" cy="2" r="0.9" fill="#E5A855" />
      <circle cx="0" cy="0" r="1.2" fill="#FAF0D7" />
    </g>

    {/* Blossom Flower 2 (Top Right) */}
    <g transform="translate(88, 26) scale(0.85)">
      <circle cx="0" cy="-8" r="5.8" fill="#FCE8EB" stroke="#F5BAC4" strokeWidth="0.5" />
      <circle cx="7.5" cy="-2" r="5.8" fill="#FCE8EB" stroke="#F5BAC4" strokeWidth="0.5" />
      <circle cx="4.8" cy="6.8" r="5.8" fill="#FDF0F2" stroke="#F5BAC4" strokeWidth="0.5" />
      <circle cx="-4.8" cy="6.8" r="5.8" fill="#FCE8EB" stroke="#F5BAC4" strokeWidth="0.5" />
      <circle cx="-7.5" cy="-2" r="5.8" fill="#FDF0F2" stroke="#F5BAC4" strokeWidth="0.5" />
      <circle cx="0" cy="0" r="3" fill="#E88C9C" />
      <circle cx="0" cy="0" r="1" fill="#E5A855" />
    </g>

    {/* Blossom Flower 3 (Small Bud - Left) */}
    <g transform="translate(32, 44) scale(0.65)">
      <circle cx="0" cy="-7" r="5.2" fill="#FDE8EA" stroke="#F5BAC4" strokeWidth="0.5" />
      <circle cx="6.5" cy="-1.5" r="5.2" fill="#FDE8EA" stroke="#F5BAC4" strokeWidth="0.5" />
      <circle cx="4" cy="6" r="5.2" fill="#FDF0F2" stroke="#F5BAC4" strokeWidth="0.5" />
      <circle cx="-4" cy="6" r="5.2" fill="#FDE8EA" stroke="#F5BAC4" strokeWidth="0.5" />
      <circle cx="-6.5" cy="-1.5" r="5.2" fill="#FDF0F2" stroke="#F5BAC4" strokeWidth="0.5" />
      <circle cx="0" cy="0" r="2.8" fill="#E88C9C" />
      <circle cx="0" cy="0" r="1" fill="#E5A855" />
    </g>
  </svg>
);

// ── Vintage Scallop Lace Trim SVG ──
const VintageLaceTrim: React.FC = () => (
  <div className="absolute -bottom-3 inset-x-3 h-5 overflow-hidden pointer-events-none select-none z-10 flex items-center justify-between opacity-85">
    <svg className="w-full h-full" viewBox="0 0 300 20" preserveAspectRatio="none">
      <defs>
        <pattern id="lacePattern" width="20" height="20" patternUnits="userSpaceOnUse">
          {/* Scallop arc */}
          <path d="M 0 0 Q 10 16, 20 0 Z" fill="#F9F6F0" stroke="#DFC48F" strokeWidth="0.6" />
          {/* Lace eyelet holes */}
          <circle cx="10" cy="7" r="1.8" fill="#D7C4A8" />
          <circle cx="5" cy="4" r="0.9" fill="#D7C4A8" />
          <circle cx="15" cy="4" r="0.9" fill="#D7C4A8" />
        </pattern>
      </defs>
      <rect width="100%" height="20" fill="url(#lacePattern)" />
    </svg>
  </div>
);

// ── Scrapbook Card Item Component ──
interface ScrapbookCardProps {
  wish: Wish;
  index: number;
  totalCards: number;
  onDismiss: (direction: 'left' | 'right' | 'down') => void;
}

const ScrapbookCard: React.FC<ScrapbookCardProps> = ({
  wish,
  index,
  totalCards,
  onDismiss,
}) => {
  const isTop = index === 0;
  const isSecond = index === 1;
  const isThird = index === 2;

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Tilt dynamically proportional to horizontal drag distance (only for top card)
  const rotate = useTransform(x, [-240, 240], [-18, 18]);

  // Dynamic message font size based on text length to fit writing area perfectly
  const getMessageFontSize = (text: string) => {
    const len = text.length;
    if (len < 55) return 'text-2xl sm:text-3xl leading-relaxed';
    if (len < 100) return 'text-xl sm:text-2xl leading-relaxed';
    if (len < 150) return 'text-lg sm:text-xl leading-snug';
    return 'text-base sm:text-lg leading-tight';
  };

  const handleDragEnd = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (!isTop) return;
    const { offset, velocity } = info;
    const threshold = 95;
    const velThreshold = 280;

    // Valid dismiss directions: LEFT, RIGHT, DOWN
    if (offset.x < -threshold || velocity.x < -velThreshold) {
      // Dismiss Left
      animate(x, -650, { duration: 0.3, ease: 'easeOut' }).then(() => {
        onDismiss('left');
      });
    } else if (offset.x > threshold || velocity.x > velThreshold) {
      // Dismiss Right
      animate(x, 650, { duration: 0.3, ease: 'easeOut' }).then(() => {
        onDismiss('right');
      });
    } else if (offset.y > threshold || velocity.y > velThreshold) {
      // Dismiss Down
      animate(y, 750, { duration: 0.3, ease: 'easeOut' }).then(() => {
        onDismiss('down');
      });
    } else {
      // Release before threshold: spring back to resting stack position
      animate(x, 0, { type: 'spring', stiffness: 350, damping: 25 });
      animate(y, 0, { type: 'spring', stiffness: 350, damping: 25 });
    }
  };

  // Stack visuals: Top card resting, 2nd card slightly scaled down & offset, 3rd card deeper
  const stackStyle = isTop
    ? { scale: 1, y: 0, rotate: 0, zIndex: 30, opacity: 1 }
    : isSecond
    ? { scale: 0.94, y: 16, rotate: 2.5, zIndex: 20, opacity: 0.92 }
    : isThird
    ? { scale: 0.88, y: 32, rotate: -2.5, zIndex: 10, opacity: 0.75 }
    : { scale: 0.82, y: 44, rotate: 0, zIndex: 0, opacity: 0 };

  return (
    <motion.div
      style={isTop ? { x, y, rotate, zIndex: 30 } : { zIndex: stackStyle.zIndex }}
      animate={isTop ? undefined : stackStyle}
      transition={{ type: 'spring', stiffness: 320, damping: 26 }}
      drag={isTop}
      // Dragging UP does nothing; card resists & snaps back if pulled upward
      dragConstraints={{ top: 0 }}
      dragElastic={{ top: 0.12, bottom: 1, left: 1, right: 1 }}
      onDragEnd={handleDragEnd}
      className={`absolute inset-0 m-auto w-[295px] xs:w-[325px] sm:w-[350px] h-[375px] xs:h-[395px] sm:h-[415px] select-none ${
        isTop ? 'cursor-grab active:cursor-grabbing' : 'pointer-events-none'
      }`}
    >
      {/* ── 1. KRAFT / CARDBOARD BACKING BASE ── */}
      <div className="relative w-full h-full rounded-2xl bg-[#D2BEA4] p-3 shadow-[0_16px_36px_-8px_rgba(74,64,56,0.32),0_4px_12px_rgba(0,0,0,0.08)] border border-[#BAA183] overflow-hidden flex flex-col justify-between">
        
        {/* Kraft cardboard fibrous speckles texture */}
        <div
          className="absolute inset-0 opacity-15 pointer-events-none"
          style={{
            backgroundImage:
              'radial-gradient(#6B5238 1px, transparent 1px), radial-gradient(#8A6B4A 0.8px, transparent 0.8px)',
            backgroundSize: '16px 16px, 24px 24px',
            backgroundPosition: '0 0, 8px 8px',
          }}
        />

        {/* ── 2. VINTAGE SCALLOP LACE TRIM (BOTTOM PEEK) ── */}
        <VintageLaceTrim />

        {/* ── 3. TORN WHITE CARDSTOCK WRITING AREA ── */}
        <div
          className="relative w-full flex-1 rounded-xl bg-[#FAF6F0] p-5 sm:p-6 flex flex-col justify-between shadow-[0_2px_10px_rgba(58,42,32,0.14)] border border-[#E8DEC9] overflow-hidden z-20"
          style={{
            // Organic deckle edge paper feel
            clipPath:
              'polygon(0.8% 1.2%, 18% 0.5%, 38% 1.2%, 62% 0.6%, 84% 1.4%, 99.2% 0.8%, 98.8% 22%, 99.4% 48%, 98.6% 72%, 99.2% 98.6%, 82% 99.4%, 60% 98.8%, 38% 99.2%, 18% 98.6%, 0.8% 99.4%, 1.2% 76%, 0.6% 50%, 1.4% 24%)',
          }}
        >
          {/* Subtle paper grain tint */}
          <div className="absolute inset-0 bg-[#FFFDF9]/60 pointer-events-none" />

          {/* ── 4. CHERRY BLOSSOM SPRIG DECORATION ── */}
          <CherryBlossomSprig className="absolute -top-3 -right-3 w-28 h-28 pointer-events-none z-30 transform rotate-12 drop-shadow-xs" />

          {/* ── 5. WASHI TAPE (FIXED AT TOP-RIGHT ACROSS THE BLOSSOM) ── */}
          <div
            className="absolute top-1.5 right-6 w-20 h-6 bg-[#EBD6CF]/85 border-y border-dashed border-[#DFB6AE]/70 backdrop-blur-xs transform rotate-[-8deg] shadow-xs z-40 pointer-events-none"
            style={{
              clipPath:
                'polygon(5% 0%, 95% 0%, 100% 50%, 95% 100%, 5% 100%, 0% 50%)',
            }}
          />

          {/* ── 6. GUEST MESSAGE (HANDWRITTEN INK OVERLAY) ── */}
          <div className="relative z-20 my-auto pt-4 pr-6 flex items-center justify-center min-h-[170px]">
            <p
              className={`font-['Caveat'] ${getMessageFontSize(
                wish.message
              )} text-[#3A291E] font-medium tracking-wide text-center`}
              style={{
                fontFamily: "'Caveat', cursive, Georgia, serif",
                textShadow: '0 0.5px 0.5px rgba(58, 41, 30, 0.1)',
              }}
            >
              &ldquo;{wish.message}&rdquo;
            </p>
          </div>

          {/* ── 7. GUEST NAME SIGNATURE (BOTTOM-RIGHT) & TIMESTAMP ── */}
          <div className="relative z-20 pt-2 border-t border-[#DFC48F]/30 flex items-end justify-between">
            <span className="text-[10px] font-sans text-[#8A7F72]/80 uppercase tracking-widest">
              Rishikesh · {wish.timestamp || 'Blessing'}
            </span>

            {/* Signature style name in handwriting ink */}
            <p
              className="text-xl sm:text-2xl text-[#5C4533] font-semibold text-right"
              style={{
                fontFamily: "'Dancing Script', 'Caveat', cursive, serif",
              }}
            >
              — {wish.author}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export const WishingWall: React.FC<WishingWallProps> = ({ config }) => {
  const [wishes, setWishes] = useState<Wish[]>([]);
  const [author, setAuthor] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        setWishes(JSON.parse(saved));
      } else {
        setWishes(config.wishingWall.initialWishes);
      }
    } catch {
      setWishes(config.wishingWall.initialWishes);
    }
  }, [config.wishingWall.initialWishes]);

  const saveWishes = (newWishes: Wish[]) => {
    setWishes(newWishes);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newWishes));
    } catch (e) {
      console.error(e);
    }
  };

  // When card flies off-screen, move it to the BACK of the queue so it loops endlessly!
  const handleDismissTop = () => {
    setWishes((prev) => {
      if (prev.length <= 1) return prev;
      const [first, ...rest] = prev;
      return [...rest, first];
    });
  };

  // Submit new blessing: Added to the TOP of the stack (most recent wish is seen first)
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!author.trim() || !message.trim()) return;

    setIsSubmitting(true);
    const newWish: Wish = {
      id: `wish-${Date.now()}`,
      author: author.trim(),
      message: message.trim(),
      tag: 'pink',
      timestamp: 'Today',
      likes: 1,
    };

    const updated = [newWish, ...wishes];
    saveWishes(updated);
    setAuthor('');
    setMessage('');
    setShowForm(false);
    setIsSubmitting(false);
  };

  return (
    <section id="wishes" className="py-12 sm:py-20 px-3 sm:px-4 max-w-4xl mx-auto w-full">
      <RevealOnScroll>
        <div className="text-center max-w-xl mx-auto mb-6">
          <SectionEyebrow>{config.wishingWall.eyebrow}</SectionEyebrow>
          <SectionHeading subtitle={config.wishingWall.subtitle}>
            {config.wishingWall.heading}
          </SectionHeading>
        </div>
      </RevealOnScroll>

      {/* ── Toggleable Write a Blessing Button / Form ── */}
      <RevealOnScroll delay={100}>
        <div className="max-w-md mx-auto mb-8 text-center">
          {!showForm ? (
            <button
              type="button"
              onClick={() => setShowForm(true)}
              className="inline-flex items-center space-x-2 px-6 py-2.5 rounded-full bg-[#FAF2F0] hover:bg-[#F3E5E2] text-[#4A4038] text-xs font-serif uppercase tracking-[0.2em] font-semibold transition-all shadow-xs border border-[#DFC48F] active:scale-95 cursor-pointer"
            >
              <Feather size={14} className="text-[#C6A15B]" />
              <span>Write a Blessing</span>
            </button>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="p-5 sm:p-6 rounded-3xl bg-[#FFF9F8]/90 backdrop-blur-xs border border-[#DFC48F] shadow-md text-left space-y-3.5 animate-in fade-in zoom-in-95 duration-200"
            >
              <div className="flex items-center justify-between pb-2 border-b border-[#DFC48F]/40">
                <div className="flex items-center space-x-2">
                  <Sparkles size={15} className="text-[#C6A15B]" />
                  <span className="font-serif text-sm font-semibold text-[#4A4038] tracking-wide">
                    New Blessing Card
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="text-xs text-[#8A7F72] hover:text-[#4A4038] px-2 py-0.5 rounded-full hover:bg-[#F1D9D6]/40 transition-colors"
                >
                  ✕ Close
                </button>
              </div>

              <div>
                <label className="block text-[10px] font-sans tracking-wider uppercase text-[#8A7F72] mb-1 font-medium">
                  Your Name / Signature
                </label>
                <SmoothInput
                  required
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  placeholder="e.g. Vikram & Sunita"
                />
              </div>

              <div>
                <label className="block text-[10px] font-sans tracking-wider uppercase text-[#8A7F72] mb-1 font-medium">
                  Your Prayer or Heartfelt Blessing
                </label>
                <textarea
                  required
                  maxLength={220}
                  rows={3}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Write your loving blessing for Meher & Kabir in Rishikesh..."
                  className="w-full bg-[#FAF2F0] border border-[#DFC48F]/70 rounded-xl px-3.5 py-2 text-sm text-[#4A4038] focus:outline-hidden focus:border-[#C6A15B] resize-none font-['Caveat'] text-lg"
                />
                <div className="text-right text-[10px] text-[#8A7F72]/80 mt-0.5">
                  {message.length} / 220
                </div>
              </div>

              <div className="pt-1 flex justify-end">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center space-x-2 px-6 py-2 rounded-full bg-[#EED8D3] hover:bg-[#E3C4BE] text-[#3D332A] text-[11px] font-semibold tracking-[0.2em] uppercase transition-all shadow-xs border border-[#DFB6AE] active:scale-95 disabled:opacity-50"
                >
                  <Send size={12} className="text-[#C6A15B]" />
                  <span>Send Blessing</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </RevealOnScroll>

      {/* ── DRAGGABLE SCRAPBOOK CARD STACK (ENDLESS LOOP) ── */}
      <RevealOnScroll delay={150}>
        <div className="relative flex flex-col items-center justify-center my-4">
          {/* Card Stack Viewport Container */}
          <div className="relative w-full max-w-[360px] h-[420px] sm:h-[450px] flex items-center justify-center select-none">
            {wishes.slice(0, 3).map((wish, index) => (
              <ScrapbookCard
                key={wish.id}
                wish={wish}
                index={index}
                totalCards={wishes.length}
                onDismiss={handleDismissTop}
              />
            ))}
          </div>

          {/* Minimalist interactive hint */}
          <p className="text-[10px] sm:text-[11px] font-sans tracking-[0.22em] text-[#8A7F72] uppercase mt-4 text-center">
            Swipe card left, right, or down to browse blessings
          </p>
        </div>
      </RevealOnScroll>

      <Divider className="mt-12" />
    </section>
  );
};
