"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useAnniversaryContent } from "@/lib/content";
import { fadeUp, scaleIn, sectionViewport, staggerContainer } from "@/lib/animations";

export default function PhotoSection() {
  const { content: { photos } } = useAnniversaryContent();
  return (
    <section
      id="photos"
      className="relative flex min-h-[100svh] w-full flex-col items-center justify-center px-6 py-24"
    >
      <motion.div
        variants={staggerContainer(0.25)}
        initial="hidden"
        whileInView="visible"
        viewport={sectionViewport}
        className="mx-auto flex w-full max-w-5xl flex-col items-center gap-10 md:flex-row md:items-stretch md:gap-6"
      >
        {/* Main image */}
        <motion.div
          variants={scaleIn}
          className="group relative aspect-[4/5] w-full max-w-sm overflow-hidden rounded-[2rem] shadow-glow md:w-3/5 md:max-w-none"
        >
          <div className="absolute -inset-6 -z-10 rounded-[2.5rem] bg-glow-radial blur-2xl" />
          <Image
            src={photos.main}
            alt="A favorite photo of the two of us"
            fill
            sizes="(max-width: 768px) 90vw, 45vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            priority={false}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-void-950/40 via-transparent to-transparent" />
        </motion.div>

        {/* Secondary images */}
        <div className="grid w-full grid-cols-3 gap-3 md:w-2/5 md:grid-cols-1 md:gap-6">
          {photos.secondary.map((src, i) => (
            <motion.div
              key={src}
              variants={fadeUp}
              className="relative aspect-square overflow-hidden rounded-2xl shadow-glow-sm md:aspect-auto md:flex-1"
            >
              <Image
                src={src}
                alt={`Memory photo ${i + 2}`}
                fill
                sizes="(max-width: 768px) 30vw, 20vw"
                className="object-cover transition-transform duration-700 ease-out hover:scale-105"
              />
            </motion.div>
          ))}
        </div>
      </motion.div>

      <motion.p
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={sectionViewport}
        className="mt-10 max-w-md text-center font-display text-lg italic text-bloom-white/50"
      >
        {photos.caption}
      </motion.p>
    </section>
  );
}
