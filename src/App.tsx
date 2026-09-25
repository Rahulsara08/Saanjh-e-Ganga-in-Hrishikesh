import React, { useState, useEffect } from 'react';
import { defaultWeddingConfig } from './data/weddingConfig';
import { WeddingConfig } from './types';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { OurStory } from './components/OurStory';
import { WithOurFamilies } from './components/WithOurFamilies';
import { NearbySights } from './components/NearbySights';
import { FollowJourney } from './components/FollowJourney';
import { WishingWall } from './components/WishingWall';
import { RSVPSection } from './components/RSVPSection';
import { TravelStay } from './components/TravelStay';
import { Footer } from './components/Footer';
import { MusicPlayer } from './components/MusicPlayer';
import { Divider } from './components/BasicComponents';
import paperBg from './assets/images/paper_blush_texture.jpg';

const CONFIG_STORAGE_KEY = 'meher_kabir_rishikesh_wedding_v6';

export default function App() {
  const [config, setConfig] = useState<WeddingConfig>(() => {
    try {
      const saved = localStorage.getItem(CONFIG_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return defaultWeddingConfig;
  });

  const [guestParam, setGuestParam] = useState<string>('');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const guest = params.get('guest');
    if (guest) {
      setGuestParam(guest);
    }
  }, []);

  const guestGreeting = guestParam.trim()
    ? `DEAR ${guestParam.replace(/\+/g, ' ').toUpperCase()},`
    : 'DEAR GUEST,';

  return (
    <div
      className="min-h-screen w-full text-[#4A4038] font-sans antialiased selection:bg-[#F1D9D6] relative overflow-x-hidden"
      style={{
        backgroundImage: `url(${paperBg})`,
        backgroundRepeat: 'repeat',
        backgroundSize: '420px auto',
        backgroundColor: '#FAF2F0',
      }}
    >
      {/* Sticky Top Navigation */}
      <Navbar config={config} />

      {/* Main Wedding Invitation Stream */}
      <main className="w-full max-w-full min-w-0 flex flex-col items-center overflow-x-hidden">
        {/* 1. Hero: Background image restored, original warm ivory and gold theme, no cards */}
        <section id="hero" className="w-full">
          <Hero config={config} guestGreeting={guestGreeting} />
        </section>

        {/* Transition Divider: Creative Ganga Wave & Sacred Lotus */}
        <Divider className="my-4 sm:my-8" />

        {/* 2. Our Story: First meeting, coffee shop date, and proposal (eclectic mix, no cards) */}
        <OurStory config={config} />

        {/* 3. With Our Families: Positioned directly below Our Story section */}
        <WithOurFamilies config={config} />

        {/* 4. Nearby Sights: Triveni Ghat, Ram Jhula, etc. with image, title, and navigate Google only */}
        <NearbySights />

        {/* 5. Wedding Celebrations & Sacred Rites: Original colors restored, event numbers removed, animation removed */}
        <FollowJourney config={config} />

        {/* 6. Blessings Section: Screw animation, color circles without text names */}
        <WishingWall config={config} />

        {/* 7. RSVP Section: Pretty and clean, only accept button */}
        <RSVPSection config={config} />

        {/* 8. Travel & Stay: Static icons without airplane/train animation, original palette */}
        <TravelStay config={config} />

        {/* 9. Footer: Artisanal Thank You Note */}
        <Footer />
      </main>

      {/* Floating Wedding Song Player: Qaafirana */}
      <MusicPlayer />
    </div>
  );
}
