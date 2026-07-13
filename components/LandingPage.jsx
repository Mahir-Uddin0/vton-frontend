"use client";

import React from "react";
import { motion } from "framer-motion";
import { Upload, Shirt, Sparkles, ArrowRight } from "lucide-react";

const STEPS = [
  {
    number: "01",
    icon: Upload,
    title: "Upload Photo",
    description: "A full-body shot, plain background. Takes ten seconds.",
  },
  {
    number: "02",
    icon: Shirt,
    title: "Choose Garment",
    description: "Pick any item from the catalog you're curious about.",
  },
  {
    number: "03",
    icon: Sparkles,
    title: "See the Fit",
    description: "Get a match score, size call, and plain-language notes.",
  },
];

function CornerBrackets() {
  const base = "absolute w-6 h-6 border-[#1B4DFF]/60";
  return (
    <>
      <span className={`${base} top-0 left-0 border-t-2 border-l-2`} />
      <span className={`${base} top-0 right-0 border-t-2 border-r-2`} />
      <span className={`${base} bottom-0 left-0 border-b-2 border-l-2`} />
      <span className={`${base} bottom-0 right-0 border-b-2 border-r-2`} />
    </>
  );
}

export default function LandingPage({ onCheckFit = () => {} }) {
  return (
    <div className="min-h-screen bg-[#FAFAF7] text-[#0B0B0C]">
      <header className="border-b border-[#DEDDD6] px-5 sm:px-8 py-5 flex items-center justify-between">
        <span className="font-serif text-lg tracking-tight">Fit Check</span>
        <button
          type="button"
          onClick={onCheckFit}
          className="text-[11px] tracking-[0.18em] uppercase text-[#83837C] hover:text-[#1B4DFF] transition-colors"
        >
          Check My Fit
        </button>
      </header>

      {/* Hero */}
      <section className="max-w-5xl mx-auto px-5 sm:px-8 pt-16 sm:pt-24 pb-20 sm:pb-28">
        <div className="grid lg:grid-cols-[1.2fr_1fr] gap-12 items-center">
          <div>
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="text-[11px] tracking-[0.18em] uppercase text-[#1B4DFF] mb-4"
            >
              Virtual Fit Check
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.05 }}
              className="font-serif text-4xl sm:text-6xl leading-[1.05] tracking-tight"
            >
              Find Your Perfect Fit.
              <br />
              Instantly.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="text-[#83837C] text-base sm:text-lg mt-6 max-w-md leading-relaxed"
            >
              Upload one photo, pick a garment, and see exactly how it sits on
              you — before you buy. No more guessing between sizes.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.25 }}
              className="mt-9 flex items-center gap-4"
            >
              <button
                type="button"
                onClick={onCheckFit}
                className="group flex items-center gap-2 text-sm font-medium tracking-wide px-7 py-3.5 rounded-sm bg-[#1B4DFF] text-white hover:bg-[#173fd1] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1B4DFF] focus-visible:ring-offset-2"
              >
                Check My Fit
                <ArrowRight
                  className="w-4 h-4 transition-transform group-hover:translate-x-0.5"
                  strokeWidth={2}
                />
              </button>
              <span className="text-xs text-[#83837C]">
                Free · No account needed
              </span>
            </motion.div>
          </div>

          {/* Visual: mock viewfinder card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative aspect-[3/4] max-w-xs mx-auto w-full rounded-sm bg-white border border-[#DEDDD6] overflow-hidden"
          >
            <CornerBrackets />
            <div
              className="absolute inset-0 opacity-[0.18]"
              style={{
                backgroundImage:
                  "linear-gradient(to right, #0B0B0C 1px, transparent 1px), linear-gradient(to bottom, #0B0B0C 1px, transparent 1px)",
                backgroundSize: "12.5% 12.5%",
              }}
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
              <Shirt className="w-10 h-10 text-[#1B4DFF]" strokeWidth={1.25} />
              <span className="font-serif text-3xl">92%</span>
              <span className="text-[10px] tracking-[0.15em] uppercase text-[#83837C]">
                Match for Size M
              </span>
            </div>
            <motion.div
              className="absolute inset-x-0 h-[2px]"
              style={{
                background:
                  "linear-gradient(to right, transparent, #1B4DFF 20%, #7C9BFF 50%, #1B4DFF 80%, transparent)",
                boxShadow: "0 0 12px 2px rgba(27,77,255,0.6)",
              }}
              animate={{ top: ["6%", "94%", "6%"] }}
              transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
            />
          </motion.div>
        </div>
      </section>

      {/* How it works */}
      <section className="border-t border-[#DEDDD6]">
        <div className="max-w-5xl mx-auto px-5 sm:px-8 py-16 sm:py-24">
          <p className="text-[11px] tracking-[0.18em] uppercase text-[#83837C] mb-3">
            How it works
          </p>
          <h2 className="font-serif text-2xl sm:text-3xl mb-12 max-w-md">
            Three steps between you and knowing your size.
          </h2>

          <div className="grid sm:grid-cols-3 gap-8 sm:gap-6">
            {STEPS.map((step, i) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="relative pl-0"
              >
                <div className="flex items-center gap-3 mb-4">
                  <span className="font-serif text-sm text-[#1B4DFF] tabular-nums">
                    {step.number}
                  </span>
                  <span className="h-px flex-1 bg-[#DEDDD6]" />
                </div>
                <div className="w-10 h-10 rounded-full border border-[#DEDDD6] flex items-center justify-center mb-4">
                  <step.icon className="w-4 h-4 text-[#0B0B0C]" strokeWidth={1.5} />
                </div>
                <h3 className="text-sm font-medium mb-1.5">{step.title}</h3>
                <p className="text-sm text-[#83837C] leading-relaxed">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Closing CTA */}
      <section className="border-t border-[#DEDDD6]">
        <div className="max-w-5xl mx-auto px-5 sm:px-8 py-16 sm:py-20 text-center">
          <h2 className="font-serif text-2xl sm:text-3xl mb-6">
            Stop guessing between sizes.
          </h2>
          <button
            type="button"
            onClick={onCheckFit}
            className="inline-flex items-center gap-2 text-sm font-medium tracking-wide px-7 py-3.5 rounded-sm bg-[#1B4DFF] text-white hover:bg-[#173fd1] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1B4DFF] focus-visible:ring-offset-2"
          >
            Check My Fit
            <ArrowRight className="w-4 h-4" strokeWidth={2} />
          </button>
        </div>
      </section>

      <footer className="border-t border-[#DEDDD6] px-5 sm:px-8 py-6 flex items-center justify-between text-[11px] text-[#83837C]">
        <span>Fit Check</span>
        <span>© 2026</span>
      </footer>
    </div>
  );
}