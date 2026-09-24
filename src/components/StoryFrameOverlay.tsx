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
        className="relative w-full aspect-[685/899] mx-auto cursor-pointer transition-all duration-500 ease-out group-hover:scale-[1.018] group-hover:-translate-y-1"
      >
        {/* Layer 1: The Photo (Extends comfortably under the solid dark frame so zero white gap or corner is ever visible) */}
        {/* Cutout window is at left 4.09%, top 11.24%, width 91.68%, height 63.40% */}
        {/* Sits from left 2.5%, top 9.0%, width 95.0%, height 67.0% without clipping corners */}
        <div
          className="absolute overflow-hidden bg-black z-10"
          style={{
            left: '2.5%',
            top: '9.0%',
            width: '95.0%',
            height: '67.0%',
          }}
        >
          {children}
        </div>

        {/* Layer 2: Clean Instagram Frame Image (Background Layer with natural inner rounded cutout) */}
        <img
          src={instagramCleanFrame}
          alt="Instagram Story Frame"
          className="absolute inset-0 w-full h-full object-contain pointer-events-none z-20 drop-shadow-xl"
        />

        {/* Layer 3: Halftone Hand Holding Camera (Foreground Layer) */}
        {/* Positioned lower so it naturally comes upward from below the frame, camera prominently on lower right */}
        {/* Independent pop-up animation: lifts and scales higher on cursor hover than the main frame */}
        <div
          className="absolute z-30 pointer-events-none transition-all duration-400 cubic-bezier(0.34, 1.56, 0.64, 1) transform group-hover:scale-112 group-hover:-translate-y-3.5 group-hover:-rotate-2 drop-shadow-2xl"
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
