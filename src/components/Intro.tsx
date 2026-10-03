import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { ChevronRight } from 'lucide-react';
import { qaafiranaAudio } from '../utils/audio';
import { FallingPetals } from './FallingPetals';

export interface IntroProps {
  brideName?: string;
  groomName?: string;
  guestName?: string;
  onEnter?: () => void;
  onDone?: () => void;
}

const ENVELOPE_SRC = '/intro/envelope.jpg';
const LINING_SRC = '/intro/lining.jpg';
const SEAL_SRC = '/intro/seal.png';
const PAPER_SRC = '/intro/paper.jpg';

// The sacred ceremony mandap painting
const CEREMONY_PAINTING_SRC = '/intro/ceremony_painting.jpg';

// Golden Blooming Lotus Mandala Emblem (Matches Image 4 Reference)
const RoyalWeddingSymbol: React.FC<{ size?: number }> = ({ size = 92 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 100 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="ix-symbol-emblem select-none pointer-events-none"
  >
    <defs>
      <linearGradient id="goldLotusGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FFF7E6" />
        <stop offset="25%" stopColor="#E5CBA0" />
        <stop offset="55%" stopColor="#C6A15B" />
        <stop offset="85%" stopColor="#DFC48F" />
        <stop offset="100%" stopColor="#8A631E" />
      </linearGradient>
      <radialGradient id="goldLotusGlow" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#DFC48F" stopOpacity="0.4" />
        <stop offset="70%" stopColor="#C6A15B" stopOpacity="0.12" />
        <stop offset="100%" stopColor="#DFC48F" stopOpacity="0" />
      </radialGradient>
    </defs>

    {/* Radiant circular aura */}
    <circle cx="50" cy="50" r="48" fill="url(#goldLotusGlow)" />

    {/* Outer delicate ring with ornamental ticks and beads */}
    <circle cx="50" cy="50" r="44" stroke="url(#goldLotusGrad)" strokeWidth="1.2" opacity="0.85" />
    <circle cx="50" cy="50" r="40" stroke="url(#goldLotusGrad)" strokeWidth="0.8" strokeDasharray="1.5 3" opacity="0.75" />

    {/* Radiant micro-accent dots around circumference */}
    {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg, i) => (
      <circle
        key={i}
        cx={50 + 44 * Math.cos((deg * Math.PI) / 180)}
        cy={50 + 44 * Math.sin((deg * Math.PI) / 180)}
        r={i % 3 === 0 ? 1.4 : 0.8}
        fill="url(#goldLotusGrad)"
      />
    ))}

    {/* Inner ring */}
    <circle cx="50" cy="50" r="32" stroke="url(#goldLotusGrad)" strokeWidth="0.9" opacity="0.6" />

    {/* ── Sacred Blooming Golden Lotus (Matching Image 4) ── */}
    {/* Center upright petal */}
    <path
      d="M 50 25 C 47 34, 46 45, 50 54 C 54 45, 53 34, 50 25 Z"
      fill="url(#goldLotusGrad)"
    />

    {/* Inner-left petal */}
    <path
      d="M 50 54 C 44 47, 36 38, 38 29 C 43 32, 47 43, 50 54 Z"
      fill="url(#goldLotusGrad)"
      opacity="0.95"
    />
    {/* Inner-right petal */}
    <path
      d="M 50 54 C 56 47, 64 38, 62 29 C 57 32, 53 43, 50 54 Z"
      fill="url(#goldLotusGrad)"
      opacity="0.95"
    />

    {/* Mid-left curved petal */}
    <path
      d="M 48 56 C 39 53, 27 45, 29 38 C 34 40, 42 49, 48 56 Z"
      fill="url(#goldLotusGrad)"
      opacity="0.88"
    />
    {/* Mid-right curved petal */}
    <path
      d="M 52 56 C 61 53, 73 45, 71 38 C 66 40, 58 49, 52 56 Z"
      fill="url(#goldLotusGrad)"
      opacity="0.88"
    />

    {/* Base cup / calyx petal */}
    <path
      d="M 33 58 C 38 67, 62 67, 67 58 C 60 63, 40 63, 33 58 Z"
      fill="url(#goldLotusGrad)"
    />
    <path
      d="M 42 63 C 45 68, 55 68, 58 63 C 54 66, 46 66, 42 63 Z"
      fill="url(#goldLotusGrad)"
      opacity="0.75"
    />

    {/* Auspicious golden droplets below */}
    <circle cx="50" cy="71" r="1.5" fill="url(#goldLotusGrad)" />
    <circle cx="50" cy="76" r="1" fill="url(#goldLotusGrad)" opacity="0.7" />
  </svg>
);

const AC = 720;
const lC = 1280;
const ei = ['left', 'right', 'top', 'bottom'] as const;
type FlapKey = (typeof ei)[number];

const c0: Record<FlapKey, [number, number][]> = {
  top: [
    [15, 0],
    [705, 0],
    [368, 645],
  ],
  left: [
    [0, 0],
    [15, 0],
    [333, 580],
    [0, 1091],
  ],
  right: [
    [720, 0],
    [705, 0],
    [399, 588],
    [720, 1093],
  ],
  bottom: [
    [0, 1091],
    [294, 640],
    [361, 590],
    [432, 640],
    [720, 1093],
    [720, 1280],
    [0, 1280],
  ],
};

const C0: Record<FlapKey, { o: string; ax: 'X' | 'Y'; s: number }> = {
  top: { o: '50% 0%', ax: 'X', s: 1 },
  bottom: { o: '50% 100%', ax: 'X', s: -1 },
  right: { o: '100% 50%', ax: 'Y', s: 1 },
  left: { o: '0% 50%', ax: 'Y', s: -1 },
};

const Yh: Record<FlapKey, [number, number]> = {
  top: [0.45, 2.15],
  bottom: [1.35, 3.05],
  right: [2.35, 4.05],
  left: [3.05, 4.75],
};

const Mh: [number, number] = [3.8, 4.8];
const Oh = 4.8;
const ii = 5.0;
const qh = [246, 228, 230];
const Kh = [250, 242, 240];

const Gh = (A: number) => (A < 0 ? 0 : A > 1 ? 1 : A);
const ni = (A: number, l: [number, number]) => Gh((A - l[0]) / (l[1] - l[0]));
const ci = (A: number) => (A < 0.5 ? 4 * A * A * A : 1 - Math.pow(-2 * A + 2, 3) / 2);
const Fh = (A: number, l: number, a: number) => A + (l - A) * a;

function wh(A: [number, number][], l: number): { x: number; y: number }[] {
  const a = A.length;
  let t = 0;
  for (let n = 0; n < a; n++) {
    const c = A[n];
    const o = A[(n + 1) % a];
    t += c[0] * o[1] - o[0] * c[1];
  }
  const u = t > 0 ? 1 : -1;
  const e = [];
  for (let n = 0; n < a; n++) {
    const c = A[n];
    const o = A[(n + 1) % a];
    const B = o[0] - c[0];
    const h = o[1] - c[1];
    const f = Math.hypot(B, h) || 1;
    e.push({ x: c[0] + (u * h) / f * l, y: c[1] + (-u * B) / f * l, dx: B, dy: h });
  }
  const i: { x: number; y: number }[] = [];
  for (let n = 0; n < a; n++) {
    const c = e[(n + a - 1) % a];
    const o = e[n];
    const B = c.dx * o.dy - c.dy * o.dx;
    if (Math.abs(B) < 1e-6) {
      i.push({ x: o.x, y: o.y });
      continue;
    }
    const h = ((o.x - c.x) * o.dy - (o.y - c.y) * o.dx) / B;
    i.push({ x: c.x + c.dx * h, y: c.y + c.dy * h });
  }
  return i;
}

const s0 = (A: ([number, number] | { x: number; y: number })[]) =>
  'polygon(' +
  A.map((l) => {
    const x = Array.isArray(l) ? l[0] : l.x;
    const y = Array.isArray(l) ? l[1] : l.y;
    return ((x / AC) * 100).toFixed(3) + '% ' + ((y / lC) * 100).toFixed(3) + '%';
  }).join(',') +
  ')';

const Ih = (A: string) =>
  new Promise<void>((l) => {
    const a = new Image();
    a.src = A;
    if (a.decode) {
      a.decode().then(
        () => l(),
        () => l()
      );
    } else {
      a.onload = a.onerror = () => l();
    }
  });

const INTRO_CSS = `
.ix-root{position:absolute;inset:0;overflow:hidden;background-color:var(--stage,#f6e4e6);touch-action:none;overscroll-behavior:contain;
  --lining:#dcaab3;--card:#fffaf6;--shadow:rgba(110,45,62,.55);-webkit-tap-highlight-color:transparent;z-index:50}
.ix-root[data-phase=leaving]{background-color:transparent;pointer-events:none;transition:background-color .8s ease .2s,opacity .8s ease .2s;opacity:0}

.ix-stage{position:absolute;inset:0;display:grid;place-items:center;opacity:0;transition:opacity .8s ease, transform 2.4s cubic-bezier(0.22, 1, 0.36, 1);will-change:transform, opacity}
.ix-root[data-ready=true] .ix-stage{opacity:1}
.ix-root[data-zoom-active=true] .ix-stage{
  transform:scale(2.2);
  opacity:0;
  pointer-events:none;
  transition:transform 2.4s cubic-bezier(0.22, 1, 0.36, 1), opacity 1.6s ease 0.6s;
}

.ix-zoom{position:relative;width:var(--w,0px);height:var(--h,0px);will-change:transform}
.ix-env{position:absolute;inset:0;perspective:calc(var(--h) * 2.4);perspective-origin:50% 50%}
.ix-rect{position:absolute;inset:0}
.ix-env-shadow{box-shadow:0 calc(var(--h)*.035) calc(var(--h)*.083) rgba(120,55,70,.28),0 calc(var(--h)*.007) calc(var(--h)*.017) rgba(120,55,70,.18)}
.ix-lining{background:radial-gradient(120% 90% at 50% 40%,#e9bfc6 0%,var(--lining) 100%)}
.ix-card{position:absolute;left:6.5%;right:6.5%;top:4.5%;bottom:4.5%;background:linear-gradient(180deg,#fffdfb 0%,var(--card) 100%);
  box-shadow:0 calc(var(--h)*.004) calc(var(--h)*.011) rgba(110,45,62,.25),inset 0 0 0 1px rgba(200,150,160,.18);overflow:hidden}
.ix-card-mandap-preview{
  position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);
  width:calc(var(--w) * 0.44);height:calc(var(--w) * 0.51);
  border-radius:12px;overflow:hidden;
  box-shadow:0 10px 24px rgba(0,0,0,.22);
}
.ix-cast{position:absolute;inset:0;filter:blur(calc(var(--h)*.0194));opacity:0;pointer-events:none}
.ix-cast>i{position:absolute;inset:0;background:var(--shadow)}
.ix-flap{position:absolute;inset:0;will-change:transform}
.ix-face{position:absolute;inset:0}
.ix-front{background:url(${ENVELOPE_SRC}) 0 0/100% 100% no-repeat}
.ix-back{background:linear-gradient(160deg,#f1cbd1,#e6b7c0);display:none}
.ix-back::before{content:"";position:absolute;inset:0;background:url(${LINING_SRC}) center/38% auto;opacity:.5;mix-blend-mode:multiply}
.ix-shade{position:absolute;inset:0;background:#6b2b3d;opacity:0;pointer-events:none}
.ix-seal{position:absolute;left:calc(361 / 720 * 100% - 124 / 720 * 100%);top:calc(646 / 1280 * 100% - 124 / 1280 * 100%);
  width:calc(248 / 720 * 100%);height:calc(248 / 1280 * 100%);background:url(${SEAL_SRC}) 0 0/100% 100% no-repeat;
  filter:drop-shadow(0 calc(var(--h)*.007) calc(var(--h)*.011) rgba(110,45,62,.35))}
.ix-root[data-phase=closed][data-ready=true] .ix-seal{animation:ixPulse 2.6s ease-in-out infinite}
.ix-root[data-phase=opening] .ix-seal{animation:ixPress .5s ease both}
@keyframes ixPulse{0%,100%{transform:scale(1)}50%{transform:scale(1.045)}}
@keyframes ixPress{0%{transform:scale(1)}40%{transform:scale(.94)}100%{transform:scale(1)}}

.ix-paper{position:absolute;inset:0;opacity:0;pointer-events:none;background-image:url(${PAPER_SRC});background-repeat:repeat;background-size:420px auto;background-color:#FAF2F0}
.ix-root[data-phase=postEnvelope] .ix-paper{opacity:0!important}

.ix-hint{position:absolute;left:50%;translate:-50% 0;width:max-content;max-width:88%;bottom:max(28px,env(safe-area-inset-bottom,0px));margin:0;text-align:center;pointer-events:none;
  padding:11px 24px;border-radius:999px;background:rgba(255,252,247,.88);border:1px solid rgba(166,115,27,.5);
  font:italic 700 23px/1.2 'Cormorant Garamond',Georgia,serif;letter-spacing:.01em;color:#3D2600;opacity:0;transition:opacity .5s ease}
.ix-root[data-phase=closed][data-ready=true] .ix-hint{opacity:1;transition-delay:.7s}
.ix-open{position:absolute;inset:0;z-index:5;background:none;border:0;padding:0;cursor:pointer}
.ix-open:focus-visible{outline:2px solid #8A5A00;outline-offset:-8px}
.ix-skip{position:absolute;z-index:60;top:max(18px,env(safe-area-inset-top,0px));right:18px;background:none;border:0;cursor:pointer;
  font:700 12px/1 Montserrat,system-ui,sans-serif;letter-spacing:.2em;text-transform:uppercase;color:#3D2600;min-height:44px;padding:0 10px;opacity:0;
  animation:ixRise .8s ease 1.2s both}
.ix-skip:focus-visible{outline:2px solid #8A5A00;outline-offset:3px}
@keyframes ixRise{from{opacity:0;translate:0 10px}to{opacity:1;translate:0 0}}

/* ══════════════════════════════════════════════════════════════════
   POST-ENVELOPE SEQUENCE (Mandap Painting Zoom -> Royal Card)
   ══════════════════════════════════════════════════════════════════ */
.ix-post-stage{position:absolute;inset:0;overflow:hidden;z-index:10}

/* WINDOW 1: The Centered Mandap Ceremony Painting - Expands seamlessly from card thumbnail to full screen */
.ix-painting-box{
  position:absolute;
  left:50%;top:50%;
  transform:translate(-50%, -50%);
  width:calc(var(--w) * 0.44);
  height:calc(var(--w) * 0.51);
  border-radius:12px;
  box-shadow:0 10px 24px rgba(0,0,0,.22);
  z-index:20;
  pointer-events:none;
  overflow:hidden;
  will-change:width, height, border-radius, box-shadow;
  transition:width 2.4s cubic-bezier(0.22, 1, 0.36, 1),
             height 2.4s cubic-bezier(0.22, 1, 0.36, 1),
             border-radius 2.0s ease,
             box-shadow 1.8s ease;
}

.ix-painting-box[data-step=zooming],
.ix-painting-box[data-step=hold],
.ix-painting-box[data-step=card],
.ix-painting-box[data-step=leaving]{
  width:100%;
  height:100%;
  border-radius:0px;
  box-shadow:none;
}

.ix-painting-img{
  width:100%;
  height:100%;
  object-fit:cover;
  object-position:50% 25%;
  display:block;
  user-select:none;
  -webkit-user-drag:none;
}

/* Soft translucent atmospheric veil over zoomed painting so light pink card blends naturally */
.ix-backdrop-dim{
  position:absolute;inset:0;z-index:22;pointer-events:none;
  background:radial-gradient(ellipse at 50% 50%, rgba(255, 245, 248, 0.18) 0%, rgba(70, 20, 35, 0.30) 100%);
  opacity:0;
  transition:opacity 0.8s ease;
}
.ix-backdrop-dim[data-visible=true]{
  opacity:1;
}

/* ROYAL INVITATION CARD OVERLAY: Fades in smoothly on top of fitted ceremony painting */
.ix-card-overlay{
  position:absolute;inset:0;z-index:30;
  display:flex;flex-direction:column;align-items:center;justify-content:center;
  padding:max(20px,env(safe-area-inset-top,0px)) 16px max(20px,env(safe-area-inset-bottom,0px));
  opacity:0;pointer-events:none;
  transition:opacity 1.0s cubic-bezier(.2,.8,.2,1);
}
.ix-card-overlay[data-visible=true]{
  opacity:1;pointer-events:auto;
}

/* The Royal Light Pink Invitation Card */
.ix-royal-card{
  position:relative;
  width:90%;
  max-width:340px;
  background:linear-gradient(168deg, rgba(255, 246, 248, 0.95) 0%, rgba(253, 238, 242, 0.97) 50%, rgba(248, 226, 233, 0.95) 100%);
  backdrop-filter:blur(18px);
  -webkit-backdrop-filter:blur(18px);
  border:1.5px solid rgba(225, 172, 186, 0.75);
  border-radius:26px;
  padding:24px 20px 22px;
  box-shadow:0 22px 50px rgba(160, 70, 90, 0.22), 0 6px 18px rgba(160, 70, 90, 0.12), inset 0 1px 2px rgba(255, 255, 255, 0.95);
  display:flex;
  flex-direction:column;
  align-items:center;
  overflow:hidden;
  transition:transform 0.85s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.85s ease, filter 0.85s ease;
}

.ix-royal-card[data-tapped=true]{
  transform:scale(1.08) translateY(-14px);
  opacity:0;
  filter:blur(6px);
  box-shadow:0 0 60px rgba(230, 140, 165, 0.7);
  pointer-events:none;
}

.ix-card-inner-frame{
  position:absolute;
  inset:7px;
  border:1px solid rgba(215, 155, 170, 0.45);
  border-radius:20px;
  pointer-events:none;
}

.ix-corner-ornament{
  position:absolute;
  font-size:10px;
  color:#B85D75;
  opacity:0.8;
  line-height:1;
  pointer-events:none;
  z-index:5;
}
.ix-corner-tl{top:12px;left:13px}
.ix-corner-tr{top:12px;right:13px}
.ix-corner-bl{bottom:12px;left:13px}
.ix-corner-br{bottom:12px;right:13px}

.ix-symbol-pulse{
  animation:ixSymbolGlow 3s ease-in-out infinite;
}
@keyframes ixSymbolGlow{
  0%, 100% { transform: scale(1); filter: drop-shadow(0 0 10px rgba(220,150,170,0.4)); }
  50% { transform: scale(1.05); filter: drop-shadow(0 0 22px rgba(220,150,170,0.7)); }
}

@keyframes ixEmblemBurst{
  0% { transform: scale(1) rotate(0deg); }
  50% { transform: scale(1.22) rotate(15deg); filter: drop-shadow(0 0 28px rgba(255,180,200,0.9)); }
  100% { transform: scale(1.35) rotate(30deg); filter: drop-shadow(0 0 45px rgba(255,210,230,1)); opacity: 0; }
}
.ix-emblem-burst{
  animation: ixEmblemBurst 0.85s cubic-bezier(0.22, 1, 0.36, 1) forwards !important;
}

.ix-tap-btn{
  transition:all .25s ease;
  cursor:pointer;
}
.ix-tap-btn:hover{
  transform:scale(1.03);
  box-shadow:0 8px 26px rgba(160,50,75,0.45);
}
.ix-tap-btn:active{
  transform:scale(0.96);
}

@media (prefers-reduced-motion:reduce){
  .ix-painting-box{transition:none!important}
  .ix-card-overlay{transition:none!important}
}
`;

export const Intro: React.FC<IntroProps> = ({
  guestName = '',
  onEnter,
  onDone,
}) => {
  const [phase, setPhase] = useState<'closed' | 'opening' | 'postEnvelope' | 'leaving'>('closed');
  const [postStep, setPostStep] = useState<'init' | 'zooming' | 'hold' | 'card' | 'leaving'>('init');
  const [ready, setReady] = useState<boolean>(false);
  const [isTapped, setIsTapped] = useState<boolean>(false);

  const phaseRef = useRef<'closed' | 'opening' | 'postEnvelope' | 'leaving'>('closed');
  const postStepRef = useRef<'init' | 'zooming' | 'hold' | 'card' | 'leaving'>('init');
  const rootRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const zoomRef = useRef<HTMLDivElement>(null);
  const paperRef = useRef<HTMLDivElement>(null);
  const ctrlRef = useRef<{ render: (t: number) => void } | null>(null);
  const rafRef = useRef<number>(0);
  const timersRef = useRef<number[]>([]);

  useEffect(() => {
    return () => {
      timersRef.current.forEach((t) => window.clearTimeout(t));
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const changePhase = (next: 'closed' | 'opening' | 'postEnvelope' | 'leaving') => {
    phaseRef.current = next;
    setPhase(next);
  };

  const changePostStep = (step: 'init' | 'zooming' | 'hold' | 'card' | 'leaving') => {
    postStepRef.current = step;
    setPostStep(step);
  };

  // Lock body scroll while Intro is visible
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  // Preload essential envelope textures and the ceremony painting
  useEffect(() => {
    let alive = true;
    Promise.all([
      ENVELOPE_SRC,
      LINING_SRC,
      SEAL_SRC,
      CEREMONY_PAINTING_SRC,
    ].map(Ih)).then(() => {
      if (alive) setReady(true);
    });
    const fallbackTimer = window.setTimeout(() => {
      if (alive) setReady(true);
    }, 3500);
    return () => {
      alive = false;
      window.clearTimeout(fallbackTimer);
    };
  }, []);

  // Envelope 3D origami unfolding animation engine (keeps existing envelope animation 100% intact)
  useLayoutEffect(() => {
    const rootEl = rootRef.current;
    const stageEl = stageRef.current;
    const zoomEl = zoomRef.current;
    const paperEl = paperRef.current;
    if (!rootEl || !stageEl || !zoomEl || !paperEl) return;

    const flaps: Record<
      string,
      { el: HTMLElement; front: HTMLElement; back: HTMLElement; shade: HTMLElement }
    > = {};
    const castMap: Record<string, HTMLElement> = {};
    let Vu = 0;
    let uC = 0;

    ei.forEach((k) => {
      const el = zoomEl.querySelector<HTMLElement>(`[data-f="${k}"]`);
      if (!el) return;
      const front = el.querySelector<HTMLElement>('.ix-front')!;
      const back = el.querySelector<HTMLElement>('.ix-back')!;
      const shade = el.querySelector<HTMLElement>('.ix-shade')!;
      flaps[k] = { el, front, back, shade };
      castMap[k] = zoomEl.querySelector<HTMLElement>(`[data-c="${k}"]`)!;

      const poly = s0(wh(c0[k], 1.6));
      [front, back, shade].forEach((part) => {
        if (part) part.style.clipPath = poly;
      });
      el.style.transformOrigin = C0[k].o;
      if (castMap[k]?.firstElementChild) {
        (castMap[k].firstElementChild as HTMLElement).style.clipPath = s0(c0[k]);
      }
    });

    const computeSize = () => {
      const pW = stageEl.clientWidth;
      const pH = stageEl.clientHeight;
      Vu = Math.min(pH * 0.72, (pW - 32) * 0.86 * (lC / AC));
      const widthVal = `${(Vu * AC) / lC}px`;
      const heightVal = `${Vu}px`;
      zoomEl.style.setProperty('--w', widthVal);
      zoomEl.style.setProperty('--h', heightVal);
      rootEl.style.setProperty('--w', widthVal);
      rootEl.style.setProperty('--h', heightVal);
    };

    const renderProgress = (t: number) => {
      uC = t;
      ei.forEach((k) => {
        const flap = flaps[k];
        if (!flap) return;
        const cfg = C0[k];
        const progress = ci(ni(t, Yh[k]));
        const deg = progress * 180;
        const translateZ = Math.sin(progress * Math.PI) * 0.012 * Vu;
        flap.el.style.transform = `translateZ(${translateZ.toFixed(2)}px) rotate${cfg.ax}(${(cfg.s * deg).toFixed(3)}deg)`;
        const isBack = deg > 90;
        flap.front.style.display = isBack ? 'none' : 'block';
        flap.back.style.display = isBack ? 'block' : 'none';
        flap.shade.style.opacity = (0.3 * Math.sin((deg * Math.PI) / 180)).toFixed(3);
        const castOpacity =
          deg <= 90
            ? Math.sin((deg * Math.PI) / 180) * 0.55
            : Math.max(0, 1 - (deg - 90) / 55) * 0.55;
        if (castMap[k]) {
          castMap[k].style.opacity = castOpacity.toFixed(3);
        }
      });

      const stageProgress = ci(ni(t, Mh));
      rootEl.style.setProperty(
        '--stage',
        `rgb(${qh.map((c, i) => Math.round(Fh(c, Kh[i], stageProgress))).join(',')})`
      );
    };

    computeSize();
    renderProgress(0);
    ctrlRef.current = { render: renderProgress };

    const observer = new ResizeObserver(() => {
      computeSize();
      renderProgress(uC);
    });
    observer.observe(stageEl);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  // Post-envelope sequence orchestration:
  // 1. Envelope is completely open; ceremony painting (Window 1) is visible on card
  // 2. Window 1 smoothly, slowly expands from center to fit the mobile screen (NO switching images!)
  // 3. 3D envelope background smoothly scales and dissolves into the background
  // 4. Royal Light Pink Invitation Card overlay fades in smoothly with Sanskrit invocation, Golden Lotus, and Tap to Open
  const startPostEnvelopeSequence = () => {
    changePhase('postEnvelope');
    changePostStep('init');

    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      changePostStep('card');
      return;
    }

    // Step 1: Hold opened envelope + centered painting view for 500ms
    const tZoom = window.setTimeout(() => {
      changePostStep('zooming');
    }, 500);
    timersRef.current.push(tZoom);

    // Step 2: Painting expands smoothly and slowly from center to fit screen (2.4s transition)
    const tHold = window.setTimeout(() => {
      changePostStep('hold');
    }, 2900); // 500ms + 2400ms zoom
    timersRef.current.push(tHold);

    // Step 3: Smoothly fade in the Royal Light Pink Invitation Card overlay
    const tCard = window.setTimeout(() => {
      changePostStep('card');
    }, 3300); // 2900ms + 400ms hold
    timersRef.current.push(tCard);
  };

  const handleOpen = () => {
    if (phaseRef.current !== 'closed' || !ready) return;
    changePhase('opening');

    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      ctrlRef.current?.render(ii);
      startPostEnvelopeSequence();
      return;
    }

    const start = performance.now();
    const tick = () => {
      const elapsed = Math.min((performance.now() - start) / 1000, ii);
      ctrlRef.current?.render(elapsed);
      if (elapsed >= Oh && phaseRef.current === 'opening') {
        startPostEnvelopeSequence();
      }
      if (elapsed < ii) {
        rafRef.current = requestAnimationFrame(tick);
      }
    };
    rafRef.current = requestAnimationFrame(tick);
  };

  const handleSkip = (e: React.MouseEvent) => {
    e.stopPropagation();
    cancelAnimationFrame(rafRef.current);
    ctrlRef.current?.render(ii);
    changePhase('postEnvelope');
    changePostStep('card');
  };

  // Card interactive trigger: pretty bloom animation on tap transitioning smoothly into main wedding application
  const handleEnter = () => {
    if (postStepRef.current !== 'card' || isTapped) return;
    setIsTapped(true);

    try {
      qaafiranaAudio.play();
    } catch (err) {
      console.warn(err);
    }

    // Pretty animation delay before triggering leaving phase
    timersRef.current.push(
      window.setTimeout(() => {
        changePhase('leaving');
        changePostStep('leaving');
      }, 550)
    );

    // Smooth crossfade: trigger hero staggered reveal at 850ms
    timersRef.current.push(
      window.setTimeout(() => {
        onEnter?.();
      }, 850)
    );

    // Completely unmount intro at 1450ms after full elegant transition
    timersRef.current.push(
      window.setTimeout(() => {
        onDone?.();
      }, 1450)
    );
  };

  const cleanGuest = (guestName || '').trim();
  const showCustomGuest = cleanGuest && cleanGuest.toLowerCase() !== 'guest';
  const isZoomActive = phase === 'postEnvelope' && postStep !== 'init';

  return (
    <div
      ref={rootRef}
      className="ix-root"
      data-phase={phase}
      data-ready={ready}
      data-zoom-active={isZoomActive}
    >
      <style>{INTRO_CSS}</style>

      {/* ── STEP 1: Existing 3D Envelope Origami Stage (Kept 100% exactly intact) ── */}
      <div ref={stageRef} className="ix-stage" aria-hidden="true">
        <div ref={zoomRef} className="ix-zoom">
          <div className="ix-rect ix-env-shadow" />
          <div className="ix-env">
            <div className="ix-rect ix-lining" />
            <div className="ix-card">
              <div className="ix-card-mandap-preview">
                <img
                  src={CEREMONY_PAINTING_SRC}
                  alt="Ceremony Mandap"
                  className="w-full h-full object-cover object-[50%_25%]"
                />
              </div>
            </div>
            {ei.map((k) => (
              <div key={`c${k}`} className="ix-cast" data-c={k}>
                <i />
              </div>
            ))}
            {ei.map((k, idx) => (
              <div key={k} className="ix-flap" data-f={k} style={{ zIndex: idx + 1 }}>
                <div className="ix-face ix-front" />
                <div className="ix-face ix-back" />
                <div className="ix-shade" />
                {k === 'bottom' && <div className="ix-seal" />}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Texture Paper Overlay for Envelope Flap phase */}
      <div ref={paperRef} className="ix-paper" />

      {/* Tap Seal Hint */}
      <p className="ix-hint">Tap the seal to open</p>

      {/* Full-screen click capture when closed */}
      {phase === 'closed' && (
        <button
          type="button"
          className="ix-open"
          onClick={handleOpen}
          aria-label="Open the invitation"
        />
      )}

      {/* Skip button while envelope is opening or zooming */}
      {(phase === 'opening' || (phase === 'postEnvelope' && postStep !== 'card' && postStep !== 'leaving')) && (
        <button type="button" className="ix-skip" onClick={handleSkip}>
          Skip
        </button>
      )}

      {/* ── POST-ENVELOPE SEQUENCE ── */}
      {(phase === 'postEnvelope' || phase === 'leaving') && (
        <div className="ix-post-stage">
          {/* WINDOW 1: Centered mandap ceremony painting - Smooth slow zoom from the exact card window to full screen (NO switching images) */}
          <div className="ix-painting-box" data-step={postStep}>
            <img
              src={CEREMONY_PAINTING_SRC}
              alt="Sacred Ganga Ceremony Mandap Painting"
              className="ix-painting-img"
            />
          </div>

          {/* Soft translucent atmospheric veil over zoomed painting for contrast */}
          <div
            className="ix-backdrop-dim"
            data-visible={postStep === 'card' || postStep === 'leaving'}
          />

          {/* Dropping pink flower petals in the background of the seal/card section */}
          {(postStep === 'card' || postStep === 'leaving') && (
            <FallingPetals isAbsolute className="z-25" />
          )}

          {/* ROYAL INVITATION CARD OVERLAY: Fades in smoothly on top of fitted painting */}
          <div
            className="ix-card-overlay"
            data-visible={postStep === 'card' || postStep === 'leaving'}
            data-leaving={phase === 'leaving'}
            role="dialog"
            aria-label="Royal Wedding Invitation Card"
          >
            {/* The Royal Light Pink Invitation Card */}
            <div className="ix-royal-card" data-tapped={isTapped}>
              {/* Delicate Gold Inner Border Frame */}
              <div className="ix-card-inner-frame" />

              {/* Corner Ornaments */}
              <span className="ix-corner-ornament ix-corner-tl">✦</span>
              <span className="ix-corner-ornament ix-corner-tr">✦</span>
              <span className="ix-corner-ornament ix-corner-bl">✦</span>
              <span className="ix-corner-ornament ix-corner-br">✦</span>

              <div className="relative z-10 flex flex-col items-center text-center space-y-3.5 sm:space-y-4 w-full">
                {/* Auspicious Sanskrit Inscription */}
                <div className="space-y-1">
                  <div className="flex items-center justify-center space-x-2">
                    <span className="h-[1px] w-6 bg-gradient-to-r from-transparent to-[#B85D75]/60" />
                    <span className="text-[12.5px] sm:text-[13.5px] font-serif tracking-[0.28em] text-[#6E182F] font-bold drop-shadow-xs">
                      ॥ श्री गणेशाय नमः ॥
                    </span>
                    <span className="h-[1px] w-6 bg-gradient-to-l from-transparent to-[#B85D75]/60" />
                  </div>
                  <div className="flex items-center justify-center space-x-2 pt-0.5">
                    <span className="h-[1px] w-3 bg-[#B85D75]/40" />
                    <span className="text-[9.5px] sm:text-[10px] font-sans tracking-[0.38em] uppercase text-[#8C2844] font-extrabold">
                      SHUBH VIVAH
                    </span>
                    <span className="h-[1px] w-3 bg-[#B85D75]/40" />
                  </div>
                </div>

                {/* Couple Names */}
                <div className="pt-0.5">
                  <h2 className="font-serif text-[32px] sm:text-[36px] leading-tight text-[#380C19] font-normal tracking-wide">
                    Meher <span className="italic font-serif text-[#A84562] px-1">&</span> Kabir
                  </h2>
                  <p className="text-[10.5px] sm:text-[11.5px] font-sans tracking-[0.26em] uppercase text-[#7A223B] font-bold mt-1">
                    21 · 11 · 2027 · RISHIKESH
                  </p>
                </div>

                {/* Personal Guest Greeting if provided */}
                {showCustomGuest && (
                  <div className="py-1 px-4 rounded-full bg-[#FFF0F4]/90 border border-[#D89AA8] shadow-xs">
                    <p className="font-serif italic text-[13px] text-[#5E1428] tracking-wide">
                      Cordially Inviting {cleanGuest} & Family
                    </p>
                  </div>
                )}

                {/* Royal Golden Mandala Symbol with Soft Blush Halo */}
                <div className="pt-1 pb-1 relative flex items-center justify-center">
                  <div className="absolute w-24 h-24 rounded-full bg-[#EBA8B8]/35 blur-xl pointer-events-none" />
                  <div className={`relative ix-symbol-pulse ${isTapped ? 'ix-emblem-burst' : ''}`}>
                    <RoyalWeddingSymbol size={86} />
                  </div>
                </div>

                {/* Tap to Open Button */}
                <div className="pt-1 w-full flex justify-center">
                  <button
                    type="button"
                    onClick={handleEnter}
                    className="ix-tap-btn inline-flex items-center justify-center space-x-2 px-8 py-3 rounded-full bg-gradient-to-r from-[#7A1E35] via-[#631428] to-[#7A1E35] text-[#FFF6F8] border border-[#9E344E] shadow-[0_8px_24px_rgba(92,18,38,0.38)] cursor-pointer active:scale-95 transition-all w-full max-w-[240px]"
                    aria-label="Tap to open wedding invitation"
                  >
                    <span className="text-[12px] font-sans font-extrabold uppercase tracking-[0.24em] text-[#FFF6F8]">
                      Tap to Open
                    </span>
                    <ChevronRight size={17} className="text-[#FCEBD2] stroke-[2.8]" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
