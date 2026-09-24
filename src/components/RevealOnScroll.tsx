import React, { useEffect, useRef, useState } from 'react';

interface RevealOnScrollProps {
  children: React.ReactNode;
  className?: string;
  delay?: number; // in milliseconds
  threshold?: number;
}

export const RevealOnScroll: React.FC<RevealOnScrollProps> = ({
  children,
  className = '',
  delay = 0,
  threshold = 0.1,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Check prefers-reduced-motion
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mediaQuery.matches) {
      setIsVisible(true);
      return;
    }

    const element = ref.current;
    if (!element) return;

    // Find closest scrollable ancestor (e.g. phone screen scroll container)
    let parent = element.parentElement;
    let scrollRoot: HTMLElement | null = null;
    while (parent) {
      const overflowY = window.getComputedStyle(parent).overflowY;
      if (overflowY === 'auto' || overflowY === 'scroll') {
        scrollRoot = parent;
        break;
      }
      parent = parent.parentElement;
    }

    try {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.unobserve(element);
          }
        },
        {
          root: scrollRoot,
          threshold,
          rootMargin: '0px 0px 40px 0px',
        }
      );

      observer.observe(element);

      // Fallback timeout so content is always visible if intersection doesn't fire
      const fallbackTimer = setTimeout(() => {
        setIsVisible(true);
      }, 1800);

      return () => {
        observer.disconnect();
        clearTimeout(fallbackTimer);
      };
    } catch {
      setIsVisible(true);
    }
  }, [threshold]);

  return (
    <div
      ref={ref}
      style={{
        transitionDelay: `${delay}ms`,
      }}
      className={`transition-all duration-700 ease-out transform ${
        isVisible
          ? 'opacity-100 translate-y-0'
          : 'opacity-0 translate-y-3 pointer-events-none'
      } ${className}`}
    >
      {children}
    </div>
  );
};
