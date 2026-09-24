import React from 'react';
import { SectionEyebrow, SectionHeading, Divider } from './BasicComponents';
import { RevealOnScroll } from './RevealOnScroll';
import { Navigation, ExternalLink } from 'lucide-react';

import triveniImg from '../assets/images/triveni_ghat_aarti_rishikesh_1790244353114.jpg';
import ramJhulaImg from '../assets/images/ram_jhula_suspension_bridge_1790244371749.jpg';
import neerGarhImg from '../assets/images/neer_garh_waterfall_rishikesh_1790244391014.jpg';
import beatlesImg from '../assets/images/beatles_ashram_rishikesh_1790244403526.jpg';

interface Sight {
  title: string;
  image: string;
  query: string;
}

export const NearbySights: React.FC = () => {
  const sights: Sight[] = [
    {
      title: 'Triveni Ghat Evening Aarti',
      image: triveniImg,
      query: 'Triveni Ghat Rishikesh Evening Aarti',
    },
    {
      title: 'Ram Jhula & Swarg Ashram',
      image: ramJhulaImg,
      query: 'Ram Jhula Rishikesh Uttarakhand',
    },
    {
      title: 'Neer Garh Waterfall Trek',
      image: neerGarhImg,
      query: 'Neer Garh Waterfall Rishikesh',
    },
    {
      title: 'The Beatles Ashram',
      image: beatlesImg,
      query: 'Beatles Ashram Chaurasi Kutia Rishikesh',
    },
  ];

  const handleOpenGoogleDirections = (query: string) => {
    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <section id="nearby-sights" className="py-20 px-4 max-w-5xl mx-auto">
      <RevealOnScroll>
        <div className="text-center max-w-xl mx-auto mb-10">
          <SectionEyebrow>NEARBY EXPERIENCES</SectionEyebrow>
          <SectionHeading subtitle="Sacred spots and serene escapes across Rishikesh">
            Sights of the Sacred Valley
          </SectionHeading>
        </div>
      </RevealOnScroll>

      {/* Grid of sights: Image, title, and navigate Google button only without any text note */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {sights.map((sight, index) => (
          <RevealOnScroll key={sight.title} delay={index * 60}>
            <div className="flex flex-col rounded-3xl overflow-hidden border border-[#DFC48F]/70 bg-[#FAF6F0] shadow-xs group">
              {/* Sight Image */}
              <div className="w-full aspect-[4/3] overflow-hidden bg-[#F3EDE3]">
                <img
                  src={sight.image}
                  alt={sight.title}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                />
              </div>

              {/* Title and Navigate Google Option Only */}
              <div className="p-4 flex flex-col justify-between flex-1 space-y-3">
                <h4 className="font-serif text-lg text-[#4A4038] font-normal leading-snug">
                  {sight.title}
                </h4>

                <button
                  type="button"
                  onClick={() => handleOpenGoogleDirections(sight.query)}
                  className="inline-flex items-center justify-center space-x-1.5 w-full py-2 px-3 rounded-full bg-[#FAF6F0] hover:bg-[#F3EDE3] text-[#4A4038] text-[10px] font-sans font-medium tracking-wider uppercase transition-colors border border-[#DFC48F]"
                >
                  <Navigation size={11} className="text-[#C6A15B]" />
                  <span>Navigate with Google</span>
                  <ExternalLink size={10} className="text-[#8A7F72]" />
                </button>
              </div>
            </div>
          </RevealOnScroll>
        ))}
      </div>

      <Divider />
    </section>
  );
};
