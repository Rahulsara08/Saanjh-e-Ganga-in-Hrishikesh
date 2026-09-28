import React, { useState, useEffect } from 'react';
import { motion, useMotionValue, useTransform, animate, PanInfo } from 'framer-motion';
import { SectionEyebrow, SectionHeading, Divider } from './BasicComponents';
import { RevealOnScroll } from './RevealOnScroll';
import { WeddingConfig } from '../types';
import { Send, Feather, Sparkles } from 'lucide-react';
import { SmoothInput } from './ui/SmoothInput';

import parchmentBow from '../assets/images/wish_parchment_bow.png';
import parchmentButterfly from '../assets/images/wish_parchment_butterfly.png';
import parchmentFlowers from '../assets/images/wish_parchment_flowers.png';
import parchmentRibbon from '../assets/images/wish_parchment_ribbon.png';

interface WishingWallProps {
  config: WeddingConfig;
  isHostMode?: boolean;
}

export interface BlessingCardItem {
  id: string;
  image: string;
  alt: string;
}

const DEFAULT_BLESSING_CARDS: BlessingCardItem[] = [
  {
    id: 'blessing-card-bow',
    image: parchmentBow,
    alt: 'Handcrafted antique parchment blessing card adorned with white and gold polka-dot bow',
  },
  {
    id: 'blessing-card-butterfly',
    image: parchmentButterfly,
    alt: 'Handcrafted antique parchment blessing card adorned with a monarch butterfly',
  },
  {
    id: 'blessing-card-flowers',
    image: parchmentFlowers,
    alt: 'Handcrafted antique parchment blessing card adorned with tied wildflower bouquet',
  },
  {
    id: 'blessing-card-ribbon',
    image: parchmentRibbon,
    alt: 'Handcrafted antique parchment blessing card adorned with charcoal organza ribbon and lace',
  },
];

// ── Transparent Parchment Card Component ──
interface ScrapbookCardProps {
  card: BlessingCardItem;
  index: number;
  totalCards: number;
  onDismiss: (direction: 'left' | 'right' | 'up' | 'down') => void;
  autoDismissTrigger?: { cardId: string; direction: 'left' | 'right' | 'up' | 'down' } | null;
}

const ScrapbookCard: React.FC<ScrapbookCardProps> = ({
  card,
  index,
  totalCards,
  onDismiss,
  autoDismissTrigger,
}) => {
  const isTop = index === 0;
  const isSecond = index === 1;
  const isThird = index === 2;

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Guarantee motion values are reset to 0 whenever position changes (infinite cycling)
  useEffect(() => {
    x.set(0);
    y.set(0);
  }, [card.id, index, x, y]);

  // Tilt dynamically proportional to horizontal drag distance (only for top card)
  const rotate = useTransform(x, [-240, 240], [-18, 18]);

  const dismissCard = (direction: 'left' | 'right' | 'up' | 'down') => {
    const targetX = direction === 'left' ? -650 : direction === 'right' ? 650 : 0;
    const targetY = direction === 'up' ? -650 : direction === 'down' ? 650 : 0;

    Promise.all([
      animate(x, targetX, { duration: 0.32, ease: 'easeOut' }),
      animate(y, targetY, { duration: 0.32, ease: 'easeOut' }),
    ]).then(() => {
      onDismiss(direction);
      x.set(0);
      y.set(0);
    });
  };

  // Trigger 5-second automatic sliding animation outside of the screen
  useEffect(() => {
    if (isTop && autoDismissTrigger && autoDismissTrigger.cardId === card.id) {
      dismissCard(autoDismissTrigger.direction);
    }
  }, [autoDismissTrigger, isTop, card.id]);

  const handleDragEnd = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (!isTop) return;
    const { offset, velocity } = info;
    const threshold = 60;
    const velThreshold = 180;

    if (offset.x < -threshold || velocity.x < -velThreshold) {
      dismissCard('left');
    } else if (offset.x > threshold || velocity.x > velThreshold) {
      dismissCard('right');
    } else if (offset.y < -threshold || velocity.y < -velThreshold) {
      dismissCard('up');
    } else if (offset.y > threshold || velocity.y > velThreshold) {
      dismissCard('down');
    } else {
      // Release before threshold: spring back to resting stack position
      animate(x, 0, { type: 'spring', stiffness: 350, damping: 25 });
      animate(y, 0, { type: 'spring', stiffness: 350, damping: 25 });
    }
  };

  const handleTap = () => {
    if (!isTop) return;
    // Tap to cycle card smoothly to back
    dismissCard('right');
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
      dragElastic={0.8}
      onDragEnd={handleDragEnd}
      onTap={handleTap}
      className={`absolute inset-0 m-auto w-[295px] xs:w-[325px] sm:w-[350px] h-[230px] xs:h-[250px] sm:h-[270px] select-none ${
        isTop ? 'cursor-grab active:cursor-grabbing' : 'pointer-events-none'
      }`}
    >
      {/* ── TRANSPARENT PARCHMENT BLESSING CARD (NO BACKGROUND, NO BOX, NO FRAME) ── */}
      <div className="relative w-full h-full flex items-center justify-center filter drop-shadow-[0_12px_24px_rgba(74,64,56,0.22)] select-none">
        <img
          src={card.image}
          alt={card.alt}
          className="w-full h-full object-contain pointer-events-none select-none"
          draggable={false}
        />
      </div>
    </motion.div>
  );
};

const AUTO_DISMISS_DIRECTIONS: Array<'right' | 'left' | 'down' | 'up'> = [
  'right',
  'left',
  'down',
  'up',
];

export const WishingWall: React.FC<WishingWallProps> = ({ config }) => {
  const [cards, setCards] = useState<BlessingCardItem[]>(DEFAULT_BLESSING_CARDS);
  const [author, setAuthor] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const [directionStep, setDirectionStep] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [autoDismissTrigger, setAutoDismissTrigger] = useState<{
    cardId: string;
    direction: 'left' | 'right' | 'up' | 'down';
  } | null>(null);

  // 5-second automatic card sliding timer: right -> left -> down -> up -> loop
  useEffect(() => {
    if (cards.length <= 1 || isHovered || showForm) return;

    const timer = setInterval(() => {
      const topCard = cards[0];
      if (topCard) {
        const nextDirection = AUTO_DISMISS_DIRECTIONS[directionStep % 4];
        setAutoDismissTrigger({ cardId: topCard.id, direction: nextDirection });
        setDirectionStep((prev) => prev + 1);
      }
    }, 5000);

    return () => clearInterval(timer);
  }, [cards, directionStep, isHovered, showForm]);

  // When card flies off-screen, move it to the BACK of the queue so it loops endlessly!
  const handleDismissTop = () => {
    setAutoDismissTrigger(null);
    setCards((prev) => {
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
    const newCard: BlessingCardItem = {
      id: `blessing-${Date.now()}`,
      image: DEFAULT_BLESSING_CARDS[cards.length % DEFAULT_BLESSING_CARDS.length].image,
      alt: `Handcrafted blessing card from ${author.trim()}`,
    };

    setCards([newCard, ...cards]);
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

      {/* ── DRAGGABLE TRANSPARENT BLESSING CARD STACK (ENDLESS LOOP WITH 5S AUTO-SLIDE) ── */}
      <RevealOnScroll delay={150}>
        <div className="relative flex flex-col items-center justify-center my-4">
          {/* Card Stack Viewport Container with 5s Auto-Slide & Hover Pause */}
          <div
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onTouchStart={() => setIsHovered(true)}
            onTouchEnd={() => setIsHovered(false)}
            className="relative w-full max-w-[360px] h-[300px] sm:h-[330px] flex items-center justify-center select-none"
          >
            {cards.slice(0, 3).map((card, index) => (
              <ScrapbookCard
                key={card.id}
                card={card}
                index={index}
                totalCards={cards.length}
                onDismiss={handleDismissTop}
                autoDismissTrigger={autoDismissTrigger}
              />
            ))}
          </div>
        </div>
      </RevealOnScroll>

      <Divider className="mt-12" />
    </section>
  );
};
