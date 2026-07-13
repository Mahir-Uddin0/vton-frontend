"use client";

import { motion } from "framer-motion";
import { RefreshCcw } from "lucide-react";

/** Displays only the virtual try-on image returned by the backend. */
export default function ResultsDashboard({
  generatedImageUrl,
  onTryAnother = () => {},
}) {
  return (
    <div className="min-h-screen bg-[#FAFAF7] text-[#0B0B0C]">
      <header className="border-b border-[#DEDDD6] px-5 sm:px-8 py-5 flex items-center justify-between">
        <span className="font-serif text-lg tracking-tight">Fit Check</span>
        <span className="text-[11px] tracking-[0.18em] uppercase text-[#83837C]">
          Result
        </span>
      </header>

      <main className="max-w-2xl mx-auto px-5 sm:px-8 py-10 sm:py-14 pb-28">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h1 className="font-serif text-3xl sm:text-4xl leading-tight">
            Your virtual try-on
          </h1>
          <p className="text-[#83837C] text-sm mt-2">
            Generated from your person photo, garment photo, and description.
          </p>
        </motion.div>

        <motion.figure
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.45, delay: 0.1 }}
          className="mt-8 rounded-sm overflow-hidden bg-[#EDECE6]"
        >
          {generatedImageUrl ? (
            <img
              src={generatedImageUrl}
              alt="Generated virtual try-on result"
              className="w-full max-h-[75vh] object-contain"
            />
          ) : (
            <div className="aspect-[3/4] flex items-center justify-center text-sm text-[#83837C]">
              Generated image unavailable.
            </div>
          )}
        </motion.figure>
      </main>

      <div className="fixed lg:static bottom-0 inset-x-0 border-t border-[#DEDDD6] bg-[#FAFAF7]/95 backdrop-blur-sm lg:bg-transparent lg:border-t-0">
        <div className="max-w-2xl mx-auto px-5 sm:px-8 py-4 lg:pb-14">
          <button
            type="button"
            onClick={onTryAnother}
            className="w-full sm:w-auto flex items-center justify-center gap-2 text-sm font-medium tracking-wide px-5 py-3 rounded-sm border border-[#0B0B0C] hover:border-[#1B4DFF] hover:text-[#1B4DFF] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1B4DFF] focus-visible:ring-offset-2"
          >
            <RefreshCcw className="w-3.5 h-3.5" strokeWidth={1.75} />
            Try Another Garment
          </button>
        </div>
      </div>
    </div>
  );
}
