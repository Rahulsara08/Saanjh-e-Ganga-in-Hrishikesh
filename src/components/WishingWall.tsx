import React, { useState, useEffect, useRef } from 'react';
import { motion, useMotionValue, useTransform, animate, PanInfo } from 'framer-motion';
import { SectionEyebrow, SectionHeading, Divider } from './BasicComponents';
import { RevealOnScroll } from './RevealOnScroll';
import { WeddingConfig, Wish } from '../types';
import {
  Send,
  Feather,
  Sparkles,
  Heart,
} from 'lucide-react';
import { SmoothInput } from './ui/SmoothInput';

import floralCardPink from '../assets/images/floral_card_pink.png';
import floralCardBlue from '../assets/images/floral_card_blue.png';
import floralCardPurple from '../assets/images/floral_card_purple.png';
import floralCardPeach from '../assets/images/floral_card_peach.png';
import cherryBlossomTree from '../assets/images/cherry_blossom_tree_transparent.png';
import paperBlushTexture from '../assets/images/paper_blush_texture.jpg';

interface WishingWallProps {
  config: WeddingConfig;
  isHostMode?: boolean;
}

export type FloralTheme = 'pink' | 'blue' | 'purple' | 'peach';

interface SafeZone {
  top: string;
  bottom: string;
  left: string;
  right: string;
}

interface FloralTemplate {
  theme: FloralTheme;
  name: string;
  image: string;
  alt: string;
  safeZone: SafeZone;
  textStyle: string;
  authorStyle: string;
  heartStyle: string;
  activeHeartStyle: string;
  accentBorder: string;
  dotColor: string;
}

const FLORAL_TEMPLATES: Record<FloralTheme, FloralTemplate> = {
  pink: {
    theme: 'pink',
    name: 'Blush Rose',
    image: floralCardPink,
    alt: 'Handcrafted floral card with delicate pink cherry blossoms and botanical vines',
    safeZone: {
      top: '23%',
      bottom: '17%',
      left: '33%',
      right: '14%',
    },
    textStyle: 'text-[#241913]',
    authorStyle: 'text-[#8B2E3E]',
    heartStyle: 'text-[#8B2E3E]/75 hover:text-[#8B2E3E] hover:bg-[#FFE8EC]/60',
    activeHeartStyle: 'text-[#D83A56] fill-[#D83A56] bg-[#FFE4E8]',
    accentBorder: '#E6A2AE',
    dotColor: '#E6A2AE',
  },
  blue: {
    theme: 'blue',
    name: 'River Ganga Blue',
    image: floralCardBlue,
    alt: 'Handcrafted floral card with royal blue blossoms and gilded watercolor foliage',
    safeZone: {
      top: '25%',
      bottom: '21%',
      left: '18%',
      right: '34%',
    },
    textStyle: 'text-[#241913]',
    authorStyle: 'text-[#164268]',
    heartStyle: 'text-[#164268]/75 hover:text-[#164268] hover:bg-[#E4F0FB]/60',
    activeHeartStyle: 'text-[#1E70BA] fill-[#1E70BA] bg-[#DEEDFA]',
    accentBorder: '#8BB8E1',
    dotColor: '#8BB8E1',
  },
  purple: {
    theme: 'purple',
    name: 'Orchid Amethyst',
    image: floralCardPurple,
    alt: 'Handcrafted floral card with lavender orchid blossoms and gilded berries',
    safeZone: {
      top: '25%',
      bottom: '19%',
      left: '33%',
      right: '18%',
    },
    textStyle: 'text-[#241913]',
    authorStyle: 'text-[#532766]',
    heartStyle: 'text-[#532766]/75 hover:text-[#532766] hover:bg-[#EFE3F7]/60',
    activeHeartStyle: 'text-[#853EA6] fill-[#853EA6] bg-[#F2E4FA]',
    accentBorder: '#B993D6',
    dotColor: '#B993D6',
  },
  peach: {
    theme: 'peach',
    name: 'Himalayan Sunrise',
    image: floralCardPeach,
    alt: 'Handcrafted floral card with warm peach blossoms and botanical greenery',
    safeZone: {
      top: '24%',
      bottom: '18%',
      left: '33%',
      right: '21%',
    },
    textStyle: 'text-[#241913]',
    authorStyle: 'text-[#7D3915]',
    heartStyle: 'text-[#7D3915]/75 hover:text-[#7D3915] hover:bg-[#FCEAD9]/60',
    activeHeartStyle: 'text-[#D06028] fill-[#D06028] bg-[#FDE5D4]',
    accentBorder: '#E6A882',
    dotColor: '#E6A882',
  },
};

const THEME_ORDER: FloralTheme[] = ['pink', 'blue', 'purple', 'peach'];

export interface BlessingCardData extends Wish {
  theme: FloralTheme;
}

// Sequence of split-out directions: Left -> Down -> Right (cycles continuously)
export type SplitDirection = 'left' | 'down' | 'right' | 'up';
const SPLIT_SEQUENCE: SplitDirection[] = ['left', 'down', 'right'];

// ── Stacked Handcrafted Floral Blessing Card Component ──
interface FloralCardStackItemProps {
  card: BlessingCardData;
  index: number;
  totalCards: number;
  onDismiss: (direction: SplitDirection) => void;
  autoDismissTrigger?: { cardId: string; direction: SplitDirection } | null;
  onLike: (id: string) => void;
  isLiked: boolean;
}

const FloralCardStackItem: React.FC<FloralCardStackItemProps> = ({
  card,
  index,
  onDismiss,
  autoDismissTrigger,
  onLike,
  isLiked,
}) => {
  const isTop = index === 0;
  const isSecond = index === 1;
  const isThird = index === 2;
  const isFourth = index === 3;

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Guarantee motion values are reset to 0 whenever position changes (infinite cycling)
  useEffect(() => {
    x.set(0);
    y.set(0);
  }, [card.id, index, x, y]);

  // Tilt dynamically proportional to horizontal drag distance (only for top card)
  const rotate = useTransform(x, [-300, 300], [-18, 18]);

  const dismissCard = (direction: SplitDirection) => {
    let targetX = 0;
    let targetY = 0;
    let targetRotate = 0;

    if (direction === 'left') {
      targetX = -850;
      targetY = -25;
      targetRotate = -22;
    } else if (direction === 'right') {
      targetX = 850;
      targetY = -25;
      targetRotate = 22;
    } else if (direction === 'down') {
      targetX = 0;
      targetY = 650;
      targetRotate = 5;
    } else if (direction === 'up') {
      targetX = 0;
      targetY = -650;
      targetRotate = -5;
    }

    Promise.all([
      animate(x, targetX, { duration: 0.38, ease: [0.32, 0, 0.67, 0] }),
      animate(y, targetY, { duration: 0.38, ease: [0.32, 0, 0.67, 0] }),
    ]).then(() => {
      onDismiss(direction);
      x.set(0);
      y.set(0);
    });
  };

  // Trigger automatic split-out animation outside of the screen
  useEffect(() => {
    if (isTop && autoDismissTrigger && autoDismissTrigger.cardId === card.id) {
      dismissCard(autoDismissTrigger.direction);
    }
  }, [autoDismissTrigger, isTop, card.id]);

  const handleDragEnd = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (!isTop) return;
    const { offset, velocity } = info;
    const xThreshold = 65;
    const yThreshold = 65;
    const vThreshold = 180;

    // Check drag direction and velocity thresholds for intuitive swipe/flick
    if (offset.x < -xThreshold || velocity.x < -vThreshold) {
      dismissCard('left');
    } else if (offset.x > xThreshold || velocity.x > vThreshold) {
      dismissCard('right');
    } else if (offset.y > yThreshold || velocity.y > vThreshold) {
      dismissCard('down');
    } else if (offset.y < -yThreshold || velocity.y < -vThreshold) {
      dismissCard('up');
    } else {
      // Release before threshold: spring back to resting stack position
      animate(x, 0, { type: 'spring', stiffness: 380, damping: 26 });
      animate(y, 0, { type: 'spring', stiffness: 380, damping: 26 });
    }
  };

  const handleTap = () => {
    if (!isTop) return;
    // Tap to split/cycle card smoothly to the right
    dismissCard('right');
  };

  // Stack visuals: realistic handcrafted paper deck with subtle tilt & scaling
  const stackStyle = isTop
    ? { scale: 1, y: 0, rotate: 0, zIndex: 30, opacity: 1 }
    : isSecond
    ? { scale: 0.94, y: 14, rotate: 2.2, zIndex: 20, opacity: 0.92 }
    : isThird
    ? { scale: 0.88, y: 26, rotate: -2.4, zIndex: 10, opacity: 0.78 }
    : isFourth
    ? { scale: 0.82, y: 36, rotate: 1.2, zIndex: 5, opacity: 0.45 }
    : { scale: 0.78, y: 44, rotate: 0, zIndex: 0, opacity: 0 };

  const template = FLORAL_TEMPLATES[card.theme];

  // Dynamic font size calculation so blessing fits comfortably regardless of message length
  const getBlessingFontSize = (text: string) => {
    if (text.length > 85) {
      return 'text-[13px] xs:text-[14px] leading-tight';
    }
    if (text.length > 50) {
      return 'text-[14px] xs:text-[15px] leading-snug';
    }
    return 'text-[15px] xs:text-[16px] leading-snug';
  };

  const fontSizeClass = getBlessingFontSize(card.message);

  return (
    <motion.div
      style={isTop ? { x, y, rotate, zIndex: 30 } : { zIndex: stackStyle.zIndex }}
      animate={isTop ? undefined : stackStyle}
      transition={{ type: 'spring', stiffness: 340, damping: 28 }}
      drag={isTop}
      dragElastic={0.7}
      whileDrag={{ scale: 1.02 }}
      whileHover={
        isTop
          ? {
              y: -4,
              scale: 1.015,
              transition: { duration: 0.2, ease: 'easeOut' },
            }
          : undefined
      }
      onDragEnd={handleDragEnd}
      onTap={handleTap}
      className={`absolute inset-0 m-auto w-[335px] xs:w-[360px] sm:w-[380px] max-w-[94%] aspect-[2/1] select-none touch-none ${
        isTop ? 'cursor-grab active:cursor-grabbing' : 'pointer-events-none'
      }`}
    >
      <div className="relative w-full h-full flex items-center justify-center filter drop-shadow-[0_14px_30px_rgba(74,64,56,0.18)] select-none">
        {/* Transparent Floral Card Background Art */}
        <img
          src={template.image}
          alt={template.alt}
          className="w-full h-full object-contain pointer-events-none select-none drop-shadow-sm"
          draggable={false}
        />

        {/* ── Safe Content Zone: Inset from flowers, stems & borders on all 4 sides ── */}
        <div
          style={{
            top: template.safeZone.top,
            bottom: template.safeZone.bottom,
            left: template.safeZone.left,
            right: template.safeZone.right,
          }}
          className="absolute flex flex-col justify-between items-center text-center select-none overflow-hidden"
        >
          {/* Subtle soft panel for maximum contrast without obscuring floral art */}
          <div className="absolute inset-0 bg-white/40 rounded-xl backdrop-blur-[0.5px] pointer-events-none -z-10" />

          {/* Center Message: Clean, highly legible serif font with auto-sizing */}
          <div className="flex-1 w-full flex items-center justify-center px-1.5 my-auto overflow-hidden">
            <p
              className={`font-serif font-medium tracking-normal text-[#241913] ${fontSizeClass} line-clamp-3`}
            >
              “{card.message}”
            </p>
          </div>

          {/* Footer Row: Author Name & Interactive Heart Likes */}
          <div className="w-full flex items-center justify-between pointer-events-auto pt-1 border-t border-[#4A4038]/15 gap-2 shrink-0">
            <span
              className={`font-sans font-semibold text-[13px] xs:text-[14px] tracking-wide truncate max-w-[70%] text-left ${template.authorStyle}`}
            >
              — {card.author}
            </span>

            {/* Heart Likes Button: Nudged fully inside safe zone */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onLike(card.id);
              }}
              className={`inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-xs font-sans font-medium transition-all duration-200 cursor-pointer active:scale-90 shrink-0 ${
                isLiked ? template.activeHeartStyle : template.heartStyle
              }`}
              title="Bless this wish with a heart"
            >
              <Heart
                size={12}
                className={`transition-transform duration-200 ${isLiked ? 'fill-current scale-110' : ''}`}
              />
              <span>{card.likes + (isLiked ? 1 : 0)}</span>
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export const WishingWall: React.FC<WishingWallProps> = ({ config }) => {
  // Convert config initial wishes to floral card data with round-robin themes
  const initialCardsData: BlessingCardData[] = (config.wishingWall?.initialWishes || []).map(
    (wish, idx) => ({
      ...wish,
      theme: THEME_ORDER[idx % THEME_ORDER.length],
    })
  );

  const [cards, setCards] = useState<BlessingCardData[]>(initialCardsData);
  const [author, setAuthor] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [isFormFocused, setIsFormFocused] = useState(false);
  const [likedCardIds, setLikedCardIds] = useState<Record<string, boolean>>({});

  // Split-out animation state
  const [directionIndex, setDirectionIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [autoDismissTrigger, setAutoDismissTrigger] = useState<{
    cardId: string;
    direction: SplitDirection;
  } | null>(null);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // 5-second automatic card sliding timer: Left -> Down -> Right -> Loop
  // Pauses only when cards are hovered or user is actively typing in form
  useEffect(() => {
    if (cards.length <= 1 || isHovered || isFormFocused) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      const topCard = cards[0];
      if (topCard) {
        const nextDirection = SPLIT_SEQUENCE[directionIndex % SPLIT_SEQUENCE.length];
        setAutoDismissTrigger({ cardId: topCard.id, direction: nextDirection });
        setDirectionIndex((prev) => prev + 1);
      }
    }, 5000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [cards, directionIndex, isHovered, isFormFocused]);

  // When card flies off-screen, move it to the BACK of the queue so it loops endlessly!
  const handleDismissTop = () => {
    setAutoDismissTrigger(null);
    setCards((prev) => {
      if (prev.length <= 1) return prev;
      const [first, ...rest] = prev;
      return [...rest, first];
    });
  };

  // Toggle liking a card
  const handleLike = (id: string) => {
    setLikedCardIds((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // Submit new blessing: Added to the TOP of the stack (most recent wish is seen first)
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!author.trim() || !message.trim()) return;

    setIsSubmitting(true);
    const assignedTheme = THEME_ORDER[cards.length % THEME_ORDER.length];
    const newCard: BlessingCardData = {
      id: `blessing-${Date.now()}`,
      author: author.trim(),
      message: message.trim(),
      tag: '✨ Divine Blessings',
      timestamp: 'Just now',
      likes: 1,
      theme: assignedTheme,
    };

    setCards([newCard, ...cards]);
    setLikedCardIds((prev) => ({ ...prev, [newCard.id]: true }));
    setAuthor('');
    setMessage('');
    setShowSuccessToast(true);
    setTimeout(() => setShowSuccessToast(false), 4000);
    setIsSubmitting(false);
  };

  const currentTopCard = cards[0];
  const currentTopTemplate = currentTopCard ? FLORAL_TEMPLATES[currentTopCard.theme] : null;

  return (
    <section id="wishes" className="relative py-12 sm:py-20 px-3 sm:px-4 max-w-4xl mx-auto w-full overflow-hidden select-none">
      <style>{`
        @keyframes ixTreeBreeze {
          0%, 100% {
            transform: rotate(0deg) skewX(0deg);
          }
          35% {
            transform: rotate(0.6deg) skewX(0.35deg);
          }
          70% {
            transform: rotate(-0.5deg) skewX(-0.3deg);
          }
        }
        @keyframes ixPetalDrift {
          0% {
            transform: translate(0, 0) rotate(0deg) scale(0.85);
            opacity: 0;
          }
          15% {
            opacity: 0.85;
          }
          50% {
            transform: translate(36px, 65px) rotate(115deg) scale(1);
            opacity: 0.9;
          }
          85% {
            opacity: 0.75;
          }
          100% {
            transform: translate(75px, 145px) rotate(225deg) scale(0.9);
            opacity: 0;
          }
        }
        @keyframes ixPetalDrift2 {
          0% {
            transform: translate(0, 0) rotate(0deg) scale(0.9);
            opacity: 0;
          }
          15% {
            opacity: 0.8;
          }
          50% {
            transform: translate(30px, 55px) rotate(-95deg) scale(1.05);
            opacity: 0.85;
          }
          85% {
            opacity: 0.65;
          }
          100% {
            transform: translate(65px, 130px) rotate(-190deg) scale(0.85);
            opacity: 0;
          }
        }
      `}</style>

      {/* ── 1. Handcrafted Blush Paper Background Texture ── */}
      <div
        className="absolute inset-0 pointer-events-none z-0 opacity-40 mix-blend-multiply"
        style={{
          backgroundImage: `url(${paperBlushTexture})`,
          backgroundRepeat: 'repeat',
          backgroundSize: '400px auto',
        }}
      />
      <div
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          background:
            'radial-gradient(ellipse 95% 85% at 50% 50%, rgba(255, 252, 250, 0.92) 0%, rgba(250, 240, 238, 0.72) 55%, rgba(246, 228, 231, 0.88) 100%)',
        }}
      />

      {/* ── 2. Integrated Flowering Cherry-Blossom Tree Layer ── */}
      {/* Starts behind the blessing cards and reaches up to top of 'Blessings on the Ganges' */}
      <div
        className="absolute -left-6 xs:-left-8 sm:-left-4 top-0 pointer-events-none select-none z-0 w-[320px] xs:w-[380px] sm:w-[450px] md:w-[500px] max-w-[85%] flex items-start justify-start overflow-visible"
        aria-hidden="true"
      >
        <div
          className="relative w-full flex items-start justify-start pointer-events-none select-none"
          style={{
            animation: 'ixTreeBreeze 9s ease-in-out infinite',
            transformOrigin: '20% 90%',
          }}
        >
          <img
            src={cherryBlossomTree}
            alt="Sacred Himalayan Flowering Tree"
            className="w-full h-auto max-h-[720px] object-contain object-top-left pointer-events-none select-none filter contrast-[1.03] opacity-95 mix-blend-multiply drop-shadow-[0_4px_16px_rgba(210,140,160,0.16)]"
          />
        </div>
      </div>

      {/* ── 3. Subtle Floating Blossoms & Petals Drifting from the Tree ── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-[1]" aria-hidden="true">
        {/* Petal 1: Near upper branches heading toward 'MESSAGES OF LOVE' */}
        <span
          className="absolute left-[24%] xs:left-[26%] top-[16%] w-3 h-4 rounded-full bg-gradient-to-br from-[#FFE3E8] to-[#F198AC] opacity-80 pointer-events-none filter blur-[0.2px]"
          style={{
            animation: 'ixPetalDrift 8s cubic-bezier(0.4, 0, 0.2, 1) infinite',
            animationDelay: '0s',
          }}
        />
        {/* Petal 2: Drifting softly toward cards */}
        <span
          className="absolute left-[32%] xs:left-[34%] top-[32%] w-2.5 h-3.5 rounded-full bg-gradient-to-br from-[#FFDDE4] to-[#F5ACB9] opacity-75 pointer-events-none filter blur-[0.2px]"
          style={{
            animation: 'ixPetalDrift2 10s cubic-bezier(0.4, 0, 0.2, 1) infinite',
            animationDelay: '2.5s',
          }}
        />
        {/* Petal 3: Near middle-left trunk */}
        <span
          className="absolute left-[16%] xs:left-[18%] top-[50%] w-3 h-4 rounded-full bg-gradient-to-br from-[#FFDDE4] to-[#F3A5B7] opacity-70 pointer-events-none filter blur-[0.3px]"
          style={{
            animation: 'ixPetalDrift 9s cubic-bezier(0.4, 0, 0.2, 1) infinite',
            animationDelay: '5s',
          }}
        />
        {/* Petal 4: Drifting near grassy base */}
        <span
          className="absolute left-[24%] xs:left-[26%] bottom-[20%] w-2.5 h-3 rounded-full bg-gradient-to-br from-[#FFE4E9] to-[#F09DB0] opacity-80 pointer-events-none filter blur-[0.2px]"
          style={{
            animation: 'ixPetalDrift2 11s cubic-bezier(0.4, 0, 0.2, 1) infinite',
            animationDelay: '7.5s',
          }}
        />
      </div>

      <div className="relative z-10">
        <RevealOnScroll>
          <div className="text-center max-w-xl mx-auto mb-6">
            <span className="text-[11px] sm:text-xs font-sans tracking-[0.26em] text-[#8A5A00] uppercase font-bold block mb-1">
              {config.wishingWall?.eyebrow || 'MESSAGES OF LOVE'}
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#140F0A] font-bold leading-tight">
              {config.wishingWall?.heading || 'Blessings on the Ganges'}
            </h2>
            <p className="font-sans text-xs sm:text-sm text-[#4A4038] mt-2 font-medium max-w-md mx-auto">
              {config.wishingWall?.subtitle || 'Leave a prayer or loving wish for Meher & Kabir’s journey ahead.'}
            </p>
          </div>
        </RevealOnScroll>

        {/* ── Blessing Submission Form: Clean & Accessible (No Blurry Card Box) ── */}
        <RevealOnScroll delay={100}>
          <div className="max-w-md mx-auto mb-8 text-center">
            {showSuccessToast && (
              <div className="mb-3 px-4 py-2 rounded-full bg-[#EAF5EB] border border-[#A5D6A7] text-xs font-sans font-bold text-[#1B5E20] inline-flex items-center gap-1.5 shadow-2xs">
                <Sparkles size={13} className="text-[#2E7D32]" />
                <span>Your blessing has been placed on top of the blessing wall!</span>
              </div>
            )}

            <form
              onSubmit={handleSubmit}
              className="p-5 sm:p-6 rounded-3xl bg-[#FFFDFB]/90 border border-[#DFC48F]/70 shadow-sm text-left space-y-4"
            >
              <div className="flex items-center justify-between pb-2 border-b border-[#DFC48F]/40">
                <div className="flex items-center space-x-2">
                  <Sparkles size={16} className="text-[#9A6B0A]" />
                  <span className="font-serif text-base sm:text-lg font-bold text-[#140F0A] tracking-wide">
                    Write a Blessing
                  </span>
                </div>
                <span className="font-serif italic text-sm text-[#8A5A00] font-semibold">
                  For Meher & Kabir
                </span>
              </div>

              {/* Author / Signature */}
              <div>
                <label className="block text-xs font-sans font-bold uppercase tracking-wider text-[#2C2117] mb-1.5">
                  Your Name / Family Signature
                </label>
                <div
                  onFocus={() => setIsFormFocused(true)}
                  onBlur={() => setIsFormFocused(false)}
                >
                  <SmoothInput
                    required
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    placeholder="e.g. Vikram & Sunita Malhotra"
                  />
                </div>
              </div>

              {/* Prayer or Blessing Message */}
              <div>
                <label className="block text-xs font-sans font-bold uppercase tracking-wider text-[#2C2117] mb-1.5">
                  Your Prayer or Heartfelt Blessing
                </label>
                <textarea
                  required
                  maxLength={220}
                  rows={3}
                  value={message}
                  onFocus={() => setIsFormFocused(true)}
                  onBlur={() => setIsFormFocused(false)}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Write your loving blessing for Meher & Kabir in Rishikesh..."
                  className="w-full bg-[#FFFDFB] border border-[#DFC48F] rounded-xl px-3.5 py-2.5 text-sm text-[#140F0A] font-sans focus:outline-hidden focus:border-[#9A6B0A] resize-none leading-relaxed placeholder:text-[#8A7F72]"
                />
                <div className="text-right text-[11px] text-[#7A6F62] font-sans font-medium mt-1">
                  {message.length} / 220
                </div>
              </div>

              <div className="pt-1 flex justify-end">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center space-x-2 px-7 py-3 rounded-full bg-[#8A5A00] hover:bg-[#6D4200] text-white text-xs font-sans font-bold tracking-[0.2em] uppercase transition-all shadow-md hover:shadow-lg active:scale-95 disabled:opacity-50 cursor-pointer"
                >
                  <Send size={13} className="text-white" />
                  <span>Send Blessing</span>
                </button>
              </div>
            </form>
          </div>
        </RevealOnScroll>

      {/* ── DRAGGABLE TRANSPARENT FLORAL BLESSING CARD STACK (ENDLESS LOOP WITH 5S AUTO-SPLIT) ── */}
      <RevealOnScroll delay={150}>
        <div className="relative flex flex-col items-center justify-center my-4">
          {/* Card Stack Viewport Container with 5s Auto-Split & Hover Pause */}
          <div
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onTouchStart={() => setIsHovered(true)}
            onTouchEnd={() => setIsHovered(false)}
            className="relative w-full max-w-[390px] h-[210px] xs:h-[230px] flex items-center justify-center select-none"
          >
            {cards.slice(0, 4).map((card, index) => (
              <FloralCardStackItem
                key={card.id}
                card={card}
                index={index}
                totalCards={cards.length}
                onDismiss={handleDismissTop}
                autoDismissTrigger={autoDismissTrigger}
                onLike={handleLike}
                isLiked={!!likedCardIds[card.id]}
              />
            ))}
          </div>
        </div>
      </RevealOnScroll>
      </div>

      <Divider className="mt-6 sm:mt-8" />
    </section>
  );
};
