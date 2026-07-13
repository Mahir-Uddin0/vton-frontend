"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Ruler, Shirt, Percent } from "lucide-react";

/**
 * PROCESSING STATE
 * ----------------
 * Shown immediately after "Generate Fit" is pressed. Reuses the same
 * viewfinder corner-bracket + ruler-tick language from the Upload Studio,
 * now animated: a scan line sweeps the photo while a stage indicator and
 * cycling caption report progress.
 *
 * The stage animation is cosmetic, but completion is gated on the REAL
 * async request passed via `request` (a thunk returning Promise<FitResult>).
 * The screen advances through the stages, then holds on the final stage
 * until the request resolves — so swapping the mock for a slower real
 * backend just makes it wait longer, no code change here.
 *
 *   onComplete(result) — fired once, when the request resolves
 *   onError(error)     — fired if the request rejects
 */

const STAGES = [
  { label: "Analyzing body proportions", icon: Ruler },
  { label: "Mapping garment", icon: Shirt },
  { label: "Calculating fit score", icon: Percent },
];

const STAGE_DURATION = 1800; // ms per stage
const MIN_LAST_STAGE = 500; // min dwell on final stage before completing

export default function ProcessingState({
  photoUrl,
  request,
  onComplete = (_result) => {},
  onError = (_error) => {},
}) {
  const [stageIndex, setStageIndex] = useState(0);
  const [dots, setDots] = useState("");
  const [status, setStatus] = useState("loading"); // "loading" | "ready" | "error"

  const resultRef = useRef(null);
  const firedRef = useRef(false);

  // Kick off the actual fit-check request exactly once, on mount.
  useEffect(() => {
    let cancelled = false;
    if (typeof request !== "function") return;

    Promise.resolve(request())
      .then((result) => {
        if (cancelled) return;
        resultRef.current = result;
        setStatus("ready");
      })
      .catch((err) => {
        if (cancelled) return;
        setStatus("error");
        onError(err);
      });

    return () => {
      cancelled = true;
    };
    // Intentionally run once; request identity is stable per mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Advance the cosmetic stage animation up to (but not past) the last stage.
  useEffect(() => {
    if (stageIndex >= STAGES.length - 1) return;
    const t = setTimeout(() => setStageIndex((i) => i + 1), STAGE_DURATION);
    return () => clearTimeout(t);
  }, [stageIndex]);

  // Complete only when the request has resolved AND we've reached the final
  // stage — whichever happens last. Fires onComplete exactly once.
  useEffect(() => {
    if (firedRef.current) return;
    if (status !== "ready" || stageIndex < STAGES.length - 1) return;
    const done = setTimeout(() => {
      firedRef.current = true;
      onComplete(resultRef.current);
    }, MIN_LAST_STAGE);
    return () => clearTimeout(done);
  }, [status, stageIndex, onComplete]);

  useEffect(() => {
    const d = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? "" : prev + "."));
    }, 400);
    return () => clearInterval(d);
  }, []);

  const progressPct = ((stageIndex + 1) / STAGES.length) * 100;

  return (
    <div className="min-h-screen bg-[#FAFAF7] text-[#0B0B0C] flex flex-col">
      <header className="border-b border-[#DEDDD6] px-5 sm:px-8 py-5 flex items-center justify-between">
        <span className="font-serif text-lg tracking-tight">Fit Check</span>
        <span className="text-[11px] tracking-[0.18em] uppercase text-[#83837C]">
          Processing
        </span>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-5 py-12">
        <div className="relative w-full max-w-sm aspect-[3/4] rounded-sm overflow-hidden bg-[#EDECE6]">
          {photoUrl ? (
            <img src={photoUrl} alt="Subject being analyzed" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full" />
          )}

          {/* Measurement grid overlay */}
          <div
            className="absolute inset-0 opacity-25 pointer-events-none"
            style={{
              backgroundImage:
                "linear-gradient(to right, rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.5) 1px, transparent 1px)",
              backgroundSize: "12.5% 12.5%",
            }}
          />

          {/* Darken for legibility */}
          <div className="absolute inset-0 bg-black/15 pointer-events-none" />

          {/* Corner brackets — active/scanning color */}
          {[
            "top-3 left-3 border-t-2 border-l-2",
            "top-3 right-3 border-t-2 border-r-2",
            "bottom-3 left-3 border-b-2 border-l-2",
            "bottom-3 right-3 border-b-2 border-r-2",
          ].map((pos, i) => (
            <motion.span
              key={i}
              className={`absolute w-5 h-5 border-[#1B4DFF] ${pos}`}
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut", delay: i * 0.1 }}
            />
          ))}

          {/* Scan line sweep */}
          <motion.div
            className="absolute inset-x-0 h-[2px]"
            style={{
              background:
                "linear-gradient(to right, transparent, #1B4DFF 20%, #7C9BFF 50%, #1B4DFF 80%, transparent)",
              boxShadow: "0 0 12px 2px rgba(27,77,255,0.7)",
            }}
            animate={{ top: ["4%", "96%", "4%"] }}
            transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
          />

          {/* Ruler ticks, right edge */}
          <div className="absolute top-3 bottom-3 right-3 w-3 flex flex-col justify-between pointer-events-none">
            {Array.from({ length: 9 }).map((_, i) => (
              <span
                key={i}
                className={`bg-white/70 ${i % 2 === 0 ? "w-3 h-px" : "w-1.5 h-px"}`}
              />
            ))}
          </div>

          {/* Progress bar, bottom of frame */}
          <div className="absolute bottom-0 inset-x-0 h-1 bg-white/20">
            <motion.div
              className="h-full bg-[#1B4DFF]"
              initial={{ width: 0 }}
              animate={{ width: `${progressPct}%` }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            />
          </div>
        </div>

        {/* Stage indicator dots */}
        <div className="flex items-center gap-2 mt-7">
          {STAGES.map((_, i) => (
            <span
              key={i}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === stageIndex ? "w-6 bg-[#1B4DFF]" : "w-1.5 bg-[#DEDDD6]"
              }`}
            />
          ))}
        </div>

        {/* Cycling caption */}
        <div className="h-10 mt-3 flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={stageIndex}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3 }}
              className="flex items-center gap-2 text-sm"
            >
              {React.createElement(STAGES[stageIndex].icon, {
                className: "w-4 h-4 text-[#1B4DFF]",
                strokeWidth: 1.75,
              })}
              <span className="text-[#0B0B0C]">
                {STAGES[stageIndex].label}
                <span className="text-[#83837C]">{dots}</span>
              </span>
            </motion.div>
          </AnimatePresence>
        </div>

        <p className="text-[11px] tracking-wide uppercase text-[#83837C] mt-1">
          Step {stageIndex + 1} of {STAGES.length}
        </p>
      </main>
    </div>
  );
}
