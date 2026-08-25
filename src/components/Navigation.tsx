"use client";

import { useEffect, useState } from "react";
import { motion, useScroll, useSpring } from "framer-motion";

const SECTIONS = [
  { id: "hero", label: "Hero" },
  { id: "story", label: "Story" },
  { id: "photos", label: "Photos" },
  { id: "galaxy", label: "Galaxy" },
  { id: "counter", label: "Counter" },
  { id: "timeline", label: "Timeline" },
  { id: "cards", label: "Memories" },
  { id: "secret", label: "Secret" },
  { id: "final", label: "Final" },
];

export default function Navigation() {
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 24,
    mass: 0.3,
  });

  const [active, setActive] = useState("hero");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActive(entry.target.id);
          }
        });
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 }
    );

    SECTIONS.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const goTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      {/* Signature: a thin "heartbeat" line tracing our progress through the story */}
      <div
        aria-hidden="true"
        className="fixed left-0 top-0 z-50 h-[2px] w-full bg-white/5"
      >
        <motion.div
          style={{ scaleX: progress }}
          className="h-full w-full origin-left bg-gradient-to-r from-bloom-violet via-bloom-rose to-bloom-pink shadow-glow-sm"
        />
      </div>

      {/* Desktop-only dot navigation, hidden on small screens to avoid clutter */}
      <nav
        aria-label="Section navigation"
        className="fixed right-6 top-1/2 z-40 hidden -translate-y-1/2 flex-col items-end gap-4 md:flex"
      >
        {SECTIONS.map((s) => (
          <button
            key={s.id}
            onClick={() => goTo(s.id)}
            aria-label={`Go to ${s.label} section`}
            aria-current={active === s.id}
            className="group flex items-center gap-2"
          >
            <span
              className={`text-[10px] uppercase tracking-[0.2em] text-bloom-white/0 transition-all duration-300 group-hover:text-bloom-white/60 ${
                active === s.id ? "text-bloom-white/50" : ""
              }`}
            >
              {s.label}
            </span>
            <span
              className={`block rounded-full transition-all duration-300 ${
                active === s.id
                  ? "h-2.5 w-2.5 bg-bloom-rose shadow-glow-sm"
                  : "h-1.5 w-1.5 bg-white/25 group-hover:bg-white/50"
              }`}
            />
          </button>
        ))}
      </nav>
    </>
  );
}
