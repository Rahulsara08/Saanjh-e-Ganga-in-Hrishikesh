import React, { useState } from 'react';
import { X, Copy, Check, QrCode, Link2, Sparkles } from 'lucide-react';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentGuest: string;
}

export const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose, currentGuest }) => {
  const [guestName, setGuestName] = useState(currentGuest || '');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const baseUrl = window.location.origin + window.location.pathname;
  const personalizedUrl = guestName.trim()
    ? `${baseUrl}?guest=${encodeURIComponent(guestName.trim())}`
    : baseUrl;

  const handleCopy = () => {
    navigator.clipboard.writeText(personalizedUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  // QR code SVG generator (simplified matrix or visual QR with couples' initials)
  const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(
    personalizedUrl
  )}&bgcolor=FAF6F0&color=4A4038`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#4A4038]/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#FAF6F0] w-full max-w-md rounded-3xl border border-[#DFC48F] shadow-2xl overflow-hidden relative">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#DFC48F]/40 bg-[#F3EDE3] flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Sparkles className="text-[#C6A15B]" size={18} />
            <h3 className="font-serif text-xl text-[#4A4038] font-normal">
              Personalized Guest Invitation
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-[#FAF6F0] text-[#8A7F72] hover:text-[#4A4038] transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          <p className="text-xs text-[#8A7F72] leading-relaxed">
            Enter your guests' names to create a personalized invitation link with a custom greeting banner (e.g. <span className="font-serif italic text-[#C6A15B]">DEAR ROHAN & ANANYA</span>).
          </p>

          <div>
            <label className="block text-[11px] font-sans tracking-wider uppercase text-[#8A7F72] mb-1.5 font-medium">
              Guest / Family Name
            </label>
            <input
              type="text"
              value={guestName}
              onChange={(e) => setGuestName(e.target.value)}
              placeholder="e.g. Rohan & Ananya / The Kapoor Family"
              className="w-full bg-white border border-[#DFC48F]/60 rounded-xl px-4 py-2.5 text-sm text-[#4A4038] focus:outline-none focus:border-[#C6A15B]"
            />
          </div>

          {/* Generated URL Box */}
          <div className="bg-[#F3EDE3]/70 p-3 rounded-xl border border-[#DFC48F]/50 flex items-center justify-between gap-2">
            <div className="flex items-center space-x-2 truncate">
              <Link2 size={14} className="text-[#C6A15B] shrink-0" />
              <span className="text-xs text-[#4A4038] truncate font-mono">
                {personalizedUrl}
              </span>
            </div>
            <button
              onClick={handleCopy}
              className="px-3 py-1.5 rounded-lg bg-[#F1D9D6] hover:bg-[#E3B9B4] text-[#4A4038] text-xs font-medium shrink-0 transition-colors flex items-center space-x-1"
            >
              {copied ? (
                <>
                  <Check size={12} className="text-emerald-700" />
                  <span>Copied</span>
                </>
              ) : (
                <>
                  <Copy size={12} />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>

          {/* QR Code Preview */}
          <div className="text-center pt-2">
            <p className="text-[10px] tracking-widest uppercase text-[#8A7F72] mb-3 flex items-center justify-center space-x-1">
              <QrCode size={13} className="text-[#C6A15B]" />
              <span>QR Code for Physical Card / Print</span>
            </p>
            <div className="inline-block p-3 rounded-2xl bg-[#FAF6F0] border border-[#DFC48F]/60 shadow-xs">
              <img
                src={qrApiUrl}
                alt="Invitation QR code"
                className="w-36 h-36 mx-auto rounded-lg"
                onError={(e) => {
                  // Fallback if offline
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-[#DFC48F]/40 bg-[#F3EDE3] flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-1.5 rounded-full bg-[#FAF6F0] hover:bg-white text-xs font-sans uppercase tracking-wider text-[#8A7F72] border border-[#DFC48F]"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
