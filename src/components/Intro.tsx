import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { qaafiranaAudio } from '../utils/audio';

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
const CEREMONY_MANDAP_SRC = '/intro/ceremony_mandap.jpg';

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

const Sh: [number, number] = [5.15, 6.75];
const Mh: [number, number] = [4.7, 5.8];
const Vh: [number, number] = [6.05, 6.9];
const Oh = 6.5;
const ii = 7;
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

/* ══════════════════════════════════════════════════════════════════
   ROYAL WEDDING SYMBOL (Bespoke Golden Auspicious Lotus Crest)
   Replaces the photorealistic wax sticker with a regal gold emblem
   ══════════════════════════════════════════════════════════════════ */
const RoyalWeddingSymbol: React.FC = () => (
  <svg
    viewBox="0 0 120 120"
    className="w-16 h-16 sm:w-20 sm:h-20 drop-shadow-[0_4px_16px_rgba(0,0,0,0.65)] transition-transform duration-300 hover:scale-105"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <defs>
      <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FFF4DE" />
        <stop offset="25%" stopColor="#E6C87C" />
        <stop offset="50%" stopColor="#FDF3DB" />
        <stop offset="75%" stopColor="#C99E44" />
        <stop offset="100%" stopColor="#966F28" />
      </linearGradient>
      <filter id="royalGlow" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="1.8" result="blur" />
        <feComposite in="SourceGraphic" in2="blur" operator="over" />
      </filter>
    </defs>

    {/* Outer decorative halo ring with auspicious dashed pattern */}
    <circle cx="60" cy="60" r="54" stroke="url(#goldGradient)" strokeWidth="1.2" strokeDasharray="3 3" opacity="0.8" />
    <circle cx="60" cy="60" r="49" stroke="url(#goldGradient)" strokeWidth="1.6" />
    <circle cx="60" cy="60" r="45" stroke="url(#goldGradient)" strokeWidth="0.8" opacity="0.6" />

    {/* Cardinal auspicious accent points */}
    <circle cx="60" cy="8" r="2.2" fill="url(#goldGradient)" />
    <circle cx="60" cy="112" r="2.2" fill="url(#goldGradient)" />
    <circle cx="8" cy="60" r="2.2" fill="url(#goldGradient)" />
    <circle cx="112" cy="60" r="2.2" fill="url(#goldGradient)" />

    {/* Diagonal corner accents */}
    <circle cx="23" cy="23" r="1.5" fill="url(#goldGradient)" opacity="0.85" />
    <circle cx="97" cy="23" r="1.5" fill="url(#goldGradient)" opacity="0.85" />
    <circle cx="23" cy="97" r="1.5" fill="url(#goldGradient)" opacity="0.85" />
    <circle cx="97" cy="97" r="1.5" fill="url(#goldGradient)" opacity="0.85" />

    {/* Central Blooming Sacred Lotus Motif */}
    {/* Center core petal */}
    <path
      d="M60 28 C64 42, 68 55, 60 70 C52 55, 56 42, 60 28 Z"
      fill="url(#goldGradient)"
      filter="url(#royalGlow)"
    />
    {/* Inner Left Petal */}
    <path
      d="M60 70 C48 66, 38 52, 43 40 C49 46, 54 58, 60 70 Z"
      fill="url(#goldGradient)"
    />
    {/* Inner Right Petal */}
    <path
      d="M60 70 C72 66, 82 52, 77 40 C71 46, 66 58, 60 70 Z"
      fill="url(#goldGradient)"
    />
    {/* Outer Left Leaf */}
    <path
      d="M60 72 C42 70, 30 60, 32 49 C39 55, 48 64, 60 72 Z"
      fill="url(#goldGradient)"
      opacity="0.9"
    />
    {/* Outer Right Leaf */}
    <path
      d="M60 72 C78 70, 90 60, 88 49 C81 55, 72 64, 60 72 Z"
      fill="url(#goldGradient)"
      opacity="0.9"
    />

    {/* Sacred Pedestal base */}
    <path
      d="M40 76 C48 73, 54 75, 60 78 C66 75, 72 73, 80 76 C75 82, 67 85, 60 84 C53 85, 45 82, 40 76 Z"
      fill="url(#goldGradient)"
    />
    {/* Royal Filigree Flourish */}
    <path
      d="M44 87 C52 90, 56 94, 60 92 C64 94, 68 90, 76 87 C71 91, 66 94, 60 97 C54 94, 49 91, 44 87 Z"
      fill="url(#goldGradient)"
      opacity="0.9"
    />
    <circle cx="60" cy="100" r="1.8" fill="url(#goldGradient)" />
  </svg>
);

const INTRO_CSS = `
.ix-root{position:absolute;inset:0;overflow:hidden;background-color:var(--stage,#f6e4e6);touch-action:none;overscroll-behavior:contain;
  --lining:#dcaab3;--card:#fffaf6;--shadow:rgba(110,45,62,.55);-webkit-tap-highlight-color:transparent;z-index:50}
.ix-root[data-phase=leaving]{background-color:transparent;pointer-events:none;transition:background-color .8s ease .2s,opacity .8s ease .2s;opacity:0}

.ix-stage{position:absolute;inset:0;display:grid;place-items:center;opacity:0;transition:opacity .8s ease}
.ix-root[data-ready=true] .ix-stage{opacity:1}
.ix-root[data-phase=postEnvelope] .ix-stage{opacity:0;pointer-events:none;transition:opacity .45s ease}

.ix-zoom{position:relative;width:var(--w,0px);height:var(--h,0px);will-change:transform}
.ix-env{position:absolute;inset:0;perspective:calc(var(--h) * 2.4);perspective-origin:50% 50%}
.ix-rect{position:absolute;inset:0}
.ix-env-shadow{box-shadow:0 calc(var(--h)*.035) calc(var(--h)*.083) rgba(120,55,70,.28),0 calc(var(--h)*.007) calc(var(--h)*.017) rgba(120,55,70,.18)}

.ix-lining{background:radial-gradient(120% 90% at 50% 40%,#e9bfc6 0%,var(--lining) 100%)}

/* Inner card inside the physical envelope — shows miniature ceremony mandap painting */
.ix-card{
  position:absolute;left:6.5%;right:6.5%;top:4.5%;bottom:4.5%;
  background:linear-gradient(180deg,#fffdfb 0%,var(--card) 100%);
  box-shadow:0 calc(var(--h)*.004) calc(var(--h)*.011) rgba(110,45,62,.25),inset 0 0 0 1px rgba(200,150,160,.18);
  display:flex;align-items:center;justify-content:center;overflow:hidden;border-radius:4px;
}
.ix-card-paint-wrap{
  width:78%;height:70%;
  display:flex;align-items:center;justify-content:center;
  overflow:hidden;border-radius:3px;
  box-shadow:0 3px 12px rgba(90,40,55,.18);
  border:1px solid rgba(212,175,55,.35);
  background:#FAF5EE;
}
.ix-card-paint-img{
  width:100%;height:100%;object-fit:cover;display:block;
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
.ix-skip{position:absolute;z-index:6;top:max(18px,env(safe-area-inset-top,0px));right:18px;background:none;border:0;cursor:pointer;
  font:700 12px/1 Montserrat,system-ui,sans-serif;letter-spacing:.2em;text-transform:uppercase;color:#3D2600;min-height:44px;padding:0 10px;opacity:0;
  animation:ixRise .8s ease 1.2s both}
.ix-skip:focus-visible{outline:2px solid #8A5A00;outline-offset:3px}
@keyframes ixRise{from{opacity:0;translate:0 10px}to{opacity:1;translate:0 0}}

/* ══════════════════════════════════════════════════════════════════
   POST-ENVELOPE SEQUENCE:
   - Full-bleed Ceremony Mandap Painting covers screen
   - Warm sacred ambient scrim ensures maximum legibility
   - Elegant wedding invitation card typography with Royal Golden Symbol & Tap to Open
   ══════════════════════════════════════════════════════════════════ */
.ix-post-stage{
  position:absolute;inset:0;overflow:hidden;z-index:10;
  display:flex;align-items:center;justify-content:center;
}
.ix-mandap-bg{
  position:absolute;inset:0;width:100%;height:100%;object-fit:cover;
  pointer-events:none;z-index:11;
  user-select:none;-webkit-user-drag:none;
}
.ix-mandap-scrim{
  position:absolute;inset:0;z-index:12;pointer-events:none;
  background:radial-gradient(ellipse at 50% 50%, rgba(18,10,6,.42) 0%, rgba(18,10,6,.78) 100%);
}
.ix-invitation-overlay{
  position:absolute;inset:0;z-index:20;
  display:flex;flex-direction:column;align-items:center;justify-content:center;
  padding:max(24px,env(safe-area-inset-top,0px)) 20px max(24px,env(safe-area-inset-bottom,0px));
  opacity:0;transform:scale(0.96);
  pointer-events:none;
  transition:opacity 0.85s cubic-bezier(0.16, 1, 0.3, 1), transform 0.85s cubic-bezier(0.16, 1, 0.3, 1);
  cursor:pointer;
}
.ix-invitation-overlay[data-visible=true]{
  opacity:1;transform:scale(1);pointer-events:auto;
}
.ix-btn-press{
  transition:transform .2s ease, box-shadow .2s ease;
}
.ix-invitation-overlay:active .ix-btn-press{
  transform:scale(.96);
}

@media (prefers-reduced-motion:reduce){
  .ix-invitation-overlay{transition:none!important}
}
`;

export const Intro: React.FC<IntroProps> = ({
  guestName = '',
  onEnter,
  onDone,
}) => {
  const [phase, setPhase] = useState<'closed' | 'opening' | 'postEnvelope' | 'leaving'>('closed');
  const [cardVisible, setCardVisible] = useState<boolean>(false);
  const [ready, setReady] = useState<boolean>(false);

  const phaseRef = useRef<'closed' | 'opening' | 'postEnvelope' | 'leaving'>('closed');
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

  // Lock body scroll while Intro is visible
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  // Preload essential envelope textures and ceremony mandap painting
  useEffect(() => {
    let alive = true;
    Promise.all([
      ENVELOPE_SRC,
      LINING_SRC,
      SEAL_SRC,
      CEREMONY_MANDAP_SRC,
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

  // Envelope 3D origami unfolding animation engine
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
      zoomEl.style.setProperty('--w', `${(Vu * AC) / lC}px`);
      zoomEl.style.setProperty('--h', `${Vu}px`);
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

      const zoomProgress = ci(ni(t, Sh));
      zoomEl.style.transform = `scale(${Math.exp(Math.log(11) * zoomProgress).toFixed(4)})`;

      const stageProgress = ci(ni(t, Mh));
      rootEl.style.setProperty(
        '--stage',
        `rgb(${qh.map((c, i) => Math.round(Fh(c, Kh[i], stageProgress))).join(',')})`
      );

      paperEl.style.opacity = ci(ni(t, Vh)).toFixed(3);
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

  const startPostEnvelopeSequence = () => {
    changePhase('postEnvelope');
    setCardVisible(false);

    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setCardVisible(true);
      return;
    }

    // Smoothly fade in the invitation card typography overlay on top of full-screen ceremony painting
    const tCard = window.setTimeout(() => {
      setCardVisible(true);
    }, 280);
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
    setCardVisible(true);
  };

  // Card interactive trigger: tapping triggers Qaafirana audio & transitions into main application
  const handleEnter = () => {
    if (phaseRef.current !== 'postEnvelope') return;
    changePhase('leaving');

    try {
      qaafiranaAudio.play();
    } catch (err) {
      console.warn(err);
    }

    // Smooth crossfade: trigger hero staggered reveal at 200ms
    timersRef.current.push(
      window.setTimeout(() => {
        onEnter?.();
      }, 200)
    );

    // Completely unmount intro at 750ms after smooth fade completes
    timersRef.current.push(
      window.setTimeout(() => {
        onDone?.();
      }, 750)
    );
  };

  const cleanGuest = (guestName || '').trim();
  const showCustomGuest = cleanGuest && cleanGuest.toLowerCase() !== 'guest';

  return (
    <div
      ref={rootRef}
      className="ix-root"
      data-phase={phase}
      data-ready={ready}
    >
      <style>{INTRO_CSS}</style>

      {/* ── STEP 1: 3D Origami Envelope with Inner Mandap Ceremony Card ── */}
      <div ref={stageRef} className="ix-stage" aria-hidden="true">
        <div ref={zoomRef} className="ix-zoom">
          <div className="ix-rect ix-env-shadow" />
          <div className="ix-env">
            <div className="ix-rect ix-lining" />

            {/* Inner Card: White parchment with centered miniature Mandap Ceremony Painting */}
            <div className="ix-card">
              <div className="ix-card-paint-wrap">
                <img
                  src={CEREMONY_MANDAP_SRC}
                  alt="Ceremony Mandap"
                  className="ix-card-paint-img"
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
          aria-label="Open the wedding invitation"
        />
      )}

      {/* Skip button while envelope is opening */}
      {phase === 'opening' && (
        <button type="button" className="ix-skip" onClick={handleSkip}>
          Skip
        </button>
      )}

      {/* ── POST-ENVELOPE SEQUENCE: Mandap Ceremony Full View & Invitation Card Overlay ── */}
      {(phase === 'postEnvelope' || phase === 'leaving') && (
        <div className="ix-post-stage">
          {/* Full-bleed Ceremony Mandap Painting */}
          <img
            src={CEREMONY_MANDAP_SRC}
            alt="Sacred Ganga Ceremony"
            className="ix-mandap-bg"
          />

          {/* Warm sacred ambient scrim for optimal text contrast and divine mood */}
          <div className="ix-mandap-scrim" />

          {/* Invitation Card Content Overlay with Royal Golden Wedding Symbol & Tap to Open */}
          <div
            className="ix-invitation-overlay"
            data-visible={cardVisible}
            onClick={handleEnter}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleEnter();
              }
            }}
            role="button"
            tabIndex={0}
            aria-label="Tap to open wedding invitation"
          >
            <div className="w-full max-w-[340px] flex flex-col items-center text-center space-y-4 px-3 select-none">
              {/* Sacred Sanskrit Inscription */}
              <div className="space-y-1">
                <span className="text-xs sm:text-sm font-serif tracking-[0.36em] uppercase text-[#FBF4E6] font-semibold drop-shadow-[0_2px_10px_rgba(0,0,0,0.85)] block">
                  ॥ श्री गणेशाय नमः ॥
                </span>
                <span className="text-[10px] sm:text-[11px] font-sans tracking-[0.42em] uppercase text-[#E5CA92] font-bold drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] block mt-1">
                  SHUBH VIVAH
                </span>
              </div>

              {/* Couple Names */}
              <div className="pt-1">
                <h1 className="font-serif text-3xl sm:text-4xl text-[#FFFDF9] font-normal tracking-wide drop-shadow-[0_4px_18px_rgba(0,0,0,0.9)]">
                  Meher <span className="italic font-serif text-[#E5CA92] px-1 font-light">&</span> Kabir
                </h1>
                <p className="text-[10px] sm:text-[11px] font-sans tracking-[0.32em] uppercase text-[#F5EADB] font-medium mt-1.5 drop-shadow-[0_2px_8px_rgba(0,0,0,0.85)]">
                  21 · 11 · 2027 · RISHIKESH
                </p>
              </div>

              {/* Guest Greeting if provided */}
              {showCustomGuest && (
                <div className="my-1 py-1.5 px-4 rounded-full bg-[#181008]/65 border border-[#DFC48F]/45 backdrop-blur-xs shadow-lg">
                  <p className="font-serif italic text-sm text-[#F7EDE0] tracking-wide">
                    Cordially Inviting {cleanGuest} & Family
                  </p>
                </div>
              )}

              {/* Bespoke Royal Wedding Golden Symbol (Replacing the circular wax sticker) */}
              <div className="py-2 relative flex items-center justify-center ix-btn-press">
                <div className="absolute w-24 h-24 rounded-full bg-[#DFC48F]/20 blur-xl pointer-events-none animate-pulse" />
                <RoyalWeddingSymbol />
              </div>

              {/* Tap to Open Button */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEnter();
                  }}
                  className="ix-btn-press inline-flex items-center space-x-2.5 px-7 py-3 rounded-full bg-[#FAF5EB]/95 hover:bg-[#FFFFFF] text-[#2C1C10] border border-[#D4AF37] shadow-[0_8px_24px_rgba(0,0,0,0.5)] transition-all cursor-pointer"
                >
                  <span className="text-xs font-sans font-bold uppercase tracking-[0.26em] text-[#362012]">
                    Tap to Open
                  </span>
                  <svg
                    className="w-3.5 h-3.5 text-[#8A5A00]"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

