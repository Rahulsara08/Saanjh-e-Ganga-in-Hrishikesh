import React, { useState, useEffect } from 'react';
import { SectionEyebrow, SectionHeading, Divider } from './BasicComponents';
import { RevealOnScroll } from './RevealOnScroll';
import { WeddingConfig, Wish } from '../types';
import { Heart, Send, MessageSquareHeart, Trash2 } from 'lucide-react';
import { SmoothInput } from './ui/SmoothInput';

interface WishingWallProps {
  config: WeddingConfig;
  isHostMode?: boolean;
}

const STORAGE_KEY = 'meher_kabir_wishes_warm_v4';
const LIKES_KEY = 'meher_kabir_wished_likes_warm_v4';

type BlessingCardColor = 'pink' | 'blue' | 'red';

export const WishingWall: React.FC<WishingWallProps> = ({ config, isHostMode = false }) => {
  const [wishes, setWishes] = useState<Wish[]>([]);
  const [author, setAuthor] = useState('');
  const [message, setMessage] = useState('');
  const [selectedColor, setSelectedColor] = useState<BlessingCardColor>('pink');
  const [likedMap, setLikedMap] = useState<{ [id: string]: boolean }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [screwedMap, setScrewedMap] = useState<{ [id: string]: boolean }>({});

  const colorThemes = [
    {
      id: 'pink' as BlessingCardColor,
      swatch: 'bg-[#FCE8E6]',
      cardBg: 'bg-[#FFF6F5]',
      border: 'border-[#F7D0CB]',
      accent: 'text-[#B88E4C]',
    },
    {
      id: 'blue' as BlessingCardColor,
      swatch: 'bg-[#EBF3F8]',
      cardBg: 'bg-[#F5F9FC]',
      border: 'border-[#D0E2EE]',
      accent: 'text-[#507D9B]',
    },
    {
      id: 'red' as BlessingCardColor,
      swatch: 'bg-[#FDF0EE]',
      cardBg: 'bg-[#FDF5F3]',
      border: 'border-[#F8D2CC]',
      accent: 'text-[#C6A15B]',
    },
  ];

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        setWishes(JSON.parse(saved));
      } else {
        setWishes(config.wishingWall.initialWishes);
      }

      const savedLikes = localStorage.getItem(LIKES_KEY);
      if (savedLikes) {
        setLikedMap(JSON.parse(savedLikes));
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

  const handleLike = (id: string) => {
    const isLiked = !likedMap[id];
    const newLikedMap = { ...likedMap, [id]: isLiked };
    setLikedMap(newLikedMap);
    try {
      localStorage.setItem(LIKES_KEY, JSON.stringify(newLikedMap));
    } catch (e) {
      console.error(e);
    }

    const updated = wishes.map((w) => {
      if (w.id === id) {
        return { ...w, likes: isLiked ? w.likes + 1 : Math.max(0, w.likes - 1) };
      }
      return w;
    });
    saveWishes(updated);
  };

  const handleToggleScrew = (id: string) => {
    setScrewedMap((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!author.trim() || !message.trim()) return;

    setIsSubmitting(true);
    const newWish: Wish = {
      id: `wish-${Date.now()}`,
      author: author.trim(),
      message: message.trim(),
      tag: selectedColor,
      timestamp: 'Today',
      likes: 1,
    };

    const updated = [newWish, ...wishes];
    saveWishes(updated);
    setAuthor('');
    setMessage('');
    setIsSubmitting(false);
  };

  const handleDeleteWish = (id: string) => {
    const updated = wishes.filter((w) => w.id !== id);
    saveWishes(updated);
  };

  return (
    <section id="wishes" className="py-20 px-4 max-w-5xl mx-auto">
      <RevealOnScroll>
        <div className="text-center max-w-xl mx-auto mb-10">
          <SectionEyebrow>{config.wishingWall.eyebrow}</SectionEyebrow>
          <SectionHeading subtitle={config.wishingWall.subtitle}>
            {config.wishingWall.heading}
          </SectionHeading>
        </div>
      </RevealOnScroll>

      {/* Blessing Input Form with clean color circles only (no labels like sunset rose, ganga sky) */}
      <RevealOnScroll delay={100}>
        <form
          onSubmit={handleSubmit}
          className="mb-14 p-6 sm:p-8 rounded-3xl bg-[#FFF9F8]/85 backdrop-blur-xs border border-[#DFC48F]/70 shadow-2xs max-w-2xl mx-auto"
        >
          <div className="flex items-center space-x-2 mb-4 pb-3 border-b border-[#DFC48F]/40">
            <MessageSquareHeart size={18} className="text-[#C6A15B]" />
            <h4 className="font-serif text-lg text-[#4A4038] font-normal">
              Fasten a Prayer or Loving Wish
            </h4>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-[10px] font-sans tracking-wider uppercase text-[#8A7F72] mb-1 font-medium">
                Your Name / Family
              </label>
              <SmoothInput
                required
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="e.g. Vikram & Sunita Sharma"
              />
            </div>

            {/* Pure color swatches without text names */}
            <div>
              <label className="block text-[10px] font-sans tracking-wider uppercase text-[#8A7F72] mb-2 font-medium">
                Choose Card Tone
              </label>
              <div className="flex items-center space-x-3">
                {colorThemes.map((c) => (
                  <button
                    type="button"
                    key={c.id}
                    onClick={() => setSelectedColor(c.id)}
                    aria-label={`Select color option`}
                    className={`w-7 h-7 rounded-full ${c.swatch} border-2 transition-all ${
                      selectedColor === c.id
                        ? 'border-[#C6A15B] scale-110 shadow-xs ring-2 ring-[#C6A15B]/40'
                        : 'border-[#DFC48F]/70 hover:scale-105'
                    }`}
                  />
                ))}
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-sans tracking-wider uppercase text-[#8A7F72] mb-1 font-medium">
                Your Prayer or Heartfelt Blessing
              </label>
              <textarea
                required
                rows={2}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Share your prayers or warm blessings for Meher & Kabir in Rishikesh..."
                className="w-full bg-[#FFF9F8] border border-[#DFC48F]/70 rounded-xl px-3.5 py-2 text-sm text-[#4A4038] focus:outline-hidden focus:border-[#C6A15B] resize-none"
              />
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center space-x-2 px-6 py-2 rounded-full bg-[#EED8D3] hover:bg-[#E3C4BE] text-[#3D332A] text-[11px] font-semibold tracking-[0.2em] uppercase transition-all shadow-xs border border-[#DFB6AE] disabled:opacity-50"
              >
                <Send size={12} className="text-[#C6A15B]" />
                <span>Fasten Blessing</span>
              </button>
            </div>
          </div>
        </form>
      </RevealOnScroll>

      {/* ── Blessing Cards with Screw Animation ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {wishes.map((wish, index) => {
          const isLiked = !!likedMap[wish.id];
          const isScrewed = screwedMap[wish.id] ?? true;

          const colorKey = (wish.tag === 'blue' || wish.tag === 'red' || wish.tag === 'pink')
            ? (wish.tag as BlessingCardColor)
            : colorThemes[index % 3].id;
          const currentTheme = colorThemes.find((c) => c.id === colorKey) || colorThemes[0];

          return (
            <div
              key={wish.id}
              className={`relative p-6 rounded-2xl border ${currentTheme.cardBg} ${currentTheme.border} shadow-2xs flex flex-col justify-between group transition-all duration-300 hover:shadow-xs`}
            >
              {/* Screws on Corners with 'Tighten with a Screw' Animation */}
              <button
                type="button"
                onClick={() => handleToggleScrew(wish.id)}
                title="Tighten or loosen screw"
                className="absolute top-2.5 left-2.5 w-4 h-4 rounded-full border border-gray-400/50 bg-[#FAF6F0] shadow-2xs flex items-center justify-center transition-transform duration-500 hover:rotate-180"
              >
                <span className={`block w-2.5 h-[1px] bg-gray-600 transition-transform duration-500 ${isScrewed ? 'rotate-45' : 'rotate-0'}`} />
              </button>

              <button
                type="button"
                onClick={() => handleToggleScrew(wish.id)}
                title="Tighten or loosen screw"
                className="absolute top-2.5 right-2.5 w-4 h-4 rounded-full border border-gray-400/50 bg-[#FAF6F0] shadow-2xs flex items-center justify-center transition-transform duration-500 hover:rotate-180"
              >
                <span className={`block w-2.5 h-[1px] bg-gray-600 transition-transform duration-500 ${isScrewed ? '-rotate-45' : 'rotate-90'}`} />
              </button>

              <button
                type="button"
                onClick={() => handleToggleScrew(wish.id)}
                title="Tighten or loosen screw"
                className="absolute bottom-2.5 left-2.5 w-4 h-4 rounded-full border border-gray-400/50 bg-[#FAF6F0] shadow-2xs flex items-center justify-center transition-transform duration-500 hover:rotate-180"
              >
                <span className={`block w-2.5 h-[1px] bg-gray-600 transition-transform duration-500 ${isScrewed ? 'rotate-90' : 'rotate-45'}`} />
              </button>

              <button
                type="button"
                onClick={() => handleToggleScrew(wish.id)}
                title="Tighten or loosen screw"
                className="absolute bottom-2.5 right-2.5 w-4 h-4 rounded-full border border-gray-400/50 bg-[#FAF6F0] shadow-2xs flex items-center justify-center transition-transform duration-500 hover:rotate-180"
              >
                <span className={`block w-2.5 h-[1px] bg-gray-600 transition-transform duration-500 ${isScrewed ? 'rotate-0' : '-rotate-45'}`} />
              </button>

              <div className="pt-2">
                <div className="flex items-center justify-between mb-3 text-[9px] font-sans text-[#8A7F72]">
                  <span className={`font-medium uppercase tracking-wider ${currentTheme.accent}`}>
                    ✦ Blessing
                  </span>
                  <span>{wish.timestamp}</span>
                </div>

                <p className="font-serif text-sm text-[#4A4038] font-light leading-relaxed mb-4">
                  “{wish.message}”
                </p>
              </div>

              <div className="pt-3 border-t border-[#DFC48F]/30 flex items-center justify-between">
                <p className={`font-serif italic text-xs font-medium truncate max-w-[150px] ${currentTheme.accent}`}>
                  — {wish.author}
                </p>

                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={() => handleLike(wish.id)}
                    className={`flex items-center space-x-1 text-xs px-2.5 py-0.5 rounded-full border transition-all ${
                      isLiked
                        ? 'bg-[#EED8D3] border-[#DFB6AE] text-[#3D332A]'
                        : 'bg-[#FAF6F0] border-[#DFC48F]/60 text-[#8A7F72] hover:text-[#4A4038]'
                    }`}
                  >
                    <Heart
                      size={11}
                      className={isLiked ? 'fill-[#C6A15B] text-[#C6A15B]' : ''}
                    />
                    <span className="text-[10px]">{wish.likes}</span>
                  </button>

                  {isHostMode && (
                    <button
                      type="button"
                      onClick={() => handleDeleteWish(wish.id)}
                      title="Delete wish"
                      className="text-red-500 hover:text-red-700 p-1"
                    >
                      <Trash2 size={12} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <Divider />
    </section>
  );
};
