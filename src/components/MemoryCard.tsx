"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useAnniversaryContent } from "@/lib/content";
import { fadeUp, sectionViewport, staggerContainer } from "@/lib/animations";

export default function MemoryCard() {
  const { content: { memoryCards, memoryCardsTitle } } = useAnniversaryContent();
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const active = openIndex !== null ? memoryCards[openIndex] : null;

  return (
    <section
      id="cards"
      className="relative w-full px-6 py-28"
    >
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={sectionViewport}
        transition={{ duration: 0.8 }}
        className="mb-16 text-center font-display text-4xl italic text-bloom-white"
      >
        {memoryCardsTitle}
      </motion.h2>

      <motion.div
        variants={staggerContainer(0.15)}
        initial="hidden"
        whileInView="visible"
        viewport={sectionViewport}
        className="mx-auto grid max-w-4xl grid-cols-1 gap-6 sm:grid-cols-3"
      >
        {memoryCards.map((card, i) => (
          <motion.button
            key={card.title}
            variants={fadeUp}
            onClick={() => setOpenIndex(i)}
            whileHover={{ y: -6 }}
            className="group card-glass relative overflow-hidden rounded-2xl text-left shadow-glow-sm transition-shadow duration-300 hover:shadow-glow"
            aria-haspopup="dialog"
          >
            <div className="relative aspect-[4/5] w-full overflow-hidden">
              <Image
                src={card.image}
                alt={card.title}
                fill
                sizes="(max-width: 768px) 90vw, 30vw"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-void-950/90 via-void-950/10 to-transparent" />
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-5">
              <h3 className="font-display text-xl italic text-bloom-white">
                {card.title}
              </h3>
              <div className="mt-1 h-px w-8 bg-bloom-rose/60" />
              <p className="mt-2 text-xs leading-relaxed text-bloom-white/60">
                {card.body}
              </p>
            </div>
          </motion.button>
        ))}
      </motion.div>

      <AnimatePresence>
        {active && (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={active.title}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center bg-void-950/80 px-6 backdrop-blur-sm"
            onClick={() => setOpenIndex(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="card-glass relative w-full max-w-sm overflow-hidden rounded-3xl shadow-glow"
            >
              <button
                onClick={() => setOpenIndex(null)}
                aria-label="Close"
                className="absolute right-4 top-4 z-10 rounded-full bg-void-950/60 p-2 text-bloom-white/80 hover:text-bloom-white"
              >
                <X className="h-4 w-4" />
              </button>
              <div className="relative aspect-[4/3] w-full">
                <Image
                  src={active.image}
                  alt={active.title}
                  fill
                  sizes="90vw"
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="font-display text-2xl italic text-bloom-white">
                  {active.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-bloom-white/70">
                  {active.body}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
