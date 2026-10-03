import React, { useState, useEffect, useRef } from 'react';
import imageManifest, { ImageMeta } from '../data/imageManifest';

export interface OptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  aspectRatio?: number | string;
  disableAspectRatio?: boolean;
  priority?: boolean;
  sizes?: string;
  className?: string;
  imgClassName?: string;
  objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
  objectPosition?: string;
  blurDataURL?: string;
  dominantColor?: string;
  containerClassName?: string;
  containerStyle?: React.CSSProperties;
  onLoad?: (e: React.SyntheticEvent<HTMLImageElement>) => void;
}

/**
 * Helper to resolve image metadata from manifest by path or key name
 */
export function getImageMeta(src: string): ImageMeta | null {
  if (!src) return null;
  if (imageManifest[src]) return imageManifest[src];

  // Extract basename if full path or imported URL was passed
  const baseName = src.split('/').pop()?.split('?')[0];
  if (baseName && imageManifest[baseName]) {
    return imageManifest[baseName];
  }

  // Check without extension
  const withoutExt = baseName?.replace(/\.[^/.]+$/, '');
  if (withoutExt && imageManifest[withoutExt]) {
    return imageManifest[withoutExt];
  }

  // Strip Vite/Rollup build hash e.g. filename-DfeqmF0w.jpg -> filename
  const strippedHash = baseName?.replace(/-[A-Za-z0-9_-]{8}\.[^/.]+$/, '');
  if (strippedHash && imageManifest[strippedHash]) {
    return imageManifest[strippedHash];
  }

  return null;
}

export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  width: customWidth,
  height: customHeight,
  aspectRatio: customAspectRatio,
  disableAspectRatio = false,
  priority = false,
  sizes = '(max-width: 640px) 100vw, (max-width: 1024px) 75vw, 1200px',
  className = '',
  imgClassName = '',
  objectFit = 'cover',
  objectPosition = 'center',
  blurDataURL: customBlurDataURL,
  dominantColor: customDominantColor,
  containerClassName = '',
  containerStyle,
  onLoad,
  onClick,
  style,
  ...restProps
}) => {
  const meta = getImageMeta(src);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isError, setIsError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  // Derive width, height, aspect ratio
  const width = customWidth || meta?.width;
  const height = customHeight || meta?.height;
  const aspectRatio = disableAspectRatio ? undefined : (customAspectRatio || meta?.aspectRatio || (width && height ? width / height : undefined));

  const blurDataURL = customBlurDataURL || meta?.blurDataURL;
  const dominantColor = customDominantColor || meta?.dominantColor || '#FAF2F0';

  // Format fallbacks
  const fallbackSrc = meta?.fallbackSrc || src;
  const avifSrcSet = meta?.avifSrcSet;
  const webpSrcSet = meta?.webpSrcSet;
  const fallbackSrcSet = meta?.fallbackSrcSet;

  useEffect(() => {
    setIsLoaded(false);
    setIsError(false);

    let isSubscribed = true;

    // Check if browser already has it cached
    if (imgRef.current?.complete && imgRef.current.naturalWidth > 0) {
      setIsLoaded(true);
      return;
    }

    if (priority && imgRef.current) {
      // Decode synchronously or with priority decode call
      imgRef.current
        .decode()
        .then(() => {
          if (isSubscribed) setIsLoaded(true);
        })
        .catch(() => {
          // Fallback if decode fails or interrupted
          if (isSubscribed && imgRef.current?.complete) {
            setIsLoaded(true);
          }
        });
    }

    return () => {
      isSubscribed = false;
    };
  }, [src, priority]);

  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const imgEl = e.currentTarget;

    // Use img.decode() before setting state to avoid painting artifacts
    if (typeof imgEl.decode === 'function') {
      imgEl
        .decode()
        .then(() => {
          setIsLoaded(true);
        })
        .catch(() => {
          setIsLoaded(true);
        });
    } else {
      setIsLoaded(true);
    }

    if (onLoad) onLoad(e);
  };

  const handleImageError = () => {
    setIsError(true);
  };

  return (
    <div
      className={`relative overflow-hidden ${containerClassName} ${className}`}
      onClick={onClick}
      style={{
        aspectRatio: aspectRatio ? `${aspectRatio}` : undefined,
        backgroundColor: dominantColor,
        ...containerStyle,
      }}
    >
      {/* ── Low-Quality Blur / Skeleton Placeholder ── */}
      {!isLoaded && (
        <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
          {blurDataURL ? (
            <div
              className="w-full h-full scale-110 blur-xl transition-opacity duration-500"
              style={{
                backgroundImage: `url(${blurDataURL})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            />
          ) : (
            <div className="w-full h-full animate-pulse bg-gradient-to-r from-[#FAF2F0] via-[#F3E5E2] to-[#FAF2F0]" />
          )}
        </div>
      )}

      {/* ── Modern Multi-Format Picture Tag ── */}
      <picture className="block w-full h-full">
        {avifSrcSet && <source type="image/avif" srcSet={avifSrcSet} sizes={sizes} />}
        {webpSrcSet && <source type="image/webp" srcSet={webpSrcSet} sizes={sizes} />}
        {fallbackSrcSet && <source srcSet={fallbackSrcSet} sizes={sizes} />}
        <img
          ref={imgRef}
          src={fallbackSrc}
          alt={alt}
          width={width}
          height={height}
          loading={priority ? 'eager' : 'lazy'}
          fetchPriority={priority ? 'high' : 'auto'}
          decoding={priority ? 'sync' : 'async'}
          onLoad={handleImageLoad}
          onError={handleImageError}
          style={{
            objectFit,
            objectPosition,
            ...style,
          }}
          className={`w-full h-full transition-opacity duration-500 ease-out motion-reduce:transition-none ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          } ${imgClassName}`}
          {...restProps}
        />
      </picture>
    </div>
  );
};
