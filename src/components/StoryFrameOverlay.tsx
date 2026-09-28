import React from 'react';
import userInstagramFrame from '../assets/images/user_instagram_frame.png';
import coupleAvatar from '../assets/images/couple_story_avatar.jpg';

interface StoryFrameOverlayProps {
  userName?: string;
  location?: string;
  caption?: string;
  daysAgo?: string;
  currentIndex?: number;
  totalStories?: number;
  onClick?: () => void;
  children: React.ReactNode;
}

export const StoryFrameOverlay: React.FC<StoryFrameOverlayProps> = ({
  userName = 'meher.kabir',
  location = 'Rishikesh, Uttarakhand',
  caption = '',
  daysAgo = 'NOVEMBER 2025',
  currentIndex = 0,
  totalStories = 8,
  onClick,
  children,
}) => {
  return (
    <div className="relative w-full max-w-[360px] xs:max-w-[390px] sm:max-w-[430px] mx-auto select-none group">
      {/* ── Outer Frame Container (No extra background or borders) ── */}
      <div
        onClick={onClick}
        className="relative w-full aspect-square mx-auto cursor-pointer transition-all duration-500 cubic-bezier(0.34, 1.56, 0.64, 1) group-hover:scale-[1.03] group-hover:-translate-y-2 drop-shadow-2xl overflow-visible"
      >
        {/* Layer 1: Photo Slideshow Cutout Window (Placed seamlessly behind the frame) */}
        <div
          className="absolute overflow-hidden bg-black/10 z-10 rounded-sm"
          style={{
            left: '12.7%',
            top: '12.7%',
            width: '56.0%',
            height: '43.6%',
          }}
        >
          {children}
        </div>

        {/* Layer 2: User's Exact Instagram Frame Artwork with Integrated Vintage Camera Hand */}
        <img
          src={userInstagramFrame}
          alt="Instagram Post Frame"
          className="absolute inset-0 w-full h-full object-contain pointer-events-none z-20"
        />

        {/* Layer 3: Dynamic Overlay Details (White text on dark frame) */}
        {/* 3A: Couple Avatar Circle */}
        <div
          className="absolute z-25 rounded-full overflow-hidden border border-white/60 pointer-events-none"
          style={{
            left: '12.7%',
            top: '6.5%',
            width: '5.2%',
            height: '5.0%',
          }}
        >
          <img
            src={coupleAvatar}
            alt="Meher & Kabir"
            className="w-full h-full object-cover object-center"
          />
        </div>

        {/* 3B: Dynamic Username & Location */}
        <div
          className="absolute z-25 flex flex-col justify-center pointer-events-none text-left bg-[#0A0D16] pr-2"
          style={{
            left: '19.2%',
            top: '6.2%',
            height: '5.4%',
            maxWidth: '48%',
          }}
        >
          <div className="flex items-center space-x-1">
            <span className="font-sans font-bold text-white text-[11px] sm:text-[12.5px] leading-tight truncate">
              {userName}
            </span>
            {/* Instagram Blue Verified Badge */}
            <svg
              className="w-3 h-3 text-[#0095F6] shrink-0"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1.25 14.5L6.5 12.25l1.41-1.41 2.84 2.83 6.34-6.34 1.41 1.41-7.75 7.76z" />
            </svg>
          </div>
          <span className="font-sans text-[#A8A8A8] text-[9px] sm:text-[9.5px] leading-tight truncate block mt-0.5 font-normal">
            {location}
          </span>
        </div>

        {/* 3C: Dynamic Caption Area */}
        <div
          className="absolute z-25 text-left pointer-events-none bg-[#0A0D16]/95 pt-0.5"
          style={{
            left: '12.7%',
            top: '65.2%',
            right: '54%',
            maxHeight: '8.5%',
          }}
        >
          <div className="font-sans text-[10px] sm:text-[11px] leading-snug text-white line-clamp-2">
            <span className="font-bold mr-1 text-white">{userName}</span>
            <span className="text-[#E0E0E0] font-normal">{caption}</span>
          </div>

          <div className="font-sans text-[#8E8E8E] text-[8px] sm:text-[8.5px] uppercase tracking-wider mt-0.5 font-medium">
            {daysAgo} · RISHIKESH
          </div>
        </div>
      </div>
    </div>
  );
};
