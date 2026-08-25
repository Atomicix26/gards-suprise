"use client";

import { useMemo } from "react";
import { Heart } from "lucide-react";

type HeartSpec = {
  left: string;
  size: number;
  delay: number;
  duration: number;
  opacity: number;
};

// Keep the count small and deliberate — a few embers, not a blizzard.
const HEART_COUNT = 7;

export default function FloatingHearts() {
  const hearts = useMemo<HeartSpec[]>(
    () =>
      Array.from({ length: HEART_COUNT }, (_, i) => ({
        left: `${8 + ((i * 137) % 84)}%`,
        size: 10 + ((i * 7) % 14),
        delay: (i * 1.7) % 9,
        duration: 10 + ((i * 3) % 8),
        opacity: 0.15 + ((i * 5) % 30) / 100,
      })),
    []
  );

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
    >
      {hearts.map((h, i) => (
        <span
          key={i}
          className="absolute bottom-[-40px] animate-[floatUp_ease-in-out_infinite]"
          style={{
            left: h.left,
            animationName: "floatUpHeart",
            animationDuration: `${h.duration}s`,
            animationDelay: `${h.delay}s`,
            animationTimingFunction: "ease-in-out",
            animationIterationCount: "infinite",
            opacity: h.opacity,
          }}
        >
          <Heart
            width={h.size}
            height={h.size}
            className="text-bloom-rose"
            fill="currentColor"
            strokeWidth={0}
          />
        </span>
      ))}

      <style jsx global>{`
        @keyframes floatUpHeart {
          0% {
            transform: translateY(0) translateX(0) rotate(0deg);
            opacity: 0;
          }
          10% {
            opacity: var(--heart-opacity, 0.3);
          }
          50% {
            transform: translateY(-50vh) translateX(12px) rotate(8deg);
          }
          90% {
            opacity: 0.15;
          }
          100% {
            transform: translateY(-100vh) translateX(-8px) rotate(-6deg);
            opacity: 0;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          span[style*="floatUpHeart"] {
            animation: none !important;
            opacity: 0.12 !important;
          }
        }
      `}</style>
    </div>
  );
}
