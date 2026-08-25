"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
  useTransform,
  useMotionValueEvent,
} from "framer-motion";
import { Minus, Plus, X } from "lucide-react";
import { type GalaxyPhoto } from "@/data/memories";
import { useAnniversaryContent } from "@/lib/content";
import { fadeUp, sectionViewport, staggerContainer } from "@/lib/animations";

const MIN_SCALE = 1;
const MAX_SCALE = 2.3;
// How long the scene waits with NO size change before it "switches on".
// This is what stops the burst from starting while the page is still
// reflowing (web fonts swapping in, images loading, etc).
const RESIZE_SETTLE_MS = 250;
const READY_FALLBACK_MS = 1500;
// Same vertical squish used by the canvas disc/spiral (see GalaxyCanvas'
// `* 0.42` below). The photo ring uses this exact number so the "stars"
// sit flat on the disc instead of floating above it as upright circles.
const RING_SQUISH = 0.42;

// ---- Spiral + heart particle canvas -----------------------------------

type SpiralParticle = {
  angle: number;
  radius: number;
  targetRadius: number;
  speed: number;
  size: number;
  hue: "rose" | "violet" | "white";
};

type HeartParticle = {
  baseX: number;
  baseY: number;
  size: number;
  phase: number;
};

type DustParticle = {
  angle: number;
  radius: number;
  size: number;
  alpha: number;
};

function heartPoint(t: number) {
  // Parametric heart curve, unit scale
  const x = 16 * Math.pow(Math.sin(t), 3);
  const y = -(
    13 * Math.cos(t) -
    5 * Math.cos(2 * t) -
    2 * Math.cos(3 * t) -
    Math.cos(4 * t)
  );
  return { x: x / 16, y: y / 16 };
}

function GalaxyCanvas({
  active,
  rotationRef,
}: {
  active: boolean;
  // A ref, not a number prop. The parent updates this every frame from the
  // SAME smoothed value that drives the photo ring's rotation, so the disc
  // and the photos can never drift out of sync with each other.
  rotationRef: React.RefObject<number>;
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    let width = 0;
    let height = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const container = canvas.parentElement as HTMLElement;

    const spiral: SpiralParticle[] = [];
    const heart: HeartParticle[] = [];
    const dust: DustParticle[] = [];
    let rotation = 0;
    let spawnStart = performance.now();
    let animationId: number;
    let running = true;

    const resize = () => {
      width = container.clientWidth;
      height = container.clientHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const initParticles = () => {
      spiral.length = 0;
      heart.length = 0;
      dust.length = 0;

      // Spread the disc out like a solar system: particles start further
      // from the black hole (not piled up at the core) and reach almost to
      // the edge of the scene. `Math.pow(t, 0.55)` pushes more of them
      // outward early, instead of bunching near the center like a plain
      // linear ramp would. Angle scatter also grows with radius, so the
      // arms loosen into a diffuse scatter of stars instead of staying a
      // tight coiled ribbon.
      const spiralCount = 540;
      for (let i = 0; i < spiralCount; i++) {
        const t = i / spiralCount;
        const arm = i % 4;
        const spread = Math.pow(t, 0.55);
        const angle = spread * Math.PI * 7 + (arm * Math.PI * 2) / 4;
        const targetRadius = 0.16 + spread * 0.78;
        const hues: SpiralParticle["hue"][] = ["rose", "violet", "white"];
        spiral.push({
          angle: angle + (Math.random() - 0.5) * (0.35 + spread * 0.9),
          radius: prefersReducedMotion ? targetRadius : 0,
          targetRadius,
          speed: 0.15 + Math.random() * 0.1,
          // Particles further out read a little bigger, like distinct
          // stars/planets rather than a uniform haze.
          size: 0.6 + Math.random() * 1.3 + spread * 1.6,
          hue: hues[i % hues.length],
        });
      }

      const heartCount = 420;
      for (let i = 0; i < heartCount; i++) {
        const t = (i / heartCount) * Math.PI * 2;
        const p = heartPoint(t);
        const thickness = 0.82 + Math.random() * 0.22;
        const interior = i % 3 === 0 ? 0.45 + Math.random() * 0.5 : 1;
        heart.push({
          baseX: p.x * thickness * interior,
          baseY: p.y * thickness * interior,
          size: 0.95 + Math.random() * 1.4,
          phase: Math.random() * Math.PI * 2,
        });
      }

      // Background starfield: scattered across nearly the whole scene
      // (not clustered near the disc) so the galaxy sits inside a much
      // wider field of stars, the way a real solar-system view would look.
      const dustCount = 520;
      for (let i = 0; i < dustCount; i++) {
        dust.push({
          angle: Math.random() * Math.PI * 2,
          radius: 0.12 + Math.random() * 0.98,
          size: 0.35 + Math.random() * 2.1,
          alpha: 0.12 + Math.random() * 0.46,
        });
      }
    };

    resize();
    initParticles();
    spawnStart = performance.now();

    const colorFor = (hue: SpiralParticle["hue"], alpha: number) => {
      if (hue === "rose") return `rgba(255,93,162,${alpha})`;
      if (hue === "violet") return `rgba(157,78,221,${alpha})`;
      return `rgba(246,241,247,${alpha})`;
    };

    const draw = (time: number) => {
      if (!running) return;
      ctx.clearRect(0, 0, width, height);
      ctx.globalCompositeOperation = "screen";

      const cx = width / 2;
      const cy = height * 0.57;
      const scale = Math.min(width, height) * 1.02;
      const elapsed = (time - spawnStart) / 1000;
      const burstProgress = prefersReducedMotion
        ? 1
        : Math.min(1, elapsed / 3.2);
      const burstEase = 1 - Math.pow(1 - burstProgress, 3);
      const spawnEase = prefersReducedMotion
        ? 1
        : Math.min(1, elapsed / 1.4);
      const eased = 1 - Math.pow(1 - spawnEase, 3);

      if (!prefersReducedMotion) {
        rotation += 0.0022;
      }

      // Single source of truth for rotation: whatever the photo ring is
      // showing on screen this frame is exactly what we draw here too.
      const currentRotation =
        rotation + ((rotationRef.current ?? 0) * Math.PI) / 180;

      // Broad, translucent nebula bands give the particle arms a visible body.
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(currentRotation * 0.18 - 0.2);
      ctx.scale(1, 0.42);
      const nebula = ctx.createRadialGradient(0, 0, scale * 0.04, 0, 0, scale * 0.66);
      nebula.addColorStop(0, `rgba(255,190,232,${0.16 * eased})`);
      nebula.addColorStop(0.22, `rgba(255,78,167,${0.1 * eased})`);
      nebula.addColorStop(0.55, `rgba(117,54,190,${0.08 * eased})`);
      nebula.addColorStop(1, "rgba(40,10,80,0)");
      ctx.fillStyle = nebula;
      ctx.beginPath();
      ctx.arc(0, 0, scale * 0.66, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // Background starfield, drawn first so the disc and heart sit on top.
      for (const p of dust) {
        const r = p.radius * eased * scale;
        const a = p.angle + rotation * 0.35 + ((rotationRef.current ?? 0) * Math.PI) / 180;
        ctx.beginPath();
        ctx.fillStyle = `rgba(255,225,240,${p.alpha * eased})`;
        ctx.arc(cx + Math.cos(a) * r, cy + Math.sin(a) * r * 0.5, p.size, 0, Math.PI * 2);
        ctx.fill();
      }

      // Spiral disc, squished vertically for a pseudo-3D angle. Alpha now
      // stays healthy even at the outer edge, so the far arms read as
      // clearly as the core instead of fading into the background.
      for (const p of spiral) {
        p.radius += (p.targetRadius - p.radius) * 0.06;
        const r = p.radius * eased * scale;
        const a = p.angle + currentRotation;
        const x = cx + Math.cos(a) * r;
        const y = cy + Math.sin(a) * r * 0.42;
        const alpha = 0.32 + (1 - p.radius / 1.05) * 0.5 * eased;

        if (burstProgress < 1 && r > 2) {
          const tail = Math.max(0, r - scale * 0.16 * (1 - burstEase));
          ctx.beginPath();
          ctx.moveTo(cx + Math.cos(a) * tail, cy + Math.sin(a) * tail * 0.42);
          ctx.lineTo(x, y);
          ctx.strokeStyle = colorFor(p.hue, 0.3 * (1 - burstEase));
          ctx.lineWidth = Math.max(0.5, p.size * 0.7);
          ctx.stroke();
        }
        ctx.beginPath();
        ctx.fillStyle = colorFor(p.hue, Math.max(0, alpha));
        ctx.arc(x, y, p.size * (0.6 + eased * 0.4), 0, Math.PI * 2);
        ctx.fill();
      }

      if (burstProgress < 1) {
        const pulse = 1 + Math.sin(time * 0.012) * 0.08;
        const burstGlow = ctx.createRadialGradient(cx, cy, 0, cx, cy, scale * 0.3 * pulse);
        burstGlow.addColorStop(0, `rgba(255,255,255,${0.28 * (1 - burstEase)})`);
        burstGlow.addColorStop(0.2, `rgba(255,93,162,${0.22 * (1 - burstEase)})`);
        burstGlow.addColorStop(1, "rgba(255,93,162,0)");
        ctx.fillStyle = burstGlow;
        ctx.beginPath();
        ctx.arc(cx, cy, scale * 0.3 * pulse, 0, Math.PI * 2);
        ctx.fill();
      }

      // A soft glow behind the accretion disc keeps the center bright without
      // applying an expensive canvas shadow to every particle.
      const halo = ctx.createRadialGradient(cx, cy, 0, cx, cy, scale * 0.2);
      halo.addColorStop(0, `rgba(255,220,244,${0.55 * eased})`);
      halo.addColorStop(0.3, `rgba(255,93,162,${0.3 * eased})`);
      halo.addColorStop(1, "rgba(255,93,162,0)");
      ctx.fillStyle = halo;
      ctx.beginPath();
      ctx.arc(cx, cy, scale * 0.24, 0, Math.PI * 2);
      ctx.fill();

      // Black hole and its hot accretion ring, beneath the floating heart.
      // NOTE: intentionally NOT rotated — it stays a flat, top-down ring no
      // matter how far you spin the disc, same as the reference clip.
      ctx.save();
      ctx.translate(cx, cy);
      ctx.scale(1, 0.34);
      const ring = ctx.createRadialGradient(0, 0, scale * 0.055, 0, 0, scale * 0.17);
      ring.addColorStop(0, "rgba(0,0,2,1)");
      ring.addColorStop(0.2, "rgba(3,0,8,1)");
      ring.addColorStop(0.28, `rgba(255,255,255,${0.98 * eased})`);
      ring.addColorStop(0.4, `rgba(255,93,162,${0.92 * eased})`);
      ring.addColorStop(0.68, `rgba(157,78,221,${0.55 * eased})`);
      ring.addColorStop(1, "rgba(157,78,221,0)");
      ctx.fillStyle = ring;
      ctx.beginPath();
      ctx.arc(0, 0, scale * 0.22, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "rgba(0,0,3,0.98)";
      ctx.beginPath();
      ctx.arc(0, 0, scale * 0.082, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
      ctx.globalCompositeOperation = "source-over";

      // Heart formed of particles, floating above the spiral. Also
      // intentionally not rotated, so it never tips onto its side.
      const heartCx = cx;
      const heartCy = cy - scale * 0.42;
      const heartScale = scale * 0.25;
      ctx.save();
      ctx.translate(heartCx, heartCy);
      for (const h of heart) {
        const breathe = prefersReducedMotion
          ? 0
          : Math.sin(time * 0.0016 + h.phase) * 0.03;
        const x = h.baseX * heartScale * (1 + breathe);
        const y = h.baseY * heartScale * (1 + breathe);
        ctx.beginPath();
        ctx.fillStyle = `rgba(255,141,193,${0.78 * eased})`;
        ctx.arc(x, y, h.size, 0, Math.PI * 2);
        ctx.fill();
      }

      // A bright inner silhouette makes the heart readable at a glance.
      ctx.beginPath();
      ctx.moveTo(0, heartScale * 0.78);
      ctx.bezierCurveTo(
        -heartScale * 1.1,
        heartScale * 0.1,
        -heartScale * 0.82,
        -heartScale * 0.72,
        0,
        -heartScale * 0.2
      );
      ctx.bezierCurveTo(
        heartScale * 0.82,
        -heartScale * 0.72,
        heartScale * 1.1,
        heartScale * 0.1,
        0,
        heartScale * 0.78
      );
      ctx.fillStyle = `rgba(255,112,183,${0.12 * eased})`;
      ctx.fill();
      ctx.restore();

      animationId = requestAnimationFrame(draw);
    };

    animationId = requestAnimationFrame(draw);

    const handleResize = () => {
      resize();
    };
    window.addEventListener("resize", handleResize);

    const handleVisibility = () => {
      running = document.visibilityState === "visible" && active;
      if (running) animationId = requestAnimationFrame(draw);
      else cancelAnimationFrame(animationId);
    };
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      running = false;
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", handleResize);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [active, rotationRef]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0"
    />
  );
}

// ---- Orbiting photo node ---------------------------------------------
//
// Positioned with the SAME trig the canvas uses for the spiral
// (cos for x, sin * RING_SQUISH for y), so every "star" sits flat on the
// disc's plane and travels along the same flattened ellipse when it spins,
// instead of floating above it as an upright circle on a perfect ring.

function OrbitPhoto({
  photo,
  index,
  total,
  sceneSize,
  rotation,
  onOpen,
}: {
  photo: GalaxyPhoto;
  index: number;
  total: number;
  sceneSize: number;
  // Shared smoothed rotation (degrees) — same value driving the canvas.
  rotation: ReturnType<typeof useMotionValue<number>>;
  onOpen: (photo: GalaxyPhoto) => void;
}) {
  // Auto-spaced around the ring by index, so adding another photo to the
  // data file is enough — no manual angle math needed. An explicit
  // `photo.angle` (if present) still wins, for one-off placement tweaks.
  const baseAngle = photo.angle ?? (360 / Math.max(total, 1)) * index;
  // Spread photos across a much wider band of orbits (0.35–0.95 of the
  // scene) so they sit among the spiral's stars instead of bunched into
  // one tight ring.
  const radiusFraction =
    photo.radius ?? 0.35 + ((index % 5) / 4) * 0.6;
  const radiusPx = (sceneSize / 2) * radiusFraction * 0.92;
  const angleRad = (baseAngle * Math.PI) / 180;

  // Live x/y along the flattened ellipse, recomputed from the shared
  // rotation value every frame (no React re-render — framer-motion updates
  // the transform style directly).
  const x = useTransform(rotation, (deg) => {
    const a = angleRad + (deg * Math.PI) / 180;
    return Math.cos(a) * radiusPx;
  });
  const y = useTransform(rotation, (deg) => {
    const a = angleRad + (deg * Math.PI) / 180;
    return Math.sin(a) * radiusPx * RING_SQUISH;
  });
  // Items on the near side of the ellipse (bottom, toward the viewer) read
  // slightly bigger and brighter than ones on the far side — a cheap depth
  // cue so the ring reads as flat and dimensional, not a paper cutout.
  const depthScale = useTransform(rotation, (deg) => {
    const a = angleRad + (deg * Math.PI) / 180;
    const s = Math.sin(a);
    return 0.82 + ((s + 1) / 2) * 0.4;
  });
  const depthOpacity = useTransform(rotation, (deg) => {
    const a = angleRad + (deg * Math.PI) / 180;
    const s = Math.sin(a);
    return 0.6 + ((s + 1) / 2) * 0.4;
  });

  return (
    <motion.button
      layoutId={`galaxy-photo-${photo.id}`}
      onClick={() => onOpen(photo)}
      aria-label={`Open memory from ${photo.date}`}
      className="absolute left-1/2 top-1/2 rounded-full shadow-glow-sm ring-1 ring-white/20 transition-shadow duration-300 hover:shadow-glow hover:ring-bloom-rose/50 focus-visible:shadow-glow"
      style={{
        width: photo.size,
        height: photo.size,
        x,
        y,
        scale: depthScale,
        opacity: depthOpacity,
        translateX: "-50%",
        translateY: "-50%",
      }}
    >
      {/* Flattened onto the disc: the image itself is squished the same
          amount as its orbit, so it visibly "lies down" on the ring. */}
      <div
        className="relative h-full w-full overflow-hidden rounded-full"
        style={{ transform: `scaleY(${RING_SQUISH + 0.4})` }}
      >
        <Image
          src={photo.image}
          alt={`Memory from ${photo.date}`}
          fill
          sizes="120px"
          className="object-cover"
        />
      </div>
    </motion.button>
  );
}

// ---- Main section ---------------------------------------------------------

export default function GalaxyGallery() {
  const { content: { galaxyPhotos, galaxyIntro } } = useAnniversaryContent();
  const sceneRef = useRef<HTMLDivElement>(null);
  const [sceneSize, setSceneSize] = useState(480);
  const [scale, setScale] = useState(1);
  const [activePhoto, setActivePhoto] = useState<GalaxyPhoto | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  // The scene only starts its burst / becomes visible once layout has
  // stopped shifting under it. This is what stops the heart + photos from
  // scattering across the page for the first few seconds after load.
  const [ready, setReady] = useState(false);
  const dragStart = useRef<{ x: number; rotation: number } | null>(null);
  const pinchDistance = useRef<number | null>(null);

  // Single rotation value, shared by the canvas and the photo ring so they
  // physically cannot drift apart from each other while dragging.
  const rawRotation = useMotionValue(0);
  const smoothRotation = useSpring(rawRotation, {
    stiffness: 120,
    damping: 20,
    mass: 0.6,
  });
  const rotationRef = useRef(0);
  useMotionValueEvent(smoothRotation, "change", (v) => {
    rotationRef.current = v;
  });

  useEffect(() => {
    const el = sceneRef.current;
    if (!el) return;

    let settleTimer: ReturnType<typeof setTimeout> | null = null;
    let lastWidth = -1;

    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const width = entry.contentRect.width;
        setSceneSize(width);

        // Any real size change resets the "settled" clock. Once nothing
        // moves for RESIZE_SETTLE_MS, we consider layout stable.
        if (Math.abs(width - lastWidth) > 1) {
          lastWidth = width;
          if (settleTimer) clearTimeout(settleTimer);
          settleTimer = setTimeout(() => setReady(true), RESIZE_SETTLE_MS);
        }
      }
    });
    ro.observe(el);

    // Fallback in case ResizeObserver only ever fires once (size already
    // stable at mount) or the settle timer gets starved somehow.
    const fallback = setTimeout(() => setReady(true), READY_FALLBACK_MS);

    return () => {
      ro.disconnect();
      if (settleTimer) clearTimeout(settleTimer);
      clearTimeout(fallback);
    };
  }, []);

  useEffect(() => {
    const el = sceneRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.2 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Wheel-to-zoom, only while the cursor is over the scene.
  useEffect(() => {
    const el = sceneRef.current;
    if (!el) return;
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      setScale((s) =>
        Math.min(MAX_SCALE, Math.max(MIN_SCALE, s - e.deltaY * 0.0015))
      );
    };
    el.addEventListener("wheel", handleWheel, { passive: false });
    return () => el.removeEventListener("wheel", handleWheel);
  }, []);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      pinchDistance.current = Math.hypot(dx, dy);
    }
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 2 && pinchDistance.current !== null) {
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      const dist = Math.hypot(dx, dy);
      const delta = dist - pinchDistance.current;
      pinchDistance.current = dist;
      setScale((s) =>
        Math.min(MAX_SCALE, Math.max(MIN_SCALE, s + delta * 0.004))
      );
    }
  }, []);

  const handleTouchEnd = useCallback(() => {
    pinchDistance.current = null;
  }, []);

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.pointerType === "touch" && event.isPrimary === false) return;
    dragStart.current = { x: event.clientX, rotation: rawRotation.get() };
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!dragStart.current) return;
    const nextRotation =
      dragStart.current.rotation +
      (event.clientX - dragStart.current.x) * 0.35;
    rawRotation.set(nextRotation);
  };

  const handlePointerUp = () => {
    dragStart.current = null;
  };

  const openPhoto = (photo: GalaxyPhoto) => {
    setActivePhoto(photo);
  };

  const closePhoto = () => {
    setActivePhoto(null);
  };

  const adjustScale = (delta: number) => {
    setScale((s) => Math.min(MAX_SCALE, Math.max(MIN_SCALE, s + delta)));
  };

  return (
    <section
      id="galaxy"
      className="relative flex min-h-[100svh] w-full flex-col items-center overflow-hidden"
    >
      {/* Full-bleed interactive scene — fills the entire section, no card
          edges, nothing cropped. Title/hint/controls float on top of it. */}
      <div
        ref={sceneRef}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        className="absolute inset-0 touch-pan-y select-none"
      >
        <motion.div
          animate={{ scale }}
          transition={{ type: "spring", stiffness: 120, damping: 20 }}
          className="absolute inset-0"
        >
          {ready && (
            <>
              <GalaxyCanvas active={isVisible} rotationRef={rotationRef} />

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="absolute inset-0"
                style={{ top: "7%" }}
              >
                {galaxyPhotos.map((photo, index) => (
                  <OrbitPhoto
                    key={photo.id}
                    photo={photo}
                    index={index}
                    total={galaxyPhotos.length}
                    sceneSize={sceneSize}
                    rotation={smoothRotation}
                    onOpen={openPhoto}
                  />
                ))}
              </motion.div>
            </>
          )}
        </motion.div>

        {/* Dim overlay while a photo is zooming open */}
        <motion.div
          aria-hidden="true"
          animate={{ opacity: activePhoto ? 1 : 0 }}
          transition={{ duration: 0.4 }}
          className="pointer-events-none absolute inset-0 bg-void-950"
        />
      </div>

      {/* Overlaid UI — sits above the full-bleed scene without stealing
          drag/scroll interactions from it. */}
      <motion.div
        variants={staggerContainer(0.2)}
        initial="hidden"
        whileInView="visible"
        viewport={sectionViewport}
        className="pointer-events-none relative z-10 flex flex-col items-center pt-16 text-center sm:pt-20"
      >
        <motion.p
          variants={fadeUp}
          className="mb-3 text-xs uppercase tracking-[0.4em] text-bloom-pink/70"
        >
          {galaxyIntro.eyebrow}
        </motion.p>
        <motion.h2
          variants={fadeUp}
          className="font-display text-4xl italic text-bloom-white sm:text-5xl"
        >
          {galaxyIntro.title}
        </motion.h2>
        <motion.p
          variants={fadeUp}
          className="mt-3 text-xs tracking-wide text-bloom-white/40"
        >
          {galaxyIntro.hint}
        </motion.p>
      </motion.div>

      <div className="pointer-events-none relative z-10 mt-auto flex w-full flex-col items-center pb-10">
        <p className="text-[10px] uppercase tracking-[0.25em] text-bloom-white/25">
          Drag the universe to move it
        </p>

        {/* Zoom controls, useful for mouse users and accessibility */}
        <div className="pointer-events-auto mt-4 flex items-center gap-3">
          <button
            onClick={() => adjustScale(-0.25)}
            aria-label="Zoom out"
            className="card-glass flex h-9 w-9 items-center justify-center rounded-full text-bloom-white/70 transition-colors hover:text-bloom-white"
          >
            <Minus className="h-4 w-4" />
          </button>
          <span className="w-12 text-center text-xs tabular-nums text-bloom-white/40">
            {Math.round(scale * 100)}%
          </span>
          <button
            onClick={() => adjustScale(0.25)}
            aria-label="Zoom in"
            className="card-glass flex h-9 w-9 items-center justify-center rounded-full text-bloom-white/70 transition-colors hover:text-bloom-white"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {activePhoto && (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={`Memory from ${activePhoto.date}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] flex items-center justify-center bg-void-950/85 px-6 backdrop-blur-sm"
            onClick={closePhoto}
          >
            <motion.div
              layoutId={`galaxy-photo-${activePhoto.id}`}
              transition={{ type: "spring", stiffness: 140, damping: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-sm overflow-hidden rounded-3xl shadow-glow"
            >
              <button
                onClick={closePhoto}
                aria-label="Close"
                className="absolute right-4 top-4 z-10 rounded-full bg-void-950/60 p-2 text-bloom-white/80 hover:text-bloom-white"
              >
                <X className="h-4 w-4" />
              </button>
              <div className="relative aspect-[4/5] w-full">
                <Image
                  src={activePhoto.image}
                  alt={`Memory from ${activePhoto.date}`}
                  fill
                  sizes="400px"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-void-950/95 via-void-950/10 to-transparent" />
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <p className="text-xs uppercase tracking-[0.3em] text-bloom-rose/80">
                  {activePhoto.date}
                </p>
                <p className="mt-2 font-display text-xl italic text-bloom-white">
                  {activePhoto.caption}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
