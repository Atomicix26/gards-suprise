"use client";

import { useEffect, useRef } from "react";

type Particle = {
  x: number;
  y: number;
  r: number;
  speedY: number;
  driftX: number;
  driftPhase: number;
  opacity: number;
};

export default function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    let width = window.innerWidth;
    let height = window.innerHeight;
    let particles: Particle[] = [];
    let animationId: number;
    let running = true;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const countFor = (w: number) => {
      // Keep particle count modest, fewer on small screens for performance
      const base = Math.floor((w * height) / 22000);
      return Math.max(18, Math.min(base, 60));
    };

    const initParticles = () => {
      const count = countFor(width);
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        r: Math.random() * 1.6 + 0.4,
        speedY: Math.random() * 0.18 + 0.04,
        driftX: Math.random() * 0.6 - 0.3,
        driftPhase: Math.random() * Math.PI * 2,
        opacity: Math.random() * 0.5 + 0.15,
      }));
    };

    resize();
    initParticles();

    const draw = () => {
      if (!running) return;
      ctx.clearRect(0, 0, width, height);

      for (const p of particles) {
        ctx.beginPath();
        const shimmer = 0.75 + 0.25 * Math.sin(p.driftPhase);
        ctx.fillStyle = `rgba(247, 198, 217, ${p.opacity * shimmer})`;
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();

        if (!prefersReducedMotion) {
          p.y -= p.speedY;
          p.x += Math.sin(p.driftPhase) * 0.15;
          p.driftPhase += 0.006;
          if (p.y < -10) {
            p.y = height + 10;
            p.x = Math.random() * width;
          }
        }
      }

      animationId = requestAnimationFrame(draw);
    };

    draw();

    const handleResize = () => {
      resize();
      initParticles();
    };

    const handleVisibility = () => {
      running = document.visibilityState === "visible";
      if (running) {
        animationId = requestAnimationFrame(draw);
      } else {
        cancelAnimationFrame(animationId);
      }
    };

    window.addEventListener("resize", handleResize);
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      running = false;
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", handleResize);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 opacity-70"
    />
  );
}
