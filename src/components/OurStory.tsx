import React, { useState, useEffect } from 'react';
import { SectionEyebrow, SectionHeading, Divider } from './BasicComponents';
import { RevealOnScroll } from './RevealOnScroll';
import { WeddingConfig } from '../types';
import { StoryFrameOverlay } from './StoryFrameOverlay';
import { StoryHoverExpand } from './StoryHoverExpand';
import {
  Play,
  Pause,
  ChevronLeft,
  ChevronRight,
  X,
  Maximize2,
  Calendar,
  Sparkles,
  MapPin,
  Heart
} from 'lucide-react';

import firstMeetImg from '../assets/images/first_meet_rishikesh_ghat_1790243833424.jpg';
import firstDateImg from '../assets/images/first_date_rishikesh_cafe_1790243849954.jpg';
import mountainViewImg from '../assets/images/couple_mountain_view_himalayas_1790245267891.jpg';
import coffeeMistyImg from '../assets/images/chai_coffee_misty_mountain_1790245285749.jpg';
import sunsetRidgeImg from '../assets/images/sunset_couple_motorcycle_ridge_1790245296691.jpg';
import firstProposalImg from '../assets/images/first_proposal_riverbank_1790243869300.jpg';
import bonfireImg from '../assets/images/starry_bonfire_himalayas_1790245923608.jpg';
import diyaAartiImg from '../assets/images/ganga_aarti_riverbank_lamps_1790245938677.jpg';

interface StoryItem {
  id: string;
  title: string;
  caption: string;
  image: string;
  likes: string;
  location: string;
  date: string;
  extendedReflection: string;
}

interface OurStoryProps {
  config: WeddingConfig;
}

export const OurStory: React.FC<OurStoryProps> = ({ config }) => {
  const stories: StoryItem[] = [
    {
      id: 'story-first-meet',
      title: 'First Glance at the Sacred Ghats',
      caption: 'Where two paths crossed beside the flowing turquoise waters of Maa Ganga at dawn.',
      image: firstMeetImg,
      likes: '9,311 likes',
      location: 'Shatrughna Ghat, Rishikesh',
      date: 'March 2024',
      extendedReflection:
        'A serendipitous encounter on ancient stone steps where high mountain air met barefoot tranquility. What began as sharing a quiet sunrise turned into timeless conversation beside the sacred river.',
    },
    {
      id: 'story-first-date',
      title: 'Chai & Riverside Conversations',
      caption: 'Two earthen kulhads of spiced masala chai, wildflowers, and laughter that made time stand still.',
      image: firstDateImg,
      likes: '7,840 likes',
      location: 'Ganga View Café, Tapovan',
      date: 'April 2024',
      extendedReflection:
        'Holding warm earthen cups against the gentle breeze while gazing across the valley. Between steaming sips and shared dreams on paper napkins, thirty minutes effortlessly turned into forever.',
    },
    {
      id: 'story-mountain-walk',
      title: 'Where We Met in the Quiet Hills',
      caption: 'Two wanderers gazing at the endless Himalayan clouds, finding home in a single glance.',
      image: mountainViewImg,
      likes: '8,420 likes',
      location: 'Garhwal Mountain Overlook',
      date: 'October 2024',
      extendedReflection:
        'Walking the pine-scented ridgelines where mist drifts across emerald valleys. Looking outward at the grandeur of the Himalayas, we realized the greatest adventure was the one we were beginning together.',
    },
    {
      id: 'story-misty-chai',
      title: 'First Date Over Steaming Cups',
      caption: 'A warm toast to the floating mist, where thirty minutes easily turned into forever.',
      image: coffeeMistyImg,
      likes: '6,920 likes',
      location: 'Riverside Wooden Cafe, Rishikesh',
      date: 'November 2024',
      extendedReflection:
        'Holding hot cups against the cold Himalayan air while drawing dreams together. The steady song of river waves below accompanied hours of deep laughter and understanding.',
    },
    {
      id: 'story-ridge-sunset',
      title: 'The Sunset Promise',
      caption: 'As the sun dipped behind the mountain ridge, twilight painted the sky in amber and rose.',
      image: sunsetRidgeImg,
      likes: '10,250 likes',
      location: 'Shivpuri Ridge Highway',
      date: 'March 2025',
      extendedReflection:
        'With motorcycle helmets resting on stone railings and golden sunlight warming the sky, riding into the evening horizon cemented a bond that only grew deeper with each passing mile.',
    },
    {
      id: 'story-proposal',
      title: 'The Riverbank Proposal',
      caption: 'On bended knee upon the white river sand, beside emerald waters, she whispered an eternal yes.',
      image: firstProposalImg,
      likes: '14,890 likes',
      location: 'White Sand Riverbank, Shivpuri',
      date: 'October 2025',
      extendedReflection:
        'Beside the glistening waters of the Holy Ganga at golden dusk, with the Himalayan peaks standing as silent witnesses, Kabir opened the carved brass box and asked Meher to walk this life together forever.',
    },
    {
      id: 'story-campfire',
      title: 'Campfire Under Himalayan Stars',
      caption: 'Wrapped in wool shawls, singing quiet melodies beside crackling amber embers.',
      image: bonfireImg,
      likes: '8,780 likes',
      location: 'Pine Forest Riverside Camp',
      date: 'December 2025',
      extendedReflection:
        'Away from all city noise, the crackling cedar logs and celestial starlight reminded us that the sweetest joy is shared in quiet, warm companionship beneath the open sky.',
    },
    {
      id: 'story-diyas',
      title: 'Releasing Diyas into the Ganges',
      caption: 'Floating our prayers together upon the sacred emerald waters at twilight.',
      image: diyaAartiImg,
      likes: '12,410 likes',
      location: 'Holy Ghat, Rishikesh',
      date: 'March 2026',
      extendedReflection:
        'Watching little leaf diyas carrying glowing candles down the holy river toward the distant sea, praying for blessings, harmony, and grace on our sacred union ahead.',
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [activeStoryCard, setActiveStoryCard] = useState<StoryItem | null>(null);

  // Auto-slide every 4.2 seconds when playing
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % stories.length);
    }, 4200);
    return () => clearInterval(interval);
  }, [isPlaying, stories.length]);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % stories.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + stories.length) % stories.length);
  };

  const currentStory = stories[currentIndex];

  return (
    <section
      id="our-story"
      className="py-16 sm:py-24 px-4 w-full max-w-5xl mx-auto flex flex-col items-center justify-center text-center overflow-hidden"
    >
      {/* Section Header */}
      <RevealOnScroll className="w-full max-w-full">
        <div className="text-center w-full max-w-xl mx-auto mb-8 sm:mb-10 px-2">
          <SectionEyebrow>OUR SACRED CHRONICLE</SectionEyebrow>
          <SectionHeading subtitle="From mountain trails to eternal vows beside River Ganga">
            Where Our Story Began
          </SectionHeading>
        </div>
      </RevealOnScroll>

      {/* ── Slideshow Player in User's Camera Overlay Frame with no background ── */}
      <RevealOnScroll delay={100} className="w-full max-w-full">
        <div className="w-full max-w-full flex flex-col items-center justify-center mx-auto">
          {/* Manual navigation controls: Prev & Next */}
          <div className="flex items-center justify-center space-x-4 mb-6 mx-auto">
            <button
              type="button"
              onClick={handlePrev}
              aria-label="Previous story"
              className="p-2.5 rounded-full border border-[#DFC48F]/80 text-[#4A4038] hover:text-[#C6A15B] hover:border-[#C6A15B] bg-[#FAF6F0] transition-all duration-300 shadow-2xs hover:shadow-xs cursor-pointer active:scale-95"
            >
              <ChevronLeft size={18} />
            </button>

            <button
              type="button"
              onClick={handleNext}
              aria-label="Next story"
              className="p-2.5 rounded-full border border-[#DFC48F]/80 text-[#4A4038] hover:text-[#C6A15B] hover:border-[#C6A15B] bg-[#FAF6F0] transition-all duration-300 shadow-2xs hover:shadow-xs cursor-pointer active:scale-95"
            >
              <ChevronRight size={18} />
            </button>
          </div>

          {/* User's Exact Camera Overlay Frame (Floating with no outer wrapper background) */}
          <div className="w-full flex justify-center items-center">
            <StoryFrameOverlay
              userName={`${config.couple.brideName.toLowerCase()}.${config.couple.groomName.toLowerCase()}`}
              likesCount={currentStory.likes}
              caption={currentStory.caption}
              daysAgo={currentStory.date}
              onClick={() => setActiveStoryCard(currentStory)}
            >
              {/* The Photo Sliding One by One */}
              <div className="relative w-full h-full">
                {stories.map((s, idx) => (
                  <div
                    key={s.id}
                    className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                      idx === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
                    }`}
                  >
                    <img
                      src={s.image}
                      alt={s.title}
                      className="w-full h-full object-cover"
                    />
                    {/* Subtle inner shadow for depth */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />

                    {/* Tap to open badge */}
                    <div className="absolute top-3 right-3 z-20 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-xs text-[9px] text-[#DFC48F] flex items-center space-x-1 border border-white/10 font-sans shadow-xs">
                      <Maximize2 size={9} />
                      <span>Open Card</span>
                    </div>
                  </div>
                ))}
              </div>
            </StoryFrameOverlay>
          </div>

          {/* Story Hover Expand Navigation (Skiper UI 52 Animation) */}
          <StoryHoverExpand
            stories={stories}
            currentIndex={currentIndex}
            onSelect={(idx) => {
              setCurrentIndex(idx);
              setIsPlaying(false);
            }}
          />
        </div>
      </RevealOnScroll>

      {/* ── Pop-Up Story Card Modal (Triggered on Click) ── */}
      {activeStoryCard && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in"
          onClick={() => setActiveStoryCard(null)}
        >
          <div
            className="relative w-full max-w-lg rounded-3xl bg-[#FAF6F0] border border-[#DFC48F] p-6 sm:p-8 shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setActiveStoryCard(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-[#FAF6F0] border border-[#DFC48F] text-[#4A4038] hover:text-[#C6A15B] transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>

            {/* Card Content */}
            <div className="space-y-4">
              <div className="w-full aspect-[16/10] rounded-2xl overflow-hidden shadow-xs">
                <img
                  src={activeStoryCard.image}
                  alt={activeStoryCard.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Only the date */}
              <div className="flex items-center justify-center pt-2 pb-1">
                <span className="flex items-center space-x-2 font-serif text-lg sm:text-xl text-[#8C6418] tracking-[0.2em] uppercase font-bold">
                  <Calendar size={18} className="text-[#C6A15B]" />
                  <span>{activeStoryCard.date}</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
