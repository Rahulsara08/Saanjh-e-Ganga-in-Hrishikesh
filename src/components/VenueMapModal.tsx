import React from 'react';
import { WeddingConfig } from '../types';
import { X, ExternalLink, MapPin, Compass, Navigation } from 'lucide-react';

interface VenueMapModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: WeddingConfig;
}

export const VenueMapModal: React.FC<VenueMapModalProps> = ({ isOpen, onClose, config }) => {
  if (!isOpen) return null;

  const { venueMap } = config.travel;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#382E27]/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#FAF6F0] w-full max-w-2xl rounded-3xl border border-[#DFC48F] shadow-2xl overflow-hidden relative">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#DFC48F]/40 flex items-center justify-between bg-[#FDFBF7]">
          <div className="flex items-center space-x-2">
            <Compass className="text-[#B88E4C]" size={18} />
            <h3 className="font-serif text-xl text-[#382E27]">Sacred Sanctuary & Ghat Location</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-[#FAF6F0] text-[#8A7F72] hover:text-[#382E27] transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {/* Venue Image Banner */}
          <div className="relative rounded-2xl overflow-hidden border border-[#DFC48F]/50 aspect-[16/9] shadow-inner">
            <img
              src={venueMap.photoUrl}
              alt="Anand Kashi Rishikesh"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#2D241D]/80 via-transparent to-transparent flex items-end p-4">
              <div className="text-white">
                <p className="font-serif text-2xl font-light">{config.couple.venueName}</p>
                <p className="text-xs text-[#FAF6F0]/90 tracking-widest uppercase">
                  Banks of River Ganga · Rishikesh, Uttarakhand
                </p>
              </div>
            </div>
          </div>

          {/* Coordinates & Location info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="bg-[#FDFBF7] p-3.5 rounded-xl border border-[#DFC48F]/50">
              <span className="text-[9px] tracking-[0.25em] uppercase text-[#B88E4C] font-semibold block mb-1">
                GPS COORDINATES
              </span>
              <p className="font-mono text-xs text-[#382E27] font-medium">
                {venueMap.coordinates}
              </p>
            </div>

            <div className="bg-[#FDFBF7] p-3.5 rounded-xl border border-[#DFC48F]/50">
              <span className="text-[9px] tracking-[0.25em] uppercase text-[#B88E4C] font-semibold block mb-1">
                RIVERSIDE GHAT ENTRY
              </span>
              <p className="text-xs text-[#4A4038]">
                Badrinath Road Sanctuary Gates with private riverside access
              </p>
            </div>
          </div>

          <div className="bg-[#FAF6F0] p-3.5 rounded-xl border border-[#DFC48F]/30 text-xs text-[#8A7F72] space-y-1.5">
            <div className="flex items-start space-x-2">
              <MapPin size={14} className="text-[#B88E4C] shrink-0 mt-0.5" />
              <span>{venueMap.address}</span>
            </div>
            <div className="flex items-start space-x-2">
              <Navigation size={14} className="text-[#B88E4C] shrink-0 mt-0.5" />
              <span>
                Dedicated wedding guest chauffeurs will be stationed at Dehradun Jolly Grant Airport and Haridwar Junction.
              </span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-2">
            <button
              onClick={onClose}
              className="w-full sm:w-auto px-5 py-2 rounded-full border border-[#DFC48F] text-xs font-sans tracking-wider uppercase text-[#8A7F72] hover:bg-[#F3EDE3]"
            >
              Close
            </button>
            <a
              href={venueMap.googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-6 py-2 rounded-full bg-[#EED8D3] hover:bg-[#E3C4BE] text-[#382E27] text-xs font-semibold tracking-wider uppercase transition-all flex items-center justify-center space-x-1.5 border border-[#DFB6AE]"
            >
              <span>Open in Google Maps</span>
              <ExternalLink size={13} />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
