import React, { useEffect, useRef, useState } from 'react';

interface RevealOnScrollProps {
  children: React.ReactNode;
  className?: string;
  delay?: number; // in milliseconds
  threshold?: number;
  variant?: 'fade' | 'popup';
}

export const RevealOnScroll: React.FC<RevealOnScrollProps> = ({
  children,
  className = '',
  delay = 0,
  threshold = 0.1,
  variant = 'fade',
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Check prefers-reduced-motion
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setIsVisible(true);
      return;
    }

    const element = ref.current;
    if (!element) return;

    // Detect actual scroll container (e.g. phone screen scroll container)
    let parent = element.parentElement;
    let scrollRoot: HTMLElement | null = null;
    while (parent) {
      if (parent.getAttribute('data-phone-scroll') === 'true') {
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
          rootMargin: '0px 0px -40px 0px',
        }
      );

      observer.observe(element);

      // Fallback timer so content is never stuck invisible
      const fallbackTimer = setTimeout(() => {
        setIsVisible(true);
      }, 1500);

      return () => {
        observer.disconnect();
        clearTimeout(fallbackTimer);
      };
    } catch {
      setIsVisible(true);
    }
  }, [threshold]);

  const isPopup = variant === 'popup';

  return (
    <div
      ref={ref}
      style={{
        transitionDelay: `${delay}ms`,
        opacity: isVisible ? 1 : 0,
        transform: isVisible
          ? 'translateY(0) scale(1)'
          : isPopup
          ? 'translateY(36px) scale(0.84)'
          : 'translateY(22px) scale(0.96)',
        transition: isPopup
          ? 'opacity 550ms cubic-bezier(0.16, 1, 0.3, 1), transform 650ms cubic-bezier(0.34, 1.56, 0.64, 1)'
          : 'opacity 480ms cubic-bezier(0.16, 1, 0.3, 1), transform 480ms cubic-bezier(0.16, 1, 0.3, 1)',
        willChange: 'opacity, transform',
      }}
      className={`w-full ${className}`}
    >
      {children}
    </div>
  );
};
