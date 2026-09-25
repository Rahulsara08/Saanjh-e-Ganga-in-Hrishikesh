import React, { useState, useEffect } from 'react';
import { defaultWeddingConfig } from './data/weddingConfig';
import { WeddingConfig } from './types';
import { PhoneMockup } from './components/PhoneMockup';
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
import { Divider } from './components/BasicComponents';

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
    <PhoneMockup config={config}>
      <div className="min-h-full w-full text-[#4A4038] font-sans antialiased selection:bg-[#F1D9D6] relative overflow-x-hidden">
        {/* Sticky Top Navigation */}
        <Navbar config={config} />

        {/* Main Wedding Invitation Stream */}
        <main className="w-full max-w-full min-w-0 flex flex-col items-center overflow-x-hidden">
          {/* 1. Hero */}
          <section id="hero" className="w-full">
            <Hero config={config} guestGreeting={guestGreeting} />
          </section>

          {/* Transition Divider: Creative Ganga Wave & Sacred Lotus */}
          <Divider className="my-4 sm:my-8" />

          {/* 2. Our Story */}
          <OurStory config={config} />

          {/* 3. With Our Families */}
          <WithOurFamilies config={config} />

          {/* 4. Nearby Sights */}
          <NearbySights />

          {/* 5. Wedding Celebrations & Sacred Rites */}
          <FollowJourney config={config} />

          {/* 6. Blessings Section */}
          <WishingWall config={config} />

          {/* 7. RSVP Section */}
          <RSVPSection config={config} />

          {/* 8. Travel & Stay */}
          <TravelStay config={config} />

          {/* 9. Footer */}
          <Footer />
        </main>
      </div>
    </PhoneMockup>
  );
}
