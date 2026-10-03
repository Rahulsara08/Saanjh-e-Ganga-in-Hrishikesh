import React from 'react';
import vintageCameraHand from '../assets/images/hand_camera_transparent.png';
import coupleAvatar from '../assets/images/couple_story_avatar.jpg';
import { Heart, MessageCircle, Send, Bookmark, MoreHorizontal } from 'lucide-react';

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
    <div className="relative w-full max-w-[340px] xs:max-w-[365px] sm:max-w-[395px] md:max-w-[415px] mx-auto select-none group">
      {/* ── Main Big White Instagram Post Frame (Just like before, clean white aesthetic) ── */}
      <div
        onClick={onClick}
        className="relative w-full rounded-[26px] bg-white border border-[#DFC48F]/50 shadow-[0_16px_45px_-12px_rgba(74,64,56,0.18)] cursor-pointer transition-all duration-500 cubic-bezier(0.34, 1.56, 0.64, 1) group-hover:scale-[1.02] group-hover:-translate-y-2 overflow-visible"
      >
        {/* 1. Header: Avatar, Username, Verified Badge, Location & 3 Dots */}
        <div className="flex items-center justify-between px-3.5 pt-3 pb-2.5">
          <div className="flex items-center space-x-2.5">
            {/* Avatar circle */}
            <div className="w-8 h-8 rounded-full overflow-hidden border border-[#DFC48F] shrink-0 shadow-xs">
              <img
                src={coupleAvatar}
                alt="Meher & Kabir"
                className="w-full h-full object-cover object-center"
              />
            </div>

            {/* Username & Location */}
            <div className="flex flex-col text-left">
              <div className="flex items-center space-x-1">
                <span className="font-sans font-bold text-[#1F1F1F] text-[12px] leading-tight">
                  {userName}
                </span>
                {/* Instagram Blue Verified Badge */}
                <svg
                  className="w-3.5 h-3.5 text-[#0095F6] shrink-0"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1.25 14.5L6.5 12.25l1.41-1.41 2.84 2.83 6.34-6.34 1.41 1.41-7.75 7.76z" />
                </svg>
              </div>
              <span className="font-sans text-[#737373] text-[9.5px] leading-tight mt-0.5 font-normal">
                {location}
              </span>
            </div>
          </div>

          {/* Three Dots Icon */}
          <div className="text-[#737373] hover:text-[#1F1F1F] transition-colors pr-1">
            <MoreHorizontal size={18} />
          </div>
        </div>

        {/* 2. Main Photo Showcase Window (Big, spacious & clear) */}
        <div className="w-full aspect-[4/3] sm:aspect-[1/1] overflow-hidden bg-[#FAF6F0] relative">
          {children}
        </div>

        {/* 3. Action Bar: Like, Comment, Share, Dots & Bookmark */}
        <div className="px-3.5 pt-2.5 pb-3.5 relative">
          <div className="flex items-center justify-between pb-1.5">
            {/* Left Icons: Red Liked Heart, Speech Bubble, Paper Airplane */}
            <div className="flex items-center space-x-3.5">
              <Heart size={20} className="fill-[#ED4956] text-[#ED4956]" />
              <MessageCircle size={19} className="text-[#262626] hover:text-black transition-colors" />
              <Send size={18} className="text-[#262626] hover:text-black transition-colors -rotate-12" />
            </div>

            {/* Center: 3 Carousel Dots */}
            <div className="flex items-center space-x-1.5">
              {[0, 1, 2].map((dotIdx) => {
                const isActive = (currentIndex % 3) === dotIdx;
                return (
                  <span
                    key={dotIdx}
                    className={`rounded-full transition-all duration-300 ${
                      isActive
                        ? 'w-1.5 h-1.5 bg-[#0095F6] scale-125'
                        : 'w-1 h-1 bg-[#C7C7C7]'
                    }`}
                  />
                );
              })}
            </div>

            {/* Right: Bookmark (semi-visible next to camera) */}
            <div className="text-[#262626]/70 pr-2">
              <Bookmark size={18} />
            </div>
          </div>

          {/* Caption & Comments (Left side leaves clean room for the stacked camera hand) */}
          <div className="text-left pr-28 sm:pr-32 space-y-0.5 pt-0.5 min-h-[58px] sm:min-h-[62px] flex flex-col justify-between">
            <div className="font-sans text-[11px] leading-snug text-[#1F1F1F] line-clamp-2 h-[28px] overflow-hidden">
              <span className="font-bold mr-1.5 text-black">{userName}</span>
              <span className="text-[#383838] font-normal">{caption}</span>
            </div>

            <div className="font-sans text-[#8E8E8E] text-[9.5px] font-normal pt-0.5">
              View all 108 comments
            </div>

            <div className="font-sans text-[#A8A8A8] text-[8.5px] uppercase tracking-wider font-medium pt-0.5">
              {daysAgo} · RISHIKESH
            </div>
          </div>
        </div>

        {/* ── 4. Stacked Hand Holding Vintage Camera (Larger & lower to cover lower space) ── */}
        <div
          className="absolute -right-2 sm:-right-3 -bottom-5 sm:-bottom-6 w-[64%] xs:w-[62%] sm:w-[60%] max-w-[260px] pointer-events-none z-30 transition-transform duration-300 ease-out group-hover:scale-106 group-hover:-translate-y-2 drop-shadow-[0_12px_24px_rgba(74,64,56,0.28)]"
        >
          <img
            src={vintageCameraHand}
            alt="Hand holding vintage camera"
            className="w-full h-auto object-contain block select-none"
          />
        </div>
      </div>
    </div>
  );
};
