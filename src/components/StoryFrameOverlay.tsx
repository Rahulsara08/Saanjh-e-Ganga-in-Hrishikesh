import React from 'react';
import instagramWhiteFrame from '../assets/images/instagram_white_frame.png';
import vintageCameraHand from '../assets/images/vintage_camera_hand_sticker.png';
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
    <div className="relative w-full max-w-[340px] xs:max-w-[360px] sm:max-w-[390px] md:max-w-[410px] mx-auto select-none group">
      {/* Outer Card Container with aspect ratio matching the exact white frame (577 : 956) */}
      {/* Responsive pop-up animation on hover: lifts up smoothly and scales */}
      <div
        onClick={onClick}
        className="relative w-full aspect-[577/956] mx-auto cursor-pointer transition-all duration-500 cubic-bezier(0.34, 1.56, 0.64, 1) group-hover:scale-[1.03] group-hover:-translate-y-3 shadow-[0_16px_45px_-12px_rgba(74,64,56,0.18)] group-hover:shadow-[0_28px_65px_-15px_rgba(74,64,56,0.28)] rounded-[26px] bg-white overflow-visible"
      >
        {/* Layer 1: The Photo Slideshow in the center window (Seamless fit, zero black border) */}
        {/* Cutout window coordinates in 577x956 frame: left=12px (2.08%), top=84px (8.78%), width=553px (95.84%), height=608px (63.60%) */}
        {/* Slight 0.3% bleed under the white frame border ensures zero gap/hairline */}
        <div
          className="absolute overflow-hidden bg-[#FAF6F0] z-10"
          style={{
            left: '1.8%',
            top: '8.4%',
            width: '96.4%',
            height: '64.0%',
          }}
        >
          {children}
        </div>

        {/* Layer 2: White Instagram Frame Artwork (Crisp transparent photo cutout, story ring, action icons, 3 dots, and solid red liked heart) */}
        <img
          src={instagramWhiteFrame}
          alt="Instagram White Post Frame"
          className="absolute inset-0 w-full h-full object-contain pointer-events-none z-20"
        />

        {/* Layer 3: Dynamic Instagram Top Header */}
        {/* 3A: Avatar Circle inside the story gradient ring (top-left) */}
        <div
          className="absolute z-25 rounded-full overflow-hidden border border-white pointer-events-none"
          style={{
            left: '3.64%',
            top: '1.78%',
            width: '8.8%',
            aspectRatio: '1/1',
          }}
        >
          <img
            src={coupleAvatar}
            alt="Meher & Kabir"
            className="w-full h-full object-cover object-center"
          />
        </div>

        {/* 3B: Couple Name and Fixed Location right under account name */}
        <div
          className="absolute z-25 flex flex-col justify-center pointer-events-none text-left"
          style={{
            left: '14.4%',
            top: '1.6%',
            right: '11%',
            height: '6.2%',
          }}
        >
          <div className="flex items-center space-x-1">
            <span className="font-sans font-bold text-[#1F1F1F] text-[11px] sm:text-[12.5px] leading-tight truncate">
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
          {/* One fixed location directly under account name for all images */}
          <span className="font-sans text-[#737373] text-[9px] sm:text-[10px] leading-tight truncate block mt-0.5 font-normal">
            {location}
          </span>
        </div>

        {/* Layer 3C: Three Carousel Dots (Centered in action bar below the photo) */}
        <div
          className="absolute z-25 flex items-center space-x-1.5 pointer-events-none"
          style={{
            left: '50%',
            top: '75.8%',
            transform: 'translate(-50%, -50%)',
          }}
        >
          {[0, 1, 2].map((dotIdx) => {
            const isActive = (currentIndex % 3) === dotIdx;
            return (
              <span
                key={dotIdx}
                className={`rounded-full transition-all duration-300 ${
                  isActive
                    ? 'w-1.5 h-1.5 bg-[#0095F6] scale-125 shadow-xs'
                    : 'w-1 h-1 bg-[#C7C7C7]'
                }`}
              />
            );
          })}
        </div>

        {/* Layer 3D: Bottom Area: Caption, Comments, Date */}
        <div
          className="absolute z-25 text-left pointer-events-none"
          style={{
            left: '3.6%',
            top: '79.2%',
            right: '34%', // Leave space so hand sticker camera doesn't overlap text
          }}
        >
          {/* Pretty Caption */}
          <div className="font-sans text-[10.5px] sm:text-[11.5px] leading-snug text-[#1F1F1F] line-clamp-2 mb-0.5">
            <span className="font-bold mr-1.5 text-black">{userName}</span>
            <span className="text-[#383838] font-normal">{caption}</span>
          </div>

          {/* Comments Link */}
          <div className="font-sans text-[#8E8E8E] text-[9.5px] sm:text-[10px] font-normal leading-tight mt-0.5">
            View all 108 comments
          </div>

          {/* Date / Location Stamp */}
          <div className="font-sans text-[#A8A8A8] text-[8px] sm:text-[9px] uppercase tracking-wider mt-0.5 font-medium">
            {daysAgo} · RISHIKESH
          </div>
        </div>

        {/* Layer 4: Halftone Hand Holding Camera Sticker (Pop-up animation on cursor hover) */}
        <div
          className="absolute z-30 pointer-events-none transition-all duration-500 cubic-bezier(0.34, 1.56, 0.64, 1) transform group-hover:scale-115 group-hover:-translate-y-6 group-hover:-rotate-2 drop-shadow-2xl"
          style={{
            left: '39.4%',
            top: '63.5%',
            width: '64.2%',
          }}
        >
          <img
            src={vintageCameraHand}
            alt="Hand holding vintage camera"
            className="w-full h-auto object-contain transition-transform duration-300"
          />
        </div>
      </div>
    </div>
  );
};
