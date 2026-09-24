import React from 'react';
import { SectionEyebrow, SectionHeading, Divider } from './BasicComponents';
import { RevealOnScroll } from './RevealOnScroll';
import { Sparkles, Camera } from 'lucide-react';

import sunsetGanga from '../assets/images/rishikesh_ganga_sunset_serenity_1790240916023.jpg';
import aartiImg from '../assets/images/rishikesh_ganga_aarti_wedding_1790240746434.jpg';
import haldiImg from '../assets/images/rishikesh_haldi_ceremony_1790240673486.jpg';
import mehndiImg from '../assets/images/rishikesh_mehndi_evening_1790240685474.jpg';
import sangeetImg from '../assets/images/rishikesh_sangeet_night_1790240698617.jpg';
import baratImg from '../assets/images/rishikesh_baraat_procession_1790240715482.jpg';
import saatPhereImg from '../assets/images/rishikesh_saat_phere_vows_1790240732445.jpg';

interface GalleryItem {
  src: string;
  title: string;
  tag: string;
  caption: string;
  span?: string;
}

export const RishikeshGallery: React.FC = () => {
  const photos: GalleryItem[] = [
    {
      src: sunsetGanga,
      title: 'Sacred Tides at Sunset',
      tag: 'HOLY GANGA',
      caption: 'Turquoise waters flowing through the foothills of the Himalayas at twilight.',
      span: 'md:col-span-8 md:row-span-2',
    },
    {
      src: haldiImg,
      title: 'Shubh Haldi & Phoolon Ki Holi',
      tag: 'HALDI',
      caption: 'Golden ubtan turmeric rituals and fresh marigold blessings on the riverfront lawn.',
      span: 'md:col-span-4',
    },
    {
      src: mehndiImg,
      title: 'Riverside Henna Gathering',
      tag: 'MEHNDI',
      caption: 'Intricate bridal mehndi under pine canopies and mountain breezes.',
      span: 'md:col-span-4',
    },
    {
      src: saatPhereImg,
      title: '7 Farre · Sacred Vedic Vows',
      tag: '7 FARRE',
      caption: 'Seven eternal rounds around the sacred Agni kund on the banks of River Ganga.',
      span: 'md:col-span-6',
    },
    {
      src: baratImg,
      title: 'Royal Barat Procession',
      tag: 'BARAT',
      caption: 'Joyous dholak beats and saffron safas descending towards the holy riverbank.',
      span: 'md:col-span-6',
    },
    {
      src: sangeetImg,
      title: 'Himalayan Sangeet Night',
      tag: 'SANGEET',
      caption: 'Fairy lights reflecting off the sacred river as music and dance echo through the valley.',
      span: 'md:col-span-6',
    },
    {
      src: aartiImg,
      title: 'Maha Ganga Aarti with 108 Diyas',
      tag: 'AARTI',
      caption: 'Chanted blessings and floating diyas illuminating the sacred waters.',
      span: 'md:col-span-6',
    },
  ];

  return (
    <section id="gallery" className="py-20 px-4 max-w-6xl mx-auto">
      <RevealOnScroll>
        <div className="text-center max-w-2xl mx-auto">
          <SectionEyebrow>SACRED VISUAL CHRONICLE</SectionEyebrow>
          <SectionHeading subtitle="Capturing the divine soul of our Rishikesh wedding rituals">
            Echoes of Rishikesh
          </SectionHeading>
        </div>
      </RevealOnScroll>

      {/* Masonry / Curated Editorial Gallery Grid */}
      <div className="mt-12 grid grid-cols-1 md:grid-cols-12 gap-5">
        {photos.map((item, idx) => (
          <RevealOnScroll
            key={idx}
            delay={idx * 70}
            className={`${item.span || 'md:col-span-4'} group`}
          >
            <div className="relative h-full min-h-[260px] sm:min-h-[300px] rounded-3xl overflow-hidden border border-[#DFC48F]/60 bg-[#FAF6F0] shadow-[0_6px_25px_-5px_rgba(74,64,56,0.08)]">
              <img
                src={item.src}
                alt={item.title}
                loading="lazy"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              />

              {/* Gradient Scrim */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#231A14]/90 via-[#231A14]/30 to-transparent opacity-90 group-hover:opacity-95 transition-opacity flex flex-col justify-end p-6">
                <div className="flex items-center space-x-2 mb-1.5">
                  <span className="px-2.5 py-0.5 rounded-full bg-[#DFC48F]/30 backdrop-blur-xs border border-[#DFC48F]/60 text-[9px] font-sans font-semibold tracking-widest text-[#FAF6F0] uppercase">
                    {item.tag}
                  </span>
                </div>
                <h4 className="font-serif text-xl sm:text-2xl text-[#FAF6F0] font-normal tracking-wide mb-1">
                  {item.title}
                </h4>
                <p className="text-xs text-[#FAF6F0]/85 font-sans font-light leading-relaxed max-w-md">
                  {item.caption}
                </p>
              </div>
            </div>
          </RevealOnScroll>
        ))}
      </div>

      <Divider />
    </section>
  );
};
