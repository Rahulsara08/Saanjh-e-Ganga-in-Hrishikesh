import React, { useState, useEffect } from 'react';
import { defaultWeddingConfig } from './data/weddingConfig';
import { WeddingConfig } from './types';
import { PhoneMockup } from './components/PhoneMockup';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Intro } from './components/Intro';
import { OurStory } from './components/OurStory';
import { WithOurFamilies } from './components/WithOurFamilies';
import { NearbySights } from './components/NearbySights';
import { FollowJourney } from './components/FollowJourney';
import { WishingWall } from './components/WishingWall';
import { RSVPSection } from './components/RSVPSection';
import { TravelStay } from './components/TravelStay';
import { HelpingDesk } from './components/HelpingDesk';
import { Footer } from './components/Footer';
import { Divider } from './components/BasicComponents';

const CONFIG_STORAGE_KEY = 'meher_kabir_rishikesh_wedding_v9';

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
  const [introDone, setIntroDone] = useState<boolean>(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      return params.has('skipintro');
    } catch {
      return false;
    }
  });
  const [revealed, setRevealed] = useState<boolean>(introDone);

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
    <PhoneMockup
      config={config}
      overlay={
        !introDone && (
          <Intro
            brideName={config.couple.brideName}
            groomName={config.couple.groomName}
            guestName={guestParam}
            onEnter={() => setRevealed(true)}
            onDone={() => setIntroDone(true)}
          />
        )
      }
    >
      <div className="min-h-full w-full text-[#4A4038] font-sans antialiased selection:bg-[#F1D9D6] relative overflow-x-hidden">
        {/* Main Wedding Invitation Stream */}
        <main className="w-full max-w-full min-w-0 flex flex-col items-center overflow-x-hidden">
          {/* 1. Hero */}
          <section id="hero" className="w-full">
            <Hero config={config} guestGreeting={guestGreeting} revealed={revealed} />
          </section>

          {/* Transition Divider: Creative Ganga Wave & Sacred Lotus */}
          <Divider className="my-2 sm:my-4" />

          {/* 2. Our Story */}
          <OurStory config={config} />

          {/* 3. With Our Families */}
          <WithOurFamilies config={config} />

          {/* 4. Wedding Celebrations & Sacred Rites */}
          <FollowJourney config={config} />

          {/* 5. Sightseeing & Valley Exploration (Between Celebrations and Blessings) */}
          <NearbySights />

          {/* 6. Blessings Section */}
          <WishingWall config={config} />

          {/* 7. RSVP Section */}
          <RSVPSection config={config} />

          {/* 8. Travel & Stay */}
          <TravelStay config={config} />

          {/* 9. Helping Desk & Guest Concierge (Between Travel/Stay and Thank You Note) */}
          <HelpingDesk />

          {/* 10. Footer (Thank You Note) */}
          <Footer />
        </main>
      </div>
    </PhoneMockup>
  );
}
