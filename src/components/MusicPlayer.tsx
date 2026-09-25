import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Play, Pause, Music, ChevronDown, ChevronUp } from 'lucide-react';
import { qaafiranaAudio, AudioState } from '../utils/audio';
import songThumbnail from '../assets/images/couple_mountain_view_himalayas_1790245267891.jpg';

export const MusicPlayer: React.FC = () => {
  const [audioState, setAudioState] = useState<AudioState>(qaafiranaAudio.getState());
  const [isExpanded, setIsExpanded] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    const unsubscribe = qaafiranaAudio.subscribe((state) => {
      setAudioState(state);
    });
    return unsubscribe;
  }, []);

  const handleTogglePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    qaafiranaAudio.toggle();
  };

  const handleToggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    qaafiranaAudio.toggleMute();
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);
    qaafiranaAudio.setVolume(val);
  };

  if (isDismissed) return null;

  return (
    <aside
      aria-label="Wedding Music Player"
      className="fixed bottom-5 right-5 z-40 select-none print:hidden transition-all duration-300"
    >
      {/* ── EXPANDED FLOATING PLAYER ── */}
      {isExpanded ? (
        <div className="w-80 rounded-2xl bg-[#FAF2F0]/95 backdrop-blur-md border border-[#DFC48F] shadow-[0_10px_35px_-8px_rgba(74,64,56,0.18)] p-4 text-[#4A4038] animate-in fade-in slide-in-from-bottom-3 duration-300">
          {/* Header Row: Minimize & Status */}
          <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-[#DFC48F]/40">
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-[#C6A15B] animate-pulse" />
              <span className="text-[10px] font-sans font-semibold tracking-[0.25em] uppercase text-[#8A7F72]">
                WEDDING ANTHEM
              </span>
            </div>
            <button
              onClick={() => setIsExpanded(false)}
              className="p-1 rounded-full text-[#8A7F72] hover:text-[#4A4038] hover:bg-[#F1D9D6]/60 transition-colors"
              title="Minimize player"
            >
              <ChevronDown size={16} />
            </button>
          </div>

          {/* Main Track Info */}
          <div className="flex items-center space-x-3.5 mb-3">
            {/* Spinning Album Thumbnail */}
            <div className="relative w-12 h-12 rounded-full overflow-hidden shrink-0 border border-[#DFC48F] shadow-inner bg-[#FAF6F0]">
              <img
                src={songThumbnail}
                alt="Qaafirana - Kedarnath"
                className={`w-full h-full object-cover transition-transform duration-700 ${
                  audioState.isPlaying ? 'animate-[spin_10s_linear_infinite]' : ''
                }`}
              />
              <div className="absolute inset-0 m-auto w-3 h-3 rounded-full bg-[#FAF2F0] border border-[#DFC48F]" />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2">
                <h4 className="font-serif text-base font-semibold text-[#4A4038] truncate">
                  {audioState.trackTitle}
                </h4>
                {audioState.isPlaying && (
                  <div className="flex items-end space-x-0.5 h-3 shrink-0">
                    <span className="w-0.5 h-3 bg-[#C6A15B] animate-[bounce_0.8s_ease-in-out_infinite]" />
                    <span className="w-0.5 h-2 bg-[#C6A15B] animate-[bounce_1.1s_ease-in-out_infinite]" />
                    <span className="w-0.5 h-3.5 bg-[#C6A15B] animate-[bounce_0.9s_ease-in-out_infinite]" />
                  </div>
                )}
              </div>
              <p className="text-[11px] font-sans text-[#8A7F72] truncate">
                {audioState.artist}
              </p>
            </div>
          </div>

          {/* Controls: Play/Pause, Mute, Volume */}
          <div className="flex items-center justify-between pt-1">
            <button
              onClick={handleTogglePlay}
              className="px-3.5 py-1.5 rounded-full bg-[#FAF6F0] border border-[#DFC48F] hover:border-[#C6A15B] hover:bg-[#F1D9D6]/40 text-[#4A4038] text-xs font-medium flex items-center space-x-1.5 shadow-2xs transition-all active:scale-95"
            >
              {audioState.isPlaying ? (
                <>
                  <Pause size={13} className="text-[#C6A15B]" />
                  <span>Pause</span>
                </>
              ) : (
                <>
                  <Play size={13} className="text-[#C6A15B] fill-current" />
                  <span>Play Song</span>
                </>
              )}
            </button>

            {/* Volume Control */}
            <div className="flex items-center space-x-2">
              <button
                onClick={handleToggleMute}
                className="text-[#8A7F72] hover:text-[#4A4038] transition-colors"
                title={audioState.isMuted ? 'Unmute' : 'Mute'}
              >
                {audioState.isMuted || audioState.volume === 0 ? (
                  <VolumeX size={15} />
                ) : (
                  <Volume2 size={15} />
                )}
              </button>
              <input
                type="range"
                min="0"
                max="100"
                value={audioState.isMuted ? 0 : audioState.volume}
                onChange={handleVolumeChange}
                aria-label="Volume"
                className="w-16 h-1 bg-[#DFC48F]/50 rounded-lg appearance-none cursor-pointer accent-[#C6A15B]"
              />
            </div>
          </div>
        </div>
      ) : (
        /* ── COMPACT FLOATING PILL ── */
        <div
          onClick={() => setIsExpanded(true)}
          className={`group flex items-center space-x-2.5 px-3.5 py-2 rounded-full cursor-pointer transition-all duration-300 shadow-md hover:shadow-lg ${
            audioState.isPlaying
              ? 'bg-[#FAF2F0]/95 border border-[#C6A15B] text-[#4A4038]'
              : 'bg-[#FAF2F0]/90 border border-[#DFC48F]/80 text-[#8A7F72] hover:text-[#4A4038]'
          } backdrop-blur-md`}
        >
          {/* Play/Pause round button inside pill */}
          <button
            onClick={handleTogglePlay}
            className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 transition-transform active:scale-90 ${
              audioState.isPlaying
                ? 'bg-[#C6A15B] text-white'
                : 'bg-[#F1D9D6] text-[#4A4038]'
            }`}
            title={audioState.isPlaying ? 'Pause' : 'Play Qaafirana'}
          >
            {audioState.isPlaying ? (
              <Pause size={11} />
            ) : (
              <Play size={11} className="fill-current ml-0.5" />
            )}
          </button>

          {/* Equalizer waves or song label */}
          <div className="flex items-center space-x-2">
            <span className="font-serif text-xs text-[#4A4038] tracking-wide font-medium">
              Qaafirana
            </span>

            {audioState.isPlaying ? (
              <div className="flex items-end space-x-0.5 h-2.5">
                <span className="w-0.5 h-2 bg-[#C6A15B] animate-[bounce_0.8s_ease-in-out_infinite]" />
                <span className="w-0.5 h-3 bg-[#C6A15B] animate-[bounce_1.1s_ease-in-out_infinite]" />
                <span className="w-0.5 h-1.5 bg-[#C6A15B] animate-[bounce_0.7s_ease-in-out_infinite]" />
              </div>
            ) : (
              <Music size={12} className="text-[#C6A15B]" />
            )}
          </div>

          {/* Expand icon */}
          <ChevronUp
            size={14}
            className="text-[#8A7F72] group-hover:text-[#4A4038] group-hover:-translate-y-0.5 transition-all"
          />
        </div>
      )}
    </aside>
  );
};
