"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart } from "lucide-react";
import { useAnniversaryContent } from "@/lib/content";
import { sectionViewport } from "@/lib/animations";

export default function SecretMessage() {
  const { content: { secretMessage } } = useAnniversaryContent();
  const [opened, setOpened] = useState(false);

  return (
    <section
      id="secret"
      className="relative flex min-h-[100svh] w-full flex-col items-center justify-center overflow-hidden px-6 py-24 text-center"
    >
      <motion.div
        aria-hidden="true"
        animate={{ opacity: opened ? 1 : 0 }}
        transition={{ duration: 1.2 }}
        className="pointer-events-none absolute inset-0 bg-void-950"
      />

      <AnimatePresence mode="wait">
        {!opened ? (
          <motion.div
            key="prompt"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.7 }}
            viewport={sectionViewport}
            className="relative z-10 flex flex-col items-center"
          >
            <p className="whitespace-pre-line font-display text-2xl italic text-bloom-white/80 sm:text-3xl">
              {secretMessage.prompt}
            </p>
            <motion.button
              onClick={() => setOpened(true)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              className="mt-10 rounded-full border border-bloom-rose/30 bg-bloom-rose/10 px-8 py-3.5 text-sm uppercase tracking-[0.2em] text-bloom-white shadow-glow-sm transition-shadow duration-300 hover:shadow-glow"
            >
              {secretMessage.cta}
            </motion.button>
          </motion.div>
        ) : (
          <motion.div
            key="message"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className="relative z-10 flex flex-col items-center gap-10"
          >
            <motion.div
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-bloom-rose"
            >
              <Heart
                width={34}
                height={34}
                fill="currentColor"
                strokeWidth={0}
                className="animate-pulse-soft"
              />
            </motion.div>

            <div className="flex flex-col gap-7">
              {secretMessage.lines.map((line, i) => (
                <motion.p
                  key={i}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.9, delay: 0.5 + i * 0.6 }}
                  className="whitespace-pre-line font-display text-xl italic text-bloom-white/90 sm:text-2xl"
                >
                  {line}
                </motion.p>
              ))}
            </div>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 1,
                delay: 0.5 + secretMessage.lines.length * 0.6 + 0.4,
              }}
              className="text-glow max-w-sm whitespace-pre-line font-display text-2xl text-bloom-white sm:text-3xl"
            >
              {secretMessage.closing}
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
