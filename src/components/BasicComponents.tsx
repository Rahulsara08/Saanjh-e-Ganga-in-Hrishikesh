import React from 'react';

/**
 * SanskritSeal: Auspicious handcrafted letterpress seal
 * with delicate Vedic lotus and Sanskrit blessings (शुभ विवाह)
 */
export const SanskritSeal: React.FC<{ className?: string; size?: number }> = ({
  className = '',
  size = 64,
}) => {
  return (
    <div className={`inline-flex flex-col items-center justify-center ${className}`}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="text-[#C6A15B] hover:scale-105 transition-transform duration-500"
      >
        {/* Outer handcrafted jagged/deckled ring */}
        <circle cx="50" cy="50" r="46" stroke="#DFC48F" strokeWidth="1" strokeDasharray="3 2" />
        <circle cx="50" cy="50" r="41" stroke="#C6A15B" strokeWidth="1.2" />

        {/* 8 Lotus Petals */}
        <path d="M50 12 C54 28 54 36 50 41 C46 36 46 28 50 12 Z" stroke="#C6A15B" strokeWidth="1" />
        <path d="M50 88 C54 72 54 64 50 59 C46 64 46 72 50 88 Z" stroke="#C6A15B" strokeWidth="1" />
        <path d="M12 50 C28 46 36 46 41 50 C36 54 28 54 12 50 Z" stroke="#C6A15B" strokeWidth="1" />
        <path d="M88 50 C72 46 64 46 59 50 C64 54 72 54 88 50 Z" stroke="#C6A15B" strokeWidth="1" />

        <path d="M23 23 C36 31 41 37 43 43 C37 41 31 36 23 23 Z" stroke="#DFC48F" strokeWidth="0.8" />
        <path d="M77 77 C64 69 59 63 57 57 C63 59 69 64 77 77 Z" stroke="#DFC48F" strokeWidth="0.8" />
        <path d="M77 23 C69 36 63 41 57 43 C59 37 64 31 77 23 Z" stroke="#DFC48F" strokeWidth="0.8" />
        <path d="M23 77 C31 64 37 59 43 57 C41 63 36 69 23 77 Z" stroke="#DFC48F" strokeWidth="0.8" />

        {/* Center sacred symbol */}
        <circle cx="50" cy="50" r="16" stroke="#DFC48F" strokeWidth="0.8" />
        <text
          x="50"
          y="54"
          textAnchor="middle"
          fontSize="10"
          fontFamily="serif"
          fill="#C6A15B"
          fontWeight="bold"
          letterSpacing="0.05em"
        >
          ॐ
        </text>
      </svg>
      <span className="text-[9px] font-sans tracking-[0.25em] uppercase text-[#B88E4C] mt-1 font-medium">
        शुभ विवाह
      </span>
    </div>
  );
};

/**
 * GangaDiya: Handcrafted floating brass diya with marigold petals and river ripples
 */
export const GangaDiya: React.FC<{ size?: number; className?: string }> = ({
  size = 48,
  className = '',
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${className}`}
    >
      {/* Soft River Water Ripples */}
      <path
        d="M6 52 C18 48 26 56 36 52 C46 48 54 55 60 52"
        stroke="#DFC48F"
        strokeWidth="0.9"
        strokeLinecap="round"
      />
      <path
        d="M12 57 C22 54 30 60 40 57 C48 54 52 58 56 57"
        stroke="#DFC48F"
        strokeWidth="0.7"
        strokeLinecap="round"
        strokeDasharray="2 3"
      />

      {/* Lotus leaf boat underneath */}
      <path
        d="M16 46 C24 49 40 49 48 46 C44 51 20 51 16 46 Z"
        fill="#E8ECE4"
        stroke="#9EAA94"
        strokeWidth="0.8"
      />

      {/* Brass Diya Bowl */}
      <path
        d="M18 43 C18 48 46 48 46 43 L42 39 C34 40 30 40 22 39 Z"
        fill="#F5E8C7"
        stroke="#C6A15B"
        strokeWidth="1"
      />

      {/* Marigold Petals on the rim */}
      <circle cx="21" cy="40" r="2.5" fill="#E8B042" />
      <circle cx="26" cy="41" r="2" fill="#E88F35" />
      <circle cx="38" cy="41" r="2" fill="#E88F35" />
      <circle cx="43" cy="40" r="2.5" fill="#E8B042" />

      {/* Diya Wick & Golden Flame with gentle glow */}
      <path d="M32 39 L32 34" stroke="#8A5A2B" strokeWidth="1.2" strokeLinecap="round" />
      <path
        d="M32 20 C28 27 28 32 32 34 C36 32 36 27 32 20 Z"
        fill="#FFD269"
        stroke="#E69535"
        strokeWidth="0.8"
        className="animate-pulse"
      />
      {/* Inner flame heart */}
      <path
        d="M32 26 C30 29 30 32 32 33 C34 32 34 29 32 26 Z"
        fill="#FFFFFF"
      />
    </svg>
  );
};

/**
 * MountainRidgeHairline: Himalayan contour line with subtle moon
 */
export const MountainRidgeHairline: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`w-full flex items-center justify-center ${className}`}>
      <svg
        viewBox="0 0 400 45"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full max-w-md text-[#DFC48F]"
      >
        {/* Distant mountain peaks */}
        <path
          d="M0 38 L60 22 L110 32 L160 14 L200 24 L240 10 L290 28 L340 18 L400 38"
          stroke="currentColor"
          strokeWidth="0.8"
          strokeLinecap="round"
          strokeDasharray="2 3"
        />
        {/* River Ganga water line below */}
        <path
          d="M0 40 C70 37 130 43 200 40 C270 37 330 43 400 40"
          stroke="#C6A15B"
          strokeWidth="1"
        />
        {/* Crescent Moon over peaks */}
        <path
          d="M245 4 C248 8 248 14 243 17 C249 16 252 11 250 4 Z"
          fill="#C6A15B"
        />
      </svg>
    </div>
  );
};

/**
 * MandalaCrest: Symmetrical gold linework crest
 */
export const MandalaCrest: React.FC<{ className?: string; size?: number }> = ({
  className = '',
  size = 72,
}) => {
  return (
    <div className={`inline-flex items-center justify-center ${className}`}>
      <SanskritSeal size={size} />
    </div>
  );
};

/**
 * SectionEyebrow: All-caps micro-label with artisan letter spacing
 */
export const SectionEyebrow: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = '',
}) => {
  return (
    <p
      className={`text-[10px] sm:text-[11px] font-medium tracking-[0.35em] uppercase text-[#B88E4C] mb-2 font-sans ${className}`}
    >
      {children}
    </p>
  );
};

/**
 * SectionHeading: Serif display heading with handcrafted restraint
 */
export const SectionHeading: React.FC<{
  children: React.ReactNode;
  subtitle?: string;
  className?: string;
  center?: boolean;
}> = ({ children, subtitle, className = '', center = true }) => {
  return (
    <div className={`mb-8 ${center ? 'text-center' : ''} ${className}`}>
      <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-[#3D332A] font-light tracking-wide leading-tight">
        {children}
      </h2>
      {subtitle && (
        <p className="font-serif italic text-[#7A7065] text-base sm:text-lg mt-2 tracking-wide font-light max-w-lg mx-auto">
          {subtitle}
        </p>
      )}
    </div>
  );
};

/**
 * Divider: Handcrafted Ganga wave and marigold flourish
 */
export const Divider: React.FC<{ className?: string }> = ({ className = 'my-14 sm:my-20' }) => {
  return (
    <div className={`flex items-center justify-center max-w-md mx-auto px-4 ${className}`}>
      <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-[#DFC48F] to-[#C6A15B]/40" />
      <div className="mx-3 flex items-center space-x-2 text-[#C6A15B]">
        <span className="text-xs">✦</span>
        <span className="text-sm font-serif italic">गंगा</span>
        <span className="text-xs">✦</span>
      </div>
      <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent via-[#DFC48F] to-[#C6A15B]/40" />
    </div>
  );
};

/**
 * PhotoFrame: Handcrafted mount with deckled edge aesthetics & corner photo mounts
 */
export const PhotoFrame: React.FC<{
  src: string;
  alt: string;
  shape?: 'oval' | 'circle' | 'arch';
  className?: string;
  caption?: string;
}> = ({ src, alt, shape = 'oval', className = '', caption }) => {
  const shapeClasses = {
    oval: 'aspect-[3/4] rounded-[50%/40%]',
    circle: 'aspect-square rounded-full',
    arch: 'aspect-[3/4] rounded-t-full rounded-b-xl',
  };

  return (
    <div className={`relative inline-block ${className}`}>
      <div className="relative p-3 rounded-[inherit] bg-[#FBF8F3] shadow-[0_8px_30px_-6px_rgba(74,64,56,0.12)] border border-[#DFC48F]/60">
        <div
          className={`absolute inset-0 border border-[#C6A15B]/40 ${
            shape === 'oval' ? 'rounded-[50%/40%]' : shape === 'circle' ? 'rounded-full' : 'rounded-t-full rounded-b-xl'
          } pointer-events-none scale-100`}
        />
        <div
          className={`overflow-hidden shadow-inner bg-[#FAF6F0] relative z-10 ${shapeClasses[shape]}`}
        >
          <img
            src={src}
            alt={alt}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center transition-transform duration-700 hover:scale-105"
          />
        </div>
      </div>
      {caption && (
        <p className="mt-3 text-center font-serif text-xs tracking-widest text-[#8A7F72] uppercase">
          {caption}
        </p>
      )}
    </div>
  );
};
