"use client";

import { motion } from "framer-motion";
import { useAnniversaryContent } from "@/lib/content";
import { fadeBlurUp, sectionViewport, staggerContainer } from "@/lib/animations";

export default function StorySection() {
  const { content: { introText } } = useAnniversaryContent();
  const goNext = () => {
    document.getElementById("photos")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="story"
      className="relative flex min-h-[100svh] w-full flex-col items-center justify-center px-6 text-center"
    >
      <motion.div
        variants={staggerContainer(0.5)}
        initial="hidden"
        whileInView="visible"
        viewport={sectionViewport}
        className="flex max-w-xl flex-col items-center gap-7"
      >
        {introText.lines.map((line, i) => (
          <motion.p
            key={i}
            variants={fadeBlurUp}
            className="whitespace-pre-line font-display text-2xl leading-relaxed text-bloom-white/90 sm:text-3xl"
          >
            {line}
          </motion.p>
        ))}

        <motion.button
          variants={fadeBlurUp}
          onClick={goNext}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
          className="mt-8 rounded-full border border-white/15 px-7 py-3 text-xs uppercase tracking-[0.25em] text-bloom-white/70 transition-colors duration-300 hover:border-bloom-rose/40 hover:text-bloom-white"
        >
          {introText.cta}
        </motion.button>
      </motion.div>
    </section>
  );
}
