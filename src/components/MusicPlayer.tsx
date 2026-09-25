import React, { useState, useEffect } from 'react';
import { Music, VolumeX } from 'lucide-react';
import { qaafiranaAudio, AudioState } from '../utils/audio';

export const MusicPlayer: React.FC = () => {
  const [audioState, setAudioState] = useState<AudioState>(qaafiranaAudio.getState());

  useEffect(() => {
    const unsubscribe = qaafiranaAudio.subscribe((state) => {
      setAudioState(state);
    });
    return unsubscribe;
  }, []);

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    qaafiranaAudio.toggle();
  };

  return (
    <aside
      aria-label="Wedding Music"
      className="fixed bottom-6 right-6 z-40 select-none print:hidden"
    >
      <button
        onClick={handleToggle}
        aria-label={audioState.isPlaying ? 'Pause Qaafirana' : 'Play Qaafirana'}
        title={audioState.isPlaying ? 'Pause Song · Qaafirana' : 'Play Song · Qaafirana'}
        className={`group relative flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-full transition-all duration-300 backdrop-blur-md shadow-[0_6px_25px_-5px_rgba(74,64,56,0.18)] hover:scale-105 active:scale-95 ${
          audioState.isPlaying
            ? 'bg-[#FAF2F0]/95 border-2 border-[#C6A15B] text-[#C6A15B] ring-2 ring-[#C6A15B]/30 ring-offset-2 ring-offset-[#FAF2F0]'
            : 'bg-[#FAF2F0]/90 border border-[#DFC48F] text-[#4A4038] hover:border-[#C6A15B] hover:text-[#C6A15B]'
        }`}
      >
        {/* Subtle Ambient Pulse Ring when playing */}
        {audioState.isPlaying && (
          <span className="absolute inset-0 rounded-full bg-[#C6A15B]/20 animate-ping pointer-events-none" />
        )}

        {/* Music Icon / Equalizer */}
        {audioState.isPlaying ? (
          <div className="relative flex items-center justify-center">
            {/* Visualizer bars bouncing dynamically */}
            <div className="flex items-end justify-center space-x-1 h-5 w-5">
              <span className="w-1 bg-[#C6A15B] rounded-full animate-[bounce_0.8s_ease-in-out_infinite]" style={{ height: '70%' }} />
              <span className="w-1 bg-[#C6A15B] rounded-full animate-[bounce_1.1s_ease-in-out_infinite]" style={{ height: '100%' }} />
              <span className="w-1 bg-[#C6A15B] rounded-full animate-[bounce_0.9s_ease-in-out_infinite]" style={{ height: '85%' }} />
            </div>
          </div>
        ) : (
          <Music
            size={22}
            className="transition-transform duration-300 group-hover:rotate-12"
            strokeWidth={1.75}
          />
        )}

        {/* Floating tooltip on hover */}
        <span className="absolute right-full mr-3 px-2.5 py-1 rounded-md bg-[#4A4038]/90 text-[#FAF2F0] text-[11px] font-sans tracking-wide whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none shadow-sm">
          {audioState.isPlaying ? 'Pause Qaafirana' : 'Play Qaafirana'}
        </span>
      </button>
    </aside>
  );
};
