import React, { useState, useEffect, useRef } from 'react';
import { WeddingConfig } from '../types';
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Share2,
  ShieldCheck,
  Settings,
  Maximize2,
  Minimize2,
  User,
  Sparkles,
  MapPin,
  Heart
} from 'lucide-react';
import { ambientAudio } from '../utils/audio';
import rishikeshBestViewBg from '../assets/images/rishikesh_best_view_bg_1790236456536.jpg';

interface PhoneMockupProps {
  config: WeddingConfig;
  guestGreeting: string;
  guestParam: string;
  onUpdateGuestParam: (name: string) => void;
  onOpenHostDashboard: () => void;
  onOpenCMSModal: () => void;
  onOpenShareModal: () => void;
  children: React.ReactNode;
}

export const PhoneMockup: React.FC<PhoneMockupProps> = ({
  config,
  guestGreeting,
  guestParam,
  onUpdateGuestParam,
  onOpenHostDashboard,
  onOpenCMSModal,
  onOpenShareModal,
  children,
}) => {
  const [isPlayingTour, setIsPlayingTour] = useState(false);
  const [tourSpeed, setTourSpeed] = useState<1 | 2>(1);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [isFullscreenMode, setIsFullscreenMode] = useState(false);
  const [isPersonalizeOpen, setIsPersonalizeOpen] = useState(false);
  const [guestInput, setGuestInput] = useState(guestParam);
  const [currentTime, setCurrentTime] = useState('9:41');

  const phoneScrollRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number | null>(null);

  // Update clock in status bar
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = now.getHours();
      const minutes = now.getMinutes().toString().padStart(2, '0');
      setCurrentTime(`${hours % 12 || 12}:${minutes}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 30000);
    return () => clearInterval(interval);
  }, []);

  // Sync guest input if guestParam changes
  useEffect(() => {
    setGuestInput(guestParam);
  }, [guestParam]);

  // Handle Audio toggle
  const handleToggleAudio = () => {
    const playing = ambientAudio.toggle();
    setIsAudioPlaying(playing);
  };

  // Play Tour Auto-Scroll Engine
  useEffect(() => {
    if (!isPlayingTour) {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
      return;
    }

    // Auto-start ambient sitar audio if not already playing
    if (!isAudioPlaying) {
      ambientAudio.start();
      setIsAudioPlaying(true);
    }

    const scrollContainer = phoneScrollRef.current;
    if (!scrollContainer) return;

    let lastTime = performance.now();
    const scrollStep = (now: number) => {
      if (!isPlayingTour || !scrollContainer) return;
      const delta = (now - lastTime) / 1000;
      lastTime = now;

      // Base speed: 45px per second for comfortable reading, 90px for 2x
      const speed = tourSpeed === 1 ? 48 : 95;
      scrollContainer.scrollTop += speed * delta;

      // Check if reached bottom
      const maxScroll = scrollContainer.scrollHeight - scrollContainer.clientHeight;
      if (scrollContainer.scrollTop >= maxScroll - 4) {
        setIsPlayingTour(false);
        return;
      }

      animationFrameRef.current = requestAnimationFrame(scrollStep);
    };

    animationFrameRef.current = requestAnimationFrame(scrollStep);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isPlayingTour, tourSpeed, isAudioPlaying]);

  // Restart tour to top
  const handleResetTour = () => {
    if (phoneScrollRef.current) {
      phoneScrollRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Save personalized guest name
  const handleSaveGuest = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateGuestParam(guestInput.trim());
    setIsPersonalizeOpen(false);
  };

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden flex flex-col justify-between selection:bg-[#F1D9D6]">
      {/* ─── 1. PANORAMIC RISHIKESH SCENIC BACKGROUND ─── */}
      <div className="fixed inset-0 pointer-events-none -z-20 overflow-hidden">
        <img
          src={rishikeshBestViewBg}
          alt="Breathtaking iconic view of Rishikesh Uttarakhand at sunset"
          className="w-full h-full object-cover object-center transform scale-102"
        />
        {/* Soft atmospheric gradient to enhance contrast and warmth */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#2E2018]/45 via-[#1F1712]/20 to-[#1F1712]/55 mix-blend-multiply" />
        <div className="absolute inset-0 bg-[#E8B89E]/10" />
      </div>

      {/* ─── FLOATING MARIGOLD PETALS & GLOW DRIFT ─── */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-[10%] left-[8%] w-3.5 h-3.5 rounded-full bg-[#E88C38]/70 blur-[0.5px] animate-petal-slow" />
        <div className="absolute top-[25%] right-[12%] w-2.5 h-2.5 rounded-full bg-[#F4B251]/75 blur-[0.5px] animate-petal-med" />
        <div className="absolute top-[5%] right-[22%] w-3 h-3 rounded-full bg-[#E57A44]/70 blur-[0.5px] animate-petal-fast" />
        <div className="absolute top-[40%] left-[18%] w-2 h-2 rounded-full bg-[#F8C165]/80 blur-[0.5px] animate-petal-slow" />
        <div className="absolute top-[60%] right-[8%] w-3 h-3 rounded-full bg-[#DE6B35]/70 blur-[0.5px] animate-petal-med" />
      </div>

      {/* ─── 2. TOP GLASSMORPHIC CONTROL DECK ─── */}
      <header className="relative z-30 w-full px-4 sm:px-8 py-3.5 flex items-center justify-between backdrop-blur-md bg-[#251D18]/60 border-b border-[#DFC48F]/30 shadow-lg text-[#FAF6F0]">
        {/* Monogram / Title */}
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-full bg-[#FAF6F0]/15 border border-[#DFC48F]/60 flex items-center justify-center text-[#DFC48F] text-xs font-serif font-bold shadow-inner">
            ॐ
          </div>
          <div>
            <h2 className="font-serif text-base sm:text-lg text-[#FAF6F0] tracking-wider leading-none">
              {config.couple.brideName}{' '}
              <span className="text-[#DFC48F] italic font-serif">&</span>{' '}
              {config.couple.groomName}
            </h2>
            <p className="text-[9px] font-sans tracking-[0.22em] text-[#DFC48F]/90 uppercase mt-0.5 flex items-center gap-1">
              <MapPin size={10} className="text-[#DFC48F]" />
              <span>{config.couple.venueCity}, {config.couple.venueCountry} · {config.couple.numericDateMark || config.couple.weddingDateString}</span>
            </p>
          </div>
        </div>

        {/* Center / Right: Interactive Controls */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* PLAY INVITATION TOUR BUTTON */}
          <button
            onClick={() => setIsPlayingTour(!isPlayingTour)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-sans font-medium uppercase tracking-wider flex items-center space-x-2 transition-all duration-300 shadow-md ${
              isPlayingTour
                ? 'bg-[#EED8D3] text-[#382E27] ring-2 ring-[#DFC48F] animate-pulse'
                : 'bg-[#FAF6F0]/90 hover:bg-[#FAF6F0] text-[#382E27] hover:scale-102'
            }`}
            title={isPlayingTour ? 'Pause automatic tour' : 'Play interactive invitation tour'}
          >
            {isPlayingTour ? <Pause size={13} /> : <Play size={13} className="fill-[#382E27]" />}
            <span className="text-[10px] font-semibold tracking-widest">
              {isPlayingTour ? 'Pause' : 'Play Invitation'}
            </span>
          </button>

          {/* Speed Toggle when playing */}
          {isPlayingTour && (
            <button
              onClick={() => setTourSpeed(tourSpeed === 1 ? 2 : 1)}
              className="px-2 py-1 rounded-full bg-[#FAF6F0]/20 text-[#FAF6F0] text-[10px] font-mono border border-[#DFC48F]/40 hover:bg-[#FAF6F0]/30 transition-all"
              title="Tour Speed"
            >
              {tourSpeed}x
            </button>
          )}

          {/* Reset to top button */}
          <button
            onClick={handleResetTour}
            title="Scroll back to top"
            className="p-2 rounded-full bg-[#FAF6F0]/15 hover:bg-[#FAF6F0]/30 text-[#FAF6F0] border border-[#DFC48F]/40 transition-all"
          >
            <RotateCcw size={14} />
          </button>

          {/* Ambient Sitar / Flute Audio Toggle */}
          <button
            onClick={handleToggleAudio}
            className={`p-2 rounded-full border transition-all flex items-center space-x-1.5 ${
              isAudioPlaying
                ? 'bg-[#EED8D3] border-[#DFB6AE] text-[#382E27] shadow-sm'
                : 'bg-[#FAF6F0]/15 border-[#DFC48F]/40 text-[#FAF6F0] hover:bg-[#FAF6F0]/25'
            }`}
            title={isAudioPlaying ? 'Mute ambient sitar' : 'Play peaceful Raag Yaman sitar'}
          >
            {isAudioPlaying ? <Volume2 size={15} /> : <VolumeX size={15} />}
            <span className="text-[10px] font-medium tracking-wider uppercase hidden md:inline pr-1">
              {isAudioPlaying ? 'Music On' : 'Music'}
            </span>
          </button>

          {/* Personalize Guest Name Pill */}
          <button
            onClick={() => setIsPersonalizeOpen(true)}
            className="p-2 rounded-full bg-[#FAF6F0]/15 hover:bg-[#FAF6F0]/25 border border-[#DFC48F]/40 text-[#FAF6F0] transition-all"
            title="Personalize invitation with guest name"
          >
            <User size={15} />
          </button>

          {/* Share Invitation */}
          <button
            onClick={onOpenShareModal}
            className="p-2 rounded-full bg-[#FAF6F0]/15 hover:bg-[#FAF6F0]/25 border border-[#DFC48F]/40 text-[#FAF6F0] transition-all"
            title="Share & QR Code"
          >
            <Share2 size={15} />
          </button>

          {/* Host Admin Dashboard */}
          <button
            onClick={onOpenHostDashboard}
            className="p-2 rounded-full bg-[#FAF6F0]/15 hover:bg-[#FAF6F0]/25 border border-[#DFC48F]/40 text-[#FAF6F0] transition-all"
            title="Host RSVP Dashboard"
          >
            <ShieldCheck size={15} />
          </button>

          {/* CMS Config */}
          <button
            onClick={onOpenCMSModal}
            className="p-2 rounded-full bg-[#FAF6F0]/15 hover:bg-[#FAF6F0]/25 border border-[#DFC48F]/40 text-[#FAF6F0] transition-all"
            title="Edit wedding config"
          >
            <Settings size={15} />
          </button>

          {/* Toggle Fullscreen / Phone Mockup Frame */}
          <button
            onClick={() => setIsFullscreenMode(!isFullscreenMode)}
            className="p-2 rounded-full bg-[#FAF6F0]/15 hover:bg-[#FAF6F0]/25 border border-[#DFC48F]/40 text-[#FAF6F0] transition-all hidden sm:flex"
            title={isFullscreenMode ? 'Switch to Phone Mockup View' : 'Switch to Fullscreen View'}
          >
            {isFullscreenMode ? <Minimize2 size={15} /> : <Maximize2 size={15} />}
          </button>
        </div>
      </header>

      {/* ─── 3. CENTER VIEWPORT: PHONE MOCKUP (Exactly like image.png) ─── */}
      <main className="relative flex-1 flex items-center justify-center p-2 sm:p-6 md:p-8">
        {isFullscreenMode ? (
          /* Fullscreen Borderless Mode */
          <div className="w-full max-w-5xl mx-auto bg-[#FAF6F0] rounded-3xl shadow-2xl border border-[#DFC48F]/70 overflow-hidden my-4">
            <div className="max-h-[85vh] overflow-y-auto phone-scrollbar">
              {children}
            </div>
          </div>
        ) : (
          /* 📱 IPHONE MOCKUP FRAME */
          <div className="relative flex items-center justify-center select-none">
            {/* Phone Hardware Side Buttons */}
            {/* Left side: Mute & Volume rockers */}
            <div className="hidden sm:block absolute -left-[14px] top-[140px] w-[5px] h-[32px] bg-[#2E2822] rounded-l-sm shadow-md" />
            <div className="hidden sm:block absolute -left-[14px] top-[190px] w-[5px] h-[55px] bg-[#2E2822] rounded-l-sm shadow-md" />
            <div className="hidden sm:block absolute -left-[14px] top-[260px] w-[5px] h-[55px] bg-[#2E2822] rounded-l-sm shadow-md" />
            {/* Right side: Power/Side button */}
            <div className="hidden sm:block absolute -right-[14px] top-[190px] w-[5px] h-[80px] bg-[#2E2822] rounded-r-sm shadow-md" />

            {/* Phone Chassis Container */}
            <div className="w-[360px] xs:w-[385px] sm:w-[410px] md:w-[420px] h-[780px] xs:h-[820px] sm:h-[850px] max-h-[86vh] sm:max-h-[88vh] bg-[#1A1613] rounded-[48px] sm:rounded-[56px] p-[8px] sm:p-[10px] shadow-[0_25px_70px_rgba(0,0,0,0.6),0_0_90px_rgba(235,170,120,0.25)] ring-1 ring-white/20 relative flex flex-col">
              
              {/* Inner bezel with smooth dark metallic chamfer */}
              <div className="w-full h-full rounded-[40px] sm:rounded-[47px] overflow-hidden bg-[#FAF6F0] relative flex flex-col shadow-inner">
                
                {/* ── TOP PHONE STATUS BAR & DYNAMIC ISLAND ── */}
                <div className="w-full h-11 bg-[#FAF6F0] z-40 shrink-0 px-7 flex items-center justify-between text-[#382E27] font-sans text-xs relative select-none">
                  {/* Digital Clock */}
                  <span className="font-semibold tracking-tight text-[11px]">
                    {currentTime}
                  </span>

                  {/* Dynamic Island / Camera Notch */}
                  <div className="absolute left-1/2 -translate-x-1/2 top-2.5 w-[96px] sm:w-[108px] h-[26px] bg-black rounded-full flex items-center justify-end pr-2.5 space-x-1.5 shadow-sm">
                    {/* Tiny camera lens reflection */}
                    <div className="w-2.5 h-2.5 rounded-full bg-[#1A1A24] border border-[#2E2E3E]/60 flex items-center justify-center">
                      <div className="w-1 h-1 rounded-full bg-[#0E1528]" />
                    </div>
                  </div>

                  {/* Network / Battery icons */}
                  <div className="flex items-center space-x-1.5 text-[10px]">
                    <span className="font-medium text-[9px] tracking-wider uppercase text-[#8A7F72]">5G</span>
                    <div className="w-5 h-2.5 rounded-[3px] border border-[#382E27] p-0.5 flex items-center">
                      <div className="w-full h-full bg-[#382E27] rounded-[1px]" />
                    </div>
                  </div>
                </div>

                {/* ── SCROLLABLE PHONE SCREEN INVITATION ("PLAY IN IT") ── */}
                <div
                  ref={phoneScrollRef}
                  data-phone-scroll="true"
                  className="flex-1 w-full overflow-y-auto overflow-x-hidden phone-scrollbar scroll-smooth relative"
                >
                  {children}
                </div>

                {/* ── BOTTOM IOS HOME INDICATOR BAR ── */}
                <div className="w-full h-6 bg-[#FAF6F0] shrink-0 flex items-center justify-center select-none">
                  <div className="w-32 h-1 bg-[#382E27]/30 rounded-full" />
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* ─── 4. BOTTOM CAPTION BAR ─── */}
      <footer className="relative z-20 w-full py-2.5 px-4 text-center text-[10px] sm:text-[11px] font-sans text-[#FAF6F0]/90 tracking-[0.25em] uppercase backdrop-blur-sm bg-[#1E1712]/40 border-t border-[#DFC48F]/20">
        Celebration of Love · {config.couple.venueName}, {config.couple.venueCity} · {config.couple.weddingDateString}
      </footer>

      {/* ─── 5. PERSONALIZE GUEST NAME MODAL ─── */}
      {isPersonalizeOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#FAF6F0] p-6 sm:p-7 rounded-3xl border border-[#DFC48F] shadow-2xl max-w-md w-full">
            <div className="flex items-center space-x-2 text-[#B88E4C] mb-2">
              <Sparkles size={18} />
              <h3 className="font-serif text-xl text-[#382E27]">Personalize Guest Invitation</h3>
            </div>
            <p className="text-xs text-[#7A7065] font-sans mb-4">
              Enter the guest or family name to customize the letterpress ribbon at the top of the phone screen.
            </p>

            <form onSubmit={handleSaveGuest} className="space-y-4">
              <div>
                <label className="block text-[10px] font-sans tracking-wider uppercase text-[#8A7F72] mb-1 font-medium">
                  Guest or Family Name
                </label>
                <input
                  type="text"
                  value={guestInput}
                  onChange={(e) => setGuestInput(e.target.value)}
                  placeholder="e.g. Rohan & Ananya / The Kapoor Family"
                  className="w-full bg-[#FDFBF7] border border-[#DFC48F]/70 rounded-xl px-3.5 py-2.5 text-sm text-[#382E27] focus:outline-none focus:border-[#B88E4C]"
                  autoFocus
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsPersonalizeOpen(false)}
                  className="px-4 py-2 rounded-full border border-[#DFC48F] text-xs font-sans tracking-wider uppercase text-[#8A7F72] hover:bg-[#F3EDE3]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-full bg-[#EED8D3] hover:bg-[#E3C4BE] text-[#382E27] text-xs font-semibold tracking-wider uppercase transition-all border border-[#DFB6AE]"
                >
                  Apply Name
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
