"use client";

import Image from "next/image";
import { motion, useScroll, useSpring } from "framer-motion";
import { useRef } from "react";
import { type Memory } from "@/data/memories";
import { useAnniversaryContent } from "@/lib/content";
import { sectionViewport } from "@/lib/animations";

function TimelineItem({
  memory,
  index,
}: {
  memory: Memory;
  index: number;
}) {
  const align = index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse";

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={sectionViewport}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className={`relative flex flex-col items-center gap-6 md:flex-row md:items-center md:gap-12 ${align}`}
    >
      {/* Glowing dot on the line */}
      <span className="absolute left-1/2 top-0 z-10 hidden h-3 w-3 -translate-x-1/2 rounded-full bg-bloom-rose shadow-glow md:top-1/2 md:block md:-translate-y-1/2" />

      <motion.div
        initial={{ opacity: 0, scale: 0.92 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={sectionViewport}
        transition={{ duration: 0.9, delay: 0.15 }}
        className="relative aspect-[4/3] w-full max-w-xs overflow-hidden rounded-2xl shadow-glow-sm md:w-1/2"
      >
        <Image
          src={memory.image}
          alt={memory.title}
          fill
          sizes="(max-width: 768px) 90vw, 40vw"
          className="object-cover"
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: index % 2 === 0 ? 24 : -24 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={sectionViewport}
        transition={{ duration: 0.8, delay: 0.25 }}
        className="w-full max-w-xs text-center md:w-1/2 md:max-w-sm md:text-left"
      >
        <p className="text-xs uppercase tracking-[0.3em] text-bloom-rose/70">
          {memory.date}
        </p>
        <h3 className="mt-2 font-display text-3xl italic text-bloom-white">
          {memory.title}
        </h3>
        <p className="mt-3 text-sm leading-relaxed text-bloom-white/60">
          {memory.description}
        </p>
      </motion.div>
    </motion.div>
  );
}

export default function Timeline() {
  const { content: { memories, timelineTitle } } = useAnniversaryContent();
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 80%", "end 60%"],
  });
  const lineHeight = useSpring(scrollYProgress, {
    stiffness: 80,
    damping: 22,
  });

  return (
    <section
      id="timeline"
      ref={containerRef}
      className="relative w-full px-6 py-28"
    >
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={sectionViewport}
        transition={{ duration: 0.8 }}
        className="mb-20 text-center font-display text-4xl italic text-bloom-white"
      >
        {timelineTitle}
      </motion.h2>

      <div className="relative mx-auto flex max-w-3xl flex-col gap-20">
        {/* Vertical progress line, desktop only */}
        <div
          aria-hidden="true"
          className="absolute left-1/2 top-0 hidden h-full w-px -translate-x-1/2 bg-white/10 md:block"
        >
          <motion.div
            style={{ scaleY: lineHeight }}
            className="h-full w-full origin-top bg-gradient-to-b from-bloom-violet via-bloom-rose to-bloom-pink"
          />
        </div>

        {memories.map((memory, i) => (
          <TimelineItem key={memory.title} memory={memory} index={i} />
        ))}
      </div>
    </section>
  );
}
