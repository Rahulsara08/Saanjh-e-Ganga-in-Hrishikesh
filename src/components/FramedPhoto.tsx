import React from 'react';
import frameOverlayImg from '../assets/images/family_wavy_floral_frame.png';

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
      className={`relative inline-block overflow-visible aspect-[686/1024] ${className}`}
      style={{
        maxWidth: '100%',
      }}
    >
      {/* ── THE CLIPPED FAMILY PHOTOGRAPH ── */}
      {/* Positioned inside the organic wavy stem border */}
      <div
        className="w-full h-full relative z-0"
        style={{
          clipPath:
            'polygon(15.0% 6.9%, 21.4% 4.0%, 27.7% 3.2%, 34.1% 4.0%, 40.5% 6.2%, 46.8% 8.8%, 53.2% 10.0%, 59.5% 9.8%, 65.9% 9.1%, 72.3% 9.3%, 78.6% 10.7%, 85.0% 13.7%, 87.8% 15.7%, 92.4% 21.4%, 93.4% 27.1%, 91.4% 32.9%, 90.5% 38.6%, 95.0% 44.3%, 95.6% 50.0%, 92.4% 55.7%, 89.4% 61.4%, 89.8% 67.1%, 93.4% 72.9%, 96.4% 78.6%, 96.1% 84.3%, 91.7% 90.0%, 85.0% 93.3%, 78.6% 94.4%, 72.3% 94.2%, 65.9% 93.1%, 59.5% 91.6%, 53.2% 90.5%, 46.8% 90.8%, 40.5% 92.4%, 34.1% 96.5%, 27.7% 93.7%, 21.4% 92.4%, 15.0% 89.6%, 9.3% 84.3%, 5.8% 78.6%, 9.0% 72.9%, 7.0% 67.1%, 12.8% 61.4%, 3.8% 55.7%, 8.6% 50.0%, 7.4% 44.3%, 9.9% 38.6%, 14.3% 32.9%, 15.0% 27.1%, 11.5% 21.4%, 9.6% 15.7%, 11.7% 10.0%)',
          WebkitClipPath:
            'polygon(15.0% 6.9%, 21.4% 4.0%, 27.7% 3.2%, 34.1% 4.0%, 40.5% 6.2%, 46.8% 8.8%, 53.2% 10.0%, 59.5% 9.8%, 65.9% 9.1%, 72.3% 9.3%, 78.6% 10.7%, 85.0% 13.7%, 87.8% 15.7%, 92.4% 21.4%, 93.4% 27.1%, 91.4% 32.9%, 90.5% 38.6%, 95.0% 44.3%, 95.6% 50.0%, 92.4% 55.7%, 89.4% 61.4%, 89.8% 67.1%, 93.4% 72.9%, 96.4% 78.6%, 96.1% 84.3%, 91.7% 90.0%, 85.0% 93.3%, 78.6% 94.4%, 72.3% 94.2%, 65.9% 93.1%, 59.5% 91.6%, 53.2% 90.5%, 46.8% 90.8%, 40.5% 92.4%, 34.1% 96.5%, 27.7% 93.7%, 21.4% 92.4%, 15.0% 89.6%, 9.3% 84.3%, 5.8% 78.6%, 9.0% 72.9%, 7.0% 67.1%, 12.8% 61.4%, 3.8% 55.7%, 8.6% 50.0%, 7.4% 44.3%, 9.9% 38.6%, 14.3% 32.9%, 15.0% 27.1%, 11.5% 21.4%, 9.6% 15.7%, 11.7% 10.0%)',
        }}
      >
        <img
          src={src}
          alt={alt}
          loading="lazy"
          className={`w-full h-full object-cover object-center transition-transform duration-700 hover:scale-105 select-none ${imgClassName}`}
        />
      </div>

      {/* ── THE WATERCOLOR ORGANIC WAVY FLORAL FRAME ARTWORK ── */}
      <img
        src={frameOverlayImg}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 w-full h-full object-fill pointer-events-none select-none z-10 drop-shadow-[0_4px_16px_rgba(74,64,56,0.12)]"
      />
    </div>
  );
};

