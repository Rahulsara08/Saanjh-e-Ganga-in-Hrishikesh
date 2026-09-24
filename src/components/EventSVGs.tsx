import React from 'react';

interface EventSVGProps {
  className?: string;
  size?: number;
}

/**
 * Haldi Ceremony SVG: Brass Urli bowl, marigolds, turmeric ubtan, and glowing sunlight
 */
export const HaldiSVG: React.FC<EventSVGProps> = ({ className = '', size = 160 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 200 200"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`select-none ${className}`}
  >
    {/* Radiant golden sun aura */}
    <circle cx="100" cy="85" r="42" fill="#FDF3CE" fillOpacity="0.8" />
    <circle cx="100" cy="85" r="30" fill="#FBE69B" fillOpacity="0.5" />

    {/* Sun rays */}
    <path d="M100 30 L100 38 M100 132 L100 140 M45 85 L53 85 M147 85 L155 85" stroke="#E5A93B" strokeWidth="1.2" strokeLinecap="round" />
    <path d="M60 45 L66 51 M134 119 L140 125 M60 125 L66 119 M134 51 L140 45" stroke="#DFC48F" strokeWidth="1" strokeLinecap="round" strokeDasharray="2 2" />

    {/* Brass Urli Vessel */}
    <g transform="translate(100, 125)">
      {/* Brass Urli Rim & Body */}
      <ellipse cx="0" cy="5" rx="55" ry="18" fill="#F4DC96" stroke="#B88E4C" strokeWidth="1.8" />
      <path d="M-55 5 C-55 24 55 24 55 5 Z" fill="#E8C472" stroke="#B88E4C" strokeWidth="1.8" />
      {/* Rose & Turmeric Water Surface */}
      <ellipse cx="0" cy="4" rx="46" ry="12" fill="#FFE885" />

      {/* Floating Orange & Yellow Marigold blossoms */}
      <circle cx="-25" cy="4" r="5.5" fill="#E88F35" />
      <circle cx="-12" cy="1" r="5" fill="#F4B251" />
      <circle cx="0" cy="5" r="6" fill="#DE6B35" />
      <circle cx="14" cy="2" r="5" fill="#F4B251" />
      <circle cx="28" cy="4" r="5.5" fill="#E88F35" />

      {/* Urli Handles */}
      <path d="M-55 4 C-63 -1 -63 12 -55 8" stroke="#B88E4C" strokeWidth="2" strokeLinecap="round" fill="none" />
      <path d="M55 4 C63 -1 63 12 55 8" stroke="#B88E4C" strokeWidth="2" strokeLinecap="round" fill="none" />
    </g>

    {/* Small katori with haldi paste */}
    <path d="M92 78 C92 72 108 72 108 78 Z" fill="#D3962F" stroke="#9A6B1A" strokeWidth="1" />
    <circle cx="100" cy="74" r="2.5" fill="#F8C146" />
  </svg>
);

/**
 * Mehndi Ceremony SVG: Intimate henna cone, intricate mandala patterns, and floral vines
 */
export const MehndiSVG: React.FC<EventSVGProps> = ({ className = '', size = 160 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 200 200"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`select-none ${className}`}
  >
    {/* Soft floral mandala aura */}
    <circle cx="100" cy="95" r="48" stroke="#DFC48F" strokeWidth="1" strokeDasharray="3 3" fill="#FAF6F0" fillOpacity="0.8" />
    <circle cx="100" cy="95" r="32" stroke="#8E9B85" strokeWidth="0.8" strokeDasharray="2 2" />

    {/* Mandala Petals */}
    <g transform="translate(100, 95)">
      {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
        <path
          key={angle}
          d="M0 -30 C-6 -22 -4 -12 0 0 C4 -12 6 -22 0 -30 Z"
          fill="#EAE2D5"
          stroke="#7A6854"
          strokeWidth="0.8"
          transform={`rotate(${angle})`}
        />
      ))}
      <circle cx="0" cy="0" r="10" fill="#D9C2A7" stroke="#7A6854" strokeWidth="1" />
      <circle cx="0" cy="0" r="4" fill="#604938" />
    </g>

    {/* Henna cone */}
    <g transform="translate(138, 52) rotate(35)">
      <polygon points="0,0 12,-45 -12,-45" fill="#4E6746" stroke="#2F4229" strokeWidth="1" />
      <path d="M0 0 L-2 8" stroke="#3D2E24" strokeWidth="1.2" strokeLinecap="round" />
      {/* Decorative cone band */}
      <rect x="-10" y="-35" width="20" height="5" fill="#C6A15B" />
    </g>

    {/* Delicate paisley flourishes */}
    <path d="M42 138 C42 120 60 120 62 135 C64 146 54 154 42 148" stroke="#7A6854" strokeWidth="1" fill="none" />
    <path d="M158 138 C158 120 140 120 138 135 C136 146 146 154 158 148" stroke="#7A6854" strokeWidth="1" fill="none" />
  </svg>
);

/**
 * Sangeet Celebration SVG: Dholak drums, ghungroo bells, musical notes, and fairy light canopies
 */
export const SangeetSVG: React.FC<EventSVGProps> = ({ className = '', size = 160 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 200 200"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`select-none ${className}`}
  >
    {/* Sparkling festive starry backdrop */}
    <circle cx="55" cy="45" r="2" fill="#E8A63A" />
    <circle cx="145" cy="40" r="2.5" fill="#E8A63A" />
    <circle cx="95" cy="28" r="1.8" fill="#C6A15B" />
    <circle cx="165" cy="80" r="1.5" fill="#DFC48F" />

    {/* Fairy Light Swags */}
    <path d="M25 40 Q62 55 100 45 Q138 55 175 40" stroke="#DFC48F" strokeWidth="1" fill="none" strokeDasharray="2 3" />
    <circle cx="62" cy="50" r="2.5" fill="#FFC966" />
    <circle cx="100" cy="45" r="3" fill="#FFB74D" />
    <circle cx="138" cy="50" r="2.5" fill="#FFC966" />

    {/* Traditional Indian Dholak Drum */}
    <g transform="translate(100, 110)">
      {/* Drum Barrel */}
      <path
        d="M-45 -18 C-15 -28 15 -28 45 -18 L45 18 C15 28 -15 28 -45 18 Z"
        fill="#9C5A37"
        stroke="#4A2616"
        strokeWidth="1.6"
      />
      {/* Left Drumhead */}
      <ellipse cx="-45" cy="0" rx="8" ry="18" fill="#EAD9C6" stroke="#4A2616" strokeWidth="1.4" />
      <circle cx="-45" cy="0" r="4" fill="#3D2E24" />
      {/* Right Drumhead */}
      <ellipse cx="45" cy="0" rx="8" ry="18" fill="#EAD9C6" stroke="#4A2616" strokeWidth="1.4" />
      <circle cx="45" cy="0" r="5" fill="#3D2E24" />
      {/* Drum Tuning Ropes (V-lacing) */}
      <path
        d="M-38 -20 L-22 23 L-6 -23 L10 23 L26 -23 L38 20"
        stroke="#F5E8C7"
        strokeWidth="1.2"
        fill="none"
        strokeLinecap="round"
      />
      {/* Brass Tuning Rings */}
      <circle cx="-22" cy="10" r="2" fill="#E5A93B" />
      <circle cx="10" cy="10" r="2" fill="#E5A93B" />
    </g>

    {/* Ghungroo anklet bells */}
    <path d="M45 155 Q100 170 155 155" stroke="#C6A15B" strokeWidth="1.2" fill="none" />
    {[-35, -18, 0, 18, 35].map((offset, i) => (
      <circle key={i} cx={100 + offset} cy={162 - Math.abs(offset) * 0.15} r="3" fill="#E5A93B" stroke="#8E6922" strokeWidth="0.8" />
    ))}

    {/* Melodic Swirls */}
    <path d="M40 85 Q50 70 65 78" stroke="#C6A15B" strokeWidth="1" fill="none" strokeLinecap="round" />
    <path d="M140 75 Q155 70 162 85" stroke="#C6A15B" strokeWidth="1" fill="none" strokeLinecap="round" />
  </svg>
);

/**
 * Barat Procession SVG: Royal Safa turban, decorative wedding sword, and festive dhol procession
 */
export const BaratSVG: React.FC<EventSVGProps> = ({ className = '', size = 160 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 200 200"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`select-none ${className}`}
  >
    {/* Festive halo backdrop */}
    <circle cx="100" cy="95" r="50" fill="#FCEFEA" stroke="#E3B9B4" strokeWidth="1" strokeDasharray="3 3" />

    {/* Royal Groom Safa / Pagri Turban */}
    <g transform="translate(100, 78)">
      {/* Turban folds */}
      <path
        d="M-30 0 C-30 -18 30 -18 30 0 C30 10 -30 10 -30 0 Z"
        fill="#DE6B35"
        stroke="#9B3B12"
        strokeWidth="1.4"
      />
      <path
        d="M-28 -4 C-10 -22 25 -15 28 -4"
        stroke="#F4B251"
        strokeWidth="2"
        fill="none"
      />
      <path
        d="M-25 -8 C-5 -26 22 -19 25 -8"
        stroke="#E88F35"
        strokeWidth="1.8"
        fill="none"
      />
      {/* Royal Kalgi (Feather Crest) */}
      <path
        d="M-5 -18 C-12 -38 4 -42 0 -18 Z"
        fill="#FAF6F0"
        stroke="#B88E4C"
        strokeWidth="1"
      />
      {/* Ruby Jewel Brooch on Turban */}
      <ellipse cx="-2" cy="-17" rx="3.5" ry="4.5" fill="#B32B27" stroke="#DFC48F" strokeWidth="1" />
      <circle cx="-2" cy="-17" r="1.5" fill="#FFC966" />
      {/* Flowing Safa tail */}
      <path
        d="M26 4 C32 15 28 32 32 45 C30 46 25 45 24 38 C22 28 24 16 22 6 Z"
        fill="#DE6B35"
        stroke="#9B3B12"
        strokeWidth="1"
      />
    </g>

    {/* Royal Talwar (Groom Ceremonial Sword) */}
    <g transform="translate(100, 138) rotate(-22)">
      {/* Scabbard / Sheath */}
      <rect x="-42" y="-3" width="84" height="6" rx="2" fill="#8B2623" stroke="#B88E4C" strokeWidth="1" />
      {/* Gold Hilts and Accents */}
      <rect x="-44" y="-5" width="8" height="10" rx="1.5" fill="#E5A93B" stroke="#7A5615" strokeWidth="0.8" />
      <rect x="36" y="-5" width="8" height="10" rx="1.5" fill="#E5A93B" stroke="#7A5615" strokeWidth="0.8" />
      {/* Ornate Gold tassel */}
      <path d="M-40 4 Q-35 15 -32 24" stroke="#E5A93B" strokeWidth="1.2" fill="none" />
      <circle cx="-32" cy="25" r="2" fill="#E5A93B" />
    </g>

    {/* Festive confetti & petal shower */}
    <circle cx="55" cy="50" r="2" fill="#E88F35" />
    <circle cx="140" cy="48" r="2.5" fill="#F4B251" />
    <circle cx="68" cy="120" r="2" fill="#B32B27" />
    <circle cx="135" cy="125" r="2" fill="#E88F35" />
  </svg>
);

/**
 * 7 Farre / Saat Phere Sacred Vedic Vows SVG: Vedic Havan Agni Kund, Sacred Knot (Gathbandhan), Holy Ganges
 */
export const SaatPhereSVG: React.FC<EventSVGProps> = ({ className = '', size = 160 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 200 200"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`select-none ${className}`}
  >
    {/* 7 Sacred Circles / Farre Orbital Paths */}
    {[60, 52, 44, 36, 28, 20, 12].map((r, i) => (
      <circle
        key={i}
        cx="100"
        cy="96"
        r={r}
        stroke={i === 0 ? '#C6A15B' : '#EAD9C6'}
        strokeWidth={i === 0 ? 1.2 : 0.7}
        strokeDasharray={i % 2 === 0 ? '4 3' : '2 2'}
        fill="none"
      />
    ))}

    {/* Sacred Gathbandhan Knot (Draped Wedding Stoles Intertwined) */}
    <path
      d="M58 55 C70 42 85 58 100 52 C115 46 130 62 142 55"
      stroke="#B32B27"
      strokeWidth="2"
      fill="none"
      strokeLinecap="round"
    />
    <path
      d="M58 58 C70 45 85 61 100 55 C115 49 130 65 142 58"
      stroke="#FAF6F0"
      strokeWidth="1.2"
      fill="none"
      strokeLinecap="round"
    />
    <circle cx="100" cy="53" r="3" fill="#E5A93B" stroke="#B32B27" strokeWidth="1" />

    {/* Sacred Havan Kund (Agni Pit) */}
    <g transform="translate(100, 120)">
      {/* Stepped Copper Kunda */}
      <polygon points="-28,12 28,12 22,24 -22,24" fill="#C47E5A" stroke="#6F361E" strokeWidth="1.4" />
      <polygon points="-34,4 34,4 28,12 -28,12" fill="#D99B77" stroke="#6F361E" strokeWidth="1.2" />

      {/* Holy Vedic Fire Flames (Agni Devta) */}
      <path d="M0 -4 C-6 -14 -6 -24 0 -32 C6 -24 6 -14 0 -4 Z" fill="#FF9A3C" stroke="#E67E22" strokeWidth="1" />
      <path d="M-4 -4 C-8 -12 -7 -18 -3 -24 C-1 -18 -1 -10 -4 -4 Z" fill="#FFC966" />
      <path d="M4 -4 C8 -12 7 -18 3 -24 C1 -18 1 -10 4 -4 Z" fill="#FFC966" />
      <circle cx="0" cy="-14" r="3" fill="#FFF2D6" />
    </g>

    {/* Sacred Ganga Wave Ripples */}
    <path d="M30 168 C65 162 95 172 130 166 C155 162 170 167 185 165" stroke="#DFC48F" strokeWidth="1.2" strokeLinecap="round" />
    <path d="M45 176 C75 172 105 178 135 174 C155 171 165 175 175 174" stroke="#C6A15B" strokeWidth="0.8" strokeDasharray="3 3" />
  </svg>
);

/**
 * 01 / Sandhya Aarti & Welcome: Sacred Ganga Ghat, Himalayan mountain hairlines, and floating brass diya
 */
export const SundownerSVG: React.FC<EventSVGProps> = ({ className = '', size = 160 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 200 200"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`select-none ${className}`}
  >
    {/* Soft twilight sun setting over peaks */}
    <circle cx="100" cy="85" r="30" fill="#F4DFD8" fillOpacity="0.7" />
    <circle cx="100" cy="85" r="22" fill="#E8CDB0" fillOpacity="0.4" />

    {/* Distant Himalayan peaks hairline */}
    <path
      d="M20 120 L50 85 L85 105 L115 75 L150 102 L180 88"
      stroke="#DFC48F"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeDasharray="2 2"
    />

    {/* Temple Shikhar silhouette on riverbank */}
    <path
      d="M38 128 L38 108 Q45 92 52 108 L52 128"
      stroke="#C6A15B"
      strokeWidth="1.2"
      fill="#FAF6F0"
    />
    <path d="M45 92 L45 84" stroke="#C6A15B" strokeWidth="1" />
    <circle cx="45" cy="83" r="1.5" fill="#C6A15B" />

    {/* River Ganga Sacred Water ripples */}
    <path d="M15 142 C45 138 75 145 105 140 C135 135 165 143 185 140" stroke="#DFC48F" strokeWidth="1.2" strokeLinecap="round" />
    <path d="M30 152 C60 148 90 154 120 150 C150 146 170 152 180 150" stroke="#C6A15B" strokeWidth="0.8" strokeDasharray="3 3" />
    <path d="M45 162 C75 159 105 163 135 160 C155 158 165 161 175 160" stroke="#DFC48F" strokeWidth="0.8" />

    {/* Floating Brass Diya with Marigold on holy water */}
    <g transform="translate(100, 140) scale(1.1)">
      {/* Diya leaf base */}
      <path d="M-18 4 C-10 8 10 8 18 4 C14 10 -14 10 -18 4 Z" fill="#DDE4D8" stroke="#8E9B85" strokeWidth="0.8" />
      {/* Brass cup */}
      <path d="M-12 2 C-12 7 12 7 12 2 L8 -1 C0 0 0 0 -8 -1 Z" fill="#F8E5BA" stroke="#C6A15B" strokeWidth="1" />
      {/* Marigold dots */}
      <circle cx="-10" cy="0" r="1.8" fill="#E88F35" />
      <circle cx="-5" cy="1" r="1.8" fill="#E8B042" />
      <circle cx="5" cy="1" r="1.8" fill="#E8B042" />
      <circle cx="10" cy="0" r="1.8" fill="#E88F35" />
      {/* Flame */}
      <path d="M0 -3 C-3 -9 -3 -14 0 -18 C3 -14 3 -9 0 -3 Z" fill="#FFAF40" stroke="#E67E22" strokeWidth="0.8" />
      <path d="M0 -6 C-1.5 -10 -1.5 -13 0 -15 C1.5 -13 1.5 -10 0 -6 Z" fill="#FFF2D6" />
    </g>

    {/* Evening stars */}
    <circle cx="150" cy="55" r="1.5" fill="#C6A15B" />
    <circle cx="168" cy="70" r="1" fill="#DFC48F" />
  </svg>
);

/**
 * 02 / Sacred Pheras Ceremony: Riverside Mandap on Ganga with Agni Kunda and marigolds
 */
export const CeremonySVG: React.FC<EventSVGProps> = ({ className = '', size = 160 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 200 200"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`select-none ${className}`}
  >
    {/* Soft spiritual aura */}
    <circle cx="100" cy="95" r="54" stroke="#F1D9D6" strokeWidth="1.2" strokeDasharray="3 4" fill="#FAF6F0" fillOpacity="0.7" />

    {/* Mandap pillars */}
    <line x1="52" y1="65" x2="52" y2="148" stroke="#4A4038" strokeWidth="1.4" />
    <line x1="148" y1="65" x2="148" y2="148" stroke="#4A4038" strokeWidth="1.4" />
    <rect x="47" y="146" width="10" height="4" rx="1" fill="#DFC48F" stroke="#4A4038" strokeWidth="1" />
    <rect x="143" y="146" width="10" height="4" rx="1" fill="#DFC48F" stroke="#4A4038" strokeWidth="1" />

    {/* Mandap Arch */}
    <path
      d="M48 65 C48 35 100 24 100 24 C100 24 152 35 152 65"
      stroke="#4A4038"
      strokeWidth="1.6"
      fill="none"
      strokeLinecap="round"
    />
    <path
      d="M58 65 C58 42 100 34 100 34 C100 34 142 42 142 65"
      stroke="#C6A15B"
      strokeWidth="0.9"
      fill="none"
    />

    {/* Sacred Kalash at top */}
    <path d="M97 24 C97 18 103 18 103 24 Z" fill="#C6A15B" stroke="#4A4038" strokeWidth="1" />
    <circle cx="100" cy="15" r="2.2" fill="#C6A15B" />

    {/* Fresh Marigold Garlands draped */}
    <path d="M52 68 Q76 82 100 75 Q124 82 148 68" stroke="#E8A63A" strokeWidth="1.5" fill="none" strokeDasharray="3 3" />
    <path d="M52 74 Q76 88 100 81 Q124 88 148 74" stroke="#DFC48F" strokeWidth="1" strokeDasharray="2 3" fill="none" />

    {/* Sacred Agni Kunda (Havan Kunda) */}
    <g transform="translate(100, 136)">
      <polygon points="-16,8 16,8 12,16 -12,16" fill="#DFC48F" stroke="#4A4038" strokeWidth="1" />
      {/* Holy Fire Flame */}
      <path d="M0 6 C-4 0 -4 -8 0 -14 C4 -8 4 0 0 6 Z" fill="#FF9A3C" stroke="#E67E22" strokeWidth="0.8" />
      <path d="M-3 6 C-6 2 -5 -4 -2 -9 C0 -5 0 2 -3 6 Z" fill="#FFC966" />
      <path d="M3 6 C6 2 5 -4 2 -9 C0 -5 0 2 3 6 Z" fill="#FFC966" />
    </g>

    {/* River Ganga ripples at base */}
    <path d="M30 168 C60 164 90 170 120 166 C150 162 170 169 185 166" stroke="#DFC48F" strokeWidth="1" />
  </svg>
);

/**
 * 03 / Dinner & Starlight Feast: Candlelit lantern, Himalayan pine branches, and crescent moon
 */
export const DinnerSVG: React.FC<EventSVGProps> = ({ className = '', size = 160 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 200 200"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`select-none ${className}`}
  >
    {/* Crescent moon and stars */}
    <path
      d="M152 40 C144 43 138 52 140 62 C142 70 148 76 156 78 C144 80 132 72 130 58 C128 46 138 36 152 40 Z"
      fill="#DFC48F"
      stroke="#C6A15B"
      strokeWidth="0.8"
    />
    <circle cx="50" cy="50" r="1.5" fill="#C6A15B" />
    <circle cx="85" cy="38" r="1" fill="#DFC48F" />
    <circle cx="115" cy="52" r="1.5" fill="#C6A15B" />

    {/* Hanging mountain lantern */}
    <line x1="100" y1="20" x2="100" y2="55" stroke="#4A4038" strokeWidth="1.2" />
    <rect x="86" y="55" width="28" height="42" rx="3" fill="#FAF6F0" stroke="#4A4038" strokeWidth="1.2" />
    <polygon points="90,55 100,46 110,55" fill="#DFC48F" stroke="#4A4038" strokeWidth="1" />
    {/* Glass window & warm candle glow */}
    <rect x="91" y="62" width="18" height="28" rx="2" fill="#FDF4E1" stroke="#DFC48F" strokeWidth="0.8" />
    <circle cx="100" cy="76" r="4" fill="#FFC766" className="animate-pulse" />
    <path d="M100 70 C99 73 99 76 100 77 C101 76 101 73 100 70 Z" fill="#E67E22" />

    {/* Himalayan Pine needle sprigs */}
    <path d="M40 120 C55 110 75 115 90 125" stroke="#6F7C63" strokeWidth="1.2" strokeLinecap="round" />
    <path d="M50 115 L46 108 M60 113 L58 106 M72 115 L72 107 M82 119 L84 112" stroke="#8E9B85" strokeWidth="1" strokeLinecap="round" />

    {/* Banquet table */}
    <line x1="30" y1="145" x2="170" y2="145" stroke="#4A4038" strokeWidth="1.5" strokeLinecap="round" />
    <line x1="45" y1="145" x2="45" y2="175" stroke="#4A4038" strokeWidth="1.2" />
    <line x1="155" y1="145" x2="155" y2="175" stroke="#4A4038" strokeWidth="1.2" />

    {/* Brass tableware & clay kulhad */}
    <ellipse cx="100" cy="143" rx="14" ry="3" fill="#DFC48F" stroke="#C6A15B" strokeWidth="0.8" />
    <rect x="74" y="138" width="6" height="7" rx="1" fill="#C47E5A" stroke="#8A4A28" strokeWidth="0.8" />
    <rect x="120" y="138" width="6" height="7" rx="1" fill="#C47E5A" stroke="#8A4A28" strokeWidth="0.8" />
  </svg>
);

/**
 * 04 / Farewell: Himalayan morning sunrise, temple bell & morning tea
 */
export const BrunchSVG: React.FC<EventSVGProps> = ({ className = '', size = 160 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 200 200"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`select-none ${className}`}
  >
    {/* Morning mountain sun */}
    <circle cx="100" cy="70" r="28" fill="#FDF1D6" stroke="#DFC48F" strokeWidth="1" />
    {/* Sun rays */}
    <path d="M100 32 L100 38 M100 102 L100 108 M62 70 L68 70 M132 70 L138 70" stroke="#C6A15B" strokeWidth="1" strokeLinecap="round" />

    {/* Himalayan Ridge */}
    <path
      d="M20 115 L60 85 L100 105 L140 80 L180 110"
      stroke="#4A4038"
      strokeWidth="1.2"
      fill="none"
    />

    {/* Sacred Temple Bell */}
    <g transform="translate(100, 115)">
      {/* Bell chain */}
      <line x1="0" y1="-25" x2="0" y2="0" stroke="#4A4038" strokeWidth="1.2" strokeDasharray="2 2" />
      {/* Bell Body */}
      <path
        d="M-12 18 C-12 6 -6 0 0 0 C6 0 12 6 12 18 Z"
        fill="#F5E8C7"
        stroke="#C6A15B"
        strokeWidth="1.2"
      />
      <path d="M-15 18 L15 18" stroke="#C6A15B" strokeWidth="1.4" strokeLinecap="round" />
      {/* Clapper */}
      <circle cx="0" cy="22" r="2" fill="#4A4038" />
      {/* Sound waves */}
      <path d="M-18 12 C-22 15 -22 21 -18 24" stroke="#DFC48F" strokeWidth="0.8" />
      <path d="M18 12 C22 15 22 21 18 24" stroke="#DFC48F" strokeWidth="0.8" />
    </g>

    {/* Flowing Ganga wave */}
    <path d="M25 155 C55 150 85 158 115 153 C145 148 165 155 175 153" stroke="#C6A15B" strokeWidth="1" />
  </svg>
);

/**
 * MomentSVG: Bespoke handcrafted timeline icons
 */
export const MomentSVG: React.FC<{ type: string; size?: number; className?: string }> = ({
  type,
  size = 40,
  className = '',
}) => {
  switch (type) {
    case 'haldi':
      // Haldi brass urli with marigold
      return (
        <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className}>
          <ellipse cx="24" cy="30" rx="16" ry="7" fill="#F4DC96" stroke="#B88E4C" strokeWidth="1.2" />
          <ellipse cx="24" cy="28" rx="12" ry="5" fill="#FFE885" />
          <circle cx="20" cy="28" r="2.5" fill="#E88F35" />
          <circle cx="28" cy="28" r="2.5" fill="#DE6B35" />
          <circle cx="24" cy="18" r="4.5" fill="#F8C146" stroke="#C6A15B" strokeWidth="1" />
        </svg>
      );
    case 'mehndi':
      // Henna cone & delicate floral motif
      return (
        <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className}>
          <circle cx="24" cy="24" r="15" stroke="#C6A15B" strokeWidth="1" strokeDasharray="2 2" fill="#FAF6F0" />
          <circle cx="24" cy="24" r="5" fill="#7A6854" />
          <polygon points="34,14 42,6 38,6" fill="#4E6746" stroke="#2F4229" strokeWidth="0.8" />
          <path d="M18 24 Q24 16 30 24" stroke="#8E9B85" strokeWidth="1" fill="none" />
        </svg>
      );
    case 'sangeet':
      // Dholak drum & musical resonance
      return (
        <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className}>
          <rect x="12" y="18" width="24" height="14" rx="4" fill="#9C5A37" stroke="#4A2616" strokeWidth="1.2" />
          <ellipse cx="12" cy="25" rx="3" ry="7" fill="#EAD9C6" stroke="#4A2616" strokeWidth="1" />
          <ellipse cx="36" cy="25" rx="3" ry="7" fill="#EAD9C6" stroke="#4A2616" strokeWidth="1" />
          <path d="M16 19 L24 31 L32 19" stroke="#F5E8C7" strokeWidth="0.9" fill="none" />
          <circle cx="24" cy="11" r="2" fill="#E5A93B" />
        </svg>
      );
    case 'barat':
      // Groom Royal Turban & Kalgi
      return (
        <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className}>
          <circle cx="24" cy="24" r="16" stroke="#C6A15B" strokeWidth="1" fill="#FAF6F0" />
          <path d="M15 26 C15 18 33 18 33 26 Z" fill="#DE6B35" stroke="#9B3B12" strokeWidth="1.2" />
          <path d="M24 18 C22 10 26 10 24 18" stroke="#B88E4C" strokeWidth="1.4" strokeLinecap="round" />
          <circle cx="24" cy="19" r="1.5" fill="#B32B27" />
          <path d="M31 26 C34 32 32 36 34 38" stroke="#DE6B35" strokeWidth="1.4" strokeLinecap="round" />
        </svg>
      );
    case 'ceremony':
      // 7 Farre / Saat Phere Sacred Agni
      return (
        <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className}>
          <polygon points="12,32 36,32 32,38 16,38" fill="#F3EDE3" stroke="#C6A15B" strokeWidth="1.2" />
          <path d="M24 10 C21 17 19 22 24 28 C29 22 27 17 24 10 Z" fill="#FFA534" stroke="#E67E22" strokeWidth="1" />
          <path d="M24 16 C22 20 22 23 24 26 C26 23 26 20 24 16 Z" fill="#FFF2D6" />
          {/* 7 subtle sacred knot dots */}
          <circle cx="16" cy="14" r="1" fill="#C6A15B" />
          <circle cx="32" cy="14" r="1" fill="#C6A15B" />
        </svg>
      );
    case 'arrival':
      // Auspicious chandan teeka thali with marigold
      return (
        <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className}>
          <circle cx="24" cy="24" r="18" stroke="#C6A15B" strokeWidth="1.2" fill="#FAF6F0" />
          <circle cx="24" cy="24" r="14" stroke="#DFC48F" strokeWidth="0.8" strokeDasharray="2 2" />
          <circle cx="20" cy="20" r="3.5" fill="#E8B042" />
          <circle cx="28" cy="20" r="3.5" fill="#D35400" />
          <circle cx="24" cy="28" r="3" fill="#C6A15B" />
        </svg>
      );
    case 'dinner':
      return (
        <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className}>
          <circle cx="24" cy="24" r="16" stroke="#C6A15B" strokeWidth="1.2" fill="#FAF6F0" />
          <circle cx="24" cy="24" r="12" stroke="#DFC48F" strokeWidth="0.8" />
          <circle cx="20" cy="20" r="2.5" fill="#E8CDB0" />
          <circle cx="28" cy="20" r="2.5" fill="#E8CDB0" />
          <circle cx="24" cy="28" r="2.5" fill="#E8CDB0" />
        </svg>
      );
    case 'midnight':
      return (
        <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className}>
          <path d="M18 20 L30 20 L28 36 L20 36 Z" fill="#DDBAA2" stroke="#8A4A28" strokeWidth="1.2" />
          <path d="M22 16 C22 12 26 12 26 8" stroke="#DFC48F" strokeWidth="1" strokeLinecap="round" />
          <line x1="16" y1="38" x2="32" y2="38" stroke="#4A4038" strokeWidth="1.2" strokeLinecap="round" />
        </svg>
      );
    default:
      return null;
  }
};
