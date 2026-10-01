import React, { useEffect, useRef, useState, useCallback } from 'react';

export interface ScrollPaperPlaneProps {
  containerRef: React.RefObject<HTMLDivElement | null>;
  rowRefs: React.RefObject<(HTMLDivElement | null)[]>;
}

export const ScrollPaperPlane: React.FC<ScrollPaperPlaneProps> = ({
  containerRef,
  rowRefs,
}) => {
  const guidePathRef = useRef<SVGPathElement>(null);
  const maskPathRef = useRef<SVGPathElement>(null);
  const planeGroupRef = useRef<HTMLDivElement>(null);

  const [pathD, setPathD] = useState<string>('');
  const [svgSize, setSvgSize] = useState<{ w: number; h: number }>({ w: 400, h: 2600 });

  const totalLengthRef = useRef<number>(0);

  // Animation state in ref for 60fps direct DOM manipulation (no React re-renders)
  const animRef = useRef({
    currentProgress: 0,
    targetProgress: 0,
    lastProgress: 0,
    lastScrollY: -1,
    unwrappedAngle: 0,
    rafId: 0,
    isFirstFrame: true,
    scrollDirection: 1, // 1 = scrolling down, -1 = scrolling up
  });

  // ──────────────────────────────────────────────────────────────────────────
  // STEP 1: CALCULATE WAYPOINTS & GENERATE SMOOTH BEZIER FLIGHT ROUTE
  // ──────────────────────────────────────────────────────────────────────────
  const calculatePath = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    const cRect = container.getBoundingClientRect();
    const W = container.clientWidth || cRect.width || 400;

    const rows = rowRefs.current || [];
    const waypoints: { x: number; y: number; isLeft: boolean; top: number; bottom: number }[] = [];

    for (let i = 0; i < 7; i++) {
      const el = rows[i];
      const isLeft = i % 2 === 0;

      if (el) {
        const rRect = el.getBoundingClientRect();
        const top = rRect.top - cRect.top;
        const bottom = top + rRect.height;
        const centerY = top + rRect.height * 0.5;
        // Anchor points: curve naturally through each ritual
        const wpX = isLeft
          ? Math.max(28, Math.min(W * 0.22, 105))
          : Math.min(W - 28, Math.max(W * 0.78, W - 105));
        waypoints.push({ x: wpX, y: centerY, isLeft, top, bottom });
      } else {
        const estH = 180;
        const top = 30 + i * (estH + 80);
        const wpX = isLeft ? W * 0.22 : W * 0.78;
        waypoints.push({ x: wpX, y: top + estH * 0.5, isLeft, top, bottom: top + estH });
      }
    }


    // Smooth Bezier path creation
    // Takeoff point (centred above Haldi)
    const startX = W * 0.50;
    const startY = Math.max(5, waypoints[0].top - 65);
    const p0 = waypoints[0];
    const takeoffDy = Math.max(40, p0.y - startY);

    let d = `M ${startX.toFixed(1)} ${startY.toFixed(1)} `;
    d += `C ${(startX + (p0.x - startX) * 0.15).toFixed(1)} ${(startY + takeoffDy * 0.45).toFixed(1)}, ${(p0.x).toFixed(1)} ${(p0.y - takeoffDy * 0.45).toFixed(1)}, ${p0.x.toFixed(1)} ${p0.y.toFixed(1)} `;

    // 0 (Haldi) -> 1 (Mehndi): Smooth S-curve
    const p1 = waypoints[1];
    const dy01 = p1.y - p0.y;
    d += `C ${(p0.x).toFixed(1)} ${(p0.y + dy01 * 0.42).toFixed(1)}, ${(p1.x).toFixed(1)} ${(p1.y - dy01 * 0.42).toFixed(1)}, ${p1.x.toFixed(1)} ${p1.y.toFixed(1)} `;

    // 1 (Mehndi, right) -> 2 (Sangeet, left): Circular Loop-the-Loop in the center gap
    const p2 = waypoints[2];
    const cx1 = W * 0.50;
    const cy1 = p1.y + (p2.y - p1.y) * 0.50;
    const r1 = Math.min(30.0, W * 0.08);
    const k1 = 0.55228 * r1;
    const entry1_x = cx1 + 15;
    const entry1_y = cy1 - r1 + 8;

    d += `C ${(p1.x - 20).toFixed(1)} ${(p1.y + 50).toFixed(1)}, ${(cx1 + 55).toFixed(1)} ${(cy1 - r1 - 10).toFixed(1)}, ${entry1_x.toFixed(1)} ${entry1_y.toFixed(1)} `;
    d += `C ${(entry1_x - k1).toFixed(1)} ${(entry1_y - 12).toFixed(1)}, ${(cx1 - r1).toFixed(1)} ${(cy1 - k1).toFixed(1)}, ${(cx1 - r1).toFixed(1)} ${cy1.toFixed(1)} `;
    d += `C ${(cx1 - r1).toFixed(1)} ${(cy1 + k1).toFixed(1)}, ${(cx1 - k1).toFixed(1)} ${(cy1 + r1).toFixed(1)}, ${cx1.toFixed(1)} ${(cy1 + r1).toFixed(1)} `;
    d += `C ${(cx1 + k1).toFixed(1)} ${(cy1 + r1).toFixed(1)}, ${(cx1 + r1).toFixed(1)} ${(cy1 + k1).toFixed(1)}, ${(cx1 + r1).toFixed(1)} ${cy1.toFixed(1)} `;
    d += `C ${(cx1 + r1).toFixed(1)} ${(cy1 - k1).toFixed(1)}, ${(cx1 + k1).toFixed(1)} ${(cy1 - r1 + 10).toFixed(1)}, ${(cx1 - 12).toFixed(1)} ${(cy1 - r1 + 20).toFixed(1)} `;
    d += `C ${(cx1 - 45).toFixed(1)} ${(cy1 + 15).toFixed(1)}, ${(p2.x + 35).toFixed(1)} ${(p2.y - 70).toFixed(1)}, ${p2.x.toFixed(1)} ${p2.y.toFixed(1)} `;

    // 2 (Sangeet) -> 3 (Baraat): Smooth S-curve
    const p3 = waypoints[3];
    const dy23 = p3.y - p2.y;
    d += `C ${(p2.x).toFixed(1)} ${(p2.y + dy23 * 0.42).toFixed(1)}, ${(p3.x).toFixed(1)} ${(p3.y - dy23 * 0.42).toFixed(1)}, ${p3.x.toFixed(1)} ${p3.y.toFixed(1)} `;

    // 3 (Baraat, right) -> 4 (Varmala, left): In-flight mini-heart loop in the center gap
    const p4 = waypoints[4];
    const cx2 = W * 0.50;
    const cy2 = p3.y + (p4.y - p3.y) * 0.50;
    const hr_scale = Math.min(1.0, W / 400.0);
    const cleft_x = cx2;
    const cleft_y = cy2 - 20 * hr_scale;
    const tip_y = cy2 + 25 * hr_scale;
    const w_lobe = 30 * hr_scale;

    d += `C ${(p3.x - 25).toFixed(1)} ${(p3.y + 50).toFixed(1)}, ${(cx2 + 30).toFixed(1)} ${(cleft_y - 45).toFixed(1)}, ${cleft_x.toFixed(1)} ${cleft_y.toFixed(1)} `;
    d += `C ${(cleft_x + w_lobe * 0.4).toFixed(1)} ${(cleft_y - 32 * hr_scale).toFixed(1)}, ${(cleft_x + w_lobe * 1.05).toFixed(1)} ${(cleft_y - 10 * hr_scale).toFixed(1)}, ${(cleft_x + w_lobe).toFixed(1)} ${(cleft_y + 12 * hr_scale).toFixed(1)} `;
    d += `C ${(cleft_x + w_lobe * 0.85).toFixed(1)} ${(cy2 + 10 * hr_scale).toFixed(1)}, ${(cleft_x + 10 * hr_scale).toFixed(1)} ${(tip_y - 5).toFixed(1)}, ${cleft_x.toFixed(1)} ${tip_y.toFixed(1)} `;
    d += `C ${(cleft_x - 10 * hr_scale).toFixed(1)} ${(tip_y - 5).toFixed(1)}, ${(cleft_x - w_lobe * 0.85).toFixed(1)} ${(cy2 + 10 * hr_scale).toFixed(1)}, ${(cleft_x - w_lobe).toFixed(1)} ${(cleft_y + 12 * hr_scale).toFixed(1)} `;
    d += `C ${(cleft_x - w_lobe * 1.05).toFixed(1)} ${(cleft_y - 10 * hr_scale).toFixed(1)}, ${(cleft_x - w_lobe * 0.4).toFixed(1)} ${(cleft_y - 32 * hr_scale).toFixed(1)}, ${cleft_x.toFixed(1)} ${cleft_y.toFixed(1)} `;
    d += `C ${(cleft_x - 30).toFixed(1)} ${(cleft_y + 15).toFixed(1)}, ${(p4.x + 35).toFixed(1)} ${(p4.y - 70).toFixed(1)}, ${p4.x.toFixed(1)} ${p4.y.toFixed(1)} `;

    // 4 (Varmala) -> 5 (Saat Phere): Smooth S-curve
    const p5 = waypoints[5];
    const dy45 = p5.y - p4.y;
    d += `C ${(p4.x).toFixed(1)} ${(p4.y + dy45 * 0.42).toFixed(1)}, ${(p5.x).toFixed(1)} ${(p5.y - dy45 * 0.42).toFixed(1)}, ${p5.x.toFixed(1)} ${p5.y.toFixed(1)} `;

    // 5 (Saat Phere) -> 6 (Reception): Smooth S-curve
    const p6 = waypoints[6];
    const dy56 = p6.y - p5.y;
    d += `C ${(p5.x).toFixed(1)} ${(p5.y + dy56 * 0.42).toFixed(1)}, ${(p6.x).toFixed(1)} ${(p6.y - dy56 * 0.42).toFixed(1)}, ${p6.x.toFixed(1)} ${p6.y.toFixed(1)} `;

    // 6 (Reception) -> GRAND FINALE HEART FLOURISH!
    // As the flight concludes after Reception, the plane swoops into the bottom center,
    // draws a magnificent romantic heart with its golden dashed trail, and settles gracefully at the cleft.
    const cx_f = W * 0.50;
    const cy_f = (p6.bottom || p6.y + 90) + 30;
    const f_scale = Math.min(1.0, W / 380.0);
    const fcleft_x = cx_f;
    const fcleft_y = cy_f;
    const ftip_y = cy_f + 85 * f_scale;
    const fw_lobe = 56 * f_scale;

    // Approach from Reception into Heart top cleft
    d += `C ${(p6.x + 45).toFixed(1)} ${(p6.y + 55).toFixed(1)}, ${(cx_f).toFixed(1)} ${(fcleft_y - 45).toFixed(1)}, ${fcleft_x.toFixed(1)} ${fcleft_y.toFixed(1)} `;
    // Right lobe
    d += `C ${(fcleft_x + 25 * f_scale).toFixed(1)} ${(fcleft_y - 34 * f_scale).toFixed(1)}, ${(fcleft_x + fw_lobe * 1.05).toFixed(1)} ${(fcleft_y - 12 * f_scale).toFixed(1)}, ${(fcleft_x + fw_lobe).toFixed(1)} ${(fcleft_y + 20 * f_scale).toFixed(1)} `;
    // Right flank down to tip
    d += `C ${(fcleft_x + fw_lobe * 0.9).toFixed(1)} ${(fcleft_y + 50 * f_scale).toFixed(1)}, ${(fcleft_x + 24 * f_scale).toFixed(1)} ${(ftip_y - 8 * f_scale).toFixed(1)}, ${fcleft_x.toFixed(1)} ${ftip_y.toFixed(1)} `;
    // Left flank up from tip
    d += `C ${(fcleft_x - 24 * f_scale).toFixed(1)} ${(ftip_y - 8 * f_scale).toFixed(1)}, ${(fcleft_x - fw_lobe * 0.9).toFixed(1)} ${(fcleft_y + 50 * f_scale).toFixed(1)}, ${(fcleft_x - fw_lobe).toFixed(1)} ${(fcleft_y + 20 * f_scale).toFixed(1)} `;
    // Left lobe back to top cleft
    d += `C ${(fcleft_x - fw_lobe * 1.05).toFixed(1)} ${(fcleft_y - 12 * f_scale).toFixed(1)}, ${(fcleft_x - 25 * f_scale).toFixed(1)} ${(fcleft_y - 34 * f_scale).toFixed(1)}, ${fcleft_x.toFixed(1)} ${fcleft_y.toFixed(1)} `;

    const totalH = Math.max(container.scrollHeight, container.offsetHeight, ftip_y + 60);
    setSvgSize({ w: W, h: totalH });

    setPathD(d);
  }, [containerRef, rowRefs]);

  // Recalculate on mount, resize, orientation
  useEffect(() => {
    calculatePath();

    const timer = setTimeout(calculatePath, 80);
    window.addEventListener('resize', calculatePath);
    window.addEventListener('orientationchange', calculatePath);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', calculatePath);
      window.removeEventListener('orientationchange', calculatePath);
    };
  }, [calculatePath]);

  // Read totalLength ONCE when pathD changes
  useEffect(() => {
    const guide = guidePathRef.current;
    if (!guide || !pathD) return;

    try {
      const len = guide.getTotalLength();
      if (len > 0) {
        totalLengthRef.current = len;
        // Initialize mask stroke-dasharray and dashoffset
        const maskPath = maskPathRef.current;
        if (maskPath) {
          maskPath.style.strokeDasharray = `${len}`;
          maskPath.style.strokeDashoffset = `${len}`;
        }
      }
    } catch (e) {
      console.error('Error measuring path totalLength:', e);
    }
  }, [pathD]);

  // ──────────────────────────────────────────────────────────────────────────
  // SCROLL PROGRESS CALCULATION (Paced gently with cursor and scroll)
  // ──────────────────────────────────────────────────────────────────────────
  const getScrollProgress = useCallback((): number => {
    const container = containerRef.current;
    if (!container) return 0;

    // Detect if inside desktop phone scroll container or native window
    const phoneScroll = document.querySelector<HTMLElement>('[data-phone-scroll="true"]');
    const isPhoneMockupActive = Boolean(
      phoneScroll &&
      phoneScroll.clientHeight > 0 &&
      typeof window !== 'undefined' &&
      window.innerWidth >= 1024
    );
    const scrollRoot = isPhoneMockupActive ? phoneScroll : null;

    const vTop = scrollRoot ? scrollRoot.getBoundingClientRect().top : 0;
    const vHeight = scrollRoot ? scrollRoot.clientHeight : window.innerHeight;

    const rows = rowRefs.current || [];
    const haldiEl = rows[0];
    const receptionEl = rows[6];

    if (haldiEl && receptionEl) {
      const haldiRect = haldiEl.getBoundingClientRect();
      const receptionRect = receptionEl.getBoundingClientRect();

      // Generous reading focal range:
      // Begins as Celebrations header and Haldi glide into view (82% down viewport)
      // Completes gently when Reception has concluded presentation (18% down viewport)
      const startY = vHeight * 0.82;
      const endY = vHeight * 0.18;

      const haldiTop = haldiRect.top - vTop;
      const receptionBottom = receptionRect.bottom - vTop;
      const finaleBottom = receptionBottom + 140;

      const travel = startY - haldiTop;
      const totalTravel = (finaleBottom - haldiTop) + (startY - endY);

      if (totalTravel <= 0) return 0;
      return Math.min(Math.max(travel / totalTravel, 0), 1);
    }

    // Fallback using containerRef directly
    const rect = container.getBoundingClientRect();
    const topInViewport = rect.top - vTop;
    const totalH = rect.height;

    const startY = vHeight * 0.82;
    const endY = vHeight * 0.18;

    const currentScroll = startY - topInViewport;
    const totalScroll = totalH - endY + startY;

    if (totalScroll <= 0) return 0;
    return Math.min(Math.max(currentScroll / totalScroll, 0), 1);
  }, [containerRef, rowRefs]);

  // ──────────────────────────────────────────────────────────────────────────
  // CONTINUOUS 60fps rAF LOOP (SMOOTH INERTIA GLIDE + CALM ROTATION)
  // ──────────────────────────────────────────────────────────────────────────
  useEffect(() => {
    const isReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const guide = guidePathRef.current;
    const mask = maskPathRef.current;
    const plane = planeGroupRef.current;

    // Reduced motion fallback: static fully revealed pose
    if (isReducedMotion) {
      if (mask && totalLengthRef.current > 0) {
        mask.style.strokeDashoffset = '0';
      }
      if (guide && plane && totalLengthRef.current > 0) {
        const pt = guide.getPointAtLength(totalLengthRef.current * 0.5);
        plane.style.transform = `translate3d(${pt.x}px, ${pt.y}px, 0px) rotate(45deg)`;
      }
      return;
    }

    let isRunning = true;

    const updateFrame = () => {
      if (!isRunning) return;

      const state = animRef.current;

      // Auto-measure length if not already measured
      let L = totalLengthRef.current;
      if ((!L || L <= 0) && guidePathRef.current) {
        try {
          L = guidePathRef.current.getTotalLength();
          if (L > 0) {
            totalLengthRef.current = L;
            if (maskPathRef.current) {
              maskPathRef.current.style.strokeDasharray = `${L}`;
              maskPathRef.current.style.strokeDashoffset = `${L}`;
            }
          }
        } catch (_) {}
      }

      // Continuously sample scroll progress on each frame
      state.targetProgress = getScrollProgress();

      // Check progress drift for direction detection
      const progressDelta = state.targetProgress - state.lastProgress;
      if (progressDelta > 0.0003) {
        state.scrollDirection = 1;
        state.lastProgress = state.targetProgress;
      } else if (progressDelta < -0.0003) {
        state.scrollDirection = -1;
        state.lastProgress = state.targetProgress;
      }

      const currentGuide = guidePathRef.current;
      const currentMask = maskPathRef.current;
      const currentPlane = planeGroupRef.current;

      if (currentGuide && L > 0 && currentPlane) {
        // Silky-smooth aerodynamic gliding inertia
        state.currentProgress += (state.targetProgress - state.currentProgress) * 0.08;
        if (Math.abs(state.targetProgress - state.currentProgress) < 1e-4) {
          state.currentProgress = state.targetProgress;
        }

        const p = Math.min(Math.max(state.currentProgress, 0), 1);
        const currentS = p * L;

        // Position on path
        const pt = currentGuide.getPointAtLength(currentS);

        // Heading angle: sample 2 points across path tangent
        const s1 = Math.max(0, currentS - 2.5);
        const s2 = Math.min(L, currentS + 2.5);
        const pt1 = currentGuide.getPointAtLength(s1);
        const pt2 = currentGuide.getPointAtLength(s2);
        const dx = pt2.x - pt1.x;
        const dy = pt2.y - pt1.y;

        if (Math.abs(dx) > 1e-4 || Math.abs(dy) > 1e-4) {
          // Sprite nose is (0,-28), pointing UP (0 deg).
          // When moving DOWN (dx=0, dy>0), forward tangent is Math.atan2 = 90 deg -> +90 = 180 deg (DOWN).
          // When scrolling UP back up the rituals (scrollDirection === -1), tangent of flight is (-dx, -dy) -> 0 deg (UP).
          const isScrollingUp = state.scrollDirection === -1;
          const targetAngle = isScrollingUp
            ? Math.atan2(-dy, -dx) * (180 / Math.PI) + 90
            : Math.atan2(dy, dx) * (180 / Math.PI) + 90;

          if (state.isFirstFrame) {
            state.unwrappedAngle = targetAngle;
            state.isFirstFrame = false;
          } else {
            let diff = targetAngle - state.unwrappedAngle;
            // Shortest rotational arc on circle [-180, 180]
            diff = ((diff + 180) % 360 + 360) % 360 - 180;
            // Decisive and smooth turn
            state.unwrappedAngle += diff * 0.12;
          }
        }

        // Reveal dashed trail via mask
        if (currentMask) {
          const offset = Math.max(0, L * (1 - p));
          currentMask.style.strokeDashoffset = `${offset.toFixed(1)}`;
        }

        // Gentle 3D banking into curves & turns
        const angleRad = (state.unwrappedAngle * Math.PI) / 180;
        const bankX = Math.max(-7, Math.min(7, -Math.sin(angleRad) * 5));
        const bankY = Math.max(-7, Math.min(7, Math.cos(angleRad) * 5));

        // Soft anti-gravity floating idle motion
        const time = performance.now();
        const floatOffsetY = Math.sin(time / 1400) * 3.5;
        const floatWobble = Math.sin(time / 1100) * 0.8;

        const finalX = pt.x;
        const finalY = pt.y + floatOffsetY;
        const finalRot = state.unwrappedAngle + floatWobble;
        const finalScale = 0.96 + Math.min(0.08, Math.abs(dx) * 0.01);
        const finalZ = 16;

        // Clean 3D transform without dark shadow
        currentPlane.style.transform = `translate3d(${finalX.toFixed(2)}px, ${finalY.toFixed(2)}px, 0px) rotate(${finalRot.toFixed(2)}deg) rotateX(${bankX.toFixed(1)}deg) rotateY(${bankY.toFixed(1)}deg) scale(${finalScale.toFixed(3)}) translateZ(${finalZ}px)`;
      }

      state.rafId = requestAnimationFrame(updateFrame);
    };

    animRef.current.rafId = requestAnimationFrame(updateFrame);

    const updateScrollDirection = (currentY: number) => {
      const state = animRef.current;
      if (state.lastScrollY >= 0) {
        const delta = currentY - state.lastScrollY;
        if (delta > 1.5) {
          state.scrollDirection = 1;
        } else if (delta < -1.5) {
          state.scrollDirection = -1;
        }
      }
      state.lastScrollY = currentY;
    };

    const onScroll = () => {
      const phoneScroll = document.querySelector<HTMLElement>('[data-phone-scroll="true"]');
      const isPhoneMockupActive = Boolean(
        phoneScroll &&
        phoneScroll.clientHeight > 0 &&
        typeof window !== 'undefined' &&
        window.innerWidth >= 1024
      );
      const currentY = (isPhoneMockupActive && phoneScroll)
        ? phoneScroll.scrollTop
        : (window.scrollY || document.documentElement.scrollTop || 0);

      updateScrollDirection(currentY);
      animRef.current.targetProgress = getScrollProgress();
    };

    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) > 0.5) {
        animRef.current.scrollDirection = e.deltaY > 0 ? 1 : -1;
      }
      animRef.current.targetProgress = getScrollProgress();
    };

    let touchStartY = 0;
    const onTouchStart = (e: TouchEvent) => {
      if (e.touches[0]) {
        touchStartY = e.touches[0].clientY;
      }
    };
    const onTouchMove = (e: TouchEvent) => {
      if (e.touches[0]) {
        const delta = touchStartY - e.touches[0].clientY;
        if (Math.abs(delta) > 2) {
          animRef.current.scrollDirection = delta > 0 ? 1 : -1;
          touchStartY = e.touches[0].clientY;
        }
      }
      animRef.current.targetProgress = getScrollProgress();
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('wheel', onWheel, { passive: true });
    window.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: true });
    document.addEventListener('scroll', onScroll, { passive: true });

    // Look for scroll container in phone mockup or anywhere in DOM
    const attachScrollListeners = () => {
      const scrollEls = document.querySelectorAll<HTMLElement>('[data-phone-scroll="true"]');
      scrollEls.forEach((el) => {
        el.addEventListener('scroll', onScroll, { passive: true });
        el.addEventListener('wheel', onWheel, { passive: true });
      });
    };
    attachScrollListeners();
    const attachTimer = setTimeout(attachScrollListeners, 250);

    return () => {
      isRunning = false;
      clearTimeout(attachTimer);
      if (animRef.current.rafId) {
        cancelAnimationFrame(animRef.current.rafId);
      }
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      document.removeEventListener('scroll', onScroll);
      const scrollEls = document.querySelectorAll<HTMLElement>('[data-phone-scroll="true"]');
      scrollEls.forEach((el) => {
        el.removeEventListener('scroll', onScroll);
        el.removeEventListener('wheel', onWheel);
      });
    };
  }, [getScrollProgress]);

  return (
    <div
      aria-hidden="true"
      className="absolute inset-0 pointer-events-none overflow-visible z-15"
      style={{
        width: '100%',
        height: `${svgSize.h}px`,
        perspective: '900px',
        transformStyle: 'preserve-3d',
      }}
    >
      <svg
        className="w-full h-full overflow-visible"
        viewBox={`0 0 ${svgSize.w} ${svgSize.h}`}
        preserveAspectRatio="none"
      >
        <defs>
          {/* Guide Path Reference for getPointAtLength */}
          <path ref={guidePathRef} d={pathD} fill="none" />

          {/* STEP 2: revealMask - White stroked copy of the SAME path d */}
          <mask id="revealMask" maskUnits="userSpaceOnUse" x="0" y="0" width={svgSize.w} height={svgSize.h}>
            <path
              ref={maskPathRef}
              d={pathD}
              fill="none"
              stroke="#ffffff"
              strokeWidth="24"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </mask>
        </defs>

        {/* ── STEP 2: The permanently-dashed trail in tan/gold accent ── */}
        <g mask="url(#revealMask)">
          <path
            d={pathD}
            fill="none"
            stroke="#B88E4C"
            strokeWidth="2.0"
            strokeDasharray="12 9"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.85"
          />
        </g>
      </svg>

      {/* ── CLEAN, PROPORTIONATE 3D ORIGAMI PAPER PLANE (MATCHING USER REFERENCE, NO DARK SHADOW) ── */}
      <div
        ref={planeGroupRef}
        className="absolute top-0 left-0 -ml-7 -mt-7 w-14 h-14 sm:-ml-8 sm:-mt-8 sm:w-16 sm:h-16 pointer-events-none select-none"
        style={{
          transformStyle: 'preserve-3d',
          willChange: 'transform',
        }}
      >
        <svg
          viewBox="-30 -30 60 60"
          className="w-full h-full overflow-visible drop-shadow-[0_3px_10px_rgba(184,142,76,0.20)]"
        >
          {/* Origami Left Main Wing Facet */}
          <polygon
            points="0,-28 -26,18 -3,9"
            fill="#F3ECE4"
            stroke="#B88E4C"
            strokeWidth="1.1"
            strokeLinejoin="round"
          />

          {/* Origami Right Main Wing Facet (Sunlit side) */}
          <polygon
            points="0,-28 26,18 3,9"
            fill="#FFFFFF"
            stroke="#B88E4C"
            strokeWidth="1.1"
            strokeLinejoin="round"
          />

          {/* Origami Left Inner Fuselage Facet */}
          <polygon
            points="0,-28 -3,9 0,7"
            fill="#E5D9CB"
            stroke="#B88E4C"
            strokeWidth="0.8"
            strokeLinejoin="round"
          />

          {/* Origami Right Inner Fuselage Facet */}
          <polygon
            points="0,-28 0,7 3,9"
            fill="#F6EFE6"
            stroke="#B88E4C"
            strokeWidth="0.8"
            strokeLinejoin="round"
          />

          {/* Under-Keel Diamond Tab */}
          <polygon
            points="-3,9 0,17 3,9 0,7"
            fill="#C9B69C"
            stroke="#B88E4C"
            strokeWidth="1.1"
            strokeLinejoin="round"
          />

          {/* Gold Nose Tip Cap (Left half) */}
          <polygon
            points="0,-28 -6,-14 0,-14"
            fill="#BE9650"
            stroke="#B88E4C"
            strokeWidth="0.8"
            strokeLinejoin="round"
          />

          {/* Gold Nose Tip Cap (Right half) */}
          <polygon
            points="0,-28 0,-14 6,-14"
            fill="#D4AC64"
            stroke="#B88E4C"
            strokeWidth="0.8"
            strokeLinejoin="round"
          />

          {/* Center Fold Crease Line */}
          <line
            x1="0"
            y1="-28"
            x2="0"
            y2="7"
            stroke="#946E2E"
            strokeWidth="1.4"
            strokeLinecap="round"
          />
        </svg>
      </div>
    </div>
  );
};

