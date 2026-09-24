import React from 'react';
import instagramCleanFrame from '../assets/images/instagram_clean_frame.png';
import vintageCameraHand from '../assets/images/vintage_camera_hand_sticker.png';

interface StoryFrameOverlayProps {
  userName?: string;
  likesCount?: string;
  caption?: string;
  daysAgo?: string;
  onClick?: () => void;
  children: React.ReactNode;
}

export const StoryFrameOverlay: React.FC<StoryFrameOverlayProps> = ({
  onClick,
  children,
}) => {
  return (
    <div className="relative w-full max-w-[340px] xs:max-w-[360px] sm:max-w-[400px] md:max-w-[430px] mx-auto select-none group">
      {/* Outer Card Container with aspect ratio matching the exact frame (685 : 899) */}
      <div
        onClick={onClick}
        className="relative w-full aspect-[685/899] mx-auto cursor-pointer transition-transform duration-500 ease-out group-hover:scale-[1.015]"
      >
        {/* Layer 1: The Photo (Fits precisely behind the inner cutout window of the frame) */}
        {/* Cutout window coordinates in 685x899: Left 4.09%, Top 11.24%, Width 91.68%, Height 63.40% */}
        {/* Given a slight 0.3% margin behind the dark border so zero white hairline gap is ever visible */}
        <div
          className="absolute overflow-hidden rounded-[14px] sm:rounded-[20px] bg-black z-10 shadow-inner"
          style={{
            left: '3.8%',
            top: '10.9%',
            width: '92.2%',
            height: '63.8%',
          }}
        >
          {children}
        </div>

        {/* Layer 2: Clean Instagram Frame Image (Background Layer) */}
        <img
          src={instagramCleanFrame}
          alt="Instagram Story Frame"
          className="absolute inset-0 w-full h-full object-contain pointer-events-none z-20 drop-shadow-xl"
        />

        {/* Layer 3: Halftone Hand Holding Camera (Foreground Layer) */}
        {/* Overlapping the lower-right area, positioned slightly lower so it naturally comes upward from below */}
        {/* Pop-up animation when cursor hovers over the frame */}
        <div
          className="absolute z-30 pointer-events-none transition-all duration-400 ease-out transform group-hover:scale-108 group-hover:-translate-y-2.5 group-hover:-rotate-1 drop-shadow-2xl"
          style={{
            left: '39.4%',
            top: '55.8%',
            width: '64.2%',
          }}
        >
          <img
            src={vintageCameraHand}
            alt="Hand holding vintage camera"
            className="w-full h-auto object-contain"
          />
        </div>
      </div>
    </div>
  );
};
