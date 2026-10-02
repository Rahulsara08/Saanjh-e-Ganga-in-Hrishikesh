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

// The 2 user-provided image assets for the post-envelope sequence
const PLAIN_PAPER_SRC = '/intro/plain_paper_card.jpg';
const CEREMONY_PAINTING_SRC = '/intro/ceremony_painting.jpg';

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

const INTRO_CSS = `
.ix-root{position:absolute;inset:0;overflow:hidden;background-color:var(--stage,#f6e4e6);touch-action:none;overscroll-behavior:contain;
  --lining:#dcaab3;--card:#fffaf6;--shadow:rgba(110,45,62,.55);-webkit-tap-highlight-color:transparent;z-index:50}
.ix-root[data-phase=leaving]{background-color:transparent;pointer-events:none;transition:background-color .8s ease .2s,opacity .8s ease .2s;opacity:0}

.ix-stage{position:absolute;inset:0;display:grid;place-items:center;opacity:0;transition:opacity .8s ease}
.ix-root[data-ready=true] .ix-stage{opacity:1}
.ix-root[data-phase=postEnvelope] .ix-stage{opacity:0;pointer-events:none;transition:opacity .5s ease}

.ix-zoom{position:relative;width:var(--w,0px);height:var(--h,0px);will-change:transform}
.ix-env{position:absolute;inset:0;perspective:calc(var(--h) * 2.4);perspective-origin:50% 50%}
.ix-rect{position:absolute;inset:0}
.ix-env-shadow{box-shadow:0 calc(var(--h)*.035) calc(var(--h)*.083) rgba(120,55,70,.28),0 calc(var(--h)*.007) calc(var(--h)*.017) rgba(120,55,70,.18)}
.ix-lining{background:radial-gradient(120% 90% at 50% 40%,#e9bfc6 0%,var(--lining) 100%)}
.ix-card{position:absolute;left:6.5%;right:6.5%;top:4.5%;bottom:4.5%;background:linear-gradient(180deg,#fffdfb 0%,var(--card) 100%);
  box-shadow:0 calc(var(--h)*.004) calc(var(--h)*.011) rgba(110,45,62,.25),inset 0 0 0 1px rgba(200,150,160,.18)}
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
   POST-ENVELOPE SEQUENCE (IMAGE 2 = Fixed, IMAGE 3 = Zooms, Seal Fades In)
   ══════════════════════════════════════════════════════════════════ */
.ix-post-stage{position:absolute;inset:0;overflow:hidden;z-index:10}

/* IMAGE 2: Plain paper card - Completely fixed, static background canvas */
.ix-paper-bg{
  position:absolute;inset:0;width:100%;height:100%;object-fit:cover;pointer-events:none;z-index:11;
  user-select:none;-webkit-user-drag:none;
}

/* IMAGE 3: Small centered ceremony painting - ONLY ZOOMING ELEMENT */
.ix-painting-box{
  position:absolute;left:50%;top:50%;
  width:125px;height:168px;
  transform-origin:50% 50%;
  will-change:transform;
  z-index:20;
  pointer-events:none;
  overflow:hidden;
}
.ix-painting-box[data-step=init]{
  transform:translate(-50%, -50%) scale(1);
  box-shadow:0 10px 30px rgba(0,0,0,.22);
  border-radius:14px;
}
.ix-painting-box[data-step=zooming]{
  transform:translate(-50%, -50%) scale(var(--fill-scale, 5.2));
  transition:transform 2.2s cubic-bezier(0.25, 0.1, 0.25, 1), border-radius 1.8s ease, box-shadow 1.4s ease;
  box-shadow:none;
  border-radius:0px;
}
.ix-painting-box[data-step=hold],
.ix-painting-box[data-step=seal],
.ix-painting-box[data-step=leaving]{
  transform:translate(-50%, -50%) scale(var(--fill-scale, 5.2));
  box-shadow:none;
  border-radius:0px;
}
.ix-painting-img{
  width:100%;height:100%;object-fit:cover;display:block;
  user-select:none;-webkit-user-drag:none;
}

/* SEAL SECTION: Fades in smoothly directly on top of the full-screen ceremony painting */
.ix-seal-section{
  position:absolute;inset:0;z-index:30;
  display:flex;flex-direction:column;align-items:center;justify-content:center;
  padding:max(24px,env(safe-area-inset-top,0px)) 20px max(24px,env(safe-area-inset-bottom,0px));
  opacity:0;pointer-events:none;
  transition:opacity .85s cubic-bezier(.2,.8,.2,1);
  cursor:pointer;
  background:radial-gradient(ellipse at 50% 50%, rgba(18,11,7,.38) 0%, rgba(18,11,7,.68) 100%);
}
.ix-seal-section[data-visible=true]{
  opacity:1;pointer-events:auto;
}
.ix-seal-press{
  transition:transform .2s ease;
}
.ix-seal-section:active .ix-seal-press{
  transform:scale(.95);
}

@media (prefers-reduced-motion:reduce){
  .ix-painting-box{transition:none!important}
  .ix-seal-section{transition:none!important}
}
`;

export const Intro: React.FC<IntroProps> = ({
  guestName = '',
  onEnter,
  onDone,
}) => {
  const [phase, setPhase] = useState<'closed' | 'opening' | 'postEnvelope' | 'leaving'>('closed');
  const [postStep, setPostStep] = useState<'init' | 'zooming' | 'hold' | 'seal' | 'leaving'>('init');
  const [ready, setReady] = useState<boolean>(false);
  const [fillScale, setFillScale] = useState<number>(5.2);

  const phaseRef = useRef<'closed' | 'opening' | 'postEnvelope' | 'leaving'>('closed');
  const postStepRef = useRef<'init' | 'zooming' | 'hold' | 'seal' | 'leaving'>('init');
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

  const changePostStep = (step: 'init' | 'zooming' | 'hold' | 'seal' | 'leaving') => {
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

  // Preload essential envelope textures and the 2 post-envelope images
  useEffect(() => {
    let alive = true;
    Promise.all([
      ENVELOPE_SRC,
      LINING_SRC,
      SEAL_SRC,
      PLAIN_PAPER_SRC,
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

  // Compute exact fill scale needed for IMAGE 3 (Painting) to completely cover the mobile screen
  const calculateFillScale = () => {
    if (!rootRef.current) return;
    const pW = rootRef.current.clientWidth || 390;
    const pH = rootRef.current.clientHeight || 844;
    const initW = 125;
    const initH = 125 * (1024 / 764); // ~167.5px
    // Scale factor to completely fill both width and height like object-fit: cover + 5% bleed
    const scale = Math.max(pW / initW, pH / initH) * 1.05;
    setFillScale(Math.max(scale, 3.5));
  };

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
      zoomEl.style.setProperty('--w', `${(Vu * AC) / lC}px`);
      zoomEl.style.setProperty('--h', `${Vu}px`);
      calculateFillScale();
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

  // Post-envelope sequence orchestration:
  // 1. Plain paper card (IMAGE 2) appears as stationary background
  // 2. Ceremony painting (IMAGE 3) is small in center
  // 3. ONLY IMAGE 3 zooms smoothly to fill screen
  // 4. Painting holds stable
  // 5. Seal section smoothly fades in directly on top of IMAGE 3
  const startPostEnvelopeSequence = () => {
    calculateFillScale();
    changePhase('postEnvelope');
    changePostStep('init');

    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      changePostStep('seal');
      return;
    }

    // Step 4: After stationary paper is visible and painting is small in center, zoom only the center painting
    const tZoom = window.setTimeout(() => {
      changePostStep('zooming');
    }, 300);
    timersRef.current.push(tZoom);

    // Step 5 & 6: Once painting completely fills screen, STOP and HOLD
    const tHold = window.setTimeout(() => {
      changePostStep('hold');
    }, 2500); // 300ms + 2200ms zoom animation
    timersRef.current.push(tHold);

    // Step 8: Smoothly fade in the seal section directly on top of the ceremony painting
    const tSeal = window.setTimeout(() => {
      changePostStep('seal');
    }, 3100); // 2500ms + 600ms hold
    timersRef.current.push(tSeal);
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
    calculateFillScale();
    changePhase('postEnvelope');
    changePostStep('seal');
  };

  // Seal section interactive trigger: tap transitions smoothly into main application
  const handleEnter = () => {
    if (postStepRef.current !== 'seal') return;
    changePhase('leaving');
    changePostStep('leaving');

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
      style={{ '--fill-scale': fillScale } as React.CSSProperties}
    >
      <style>{INTRO_CSS}</style>

      {/* ── STEP 1: Existing 3D Envelope Origami Stage (Kept 100% exactly intact) ── */}
      <div ref={stageRef} className="ix-stage" aria-hidden="true">
        <div ref={zoomRef} className="ix-zoom">
          <div className="ix-rect ix-env-shadow" />
          <div className="ix-env">
            <div className="ix-rect ix-lining" />
            <div className="ix-card" />
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

      {/* Skip button while envelope is opening */}
      {phase === 'opening' && (
        <button type="button" className="ix-skip" onClick={handleSkip}>
          Skip
        </button>
      )}

      {/* ── POST-ENVELOPE SEQUENCE (Steps 2 to 8) ── */}
      {(phase === 'postEnvelope' || phase === 'leaving') && (
        <div className="ix-post-stage">
          {/* STEP 2: IMAGE 2 (Plain Paper Card) = Fixed, completely static background canvas */}
          <img
            src={PLAIN_PAPER_SRC}
            alt=""
            aria-hidden="true"
            className="ix-paper-bg"
          />

          {/* STEP 3, 4, 5: IMAGE 3 (Ceremony Painting) = Small centered image that performs the ONLY zoom animation */}
          <div className="ix-painting-box" data-step={postStep}>
            <img
              src={CEREMONY_PAINTING_SRC}
              alt="Sacred Ganga Ceremony Painting"
              className="ix-painting-img"
            />
          </div>

          {/* STEP 8: Seal Section = Fades in smoothly directly on top of the full-screen ceremony painting */}
          <div
            className="ix-seal-section"
            data-visible={postStep === 'seal' || postStep === 'leaving'}
            onClick={handleEnter}
            role="button"
            tabIndex={0}
            aria-label="Tap seal to open wedding invitation"
          >
            <div className="w-full max-w-[320px] flex flex-col items-center text-center space-y-4 px-2">
              {/* Auspicious Sanskrit Inscription */}
              <div className="space-y-1">
                <span className="text-[11px] sm:text-xs font-serif tracking-[0.34em] uppercase text-[#F5E6CC] font-semibold drop-shadow-md block">
                  ॥ श्री गणेशाय नमः ॥
                </span>
                <span className="text-[9px] sm:text-[10px] font-sans tracking-[0.38em] uppercase text-[#DFC48F] font-bold drop-shadow-md block">
                  SHUBH VIVAH
                </span>
              </div>

              {/* Couple Names */}
              <div className="pt-1">
                <h2 className="font-serif text-3xl sm:text-4xl text-[#FFFDF8] font-normal tracking-wide drop-shadow-[0_2px_14px_rgba(0,0,0,0.65)]">
                  Meher <span className="italic font-serif text-[#E2C997] px-1">&</span> Kabir
                </h2>
                <p className="text-[10px] sm:text-[11px] font-sans tracking-[0.28em] uppercase text-[#F1E5D4] font-medium mt-1 drop-shadow-md">
                  21 · 11 · 2027 · Rishikesh
                </p>
              </div>

              {/* Personal Guest Greeting if provided */}
              {showCustomGuest && (
                <div className="py-1 px-4 rounded-full bg-[#1F140E]/65 border border-[#DFC48F]/50 backdrop-blur-xs shadow-md">
                  <p className="font-serif italic text-sm text-[#F7EDE0] tracking-wide">
                    Cordially Inviting {cleanGuest} & Family
                  </p>
                </div>
              )}

              {/* Iconic Wax Seal Button */}
              <div className="pt-2 pb-1 relative flex items-center justify-center ix-seal-press">
                {/* Soft ambient golden glow */}
                <div className="absolute w-28 h-28 rounded-full bg-[#DFC48F]/25 blur-xl pointer-events-none" />
                <div className="relative group transition-transform duration-300 hover:scale-105">
                  <img
                    src={SEAL_SRC}
                    alt="Wax Seal"
                    className="w-24 h-24 sm:w-28 sm:h-28 object-contain drop-shadow-[0_12px_28px_rgba(0,0,0,0.7)] select-none pointer-events-none"
                  />
                </div>
              </div>

              {/* Tap Instruction Pill */}
              <div className="pt-1">
                <div className="inline-flex items-center space-x-2 px-5 py-2 rounded-full bg-[#FFFBF7]/90 hover:bg-[#FFFBF7] text-[#2A1D13] border border-[#DFC48F] shadow-[0_4px_16px_rgba(0,0,0,0.35)] transition-all hover:scale-102 active:scale-98">
                  <span className="text-[10px] font-sans font-semibold uppercase tracking-[0.24em]">
                    Tap Seal to Open
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
