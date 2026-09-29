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

interface WishingWallProps {
  config: WeddingConfig;
  isHostMode?: boolean;
}

export type FloralTheme = 'pink' | 'blue' | 'purple' | 'peach';

export interface FloralTemplate {
  theme: FloralTheme;
  name: string;
  image: string;
  alt: string;
  tagStyle: string;
  textStyle: string;
  authorStyle: string;
  heartStyle: string;
  activeHeartStyle: string;
  accentBorder: string;
  dotColor: string;
}

export const FLORAL_TEMPLATES: Record<FloralTheme, FloralTemplate> = {
  pink: {
    theme: 'pink',
    name: 'Blush Rose',
    image: floralCardPink,
    alt: 'Handcrafted floral card with delicate pink cherry blossoms and botanical vines',
    tagStyle: 'bg-[#FFF0F2] text-[#9E3E50] border-[#F7C6CE]',
    textStyle: 'text-[#3E292C]',
    authorStyle: 'text-[#8E3A4B]',
    heartStyle: 'text-[#9E3E50]/75 hover:text-[#9E3E50] hover:bg-[#FFE8EC]/60',
    activeHeartStyle: 'text-[#D83A56] fill-[#D83A56] bg-[#FFE4E8]',
    accentBorder: '#E6A2AE',
    dotColor: '#E6A2AE',
  },
  blue: {
    theme: 'blue',
    name: 'River Ganga Blue',
    image: floralCardBlue,
    alt: 'Handcrafted floral card with royal blue blossoms and gilded watercolor foliage',
    tagStyle: 'bg-[#F0F6FD] text-[#215380] border-[#C4DCF3]',
    textStyle: 'text-[#203244]',
    authorStyle: 'text-[#1D4A73]',
    heartStyle: 'text-[#215380]/75 hover:text-[#215380] hover:bg-[#E4F0FB]/60',
    activeHeartStyle: 'text-[#1E70BA] fill-[#1E70BA] bg-[#DEEDFA]',
    accentBorder: '#8BB8E1',
    dotColor: '#8BB8E1',
  },
  purple: {
    theme: 'purple',
    name: 'Orchid Amethyst',
    image: floralCardPurple,
    alt: 'Handcrafted floral card with lavender orchid blossoms and gilded berries',
    tagStyle: 'bg-[#F7F2FB] text-[#633979] border-[#DFC9EE]',
    textStyle: 'text-[#34233C]',
    authorStyle: 'text-[#5E3473]',
    heartStyle: 'text-[#633979]/75 hover:text-[#633979] hover:bg-[#EFE3F7]/60',
    activeHeartStyle: 'text-[#853EA6] fill-[#853EA6] bg-[#F2E4FA]',
    accentBorder: '#B993D6',
    dotColor: '#B993D6',
  },
  peach: {
    theme: 'peach',
    name: 'Himalayan Sunrise',
    image: floralCardPeach,
    alt: 'Handcrafted floral card with warm peach blossoms and botanical greenery',
    tagStyle: 'bg-[#FDF5ED] text-[#934C24] border-[#F4D7C2]',
    textStyle: 'text-[#3B2C21]',
    authorStyle: 'text-[#8C4620]',
    heartStyle: 'text-[#934C24]/75 hover:text-[#934C24] hover:bg-[#FCEAD9]/60',
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

  return (
    <motion.div
      style={isTop ? { x, y, rotate, zIndex: 30 } : { zIndex: stackStyle.zIndex }}
      animate={isTop ? undefined : stackStyle}
      transition={{ type: 'spring', stiffness: 340, damping: 28 }}
      drag={isTop}
      dragElastic={0.7}
      whileDrag={{ scale: 1.02 }}
      onDragEnd={handleDragEnd}
      onTap={handleTap}
      className={`absolute inset-0 m-auto w-[330px] xs:w-[350px] max-w-[92%] aspect-[2/1] select-none touch-none ${
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

        {/* ── Heartfelt Craft Blessing Overlay on Floral Canvas ── */}
        <div className="absolute inset-0 flex flex-col justify-between items-center text-center px-14 xs:px-16 py-3.5 xs:py-4.5 select-none">
          {/* Header Row: Category Badge & Timestamp */}
          <div className="flex items-center space-x-1.5 xs:space-x-2 pointer-events-auto">
            <span
              className={`inline-flex items-center px-2 xs:px-2.5 py-0.5 rounded-full text-[9px] xs:text-[10px] font-sans font-semibold tracking-wider uppercase border shadow-2xs ${template.tagStyle}`}
            >
              {card.tag}
            </span>
            <span className="text-[9px] xs:text-[10px] font-sans text-[#8A7F72]/80 hidden xs:inline">
              · {card.timestamp}
            </span>
          </div>

          {/* Center Message: Heartfelt Wish in Cormorant Garamond Italic */}
          <div className="my-auto px-1 max-w-[96%] flex items-center justify-center">
            <p
              className={`font-['Cormorant_Garamond'] italic font-medium leading-tight xs:leading-snug text-[13px] xs:text-[14px] line-clamp-3 ${template.textStyle}`}
            >
              “{card.message}”
            </p>
          </div>

          {/* Footer Row: Author Signature & Interactive Heart Likes */}
          <div className="w-full flex items-center justify-between pointer-events-auto pt-1 border-t border-[#4A4038]/12">
            <span
              className={`font-serif font-semibold text-[10px] xs:text-[11px] tracking-wide truncate max-w-[65%] text-left ${template.authorStyle}`}
            >
              — {card.author}
            </span>

            {/* Heart Likes Button */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onLike(card.id);
              }}
              className={`inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] xs:text-[11px] font-sans font-medium transition-all duration-200 cursor-pointer active:scale-90 ${
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
  const [showForm, setShowForm] = useState(false);
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
  useEffect(() => {
    if (cards.length <= 1 || isHovered || showForm) {
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
  }, [cards, directionIndex, isHovered, showForm]);

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
      timestamp: 'Today',
      likes: 1,
      theme: assignedTheme,
    };

    setCards([newCard, ...cards]);
    setLikedCardIds((prev) => ({ ...prev, [newCard.id]: true }));
    setAuthor('');
    setMessage('');
    setShowForm(false);
    setIsSubmitting(false);
  };

  const currentTopCard = cards[0];
  const currentTopTemplate = currentTopCard ? FLORAL_TEMPLATES[currentTopCard.theme] : null;

  return (
    <section id="wishes" className="py-12 sm:py-20 px-3 sm:px-4 max-w-4xl mx-auto w-full">
      <RevealOnScroll>
        <div className="text-center max-w-xl mx-auto mb-6">
          <SectionEyebrow>{config.wishingWall?.eyebrow || 'MESSAGES OF LOVE'}</SectionEyebrow>
          <SectionHeading
            subtitle={
              config.wishingWall?.subtitle ||
              'Leave a prayer or loving wish for Meher & Kabir’s journey ahead.'
            }
          >
            {config.wishingWall?.heading || 'Blessings on the Ganges'}
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
              className="p-5 sm:p-6 rounded-3xl bg-[#FFF9F8]/95 backdrop-blur-md border border-[#DFC48F] shadow-lg text-left space-y-4 animate-in fade-in zoom-in-95 duration-200"
            >
              <div className="flex items-center justify-between pb-2 border-b border-[#DFC48F]/40">
                <div className="flex items-center space-x-2">
                  <Sparkles size={15} className="text-[#C6A15B]" />
                  <span className="font-serif text-sm font-semibold text-[#4A4038] tracking-wide">
                    New Floral Blessing Card
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="text-xs text-[#8A7F72] hover:text-[#4A4038] px-2 py-0.5 rounded-full hover:bg-[#F1D9D6]/40 transition-colors cursor-pointer"
                >
                  ✕ Close
                </button>
              </div>

              {/* Author / Signature */}
              <div>
                <label className="block text-[10px] font-sans tracking-wider uppercase text-[#8A7F72] mb-1 font-medium">
                  Your Name / Signature
                </label>
                <SmoothInput
                  required
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  placeholder="e.g. Vikram & Sunita Malhotra"
                />
              </div>

              {/* Prayer or Blessing Message */}
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

              <div className="pt-1 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 rounded-full border border-stone-300 text-[11px] font-semibold tracking-wider text-[#6B5E52] hover:bg-stone-100 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center space-x-2 px-6 py-2 rounded-full bg-[#EED8D3] hover:bg-[#E3C4BE] text-[#3D332A] text-[11px] font-semibold tracking-[0.2em] uppercase transition-all shadow-xs border border-[#DFB6AE] active:scale-95 disabled:opacity-50 cursor-pointer"
                >
                  <Send size={12} className="text-[#C6A15B]" />
                  <span>Send Blessing</span>
                </button>
              </div>
            </form>
          )}
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
            className="relative w-full max-w-[380px] h-[200px] xs:h-[220px] flex items-center justify-center select-none"
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

      <Divider className="mt-12" />
    </section>
  );
};
