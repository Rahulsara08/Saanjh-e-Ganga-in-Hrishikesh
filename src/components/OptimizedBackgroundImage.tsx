import React, { useState, useEffect, useRef } from 'react';
import { getImageMeta } from './OptimizedImage';

interface OptimizedBackgroundImageProps extends React.HTMLAttributes<HTMLDivElement> {
  src: string;
  alt?: string;
  priority?: boolean;
  className?: string;
  children?: React.ReactNode;
  overlayClassName?: string;
  overlayStyle?: React.CSSProperties;
  maskImage?: string;
}

export const OptimizedBackgroundImage: React.FC<OptimizedBackgroundImageProps> = ({
  src,
  alt = 'Background image',
  priority = false,
  className = '',
  children,
  overlayClassName = '',
  overlayStyle,
  maskImage,
  style,
  ...restProps
}) => {
  const meta = getImageMeta(src);
  const [isLoaded, setIsLoaded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const fallbackSrc = meta?.fallbackSrc || src;
  const avifSrcSet = meta?.avifSrcSet;
  const webpSrcSet = meta?.webpSrcSet;
  const fallbackSrcSet = meta?.fallbackSrcSet;
  const blurDataURL = meta?.blurDataURL;
  const dominantColor = meta?.dominantColor || '#FAF2F0';

  useEffect(() => {
    // IntersectionObserver for lazy background loading if not priority
    if (priority) return;

    const el = containerRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            observer.disconnect();
          }
        });
      },
      { rootMargin: '300px 0px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [priority]);

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden ${className}`}
      style={{
        backgroundColor: dominantColor,
        ...style,
      }}
      {...restProps}
    >
      {/* LQIP Placeholder */}
      {!isLoaded && blurDataURL && (
        <div
          className="absolute inset-0 z-0 pointer-events-none scale-110 blur-xl transition-opacity duration-500"
          style={{
            backgroundImage: `url(${blurDataURL})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
      )}

      {/* Picture Tag serving background image */}
      <picture
        className="absolute inset-0 w-full h-full pointer-events-none z-0"
        style={{
          maskImage,
          WebkitMaskImage: maskImage,
        }}
      >
        {avifSrcSet && <source type="image/avif" srcSet={avifSrcSet} sizes="100vw" />}
        {webpSrcSet && <source type="image/webp" srcSet={webpSrcSet} sizes="100vw" />}
        {fallbackSrcSet && <source srcSet={fallbackSrcSet} sizes="100vw" />}
        <img
          src={fallbackSrc}
          alt={alt}
          loading={priority ? 'eager' : 'lazy'}
          fetchPriority={priority ? 'high' : 'auto'}
          decoding={priority ? 'sync' : 'async'}
          onLoad={(e) => {
            const img = e.currentTarget;
            if (typeof img.decode === 'function') {
              img.decode().then(() => setIsLoaded(true)).catch(() => setIsLoaded(true));
            } else {
              setIsLoaded(true);
            }
          }}
          className={`w-full h-full object-cover transition-opacity duration-500 ease-out motion-reduce:transition-none ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
        />
      </picture>

      {/* Optional Overlay Layer */}
      {overlayClassName && (
        <div className={`absolute inset-0 pointer-events-none z-1 ${overlayClassName}`} style={overlayStyle} />
      )}

      {/* Children Content */}
      <div className="relative z-10 w-full h-full">{children}</div>
    </div>
  );
};
