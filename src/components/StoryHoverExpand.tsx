import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';

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
      transition={{ duration: 0.4, delay: 0.1 }}
      className={`w-full max-w-full sm:max-w-3xl mx-auto px-2 mt-8 overflow-hidden ${className}`}
    >
      <div
        ref={containerRef}
        className="w-full max-w-full flex items-center justify-start sm:justify-center gap-1.5 sm:gap-2.5 overflow-x-auto py-2 px-3 no-scrollbar scroll-smooth"
        style={{
          WebkitOverflowScrolling: 'touch',
        }}
      >
        {stories.map((story, index) => {
          const isActive = currentIndex === index;

          return (
            <motion.div
              key={story.id}
              ref={isActive ? activeItemRef : null}
              className={`relative cursor-pointer overflow-hidden rounded-2xl sm:rounded-3xl border-2 shrink-0 transition-all duration-300 ${
                isActive
                  ? 'border-[#C6A15B] ring-2 ring-[#C6A15B]/50 shadow-md scale-[1.02]'
                  : 'border-[#DFC48F]/50 hover:border-[#C6A15B]/80 opacity-70 hover:opacity-100 hover:scale-[1.03]'
              }`}
              initial={false}
              animate={{
                width: isActive
                  ? isMobile
                    ? '6.25rem'
                    : '9.5rem'
                  : isMobile
                  ? '2.1rem'
                  : '2.75rem',
                height: isMobile ? '4.25rem' : '5.5rem',
              }}
              transition={{
                type: 'spring',
                stiffness: 280,
                damping: 24,
                mass: 0.65,
              }}
              onClick={() => onSelect(index)}
              onMouseEnter={() => onSelect(index)}
              onHoverStart={() => onSelect(index)}
            >
              {/* Photo */}
              <img
                src={story.image}
                alt={story.title}
                className="w-full h-full object-cover pointer-events-none"
              />

              {/* Inactive subtle overlay */}
              {!isActive && (
                <div className="absolute inset-0 bg-black/15 transition-opacity hover:opacity-0" />
              )}
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};
