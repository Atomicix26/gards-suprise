"use client";

import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import { useAnniversaryContent } from "@/lib/content";
import { fadeUp, staggerContainer } from "@/lib/animations";

type HeroProps = {
  onStart: () => void;
};

export default function Hero({ onStart }: HeroProps) {
  const { content: { openingText } } = useAnniversaryContent();
  const handleStart = () => {
    onStart();
    document.getElementById("story")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="hero"
      className="relative flex min-h-[100svh] w-full flex-col items-center justify-center overflow-hidden px-6 text-center"
    >
      {/* Ambient center glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 h-[70vh] w-[70vh] -translate-x-1/2 -translate-y-1/2 rounded-full bg-glow-radial"
      />

      <motion.div
        variants={staggerContainer(0.22, 0.15)}
        initial="hidden"
        animate="visible"
        className="relative z-10 flex flex-col items-center"
      >
        <motion.p
          variants={fadeUp}
          className="mb-6 text-xs uppercase tracking-[0.5em] text-bloom-pink/70"
        >
          {openingText.eyebrow}
        </motion.p>

        <motion.div
          variants={fadeUp}
          className="mb-6 animate-pulse-soft text-bloom-rose"
        >
          <Heart width={30} height={30} fill="currentColor" strokeWidth={0} />
        </motion.div>

        <motion.h1
          variants={fadeUp}
          className="text-glow font-display text-5xl font-medium italic text-bloom-white sm:text-6xl md:text-7xl"
        >
          {openingText.title}
        </motion.h1>

        <motion.p
          variants={fadeUp}
          className="mt-5 font-display text-lg text-bloom-white/60 sm:text-xl"
        >
          {openingText.subtitle}
        </motion.p>

        <motion.button
          variants={fadeUp}
          onClick={handleStart}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
          className="mt-14 rounded-full border border-bloom-rose/30 bg-bloom-rose/10 px-8 py-3.5 text-sm uppercase tracking-[0.2em] text-bloom-white shadow-glow-sm transition-shadow duration-300 hover:shadow-glow focus-visible:shadow-glow"
        >
          {openingText.cta}
        </motion.button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5 }}
        transition={{ delay: 1.6, duration: 1 }}
        className="absolute bottom-10 flex flex-col items-center gap-2"
        aria-hidden="true"
      >
        <span className="h-10 w-px bg-gradient-to-b from-transparent via-bloom-white/40 to-transparent" />
      </motion.div>
    </section>
  );
}
