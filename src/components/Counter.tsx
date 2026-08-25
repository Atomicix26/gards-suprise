"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useAnniversaryContent } from "@/lib/content";
import { fadeUp, sectionViewport, staggerContainer } from "@/lib/animations";

type TimeLeft = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

function getElapsed(from: Date): TimeLeft {
  const now = new Date().getTime();
  const diff = Math.max(0, now - from.getTime());

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);

  return { days, hours, minutes, seconds };
}

function pad(n: number) {
  return n.toString().padStart(2, "0");
}

export default function Counter() {
  const { content: { couple, counterText } } = useAnniversaryContent();
  const anniversaryDate = new Date(couple.anniversaryDate);
  const [time, setTime] = useState<TimeLeft | null>(null);

  useEffect(() => {
    setTime(getElapsed(anniversaryDate));
    const interval = setInterval(() => {
      setTime(getElapsed(anniversaryDate));
    }, 1000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const cards = [
    { label: counterText.days, value: time ? time.days.toString() : "----" },
    { label: counterText.hours, value: time ? pad(time.hours) : "--" },
    { label: counterText.minutes, value: time ? pad(time.minutes) : "--" },
    { label: counterText.seconds, value: time ? pad(time.seconds) : "--" },
  ];

  return (
    <section
      id="counter"
      className="relative flex min-h-[100svh] w-full flex-col items-center justify-center px-6 py-24"
    >
      <motion.div
        variants={staggerContainer(0.15)}
        initial="hidden"
        whileInView="visible"
        viewport={sectionViewport}
        className="flex flex-col items-center text-center"
      >
        <motion.p
          variants={fadeUp}
          className="mb-3 font-display text-xl italic text-bloom-white/60"
        >
          {counterText.intro}
        </motion.p>

        <motion.div
          variants={fadeUp}
          className="grid grid-cols-2 gap-4 sm:grid-cols-4 sm:gap-6"
        >
          {cards.map((c) => (
            <div
              key={c.label}
              className="card-glass flex w-28 flex-col items-center justify-center rounded-2xl px-4 py-6 shadow-glow-sm sm:w-32"
            >
              <span
                aria-live={c.label === "Seconds" ? "polite" : undefined}
                className="text-glow font-display text-4xl font-medium text-bloom-white sm:text-5xl"
              >
                {c.value}
              </span>
              <span className="mt-2 text-[10px] uppercase tracking-[0.25em] text-bloom-white/50">
                {c.label}
              </span>
            </div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}
