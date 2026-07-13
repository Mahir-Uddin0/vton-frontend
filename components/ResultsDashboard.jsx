"use client";

import { motion } from "framer-motion";
import { RefreshCcw } from "lucide-react";

function ImagePanel({ label, src, alt, className = "" }) {
  return (
    <figure className={className}>
      <div className="aspect-[3/4] overflow-hidden rounded-sm bg-[#EDECE6]">
        {src ? (
          <img src={src} alt={alt} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-[#83837C]">
            Image unavailable.
          </div>
        )}
      </div>
      <figcaption className="mt-2 text-[10px] font-medium tracking-[0.15em] uppercase text-[#83837C]">
        {label}
      </figcaption>
    </figure>
  );
}

/** Shows the source images and the generated virtual try-on together. */
export default function ResultsDashboard({
  personImageUrl,
  garmentImageUrl,
  garmentDescription,
  generatedImageUrl,
  onTryAnother = () => {},
}) {
  return (
    <div className="min-h-screen bg-[#FAFAF7] text-[#0B0B0C]">
      <header className="border-b border-[#DEDDD6] px-5 py-5 sm:px-8 flex items-center justify-between">
        <span className="font-serif text-lg tracking-tight">Fit Check</span>
        <span className="text-[11px] tracking-[0.18em] uppercase text-[#83837C]">
          Result
        </span>
      </header>

      <main className="mx-auto max-w-6xl px-5 py-10 pb-28 sm:px-8 sm:py-14">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <p className="text-[11px] font-medium tracking-[0.18em] uppercase text-[#1B4DFF]">
            Generated result
          </p>
          <h1 className="mt-2 font-serif text-3xl leading-tight sm:text-4xl">
            Your virtual try-on
          </h1>
          <p className="mt-2 max-w-xl text-sm text-[#83837C]">
            Compare your input photos with the image created for your selected garment.
          </p>
        </motion.div>

        <section className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-[0.72fr_0.72fr_1.3fr] lg:gap-6">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.1 }}
          >
            <ImagePanel label="Your photo" src={personImageUrl} alt="Uploaded person" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.18 }}
          >
            <ImagePanel label="Garment photo" src={garmentImageUrl} alt="Uploaded garment" />
            <p className="mt-4 text-[10px] font-medium tracking-[0.15em] uppercase text-[#83837C]">
              Garment description
            </p>
            <p className="mt-1 text-sm text-[#0B0B0C]">{garmentDescription}</p>
          </motion.div>

          <motion.figure
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.45, delay: 0.26 }}
            className="sm:col-span-2 lg:col-span-1"
          >
            <div className="relative aspect-[3/4] overflow-hidden rounded-sm bg-[#EDECE6] ring-1 ring-[#1B4DFF]/20">
              {generatedImageUrl ? (
                <img
                  src={generatedImageUrl}
                  alt="Generated virtual try-on result"
                  className="h-full w-full object-contain"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-sm text-[#83837C]">
                  Generated image unavailable.
                </div>
              )}
              <span className="absolute left-3 top-3 rounded-sm bg-[#1B4DFF] px-2 py-1 text-[9px] font-medium tracking-[0.12em] uppercase text-white">
                Your try-on
              </span>
            </div>
            <figcaption className="mt-2 text-[10px] font-medium tracking-[0.15em] uppercase text-[#1B4DFF]">
              Generated image
            </figcaption>
          </motion.figure>
        </section>
      </main>

      <div className="fixed inset-x-0 bottom-0 border-t border-[#DEDDD6] bg-[#FAFAF7]/95 backdrop-blur-sm lg:static lg:border-t-0 lg:bg-transparent">
        <div className="mx-auto max-w-6xl px-5 py-4 sm:px-8 lg:pb-14">
          <button
            type="button"
            onClick={onTryAnother}
            className="flex w-full items-center justify-center gap-2 rounded-sm border border-[#0B0B0C] px-5 py-3 text-sm font-medium tracking-wide transition-colors hover:border-[#1B4DFF] hover:text-[#1B4DFF] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1B4DFF] focus-visible:ring-offset-2 sm:w-auto"
          >
            <RefreshCcw className="h-3.5 w-3.5" strokeWidth={1.75} />
            Try Another Garment
          </button>
        </div>
      </div>
    </div>
  );
}
