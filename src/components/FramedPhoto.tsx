import React from 'react';
import frameOverlayImg from '../assets/images/floral_frame_transparent.png';
import floralClipData from '../data/floral_frame_clip.json';

export interface FramedPhotoProps {
  src: string;
  alt: string;
  className?: string;
  imgClassName?: string;
  priority?: boolean;
}

export const FramedPhoto: React.FC<FramedPhotoProps> = ({
  src,
  alt,
  className = '',
  imgClassName = '',
}) => {
  return (
    <div
      className={`relative inline-block overflow-visible aspect-[1152/2048] ${className}`}
      style={{
        maxWidth: '100%',
      }}
    >
      {/* ── THE CLIPPED FAMILY PHOTOGRAPH ── */}
      {/* Clipped to the inside of the organic wavy stem so nothing spills outside */}
      <div
        className="w-full h-full relative z-0"
        style={{
          clipPath: floralClipData.clipPolygon,
          WebkitClipPath: floralClipData.clipPolygon,
        }}
      >
        <img
          src={src}
          alt={alt}
          loading="lazy"
          className={`w-full h-full object-cover object-center transition-transform duration-700 hover:scale-105 select-none ${imgClassName}`}
        />
      </div>

      {/* ── THE EXACT FLORAL FRAME ARTWORK (OUTLINE + WATERCOLOR FLOWERS) ── */}
      {/* Placed directly on top as a transparent frame border overlay */}
      <img
        src={frameOverlayImg}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 w-full h-full object-fill pointer-events-none select-none z-10 drop-shadow-[0_4px_12px_rgba(74,64,56,0.08)]"
      />
    </div>
  );
};

