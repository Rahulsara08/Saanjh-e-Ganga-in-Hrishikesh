import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { OptimizedImage } from './OptimizedImage';

interface StoryHoverItem {
  id: string;
  title: string;
  caption: string;
  image: string;
  location?: string;
  date?: string;
}

interface StoryHoverExpandProps {
  stories: StoryHoverItem[];
  currentIndex: number;
  onSelect: (index: number) => void;
  className?: string;
}

export const StoryHoverExpand: React.FC<StoryHoverExpandProps> = ({
  stories,
  currentIndex,
  onSelect,
  className = '',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const activeItemRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Smoothly center the active thumbnail in the container when currentIndex changes
  useEffect(() => {
    if (activeItemRef.current && containerRef.current) {
      const container = containerRef.current;
      const item = activeItemRef.current;
      const scrollLeft =
        item.offsetLeft - container.offsetWidth / 2 + item.offsetWidth / 2;
      container.scrollTo({
        left: Math.max(0, scrollLeft),
        behavior: 'smooth',
      });
    }
  }, [currentIndex]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: 0.05 }}
      className={`w-full px-0 mt-3 sm:mt-6 overflow-hidden h-[6.5rem] sm:h-[8.8rem] flex items-center ${className}`}
    >
      <div
        ref={containerRef}
        className="w-full h-full flex items-center justify-between gap-1 sm:gap-2.5 py-1 sm:py-2 px-1 sm:px-3 no-scrollbar"
      >
        {stories.map((story, index) => {
          const isActive = currentIndex === index;

          return (
            <motion.div
              key={story.id}
              ref={isActive ? activeItemRef : null}
              className={`relative cursor-pointer overflow-hidden rounded-full border-2 min-w-0 transition-[border-color,box-shadow,opacity] duration-200 ${
                isActive
                  ? 'border-[#C6A15B] ring-2 ring-[#C6A15B]/60 shadow-lg'
                  : 'border-[#DFC48F]/60 hover:border-[#C6A15B]/90 opacity-70 hover:opacity-100'
              }`}
              initial={false}
              animate={{
                flex: isActive ? (isMobile ? 4.5 : 4.0) : 1,
                height: isActive
                  ? isMobile
                    ? '5.6rem'
                    : '7.6rem'
                  : isMobile
                  ? '4.2rem'
                  : '5.8rem',
              }}
              transition={{
                flex: {
                  type: 'spring',
                  stiffness: 420,
                  damping: 32,
                  mass: 0.45,
                },
                height: {
                  duration: 0.3,
                  ease: [0.25, 1, 0.5, 1],
                },
              }}
              onClick={() => onSelect(index)}
              onMouseEnter={() => onSelect(index)}
              onHoverStart={() => onSelect(index)}
            >
              {/* Photo */}
              <OptimizedImage
                src={story.image}
                alt={story.title}
                sizes="240px"
                disableAspectRatio={true}
                className="w-full h-full"
                containerStyle={{ width: '100%', height: '100%' }}
                imgClassName="object-cover object-center pointer-events-none w-full h-full transition-transform duration-300 hover:scale-105"
              />

              {/* Inactive subtle overlay */}
              {!isActive && (
                <div className="absolute inset-0 bg-black/20 transition-opacity hover:opacity-0" />
              )}
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};
