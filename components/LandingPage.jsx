"use client";

import { motion } from "framer-motion";

import UploadStudio from "@/components/UploadStudio";

/** The landing page is also the complete virtual try-on entry point. */
export default function LandingPage({
  onGenerate = (selection) => {
    void selection;
  },
  error = "",
}) {
  return (
    <div className="min-h-screen bg-[#FAFAF7] text-[#0B0B0C]">
      <header className="flex items-center justify-between border-b border-[#DEDDD6] px-5 py-5 sm:px-8">
        <span className="font-serif text-lg tracking-tight">Fit Check</span>
        <span className="text-[11px] tracking-[0.18em] uppercase text-[#83837C]">
          Virtual Try-On
        </span>
      </header>

      <main>
        <section className="mx-auto max-w-6xl px-5 pb-12 pt-14 sm:px-8 sm:pb-16 sm:pt-20">
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="text-[11px] font-medium tracking-[0.18em] uppercase text-[#1B4DFF]"
          >
            AI clothing preview
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.05 }}
            className="mt-4 max-w-3xl font-serif text-4xl leading-[1.04] tracking-tight sm:text-6xl"
          >
            See Yourself in Any Outfit with AI-Powered Virtual Try-On
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.12 }}
            className="mt-5 max-w-xl text-base leading-relaxed text-[#83837C] sm:text-lg"
          >
            Add a full-body photo, a garment image, and a short description of the garment. We&apos;ll
            generate a virtual try-on for you.
          </motion.p>
        </section>

        <UploadStudio onGenerate={onGenerate} error={error} />
      </main>

      <footer className="mx-auto flex max-w-6xl items-center justify-between border-t border-[#DEDDD6] px-5 py-6 text-[11px] text-[#83837C] sm:px-8">
        <span>Fit Check</span>
        <span>Personal project · 2026</span>
      </footer>
    </div>
  );
}
