"use client";

import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import { useAnniversaryContent } from "@/lib/content";
import { fadeUp, staggerContainer, sectionViewport } from "@/lib/animations";

export default function FinalSection() {
  const { content: { couple, finalScene } } = useAnniversaryContent();
  return (
    <section
      id="final"
      className="relative flex min-h-[100svh] w-full flex-col items-center justify-center overflow-hidden px-6 text-center"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 h-[80vh] w-[80vh] -translate-x-1/2 -translate-y-1/2 rounded-full bg-glow-radial"
      />

      <motion.div
        variants={staggerContainer(0.25, 0.1)}
        initial="hidden"
        whileInView="visible"
        viewport={sectionViewport}
        className="relative z-10 flex flex-col items-center"
      >
        <motion.h2
          variants={fadeUp}
          className="text-glow font-display text-5xl italic text-bloom-white sm:text-6xl"
        >
          {finalScene.title}
        </motion.h2>

        <motion.div variants={fadeUp} className="my-8 text-bloom-rose">
          <Heart
            width={28}
            height={28}
            fill="currentColor"
            strokeWidth={0}
            className="animate-pulse-soft"
          />
        </motion.div>

        <motion.p
          variants={fadeUp}
          className="whitespace-pre-line font-display text-xl text-bloom-white/80 sm:text-2xl"
        >
          {finalScene.body}
        </motion.p>

        <motion.div variants={fadeUp} className="mt-14 flex flex-col items-center gap-1">
          <span className="text-xs uppercase tracking-[0.3em] text-bloom-white/40">
            {finalScene.signOff}
          </span>
          <span className="font-display text-2xl italic text-bloom-white">
            {couple.name}
          </span>
        </motion.div>
      </motion.div>
    </section>
  );
}
